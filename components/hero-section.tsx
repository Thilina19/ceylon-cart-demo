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
  promoCards: PromoCard[];
  query: string;
  registeredUserName?: string;
  serviceability: ServiceabilityState | null;
  onCategoryChange: (value: string) => void;
  onGpsCheck: () => void;
  onOpenCheckout: () => void;
  onOpenAuth: () => void;
  onQueryChange: (value: string) => void;
};

export function HeroSection({
  activeCategory,
  announcementBanner,
  cartCount,
  categories,
  highlightPills,
  locating,
  promoCards,
  query,
  registeredUserName,
  serviceability,
  onCategoryChange,
  onGpsCheck,
  onOpenCheckout,
  onOpenAuth,
  onQueryChange,
}: HeroSectionProps) {
  const quickCategories = categories.slice(0, 7);
  const sidePromos = promoCards.slice(0, 2);

  return (
    <>
      {announcementBanner.active ? (
        <div className="border-b border-[#e6d543] bg-[var(--brand)]">
          <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-3 px-4 py-2 text-sm text-[#2d2d2d] lg:px-6">
            <p className="font-medium">{announcementBanner.text}</p>
            <a
              href={announcementBanner.ctaHref || "#"}
              className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold"
            >
              {announcementBanner.ctaLabel}
            </a>
          </div>
        </div>
      ) : null}

      <header className="sticky top-0 z-40 border-b border-black/5 bg-[var(--brand)]">
        <div className="mx-auto max-w-[1280px] px-4 lg:px-6">
          <div className="flex flex-col gap-3 py-3">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
              <div className="flex items-center gap-3 xl:min-w-[240px]">
                <LogoMark />
                <div>
                  <p className="text-2xl font-black tracking-[-0.04em] text-[#1f1f1f]">
                    CeylonCart
                  </p>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/55">
                    supermarket
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onGpsCheck}
                className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-left shadow-[0_8px_24px_rgba(0,0,0,0.08)] xl:min-w-[220px]"
              >
                <Icon name="location" className="h-5 w-5 text-[#4a7a27]" />
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/45">
                    Deliver to
                  </p>
                  <p className="truncate text-sm font-semibold text-[#1f1f1f]">
                    {serviceability?.zone?.name ?? "Colombo"}
                  </p>
                </div>
              </button>

              <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
                <Icon name="search" className="h-5 w-5 text-black/45" />
                <input
                  value={query}
                  onChange={(event) => onQueryChange(event.target.value)}
                  placeholder="What are you looking for?"
                  className="min-w-0 flex-1 border-0 bg-transparent text-sm text-[#1f1f1f] outline-none placeholder:text-black/38"
                />
              </div>

              <div className="flex items-center gap-2 xl:justify-end">
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#1f1f1f] shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
                >
                  {registeredUserName ?? "Log in"}
                </button>
                <button
                  type="button"
                  onClick={onOpenCheckout}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#1f1f1f] px-4 py-3 text-sm font-semibold text-white"
                >
                  <Icon name="cart" className="h-4 w-4" />
                  Cart {cartCount}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
              {quickCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => onCategoryChange(category.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    activeCategory === category.id
                      ? "bg-[#1f1f1f] text-white"
                      : "bg-white/70 text-[#1f1f1f]"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1280px] px-4 py-5 lg:px-6">
        <div className="grid gap-4 xl:grid-cols-[1.55fr_0.75fr]">
          <article className="relative min-h-[300px] overflow-hidden rounded-[24px] bg-[#d8f2e9]">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(216,242,233,1)_0%,rgba(216,242,233,0.95)_44%,rgba(216,242,233,0.2)_100%)]" />
            <div className="absolute inset-y-0 right-0 w-[45%]">
              <Image
                src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1200&q=80"
                alt="Fresh groceries"
                fill
                sizes="(max-width: 1279px) 100vw, 36vw"
                className="object-cover"
              />
            </div>

            <div className="relative z-10 flex h-full max-w-[56%] flex-col justify-center px-7 py-8 sm:px-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0e7a5f]">
                Daily amazing deals
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-[#1f1f1f] sm:text-5xl">
                Don&apos;t miss our daily amazing deals.
              </h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-black/58">
                Fresh produce, pantry staples, bakery picks, chilled groceries,
                and everyday value for fast weekly shopping.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onCategoryChange("all")}
                  className="rounded-lg bg-[#0f9d68] px-5 py-3 text-sm font-semibold text-white"
                >
                  Shop now
                </button>
                <button
                  type="button"
                  onClick={onGpsCheck}
                  className="rounded-lg border border-black/10 bg-white/70 px-5 py-3 text-sm font-semibold text-[#1f1f1f] backdrop-blur-sm"
                >
                  {locating ? "Checking..." : "Use GPS"}
                </button>
              </div>
            </div>
          </article>

          <div className="grid gap-4">
            {sidePromos.map((promo, index) => (
              <article
                key={promo.id}
                className={`overflow-hidden rounded-[24px] p-6 ${
                  index === 0 ? "bg-[#fff5d7]" : "bg-[#eaf1ff]"
                }`}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
                  {promo.eyebrow}
                </p>
                <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-[#1f1f1f]">
                  {promo.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-black/58">
                  {promo.description}
                </p>
                <p className="mt-5 inline-flex rounded-full bg-white/75 px-4 py-2 text-sm font-semibold text-[#1f1f1f] backdrop-blur-sm">
                  {promo.metric}
                </p>
              </article>
            ))}
          </div>
        </div>

        {highlightPills.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {highlightPills.map((pill) => (
              <span
                key={pill}
                className="rounded-full border border-white/70 bg-white/72 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-black/55 backdrop-blur-md"
              >
                {pill}
              </span>
            ))}
          </div>
        ) : null}
      </section>
    </>
  );
}
