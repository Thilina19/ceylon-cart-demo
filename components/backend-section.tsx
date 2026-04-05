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
    <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
      <article className="rounded-[32px] border border-[var(--line)] bg-white p-5 shadow-[0_18px_42px_rgba(22,50,44,0.05)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              Shopping rhythms
            </p>
            <h2 className="mt-2 font-[var(--font-display)] text-4xl font-semibold text-[var(--ink)]">
              Built around how real weekly baskets happen
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-soft)] px-4 py-2 text-sm font-semibold text-[var(--accent)]">
            <Icon name="spark" className="h-4 w-4" />
            Fresh, pantry, home, and quick top-ups
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-[26px] bg-[#fff8e8] p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[var(--brand-deep)] shadow-sm">
              <Icon name="leaf" className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-[var(--ink)]">Morning restocks</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Milk, bread, eggs, fruit, and tea for early household shopping runs.
            </p>
          </div>

          <div className="rounded-[26px] bg-[#eef8f4] p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[var(--accent)] shadow-sm">
              <Icon name="jar" className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-[var(--ink)]">Pantry refills</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Rice, dhal, coconut milk, seasonings, and kitchen basics for everyday cooking.
            </p>
          </div>

          <div className="rounded-[26px] bg-[#f7f4ff] p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#7c5bd8] shadow-sm">
              <Icon name="home" className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-[var(--ink)]">Home refresh</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Tissue, detergents, dishwash, and cleaning supplies grouped for easy repeat ordering.
            </p>
          </div>
        </div>
      </article>

      <article className="rounded-[32px] border border-[var(--line)] bg-white p-5 shadow-[0_18px_42px_rgba(22,50,44,0.05)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
          Active delivery areas
        </p>
        <h2 className="mt-2 font-[var(--font-display)] text-4xl font-semibold text-[var(--ink)]">
          Coverage today
        </h2>

        <div className="mt-5 space-y-3">
          {liveZones.map((zone) => (
            <div
              key={zone.id}
              className="rounded-[24px] border border-[var(--line)] bg-[var(--surface-strong)] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-[var(--ink)]">{zone.name}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{zone.district}</p>
                </div>
                <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
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
