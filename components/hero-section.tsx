import type { Category, DeliveryZone } from "@/lib/store-data";
import {
  aisleHighlights,
  categories,
  highlightPills,
  promoCards,
  serviceMoments,
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
  const formattedCartTotal = new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(cartTotal);

  return (
    <>
      <div className="border-b border-black/5 bg-[linear-gradient(90deg,#19342c,#0f6354)] px-4 py-3 text-sm text-white">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 font-medium tracking-[0.14em] uppercase text-white/75">
            <Icon name="clock" className="h-4 w-4" />
            Sri Lanka grocery delivery concept
          </p>
          <div className="flex flex-wrap items-center gap-3 text-white/90">
            <span>60-minute delivery in selected zones</span>
            <span className="hidden h-1 w-1 rounded-full bg-white/60 sm:block" />
            <span>Backend-controlled radius coverage</span>
            <span className="hidden h-1 w-1 rounded-full bg-white/60 sm:block" />
            <span>Mobile OTP registration</span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(255,253,248,0.92)] backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-4 lg:px-8">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
            <div className="flex items-center gap-3">
              <LogoMark />
              <div>
                <p className="font-[var(--font-display)] text-2xl font-semibold tracking-[0.04em]">
                  Ceylon Cart
                </p>
                <p className="text-sm text-[var(--muted)]">
                  Modern grocery delivery for Sri Lanka
                </p>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-3 xl:flex-row xl:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-3 rounded-[26px] border border-[var(--line)] bg-white px-4 py-3 shadow-[0_14px_34px_rgba(25,52,44,0.06)]">
                <Icon name="search" className="h-5 w-5 text-[var(--brand)]" />
                <input
                  value={query}
                  onChange={(event) => onQueryChange(event.target.value)}
                  placeholder="Search for vegetables, tea, rice, bread, cleaning supplies..."
                  className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
                />
              </div>

              <button
                type="button"
                onClick={onGpsCheck}
                className="flex items-center justify-center gap-2 rounded-[22px] border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 text-sm font-semibold text-[var(--brand-deep)] transition hover:-translate-y-0.5"
              >
                <Icon name="location" className="h-5 w-5" />
                Use GPS
              </button>

              <button
                type="button"
                onClick={onOpenAuth}
                className="flex items-center justify-center gap-2 rounded-[22px] border border-[var(--line)] bg-white px-4 py-3 text-sm font-semibold text-[var(--ink)] transition hover:-translate-y-0.5"
              >
                <Icon name="user" className="h-5 w-5" />
                {registeredUserName ?? "Register / Sign in"}
              </button>

              <div className="flex items-center justify-center gap-2 rounded-[22px] bg-[var(--ink)] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(25,52,44,0.18)]">
                <Icon name="cart" className="h-5 w-5" />
                {cartCount} items
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {highlightPills.map((pill) => (
              <span
                key={pill}
                className="rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-xs font-semibold tracking-[0.08em] uppercase text-[var(--muted)]"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-4 py-6 lg:px-8 lg:py-8">
        <section className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
        <aside className="hidden rounded-[30px] border border-[var(--line)] bg-white p-5 shadow-[0_24px_48px_rgba(25,52,44,0.06)] xl:block">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-[var(--font-display)] text-2xl font-semibold">
              Shop by aisle
            </h2>
            <span className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
              Inspired by big-basket browsing
            </span>
          </div>

          <div className="space-y-2">
            {categories.map((category: Category) => {
              const active = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => onCategoryChange(category.id)}
                  className={`flex w-full items-start gap-3 rounded-[24px] px-4 py-3 text-left transition ${
                    active
                      ? "bg-[linear-gradient(135deg,#19342c,#0f8c76)] text-white shadow-[0_18px_40px_rgba(15,99,84,0.2)]"
                      : "bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--surface-strong)]"
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                      active
                        ? "bg-white/14 text-white"
                        : "bg-[rgba(15,140,118,0.12)] text-[var(--brand-deep)]"
                    }`}
                  >
                    <Icon name={category.icon} />
                  </div>
                  <div>
                    <p className="font-semibold">{category.name}</p>
                    <p
                      className={`mt-1 text-sm ${
                        active ? "text-white/74" : "text-[var(--muted)]"
                      }`}
                    >
                      {category.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="space-y-5">
          <div className="relative overflow-hidden rounded-[36px] border border-[rgba(15,140,118,0.12)] bg-[linear-gradient(135deg,#fff3df_0%,#fffdf6_36%,#d8f6ee_100%)] p-6 shadow-[0_28px_56px_rgba(25,52,44,0.08)] sm:p-8">
            <div className="pointer-events-none absolute inset-y-0 right-0 w-[42%] bg-[radial-gradient(circle_at_top,rgba(244,118,77,0.28),transparent_42%),radial-gradient(circle_at_bottom,rgba(15,140,118,0.22),transparent_48%)]" />
            <div className="relative max-w-2xl">
              <span className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold tracking-[0.16em] uppercase text-[var(--brand)] shadow-sm">
                Sri Lanka grocery superstore
              </span>
              <h1 className="mt-4 max-w-xl font-[var(--font-display)] text-4xl font-semibold leading-tight text-[var(--ink)] sm:text-6xl">
                A Noon-style grocery experience, reimagined with a tropical Sri Lankan palette.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
                This concept storefront combines dense category browsing, fast-deal merchandising,
                GPS-based delivery checks, and OTP onboarding into a single modern grocery journey.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(25,52,44,0.18)] transition hover:-translate-y-0.5"
                >
                  Create mobile account
                </button>
                <button
                  type="button"
                  onClick={onGpsCheck}
                  className="rounded-full border border-[var(--line)] bg-white px-6 py-3 text-sm font-semibold text-[var(--brand-deep)] transition hover:-translate-y-0.5"
                >
                  Check 1-hour delivery
                </button>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {promoCards.map((card) => (
                  <article
                    key={card.id}
                    className={`rounded-[28px] border border-white/60 bg-gradient-to-br ${card.accent} p-4 shadow-[0_18px_40px_rgba(25,52,44,0.08)]`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                      {card.eyebrow}
                    </p>
                    <h3 className="mt-3 text-xl font-semibold text-[var(--ink)]">{card.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{card.description}</p>
                    <p className="mt-4 text-sm font-semibold text-[var(--brand-deep)]">
                      {card.metric}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {aisleHighlights.map((item, index) => (
              <article
                key={item.title}
                className={`rounded-[28px] border border-[var(--line)] p-5 shadow-[0_18px_40px_rgba(25,52,44,0.05)] ${
                  index === 0
                    ? "bg-[linear-gradient(135deg,#fff7e8,#ffffff)]"
                    : index === 1
                      ? "bg-[linear-gradient(135deg,#e7f8f1,#ffffff)]"
                      : "bg-[linear-gradient(135deg,#fff0e9,#ffffff)]"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                  Curated mission
                </p>
                <h3 className="mt-3 text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.text}</p>
              </article>
            ))}
          </div>
        </div>

          <aside className="space-y-5">
            <div className="rounded-[30px] border border-[var(--line)] bg-white p-5 shadow-[0_24px_48px_rgba(25,52,44,0.06)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
                  Delivery status
                </p>
                <h2 className="mt-2 font-[var(--font-display)] text-3xl font-semibold">
                  One-hour coverage
                </h2>
              </div>
              <div className="rounded-2xl bg-[rgba(15,140,118,0.1)] p-3 text-[var(--brand)]">
                <Icon name="location" className="h-6 w-6" />
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{locationLabel}</p>

            <div
              className={`mt-5 rounded-[24px] p-4 ${
                serviceability?.eligible
                  ? "bg-[linear-gradient(135deg,#dff7ee,#f8fffc)]"
                  : "bg-[linear-gradient(135deg,#fff1e9,#fffaf7)]"
              }`}
            >
              <p className="text-sm font-semibold text-[var(--ink)]">
                {locating
                  ? "Checking your delivery eligibility..."
                  : serviceability?.message ??
                    "Try live GPS or tap one of the configured delivery hubs below."}
              </p>
              {serviceability?.zone ? (
                <div className="mt-3 text-sm text-[var(--muted)]">
                  <p>
                    Active hub:{" "}
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
                    Minimum order:{" "}
                    <span className="font-semibold text-[var(--ink)]">
                      LKR {serviceability.zone.minOrder.toLocaleString()}
                    </span>
                  </p>
                </div>
              ) : null}
              {locationError ? (
                <p className="mt-3 text-sm font-medium text-[var(--accent)]">{locationError}</p>
              ) : null}
            </div>

            <div className="mt-5 space-y-2">
              {zones.filter((zone) => zone.active).slice(0, 5).map((zone) => (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => onSampleZoneCheck(zone)}
                  className="flex w-full items-center justify-between rounded-[22px] border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-left transition hover:-translate-y-0.5 hover:bg-white"
                >
                  <div>
                    <p className="font-semibold">{zone.name}</p>
                    <p className="text-sm text-[var(--muted)]">{zone.district}</p>
                  </div>
                  <span className="text-sm font-semibold text-[var(--brand-deep)]">
                    {zone.radiusKm} km
                  </span>
                </button>
              ))}
            </div>
            </div>

            <div className="rounded-[30px] border border-[var(--line)] bg-[linear-gradient(160deg,#19342c,#0f6354)] p-5 text-white shadow-[0_24px_48px_rgba(25,52,44,0.18)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                Basket summary
              </p>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-4xl font-semibold">{formattedCartTotal}</p>
                  <p className="mt-1 text-sm text-white/74">
                    {cartCount} items ready for checkout
                  </p>
                </div>
                <div className="rounded-2xl bg-white/10 p-3">
                  <Icon name="cart" className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-5 space-y-3 text-sm text-white/78">
                {serviceMoments.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="rounded-full bg-white/10 p-1">
                      <Icon name="check" className="h-4 w-4" />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </>
  );
}
