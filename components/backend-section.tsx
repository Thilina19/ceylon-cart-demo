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
  return (
    <section className="grid gap-5 lg:grid-cols-[1.3fr_0.9fr]">
      <div className="rounded-[34px] border border-[var(--line)] bg-[linear-gradient(140deg,#fffefb,#fff5e9)] p-6 shadow-[0_24px_48px_rgba(25,52,44,0.06)]">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">
          Backend blueprint
        </p>
        <h2 className="mt-2 font-[var(--font-display)] text-4xl font-semibold">
          The key commerce logic is already server-side
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-[var(--line)] bg-white p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(15,140,118,0.12)] text-[var(--brand)]">
              <Icon name="location" className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">GPS serviceability API</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Browser location is sent to a backend route that checks live delivery radiuses with haversine distance.
            </p>
          </div>
          <div className="rounded-[24px] border border-[var(--line)] bg-white p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(244,118,77,0.14)] text-[var(--accent)]">
              <Icon name="user" className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Mobile number OTP auth</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Registration APIs normalize Sri Lankan mobile numbers, issue OTP codes, and verify them into sessions.
            </p>
          </div>
          <div className="rounded-[24px] border border-[var(--line)] bg-white p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(244,191,87,0.18)] text-[#b4770a]">
              <Icon name="shield" className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Zone control from backend</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Delivery locations, radiuses, ETA targets, and minimum order values are all exposed through backend APIs.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[34px] border border-[var(--line)] bg-white p-6 shadow-[0_24px_48px_rgba(25,52,44,0.06)]">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">
          Live configured zones
        </p>
        <h2 className="mt-2 font-[var(--font-display)] text-3xl font-semibold">
          Selected coverage areas
        </h2>
        <div className="mt-5 space-y-3">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className={`rounded-[24px] border px-4 py-4 ${
                zone.active
                  ? "border-[var(--line)] bg-[var(--surface)]"
                  : "border-dashed border-[rgba(25,52,44,0.18)] bg-[rgba(255,245,233,0.55)]"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{zone.name}</p>
                  <p className="text-sm text-[var(--muted)]">{zone.district}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
                    zone.active
                      ? "bg-[rgba(15,140,118,0.12)] text-[var(--brand-deep)]"
                      : "bg-[rgba(244,118,77,0.12)] text-[var(--accent)]"
                  }`}
                >
                  {zone.active ? "Live" : "Preview"}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-sm text-[var(--muted)]">
                <span className="rounded-full bg-white px-3 py-1">Radius {zone.radiusKm} km</span>
                <span className="rounded-full bg-white px-3 py-1">ETA {zone.etaMinutes} min</span>
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
