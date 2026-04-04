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
    <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-2xl border border-[var(--line)] bg-white">
        <div className="border-b border-[var(--line)] px-4 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Platform backend
          </p>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--ink)]">
            Core flows already wired for demo
          </h2>
        </div>

        <div className="grid gap-4 p-4 md:grid-cols-3">
          <div className="rounded-2xl bg-[#fff8df] p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[var(--ink)]">
              <Icon name="location" className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[var(--ink)]">GPS delivery check</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Frontend location calls an API route that checks live radius coverage and computes ETA.
            </p>
          </div>

          <div className="rounded-2xl bg-[#edf4ff] p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[var(--accent)]">
              <Icon name="phone" className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[var(--ink)]">OTP onboarding</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Sri Lankan mobile numbers are normalized, OTP codes are issued, and verification creates a session.
            </p>
          </div>

          <div className="rounded-2xl bg-[#ecf8f2] p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[var(--success)]">
              <Icon name="shield" className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[var(--ink)]">Zone updates</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Delivery hubs, active status, ETA, and minimum order are all exposed through backend routes.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--line)] bg-white">
        <div className="border-b border-[var(--line)] px-4 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Live delivery zones
          </p>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--ink)]">
            Current coverage
          </h2>
        </div>

        <div className="p-4">
          <div className="rounded-2xl border border-[var(--line)]">
            <div className="grid grid-cols-[1.3fr_0.7fr_0.7fr] gap-3 border-b border-[var(--line)] bg-[#f8f9fb] px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
              <span>Zone</span>
              <span>Radius</span>
              <span>Minimum</span>
            </div>

            {liveZones.map((zone) => (
              <div
                key={zone.id}
                className="grid grid-cols-[1.3fr_0.7fr_0.7fr] gap-3 border-b border-[var(--line)] px-4 py-4 text-sm last:border-b-0"
              >
                <div>
                  <p className="font-semibold text-[var(--ink)]">{zone.name}</p>
                  <p className="mt-1 text-[var(--muted)]">{zone.district}</p>
                  <p className="mt-2 inline-flex rounded-full bg-[#ecf8f2] px-2.5 py-1 text-[11px] font-semibold text-[var(--success)]">
                    {zone.etaMinutes} min
                  </p>
                </div>
                <div className="font-semibold text-[var(--ink)]">{zone.radiusKm} km</div>
                <div className="font-semibold text-[var(--ink)]">
                  {formatCurrency(zone.minOrder)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
