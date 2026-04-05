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
    <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
      <div className="rounded-2xl border border-[var(--line)] bg-white">
        <div className="border-b border-[var(--line)] px-4 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            More to explore
          </p>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--ink)]">
            Shop by need, mood, and routine
          </h2>
        </div>

        <div className="grid gap-4 p-4 md:grid-cols-3">
          <div className="rounded-2xl bg-[#fff8df] p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[var(--ink)]">
              <Icon name="leaf" className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[var(--ink)]">Fresh market</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Pick from fruit, vegetables, eggs, milk, bread, and chilled basics for daily cooking.
            </p>
          </div>

          <div className="rounded-2xl bg-[#edf4ff] p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[var(--accent)]">
              <Icon name="tag" className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[var(--ink)]">Deal zone</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Limited-time offers across pantry staples, drinks, snacks, and household refills.
            </p>
          </div>

          <div className="rounded-2xl bg-[#ecf8f2] p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[var(--success)]">
              <Icon name="truck" className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[var(--ink)]">Fast delivery</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Order when you need essentials quickly and check whether your area is covered before checkout.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--line)] bg-white">
        <div className="border-b border-[var(--line)] px-4 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Delivery areas
          </p>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--ink)]">
            Available now
          </h2>
        </div>

        <div className="space-y-3 p-4">
          {liveZones.map((zone) => (
            <div
              key={zone.id}
              className="rounded-2xl border border-[var(--line)] bg-[#fafbfc] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-[var(--ink)]">{zone.name}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{zone.district}</p>
                </div>
                <span className="rounded-full bg-[#ecf8f2] px-2.5 py-1 text-[11px] font-semibold text-[var(--success)]">
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
      </div>
    </section>
  );
}
