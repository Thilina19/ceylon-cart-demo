import Image from "next/image";
import type { Category, DeliveryZone, PromoCard } from "@/lib/store-data";
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
  const spotlightCards = promoCards.slice(0, 3);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[rgba(22,50,44,0.08)] bg-[rgba(247,251,248,0.9)] backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-4 px-4 py-4 lg:px-8">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-4">
              <LogoMark />
              <div>
                <p className="font-[var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--ink)]">
                  Ceylon Cart
                </p>
                <p className="text-sm text-[var(--muted)]">
                  Grocery delivery shaped around real weekly shopping
                </p>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-3 xl:max-w-[880px] xl:flex-row xl:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-3 rounded-full border border-[rgba(22,50,44,0.08)] bg-white px-5 py-3 shadow-[0_10px_24px_rgba(22,50,44,0.05)]">
                <Icon name="search" className="h-5 w-5 text-[var(--accent)]" />
                <input
                  value={query}
                  onChange={(event) => onQueryChange(event.target.value)}
                  placeholder="Search fresh produce, bakery, tea, cleaning supplies..."
                  className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
                />
              </div>

              <button
                type="button"
                onClick={onGpsCheck}
                className="flex items-center gap-3 rounded-full border border-[rgba(22,50,44,0.08)] bg-white px-4 py-3 text-left shadow-[0_10px_24px_rgba(22,50,44,0.05)]"
              >
                <div className="rounded-full bg-[var(--accent-soft)] p-2 text-[var(--accent)]">
                  <Icon name="location" className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                    Deliver to
                  </p>
                  <p className="text-sm font-semibold text-[var(--ink)]">
                    {serviceability?.zone?.district ?? "Choose location"}
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={onOpenAuth}
                className="rounded-full border border-[rgba(22,50,44,0.08)] bg-white px-5 py-3 text-sm font-semibold text-[var(--ink)] shadow-[0_10px_24px_rgba(22,50,44,0.05)]"
              >
                {registeredUserName ?? "Sign in"}
              </button>

              <button
                type="button"
                onClick={onOpenCheckout}
                className="rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(22,50,44,0.18)]"
              >
                Basket {cartCount}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const active = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => onCategoryChange(category.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-[var(--ink)] text-white"
                      : "bg-white text-[var(--muted)] hover:text-[var(--ink)]"
                  }`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <section className="relative min-h-[88svh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1800&q=80"
            alt="Fresh groceries arranged on a market table"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,31,27,0.76)_0%,rgba(13,31,27,0.52)_38%,rgba(13,31,27,0.18)_68%,rgba(13,31,27,0.06)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,20,17,0.22)_0%,rgba(10,20,17,0.04)_32%,rgba(10,20,17,0.32)_100%)]" />
        </div>

        <div className="relative mx-auto grid min-h-[88svh] max-w-[1500px] gap-10 px-4 py-10 lg:px-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-end">
          <div className="flex max-w-2xl flex-col justify-end">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/88 backdrop-blur">
              <Icon name="spark" className="h-4 w-4" />
              Fresh every day
            </span>
            <h1 className="mt-5 font-[var(--font-display)] text-5xl font-semibold leading-[0.96] tracking-tight text-white sm:text-7xl">
              Shopping made easier for the whole week.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/78 sm:text-lg">
              A simpler grocery store with faster browsing, calmer surfaces, and the right mix of fresh picks, pantry staples, and home essentials.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onCategoryChange("produce")}
                className="rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-bold text-[var(--ink)]"
              >
                Shop fresh produce
              </button>
              <button
                type="button"
                onClick={onGpsCheck}
                className="rounded-full border border-white/18 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur"
              >
                Check delivery area
              </button>
            </div>

            {highlightPills.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {highlightPills.map((pill) => (
                  <span
                    key={pill}
                    className="rounded-full border border-white/16 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/84 backdrop-blur"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="grid gap-4 self-end">
            <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
              {spotlightCards.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (index === 0) {
                      onCategoryChange("produce");
                    } else if (index === 1) {
                      onGpsCheck();
                    } else {
                      onCategoryChange("pantry");
                    }
                  }}
                  className={`rounded-[30px] px-5 py-5 text-left text-white backdrop-blur transition hover:-translate-y-1 ${
                    index === 0
                      ? "bg-[rgba(242,182,61,0.88)] text-[var(--ink)]"
                      : "bg-white/10"
                  }`}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] opacity-75">
                    {item.eyebrow}
                  </p>
                  <p className="mt-3 text-xl font-semibold">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 opacity-82">{item.description}</p>
                  <p className="mt-4 text-sm font-semibold opacity-82">{item.metric}</p>
                </button>
              ))}
            </div>

            <div className="rounded-[32px] border border-white/12 bg-white/10 p-5 text-white backdrop-blur">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
                    Delivery
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {serviceability?.zone?.name ?? "See if we deliver to you"}
                  </p>
                </div>
                <div className="rounded-full bg-white/10 p-3">
                  <Icon name="location" className="h-5 w-5" />
                </div>
              </div>

              <p className="mt-3 text-sm leading-6 text-white/74">
                {locating
                  ? "Checking availability near your location..."
                  : serviceability?.message ?? locationLabel}
              </p>

              {locationError ? (
                <p className="mt-3 text-sm font-semibold text-[#ffd2d2]">{locationError}</p>
              ) : null}

              <div className="mt-4 space-y-2">
                {liveZones.map((zone) => (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => onSampleZoneCheck(zone)}
                    className="flex w-full items-center justify-between rounded-[20px] border border-white/10 bg-white/8 px-4 py-3 text-left"
                  >
                    <div>
                      <p className="text-sm font-semibold">{zone.name}</p>
                      <p className="text-sm text-white/66">{zone.district}</p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--brand)]">
                      {zone.radiusKm} km
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
