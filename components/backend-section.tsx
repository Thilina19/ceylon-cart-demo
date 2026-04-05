import Image from "next/image";
import type { DeliveryZone } from "@/lib/store-data";
import { Icon } from "@/components/icons";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function BackendSection({ zones }: { zones: DeliveryZone[] }) {
  const liveZones = zones.filter((zone) => zone.active);

  return (
    <section id="coverage" className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <article className="overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,#14312b,#20483f)] text-white shadow-[0_24px_48px_rgba(22,50,44,0.18)]">
        <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="p-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/62">
              Designed for repeat shopping
            </p>
            <h2 className="mt-4 font-[var(--font-display)] text-4xl font-semibold leading-tight">
              Fewer steps, faster decisions, and a store that feels easier to use.
            </h2>
            <div className="mt-6 space-y-4">
              <div className="border-l border-white/20 pl-4">
                <p className="text-sm font-semibold text-white">Clear shelves</p>
                <p className="mt-1 text-sm leading-6 text-white/72">
                  Products are grouped by how people actually shop, not just by category labels.
                </p>
              </div>
              <div className="border-l border-white/20 pl-4">
                <p className="text-sm font-semibold text-white">Image-led browsing</p>
                <p className="mt-1 text-sm leading-6 text-white/72">
                  Large visuals help the page feel like a store, not an admin dashboard.
                </p>
              </div>
              <div className="border-l border-white/20 pl-4">
                <p className="text-sm font-semibold text-white">Simple basket flow</p>
                <p className="mt-1 text-sm leading-6 text-white/72">
                  Search, pick an aisle, add to basket, then check delivery when you are ready.
                </p>
              </div>
            </div>
          </div>

          <div className="min-h-[320px]">
            <Image
              src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1400&q=80"
              alt="Shopping basket with vegetables and groceries"
              width={900}
              height={720}
              sizes="(max-width: 1023px) 100vw, 45vw"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </article>

      <article className="rounded-[36px] bg-white p-6 shadow-[0_18px_42px_rgba(22,50,44,0.06)]">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              Delivery coverage
            </p>
            <h2 className="mt-2 font-[var(--font-display)] text-4xl font-semibold text-[var(--ink)]">
              Areas we serve
            </h2>
          </div>
          <div className="rounded-full bg-[var(--accent-soft)] p-3 text-[var(--accent)]">
            <Icon name="truck" className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {liveZones.map((zone) => (
            <div
              key={zone.id}
              className="rounded-[24px] border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-[var(--ink)]">{zone.name}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{zone.district}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                  {zone.etaMinutes} min
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-[var(--muted)]">
                <span className="rounded-full bg-white px-3 py-1">
                  Radius {zone.radiusKm} km
                </span>
                <span className="rounded-full bg-white px-3 py-1">
                  Min {formatCurrency(zone.minOrder)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
