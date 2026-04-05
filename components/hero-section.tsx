import type { DeliveryZone } from "@/lib/store-data";
import { categories, highlightPills, promoCards } from "@/lib/store-data";
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
  cartTotal: number;
  locating: boolean;
  locationLabel: string;
  locationError: string;
  query: string;
  registeredUserName?: string;
  serviceability: ServiceabilityState | null;
  zones: DeliveryZone[];
  onCategoryChange: (value: string) => void;
  onGpsCheck: () => void;
  onOpenAuth: () => void;
  onQueryChange: (value: string) => void;
  onSampleZoneCheck: (zone: DeliveryZone) => void;
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function HeroSection({
  activeCategory,
  cartCount,
  cartTotal,
  locating,
  locationLabel,
  locationError,
  query,
  registeredUserName,
  serviceability,
  zones,
  onCategoryChange,
  onGpsCheck,
  onOpenAuth,
  onQueryChange,
  onSampleZoneCheck,
}: HeroSectionProps) {
  const liveZones = zones.filter((zone) => zone.active).slice(0, 3);

  return (
    <>
      <div className="border-b border-[rgba(22,50,44,0.08)] bg-[rgba(255,255,255,0.78)] px-4 py-2 text-xs text-[var(--muted)] backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-2 font-semibold text-[var(--accent)]">
              <Icon name="truck" className="h-4 w-4" />
              Fresh groceries delivered daily
            </span>
            <span>Selected Colombo areas</span>
            <span>Island pantry staples</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {highlightPills.slice(0, 3).map((pill) => (
              <span
                key={pill}
                className="rounded-full bg-white px-3 py-1 font-semibold text-[var(--ink)]"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(247,251,248,0.92)] backdrop-blur">
        <div className="mx-auto max-w-[1440px] px-4 lg:px-6">
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
              <div className="flex items-center gap-3">
                <LogoMark />
                <div>
                  <p className="font-[var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--ink)]">
                    Ceylon Cart
                  </p>
                  <p className="text-sm text-[var(--muted)]">
                    Everyday groceries for Sri Lankan homes
                  </p>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-3 xl:flex-row xl:items-center">
                <button
                  type="button"
                  onClick={onGpsCheck}
                  className="flex items-center gap-3 rounded-[22px] border border-[var(--line)] bg-white px-4 py-3 text-left shadow-[0_10px_24px_rgba(22,50,44,0.04)] xl:min-w-[250px]"
                >
                  <div className="rounded-full bg-[var(--accent-soft)] p-2 text-[var(--accent)]">
                    <Icon name="location" className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                      Deliver to
                    </p>
                    <p className="truncate text-sm font-semibold text-[var(--ink)]">
                      {serviceability?.zone?.district ?? "Set your location"}
                    </p>
                  </div>
                </button>

                <div className="flex min-w-0 flex-1 items-center gap-3 rounded-[24px] border border-[rgba(31,122,103,0.14)] bg-white px-4 py-3 shadow-[0_14px_30px_rgba(22,50,44,0.05)]">
                  <Icon name="search" className="h-5 w-5 text-[var(--accent)]" />
                  <input
                    value={query}
                    onChange={(event) => onQueryChange(event.target.value)}
                    placeholder="Search vegetables, tea, rice, bread, fish, cleaning supplies..."
                    className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 xl:flex xl:items-center">
                  <button
                    type="button"
                    onClick={onOpenAuth}
                    className="rounded-[20px] border border-[var(--line)] bg-white px-4 py-3 text-left shadow-[0_10px_24px_rgba(22,50,44,0.04)]"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                      Account
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[var(--ink)]">
                      {registeredUserName ?? "Sign in"}
                    </p>
                  </button>
                  <div className="rounded-[20px] bg-[var(--ink)] px-4 py-3 text-left text-white shadow-[0_16px_32px_rgba(22,50,44,0.16)]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/68">
                      Basket
                    </p>
                    <p className="mt-1 text-sm font-semibold">{cartCount} items</p>
                  </div>
                </div>
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
                        ? "bg-[var(--accent)] text-white"
                        : "border border-[var(--line)] bg-white text-[var(--muted)] hover:border-[rgba(31,122,103,0.24)] hover:text-[var(--ink)]"
                    }`}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1440px] px-4 py-6 lg:px-6 lg:py-8">
        <div className="grid gap-5 xl:grid-cols-[1.75fr_1fr]">
          <div className="space-y-5">
            <div className="grid gap-5 lg:grid-cols-[1.45fr_0.95fr]">
              <article className="relative overflow-hidden rounded-[34px] bg-[linear-gradient(140deg,#16322c,#1f7a67_58%,#f2b63d_130%)] p-7 text-white shadow-[0_28px_60px_rgba(22,50,44,0.18)]">
                <div className="absolute -right-8 top-6 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-[rgba(242,182,61,0.18)] blur-3xl" />
                <div className="relative max-w-xl">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/86">
                    <Icon name="spark" className="h-4 w-4" />
                    Market fresh every day
                  </span>
                  <h1 className="mt-5 font-[var(--font-display)] text-5xl font-semibold leading-[1.04] tracking-tight sm:text-6xl">
                    Groceries that feel local, fast, and beautifully curated.
                  </h1>
                  <p className="mt-4 max-w-lg text-base leading-7 text-white/78">
                    Shop produce, seafood, dairy, bakery, tea, and home essentials from a storefront designed around weekly Sri Lankan shopping habits.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => onCategoryChange("produce")}
                      className="rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-bold text-[var(--ink)]"
                    >
                      Shop fresh picks
                    </button>
                    <button
                      type="button"
                      onClick={onGpsCheck}
                      className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white"
                    >
                      Check delivery
                    </button>
                  </div>

                  <div className="mt-8 grid gap-3 sm:grid-cols-3">
                    {promoCards.map((card) => (
                      <div
                        key={card.id}
                        className="rounded-[24px] border border-white/12 bg-white/10 p-4 backdrop-blur"
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/62">
                          {card.eyebrow}
                        </p>
                        <p className="mt-2 text-lg font-semibold text-white">{card.title}</p>
                        <p className="mt-2 text-sm leading-6 text-white/72">
                          {card.description}
                        </p>
                        <p className="mt-3 text-sm font-semibold text-[var(--brand)]">
                          {card.metric}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </article>

              <div className="space-y-5">
                <article className="rounded-[30px] border border-[rgba(31,122,103,0.14)] bg-[linear-gradient(160deg,#f8fcfa,#eef9f4)] p-5 shadow-[0_18px_42px_rgba(22,50,44,0.06)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                    Your basket
                  </p>
                  <p className="mt-3 text-4xl font-semibold text-[var(--ink)]">
                    {formatCurrency(cartTotal)}
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-[20px] bg-white p-4">
                      <p className="text-2xl font-semibold text-[var(--ink)]">{cartCount}</p>
                      <p className="mt-1 text-sm text-[var(--muted)]">items ready</p>
                    </div>
                    <div className="rounded-[20px] bg-white p-4">
                      <p className="text-2xl font-semibold text-[var(--ink)]">11 PM</p>
                      <p className="mt-1 text-sm text-[var(--muted)]">last order</p>
                    </div>
                  </div>
                </article>

                <article className="rounded-[30px] bg-[linear-gradient(155deg,#f2b63d,#efc96d)] p-5 text-[var(--ink)] shadow-[0_22px_48px_rgba(242,182,61,0.18)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgba(22,50,44,0.58)]">
                    Weekly note
                  </p>
                  <h2 className="mt-3 font-[var(--font-display)] text-3xl font-semibold leading-tight">
                    Start with pantry staples, then top up with fresh finds.
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-[rgba(22,50,44,0.72)]">
                    We grouped the page around how real grocery baskets grow: essentials first, impulse picks after.
                  </p>
                </article>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {categories.slice(1, 6).map((category, index) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => onCategoryChange(category.id)}
                  className={`rounded-[28px] border border-[var(--line)] p-5 text-left shadow-[0_14px_30px_rgba(22,50,44,0.04)] transition hover:-translate-y-1 ${
                    index % 3 === 0
                      ? "bg-[#fff8e8]"
                      : index % 3 === 1
                        ? "bg-[#eef8f4]"
                        : "bg-[#f7f4ff]"
                  }`}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[var(--accent)] shadow-sm">
                    <Icon name={category.icon} className="h-6 w-6" />
                  </div>
                  <p className="mt-4 text-lg font-semibold text-[var(--ink)]">{category.name}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    {category.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <aside className="space-y-5">
            <article className="rounded-[30px] border border-[var(--line)] bg-white p-5 shadow-[0_18px_42px_rgba(22,50,44,0.06)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                    Delivery area
                  </p>
                  <h2 className="mt-2 font-[var(--font-display)] text-3xl font-semibold text-[var(--ink)]">
                    Set your location
                  </h2>
                </div>
                <div className="rounded-2xl bg-[var(--accent-soft)] p-3 text-[var(--accent)]">
                  <Icon name="location" className="h-5 w-5" />
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                {locationLabel}
              </p>

              <div
                className={`mt-4 rounded-[24px] p-4 ${
                  serviceability?.eligible ? "bg-[#eef8f4]" : "bg-[#fff8eb]"
                }`}
              >
                <p className="text-sm font-semibold text-[var(--ink)]">
                  {locating
                    ? "Checking availability near you..."
                    : serviceability?.message ??
                      "Use current location to see whether we can deliver to your area."}
                </p>
                {serviceability?.zone ? (
                  <div className="mt-3 space-y-1 text-sm text-[var(--muted)]">
                    <p>
                      Hub: <span className="font-semibold text-[var(--ink)]">{serviceability.zone.name}</span>
                    </p>
                    <p>
                      ETA: <span className="font-semibold text-[var(--ink)]">{serviceability.etaMinutes} min</span>
                    </p>
                    <p>
                      Distance: <span className="font-semibold text-[var(--ink)]">{serviceability.distanceKm} km</span>
                    </p>
                  </div>
                ) : null}
                {locationError ? (
                  <p className="mt-3 text-sm font-semibold text-[var(--danger)]">
                    {locationError}
                  </p>
                ) : null}
              </div>

              <button
                type="button"
                onClick={onGpsCheck}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-4 py-3 text-sm font-bold text-white"
              >
                <Icon name="location" className="h-4 w-4" />
                Use my location
              </button>

              <div className="mt-4 space-y-2">
                {liveZones.map((zone) => (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => onSampleZoneCheck(zone)}
                    className="flex w-full items-center justify-between rounded-[20px] border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 text-left"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[var(--ink)]">{zone.name}</p>
                      <p className="text-sm text-[var(--muted)]">{zone.district}</p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--accent)]">
                      {zone.radiusKm} km
                    </span>
                  </button>
                ))}
              </div>
            </article>

            <article className="rounded-[30px] border border-[var(--line)] bg-white p-5 shadow-[0_18px_42px_rgba(22,50,44,0.06)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Store highlights
              </p>
              <div className="mt-4 space-y-3">
                {highlightPills.map((pill) => (
                  <div
                    key={pill}
                    className="flex items-center gap-3 rounded-[20px] bg-[var(--surface-strong)] px-4 py-3"
                  >
                    <div className="rounded-full bg-white p-2 text-[var(--accent)] shadow-sm">
                      <Icon name="check" className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-semibold text-[var(--ink)]">{pill}</span>
                  </div>
                ))}
              </div>
            </article>
          </aside>
        </div>
      </section>
    </>
  );
}
