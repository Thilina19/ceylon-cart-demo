"use client";

import { useDeferredValue, useEffect, useState, useTransition } from "react";
import { AuthModal } from "@/components/auth-modal";
import { BackendSection } from "@/components/backend-section";
import { CatalogSection } from "@/components/catalog-section";
import { FooterCta } from "@/components/footer-cta";
import { HeroSection } from "@/components/hero-section";
import { products, type DeliveryZone } from "@/lib/store-data";
import type { RegisteredUser } from "@/lib/otp-store";

type ServiceabilityState = {
  eligible: boolean;
  etaMinutes: number | null;
  distanceKm: number;
  message: string;
  zone: DeliveryZone | null;
  nearestZone: DeliveryZone | null;
};

type AuthPhase = "details" | "verify";

export function Storefront() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [activeCategory, setActiveCategory] = useState("all");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [serviceability, setServiceability] = useState<ServiceabilityState | null>(
    null,
  );
  const [locationLabel, setLocationLabel] = useState(
    "Use GPS to check if your address qualifies for 1-hour delivery.",
  );
  const [locationError, setLocationError] = useState("");
  const [locating, setLocating] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authPhase, setAuthPhase] = useState<AuthPhase>("details");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [otpPreview, setOtpPreview] = useState("");
  const [registeredUser, setRegisteredUser] = useState<RegisteredUser | null>(null);
  const [isAuthPending, startAuthTransition] = useTransition();

  useEffect(() => {
    const savedUser = window.localStorage.getItem("ceylon-cart-user");

    if (savedUser) {
      setRegisteredUser(JSON.parse(savedUser) as RegisteredUser);
    }

    void fetch("/api/delivery-zones")
      .then((response) => response.json())
      .then((payload: { zones: DeliveryZone[] }) => {
        setZones(payload.zones);
      })
      .catch(() => {
        setZones([]);
      });
  }, []);

  const visibleProducts = products.filter((product) => {
    const text = deferredQuery.trim().toLowerCase();
    const categoryMatches =
      activeCategory === "all" || product.category === activeCategory;
    const queryMatches =
      !text ||
      product.name.toLowerCase().includes(text) ||
      product.badge.toLowerCase().includes(text) ||
      product.origin.toLowerCase().includes(text);

    return categoryMatches && queryMatches;
  });

  const cartCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  function addToCart(productId: string) {
    setCart((current) => ({
      ...current,
      [productId]: (current[productId] ?? 0) + 1,
    }));
  }

  function runServiceabilityCheck(lat: number, lng: number, label: string) {
    setLocationError("");
    setLocationLabel(label);
    setLocating(true);

    void fetch("/api/serviceability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lat, lng }),
    })
      .then(async (response) => {
        const payload = (await response.json()) as ServiceabilityState & {
          message?: string;
        };

        if (!response.ok) {
          throw new Error(payload.message ?? "Unable to check delivery right now.");
        }

        setServiceability(payload);
      })
      .catch((error: unknown) => {
        setServiceability(null);
        setLocationError(
          error instanceof Error
            ? error.message
            : "Unable to check serviceability right now.",
        );
      })
      .finally(() => {
        setLocating(false);
      });
  }

  function handleGpsCheck() {
    if (!navigator.geolocation) {
      setLocationError("This browser does not support GPS lookups.");
      return;
    }

    setLocationError("");
    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        runServiceabilityCheck(
          position.coords.latitude,
          position.coords.longitude,
          "Using your current GPS position.",
        );
      },
      () => {
        setLocating(false);
        setLocationError(
          "Location access was blocked. You can still try one of the sample delivery hubs below.",
        );
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  function requestOtp() {
    startAuthTransition(async () => {
      setAuthMessage("");

      try {
        const response = await fetch("/api/auth/request-otp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, phone }),
        });

        const payload = (await response.json()) as {
          message?: string;
          otpPreview?: string;
          normalizedPhone?: string;
        };

        if (!response.ok) {
          throw new Error(payload.message ?? "Could not send OTP.");
        }

        setPhone(payload.normalizedPhone ?? phone);
        setOtpPreview(payload.otpPreview ?? "");
        setAuthPhase("verify");
        setAuthMessage(payload.message ?? "OTP generated.");
      } catch (error) {
        setAuthMessage(
          error instanceof Error ? error.message : "Could not send OTP.",
        );
      }
    });
  }

  function verifyOtpCode() {
    startAuthTransition(async () => {
      setAuthMessage("");

      try {
        const response = await fetch("/api/auth/verify-otp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone, code: otp }),
        });

        const payload = (await response.json()) as {
          message?: string;
          user?: RegisteredUser;
        };

        if (!response.ok) {
          throw new Error(payload.message ?? "Could not verify OTP.");
        }

        if (!payload.user) {
          throw new Error("The server did not return a user profile.");
        }

        setRegisteredUser(payload.user);
        window.localStorage.setItem(
          "ceylon-cart-user",
          JSON.stringify(payload.user),
        );
        setAuthMessage(payload.message ?? "Registration complete.");
        setAuthOpen(false);
        setOtp("");
      } catch (error) {
        setAuthMessage(
          error instanceof Error ? error.message : "Could not verify OTP.",
        );
      }
    });
  }

  return (
    <div className="min-h-screen">
      <HeroSection
        activeCategory={activeCategory}
        cartCount={cartCount}
        locating={locating}
        locationError={locationError}
        locationLabel={locationLabel}
        query={query}
        registeredUserName={registeredUser?.name}
        serviceability={serviceability}
        zones={zones}
        onCategoryChange={setActiveCategory}
        onGpsCheck={handleGpsCheck}
        onOpenAuth={() => {
          setAuthOpen(true);
          setAuthPhase("details");
        }}
        onQueryChange={setQuery}
        onSampleZoneCheck={(zone) =>
          runServiceabilityCheck(
            zone.center.lat,
            zone.center.lng,
            `Checking delivery from the ${zone.name} sample point.`,
          )
        }
      />

      <main className="mx-auto flex max-w-[1440px] flex-col gap-8 px-4 py-6 lg:px-8 lg:py-8">
        <CatalogSection
          activeCategory={activeCategory}
          visibleProducts={visibleProducts}
          onAddToCart={addToCart}
          onCategoryChange={setActiveCategory}
        />
        <BackendSection zones={zones} />
        <FooterCta registeredUser={registeredUser} />
      </main>

      <AuthModal
        open={authOpen}
        phase={authPhase}
        name={name}
        phone={phone}
        otp={otp}
        message={authMessage}
        otpPreview={otpPreview}
        pending={isAuthPending}
        onClose={() => setAuthOpen(false)}
        onNameChange={setName}
        onPhoneChange={setPhone}
        onOtpChange={setOtp}
        onRequestOtp={requestOtp}
        onVerifyOtp={verifyOtpCode}
        onEditNumber={() => setAuthPhase("details")}
      />
    </div>
  );
}
