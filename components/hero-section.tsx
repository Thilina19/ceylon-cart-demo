import type { DeliveryZone } from "@/lib/store-data";
import {
  aisleHighlights,
  categories,
  highlightPills,
  promoCards,
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
  const liveZones = zones.filter((zone) => zone.active).slice(0, 4);

  return (
    <>
      <div className="bg-[var(--brand)] px-3 py-2 text-xs font-semibold text-[var(--ink)]">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Icon name="truck" className="h-4 w-4" />
            <span>
              Free delivery on selected baskets. Shop groceries, fresh food, and home essentials in one place.
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.12em] text-[rgba(31,37,47,0.72)]">
            <span>Express delivery</span>
            <span>Daily deals</span>
            <span>Weekly savings</span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-white">
        <div className="mx-auto max-w-[1440px] px-3 lg:px-6">
          <div className="flex flex-col gap-3 py-3">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--line)] bg-white text-[var(--ink)]"
                >
                  <Icon name="menu" />
                </button>
                <div className="flex items-center gap-3">
                  <LogoMark />
                  <div className="leading-tight">
                    <p className="text-2xl font-extrabold tracking-tight text-[var(--ink)]">
                      Ceylon Cart
                    </p>
                    <p className="text-xs font-medium text-[var(--muted)]">
                      supermarket
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-3 xl:flex-row xl:items-center">
                <button
                  type="button"
                  onClick={onGpsCheck}
                  className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[#f9fafb] px-4 py-3 text-left xl:min-w-[240px]"
                >
                  <div className="rounded-full bg-[var(--brand)] p-2 text-[var(--ink)]">
                    <Icon name="location" className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                      Deliver to
                    </p>
                    <p className="truncate text-sm font-semibold text-[var(--ink)]">
                      {serviceability?.zone?.district ?? "Choose your location"}
                    </p>
                  </div>
                </button>

                <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border-2 border-[var(--brand)] bg-[#fffdf7] px-4 py-3 shadow-[0_8px_20px_rgba(255,198,41,0.12)]">
                  <Icon name="search" className="h-5 w-5 text-[var(--muted)]" />
                  <input
                    value={query}
                    onChange={(event) => onQueryChange(event.target.value)}
                    placeholder="Search for products, brands and more"
                    className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 xl:flex xl:items-center">
                  <button
                    type="button"
                    onClick={onOpenAuth}
                    className="rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-left"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                      Account
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[var(--ink)]">
                      {registeredUserName ?? "Sign in"}
                    </p>
                  </button>

                  <div className="rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-left">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                      Cart
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[var(--ink)]">
                      {cartCount} items
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-[var(--line)] pt-3">
              {categories.map((category) => {
                const active = activeCategory === category.id;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => onCategoryChange(category.id)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      active
                        ? "bg-[var(--brand)] text-[var(--ink)]"
                        : "bg-[#f3f4f6] text-[var(--muted)] hover:bg-[#eceef3]"
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

      <div className="mx-auto max-w-[1440px] px-3 py-4 lg:px-6">
        <div className="grid gap-4 xl:grid-cols-[2.2fr_1fr]">
          <div className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-[1.8fr_1fr]">
              <section className="overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#ffe278,#ffcb37_55%,#ffb800)] p-6 shadow-[0_16px_32px_rgba(255,198,41,0.18)]">
                <div className="flex h-full flex-col justify-between gap-6">
                  <div className="max-w-xl">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/65 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ink)]">
                      <Icon name="tag" className="h-4 w-4" />
                      Daily supermarket deals
                    </div>
                    <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-[var(--ink)] sm:text-5xl">
                      Everything you need for the week, all in one basket.
                    </h1>
                    <p className="mt-3 max-w-lg text-sm leading-6 text-[rgba(31,37,47,0.76)] sm:text-base">
                      Discover fresh produce, pantry staples, chilled essentials, beverages, and home care with fast delivery across selected areas.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {promoCards.map((card) => (
                      <div
                        key={card.id}
                        className="rounded-2xl border border-white/50 bg-white/82 p-4 backdrop-blur"
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                          {card.eyebrow}
                        </p>
                        <p className="mt-2 text-lg font-bold text-[var(--ink)]">
                          {card.title}
                        </p>
                        <p className="mt-1 text-sm leading-5 text-[var(--muted)]">
                          {card.description}
                        </p>
                        <p className="mt-3 text-sm font-semibold text-[var(--accent)]">
                          {card.metric}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <section className="rounded-2xl bg-[linear-gradient(140deg,#0b5bd3,#4c8eff)] p-5 text-white shadow-[0_16px_30px_rgba(45,108,223,0.16)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/72">
                    Smart shopping
                  </p>
                  <h2 className="mt-2 text-2xl font-extrabold">
                    Save more on everyday staples
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-white/78">
                    Shop rice, milk, bread, eggs, drinks, and cleaning essentials with easy repeat ordering.
                  </p>
                  <button
                    type="button"
                    onClick={onOpenAuth}
                    className="mt-4 rounded-xl bg-white px-4 py-3 text-sm font-bold text-[var(--accent)]"
                  >
                    Sign in
                  </button>
                </section>

                <section className="rounded-2xl border border-[var(--line)] bg-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                        Basket total
                      </p>
                      <p className="mt-2 text-3xl font-extrabold text-[var(--ink)]">
                        {formatCurrency(cartTotal)}
                      </p>
                    </div>
                    <div className="rounded-full bg-[#fff3cc] p-3 text-[var(--ink)]">
                      <Icon name="cart" className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl bg-[#f8f9fb] p-3">
                      <p className="font-semibold text-[var(--ink)]">{cartCount}</p>
                      <p className="text-[var(--muted)]">items in basket</p>
                    </div>
                    <div className="rounded-xl bg-[#f8f9fb] p-3">
                      <p className="font-semibold text-[var(--ink)]">11 PM</p>
                      <p className="text-[var(--muted)]">last order today</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <section className="rounded-2xl border border-[var(--line)] bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-[var(--ink)]">
                    Popular supermarket shortcuts
                  </p>
                  <p className="text-sm text-[var(--muted)]">
                    Jump straight into the departments people shop from most.
                  </p>
                </div>
                <div className="hidden items-center gap-2 text-sm font-semibold text-[var(--accent)] md:flex">
                  View all
                  <Icon name="chevron" className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
                {categories.map((category) => {
                  const active = activeCategory === category.id;

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => onCategoryChange(category.id)}
                      className={`rounded-2xl border p-4 text-center transition ${
                        active
                          ? "border-[var(--brand)] bg-[#fff8df]"
                          : "border-[var(--line)] bg-white hover:border-[#d8dce5] hover:bg-[#fafbfc]"
                      }`}
                    >
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fff3cc] text-[var(--ink)]">
                        <Icon name={category.icon} className="h-6 w-6" />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-[var(--ink)]">
                        {category.name}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>

            <div className="grid gap-4 md:grid-cols-3">
              {aisleHighlights.map((item, index) => (
                <div
                  key={item.title}
                  className={`rounded-2xl border border-[var(--line)] p-4 ${
                    index === 0
                      ? "bg-[#fff8df]"
                      : index === 1
                        ? "bg-[#edf4ff]"
                        : "bg-[#fff1ee]"
                  }`}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                    Shopping picks
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-[var(--ink)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-[var(--line)] bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                    Delivery address
                  </p>
                  <h2 className="mt-2 text-2xl font-extrabold text-[var(--ink)]">
                    Check your area
                  </h2>
                </div>
                <div className="rounded-full bg-[#fff3cc] p-3 text-[var(--ink)]">
                  <Icon name="location" className="h-5 w-5" />
                </div>
              </div>

              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {locationLabel}
              </p>

              <div
                className={`mt-4 rounded-2xl p-4 ${
                  serviceability?.eligible ? "bg-[#eaf7f1]" : "bg-[#fff7e8]"
                }`}
              >
                <p className="text-sm font-semibold text-[var(--ink)]">
                  {locating
                    ? "Checking your delivery eligibility..."
                    : serviceability?.message ??
                      "Use your location to see whether express delivery is available in your area."}
                </p>
                {serviceability?.zone ? (
                  <div className="mt-3 space-y-1 text-sm text-[var(--muted)]">
                    <p>
                      Hub:{" "}
                      <span className="font-semibold text-[var(--ink)]">
                        {serviceability.zone.name}
                      </span>
                    </p>
                    <p>
                      Distance:{" "}
                      <span className="font-semibold text-[var(--ink)]">
                        {serviceability.distanceKm} km
                      </span>
                    </p>
                    <p>
                      ETA:{" "}
                      <span className="font-semibold text-[var(--ink)]">
                        {serviceability.etaMinutes} min
                      </span>
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
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-4 py-3 text-sm font-bold text-[var(--ink)]"
              >
                <Icon name="location" className="h-4 w-4" />
                Use current location
              </button>

              <div className="mt-4 space-y-2">
                {liveZones.map((zone) => (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => onSampleZoneCheck(zone)}
                    className="flex w-full items-center justify-between rounded-xl border border-[var(--line)] bg-[#fafbfc] px-4 py-3 text-left"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[var(--ink)]">
                        {zone.name}
                      </p>
                      <p className="text-sm text-[var(--muted)]">{zone.district}</p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--accent)]">
                      {zone.radiusKm} km
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-[var(--line)] bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                Why shoppers come back
              </p>
              <div className="mt-4 space-y-3">
                {highlightPills.map((pill) => (
                  <div
                    key={pill}
                    className="flex items-center gap-3 rounded-xl bg-[#f8f9fb] px-4 py-3"
                  >
                    <div className="rounded-full bg-[#fff3cc] p-2 text-[var(--ink)]">
                      <Icon name="check" className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-semibold text-[var(--ink)]">{pill}</p>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </>
  );
}
