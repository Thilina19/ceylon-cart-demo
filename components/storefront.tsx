"use client";

import { useDeferredValue, useEffect, useState, useTransition } from "react";
import { AuthModal } from "@/components/auth-modal";
import { CatalogSection } from "@/components/catalog-section";
import { CheckoutSheet } from "@/components/checkout-sheet";
import { FooterCta } from "@/components/footer-cta";
import { HeroSection } from "@/components/hero-section";
import { MarketingPopup } from "@/components/marketing-popup";
import type {
  DeliveryZone,
  RegisteredUser,
  StorefrontData,
} from "@/lib/store-data";

type ServiceabilityState = {
  eligible: boolean;
  etaMinutes: number | null;
  distanceKm: number;
  message: string;
  zone: DeliveryZone | null;
  nearestZone: DeliveryZone | null;
};

type AuthPhase = "details" | "verify";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function Storefront() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [activeCategory, setActiveCategory] = useState("all");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [storefront, setStorefront] = useState<StorefrontData | null>(null);
  const [storeError, setStoreError] = useState("");
  const [storeLoading, setStoreLoading] = useState(true);
  const [serviceability, setServiceability] = useState<ServiceabilityState | null>(
    null,
  );
  const [locating, setLocating] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authPhase, setAuthPhase] = useState<AuthPhase>("details");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [otpPreview, setOtpPreview] = useState("");
  const [registeredUser, setRegisteredUser] = useState<RegisteredUser | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutName, setCheckoutName] = useState("");
  const [checkoutPhone, setCheckoutPhone] = useState("");
  const [checkoutAddress, setCheckoutAddress] = useState("");
  const [checkoutNote, setCheckoutNote] = useState("");
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);
  const [isAuthPending, startAuthTransition] = useTransition();
  const [isCheckoutPending, startCheckoutTransition] = useTransition();

  useEffect(() => {
    const savedUser = window.localStorage.getItem("ceylon-cart-user");

    if (savedUser) {
      setRegisteredUser(JSON.parse(savedUser) as RegisteredUser);
    }

    void fetch("/api/store")
      .then(async (response) => {
        const payload = (await response.json()) as StorefrontData & {
          message?: string;
        };

        if (!response.ok) {
          throw new Error(payload.message ?? "The storefront data could not be loaded.");
        }

        setStorefront(payload);
        setStoreError("");
      })
      .catch((error: unknown) => {
        setStorefront(null);
        setStoreError(
          error instanceof Error
            ? error.message
            : "The storefront data could not be loaded.",
        );
      })
      .finally(() => {
        setStoreLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!registeredUser) {
      return;
    }

    setCheckoutName((current) => current || registeredUser.name);
    setCheckoutPhone((current) => current || registeredUser.phone);
  }, [registeredUser]);

  useEffect(() => {
    const categories = storefront?.categories ?? [];

    if (!categories.length) {
      return;
    }

    if (!categories.some((category) => category.id === activeCategory)) {
      setActiveCategory("all");
    }
  }, [activeCategory, storefront]);

  const categories = storefront?.categories ?? [];
  const promoCards = storefront?.promoCards ?? [];
  const announcementBanner = storefront?.announcementBanner;
  const promoPopup = storefront?.promoPopup;
  const highlightPills = storefront?.highlightPills ?? [];
  const products = storefront?.products ?? [];
  const zones = storefront?.deliveryZones ?? [];
  const defaultZone = zones.find((zone) => zone.active) ?? null;
  const selectedZoneId = serviceability?.zone?.id ?? defaultZone?.id ?? null;

  const zoneProducts = selectedZoneId
    ? products.filter(
        (product) =>
          !product.availableZoneIds.length ||
          product.availableZoneIds.includes(selectedZoneId),
      )
    : [];

  const visibleProducts = zoneProducts.filter((product) => {
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

  const cartItems = products
    .filter((product) => (cart[product.id] ?? 0) > 0)
    .map((product) => ({
      id: product.id,
      name: product.name,
      quantity: cart[product.id],
      unit: product.unit,
      unitPrice: product.price,
      lineTotal: product.price * cart[product.id],
    }));

  const cartCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const deliveryFee = subtotal === 0 ? 0 : subtotal >= 5000 ? 0 : 350;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    if (!promoPopup?.active) {
      setPopupOpen(false);
      return;
    }

    const storageKey = `ceylon-cart-popup-dismissed:${promoPopup.id}`;
    const alreadyDismissed = window.sessionStorage.getItem(storageKey);
    setPopupOpen(!alreadyDismissed);
  }, [promoPopup]);

  function addToCart(productId: string) {
    setCart((current) => ({
      ...current,
      [productId]: (current[productId] ?? 0) + 1,
    }));
    setCheckoutMessage("");
  }

  function updateCartQuantity(productId: string, quantity: number) {
    setCart((current) => {
      if (quantity <= 0) {
        const nextCart = { ...current };
        delete nextCart[productId];
        return nextCart;
      }

      return {
        ...current,
        [productId]: quantity,
      };
    });
    setCheckoutMessage("");
  }

  function runServiceabilityCheck(lat: number, lng: number, label: string) {
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
        console.error(label, error);
      })
      .finally(() => {
        setLocating(false);
      });
  }

  function handleGpsCheck() {
    if (!navigator.geolocation) {
      return;
    }

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
        setCheckoutName(payload.user.name);
        setCheckoutPhone(payload.user.phone);
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

  function submitOrder() {
    startCheckoutTransition(async () => {
      setCheckoutMessage("");

      try {
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerName: checkoutName,
            phone: checkoutPhone,
            address: checkoutAddress,
            note: checkoutNote,
            zoneId: serviceability?.zone?.id ?? null,
            items: cartItems.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
            })),
          }),
        });

        const payload = (await response.json()) as {
          message?: string;
          order?: {
            id: string;
            total: number;
          };
        };

        if (!response.ok) {
          throw new Error(payload.message ?? "Could not place the order.");
        }

        setCart({});
        setCheckoutNote("");
        setCheckoutMessage(
          payload.order
            ? `Order ${payload.order.id.slice(0, 8).toUpperCase()} placed successfully. Total ${formatCurrency(payload.order.total)}.`
            : payload.message ?? "Order placed successfully.",
        );
      } catch (error) {
        setCheckoutMessage(
          error instanceof Error ? error.message : "Could not place the order.",
        );
      }
    });
  }

  function dismissPopup() {
    if (promoPopup?.id) {
      window.sessionStorage.setItem(
        `ceylon-cart-popup-dismissed:${promoPopup.id}`,
        "true",
      );
    }
    setPopupOpen(false);
  }

  if (storeLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="rounded-[32px] bg-white px-8 py-6 text-center shadow-[0_18px_42px_rgba(22,50,44,0.06)]">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
            Loading store
          </p>
          <p className="mt-3 text-lg text-[var(--ink)]">
            Preparing the latest aisles, offers, and delivery areas.
          </p>
        </div>
      </div>
    );
  }

  if (!storefront) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-lg rounded-[32px] bg-white px-8 py-6 text-center shadow-[0_18px_42px_rgba(22,50,44,0.06)]">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
            Store unavailable
          </p>
          <p className="mt-3 text-lg text-[var(--ink)]">
            {storeError || "The storefront could not be loaded right now."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="top" className="min-h-screen">
      <HeroSection
        activeCategory={activeCategory}
        announcementBanner={
          announcementBanner ?? {
            active: false,
            text: "",
            ctaLabel: "",
            ctaHref: "#",
          }
        }
        cartCount={cartCount}
        categories={categories}
        highlightPills={highlightPills}
        locating={locating}
        promoCards={promoCards}
        query={query}
        registeredUserName={registeredUser?.name}
        serviceability={serviceability}
        onCategoryChange={setActiveCategory}
        onGpsCheck={handleGpsCheck}
        onOpenCheckout={() => setCheckoutOpen(true)}
        onOpenAuth={() => {
          setAuthOpen(true);
          setAuthPhase("details");
        }}
        onQueryChange={setQuery}
      />

      <main className="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 pb-8 lg:px-6 lg:pb-10">
        <CatalogSection
          activeCategory={activeCategory}
          categories={categories}
          visibleProducts={visibleProducts}
          onAddToCart={addToCart}
          onCategoryChange={setActiveCategory}
        />
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

      <CheckoutSheet
        open={checkoutOpen}
        items={cartItems}
        subtotal={subtotal}
        total={total}
        serviceabilityZone={serviceability?.zone ?? null}
        registeredUser={registeredUser}
        name={checkoutName}
        phone={checkoutPhone}
        address={checkoutAddress}
        note={checkoutNote}
        message={checkoutMessage}
        pending={isCheckoutPending}
        onClose={() => setCheckoutOpen(false)}
        onNameChange={setCheckoutName}
        onPhoneChange={setCheckoutPhone}
        onAddressChange={setCheckoutAddress}
        onNoteChange={setCheckoutNote}
        onQuantityChange={updateCartQuantity}
        onSubmit={submitOrder}
      />

      {promoPopup ? (
        <MarketingPopup
          popup={promoPopup}
          open={popupOpen}
          onClose={dismissPopup}
        />
      ) : null}
    </div>
  );
}
