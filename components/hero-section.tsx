import Image from "next/image";
import type {
  AnnouncementBanner,
  Category,
  DeliveryZone,
  PromoCard,
} from "@/lib/store-data";
import { Icon, LogoMark } from "@/components/icons";

type ServiceabilityState = {
  eligible: boolean;
  etaMinutes: number | null;
  distanceKm: number;
  message: string;
  zone: DeliveryZone | null;
  nearestZone: DeliveryZone | null;
};

type HeroSectionProps = {
  activeCategory: string;
  announcementBanner: AnnouncementBanner;
  cartCount: number;
  categories: Category[];
  highlightPills: string[];
  locating: boolean;
  locationLabel: string;
  locationError: string;
  promoCards: PromoCard[];
  query: string;
  registeredUserName?: string;
  serviceability: ServiceabilityState | null;
  zones: DeliveryZone[];
  onCategoryChange: (value: string) => void;
  onGpsCheck: () => void;
  onOpenCheckout: () => void;
  onOpenAuth: () => void;
  onQueryChange: (value: string) => void;
  onSampleZoneCheck: (zone: DeliveryZone) => void;
};

export function HeroSection({
  activeCategory,
  announcementBanner,
  cartCount,
  categories,
  highlightPills,
  locating,
  locationLabel,
  locationError,
  promoCards,
  query,
  registeredUserName,
  serviceability,
  zones,
  onCategoryChange,
  onGpsCheck,
  onOpenCheckout,
  onOpenAuth,
  onQueryChange,
  onSampleZoneCheck,
}: HeroSectionProps) {
  const liveZones = zones.filter((zone) => zone.active).slice(0, 3);

  return (
    <>
      {announcementBanner.active ? (
        <div className="bg-[var(--accent)] text-white">
          <div className="mx-auto flex max-w-[1480px] flex-col gap-3 px-4 py-3 text-sm lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <p className="font-medium text-white/88">{announcementBanner.text}</p>
            <a
              href={announcementBanner.ctaHref || "#"}
              className="inline-flex w-fit rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--ink)]"
            >
              {announcementBanner.ctaLabel}
            </a>
          </div>
        </div>
      ) : null}

      <header className="sticky top-0 z-40 border-b border-white/35 bg-[rgba(244,250,247,0.72)] backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1480px] flex-col gap-4 px-4 py-4 lg:px-8">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-4">
              <LogoMark />
              <div>
                <p className="font-[var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--ink)]">
                  Ceylon Cart
                </p>
                <p className="text-sm text-[var(--muted)]">
                  Smart grocery delivery for your area
                </p>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-3 xl:max-w-[900px] xl:flex-row xl:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-3 rounded-full border border-white/60 bg-white/72 px-5 py-3 shadow-[0_18px_42px_rgba(31,70,61,0.08)] backdrop-blur-xl">
                <Icon name="search" className="h-5 w-5 text-[var(--accent)]" />
                <input
                  value={query}
                  onChange={(event) => onQueryChange(event.target.value)}
                  placeholder="Search groceries, pantry items, bakery, dairy..."
                  className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
                />
              </div>

              <button
                type="button"
                onClick={onGpsCheck}
                className="flex items-center gap-3 rounded-full border border-white/60 bg-white/72 px-4 py-3 text-left shadow-[0_18px_42px_rgba(31,70,61,0.08)] backdrop-blur-xl"
              >
                <div className="rounded-full bg-[var(--accent-soft)] p-2 text-[var(--accent)]">
                  <Icon name="location" className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                    Your area
                  </p>
                  <p className="text-sm font-semibold text-[var(--ink)]">
                    {serviceability?.zone?.name ?? "Use GPS"}
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={onOpenAuth}
                className="rounded-full border border-white/60 bg-white/72 px-5 py-3 text-sm font-semibold text-[var(--ink)] shadow-[0_18px_42px_rgba(31,70,61,0.08)] backdrop-blur-xl"
              >
                {registeredUserName ?? "Sign in"}
              </button>

              <button
                type="button"
                onClick={onOpenCheckout}
                className="rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_42px_rgba(31,70,61,0.16)]"
              >
                Basket {cartCount}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => onCategoryChange(category.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeCategory === category.id
                    ? "bg-[var(--ink)] text-white"
                    : "bg-white/72 text-[var(--muted)]"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1480px] px-4 py-6 lg:px-8">
        <div className="grid gap-4 xl:grid-cols-[1.18fr_0.82fr]">
          <div className="relative overflow-hidden rounded-[40px] border border-white/55 bg-[linear-gradient(135deg,rgba(223,248,239,0.96),rgba(245,255,251,0.82))] p-8 shadow-[0_24px_50px_rgba(31,70,61,0.08)] backdrop-blur-2xl">
            <div className="absolute inset-y-0 right-0 w-[46%]">
              <Image
                src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1200&q=80"
                alt="Fresh fruits and vegetables"
                fill
                sizes="(max-width: 1279px) 100vw, 38vw"
                className="object-cover"
              />
            </div>
            <div className="absolute inset-y-0 right-0 w-[46%] bg-[linear-gradient(90deg,rgba(245,255,251,0)_0%,rgba(245,255,251,0.2)_32%,rgba(245,255,251,0.92)_100%)]" />

            <div className="relative z-10 max-w-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                Daily amazing deals
              </p>
              <h1 className="mt-4 font-[var(--font-display)] text-5xl font-semibold leading-[1.02] text-[var(--ink)] sm:text-6xl">
                Groceries that fit your exact delivery zone.
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-7 text-[var(--muted)]">
                Share your location once, then browse only the products your nearby hub can actually deliver.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onGpsCheck}
                  className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white"
                >
                  {locating ? "Checking..." : "Use GPS location"}
                </button>
                <button
                  type="button"
                  onClick={() => onCategoryChange("produce")}
                  className="rounded-full border border-[var(--line)] bg-white/78 px-5 py-3 text-sm font-semibold text-[var(--ink)]"
                >
                  Browse fresh picks
                </button>
              </div>

              {highlightPills.length ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {highlightPills.slice(0, 4).map((pill) => (
                    <span
                      key={pill}
                      className="rounded-full border border-white/65 bg-white/68 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)] backdrop-blur"
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[34px] border border-white/55 bg-white/62 p-6 shadow-[0_20px_45px_rgba(31,70,61,0.08)] backdrop-blur-2xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                    Delivery status
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-[var(--ink)]">
                    {serviceability?.zone?.name ?? "Set your location"}
                  </h2>
                </div>
                <div className="rounded-full bg-[var(--accent-soft)] p-3 text-[var(--accent)]">
                  <Icon name="truck" className="h-5 w-5" />
                </div>
              </div>

              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                {locating
                  ? "Checking availability near your location..."
                  : serviceability?.message ?? locationLabel}
              </p>

              {locationError ? (
                <p className="mt-3 text-sm font-semibold text-[var(--danger)]">
                  {locationError}
                </p>
              ) : null}

              <div className="mt-5 flex flex-wrap gap-2">
                {liveZones.map((zone) => (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => onSampleZoneCheck(zone)}
                    className="rounded-full border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-2 text-sm font-semibold text-[var(--muted)]"
                  >
                    {zone.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              {promoCards.slice(0, 2).map((card, index) => (
                <div
                  key={card.id}
                  className={`rounded-[30px] border border-white/55 p-5 shadow-[0_18px_40px_rgba(31,70,61,0.08)] backdrop-blur-2xl ${
                    index === 0
                      ? "bg-[linear-gradient(135deg,rgba(255,246,207,0.9),rgba(255,255,255,0.68))]"
                      : "bg-[linear-gradient(135deg,rgba(228,244,255,0.9),rgba(255,255,255,0.68))]"
                  }`}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                    {card.eyebrow}
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-[var(--ink)]">
                    {card.title}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
