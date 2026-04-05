"use client";

import type { DeliveryZone } from "@/lib/store-data";
import { Field, Panel, formatCurrency } from "@/components/admin/admin-ui";

export function AdminLocations({
  isPending,
  onSaveZone,
  onSelectZone,
  onZoneCenterChange,
  onZoneUpdate,
  selectedZone,
  zones,
}: {
  isPending: boolean;
  onSaveZone: (zone: DeliveryZone) => void;
  onSelectZone: (zoneId: string) => void;
  onZoneCenterChange: (zoneId: string, field: "lat" | "lng", value: number) => void;
  onZoneUpdate: (
    zoneId: string,
    field: keyof DeliveryZone,
    value: string | number | boolean | DeliveryZone["center"],
  ) => void;
  selectedZone: DeliveryZone | null;
  zones: DeliveryZone[];
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <Panel
        title="Delivery locations"
        subtitle="Review all service zones in one place and open the one you need to adjust."
      >
        <div className="space-y-3">
          {zones.map((zone) => {
            const active = zone.id === selectedZone?.id;

            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => onSelectZone(zone.id)}
                className={`flex w-full items-center justify-between gap-3 rounded-[22px] border px-4 py-4 text-left transition ${
                  active
                    ? "border-[var(--ink)] bg-[var(--ink)] text-white"
                    : "border-[var(--line)] bg-[var(--surface-strong)] text-[var(--ink)] hover:border-[var(--brand)]"
                }`}
              >
                <div>
                  <p className="font-semibold">{zone.name}</p>
                  <p className={`mt-1 text-sm ${active ? "text-white/70" : "text-[var(--muted)]"}`}>
                    {zone.district}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{zone.radiusKm} km</p>
                  <p className={`mt-1 text-sm ${active ? "text-white/70" : "text-[var(--muted)]"}`}>
                    {zone.active ? "Active" : "Paused"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </Panel>

      <Panel
        title={selectedZone ? "Edit selected location" : "Select a location"}
        subtitle="Tune radius, ETA, minimum order, and coordinates with one editor."
        actions={
          selectedZone ? (
            <button
              type="button"
              onClick={() => onSaveZone(selectedZone)}
              disabled={isPending}
              className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              Save zone
            </button>
          ) : null
        }
      >
        {selectedZone ? (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <Field
                label="Zone name"
                value={selectedZone.name}
                onChange={(value) => onZoneUpdate(selectedZone.id, "name", value)}
              />
              <Field
                label="District"
                value={selectedZone.district}
                onChange={(value) => onZoneUpdate(selectedZone.id, "district", value)}
              />
              <Field
                label="Radius km"
                type="number"
                value={String(selectedZone.radiusKm)}
                onChange={(value) =>
                  onZoneUpdate(
                    selectedZone.id,
                    "radiusKm",
                    Number(value || selectedZone.radiusKm),
                  )
                }
              />
              <Field
                label="ETA minutes"
                type="number"
                value={String(selectedZone.etaMinutes)}
                onChange={(value) =>
                  onZoneUpdate(
                    selectedZone.id,
                    "etaMinutes",
                    Number(value || selectedZone.etaMinutes),
                  )
                }
              />
              <Field
                label="Minimum order"
                type="number"
                value={String(selectedZone.minOrder)}
                onChange={(value) =>
                  onZoneUpdate(
                    selectedZone.id,
                    "minOrder",
                    Number(value || selectedZone.minOrder),
                  )
                }
              />
              <label className="block">
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                  Status
                </span>
                <select
                  value={selectedZone.active ? "active" : "paused"}
                  onChange={(event) =>
                    onZoneUpdate(
                      selectedZone.id,
                      "active",
                      event.target.value === "active",
                    )
                  }
                  className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 text-sm outline-none transition focus:border-[var(--brand)]"
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                </select>
              </label>
              <Field
                label="Latitude"
                type="number"
                value={String(selectedZone.center.lat)}
                onChange={(value) =>
                  onZoneCenterChange(
                    selectedZone.id,
                    "lat",
                    Number(value || selectedZone.center.lat),
                  )
                }
              />
              <Field
                label="Longitude"
                type="number"
                value={String(selectedZone.center.lng)}
                onChange={(value) =>
                  onZoneCenterChange(
                    selectedZone.id,
                    "lng",
                    Number(value || selectedZone.center.lng),
                  )
                }
              />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-[22px] bg-[var(--surface-strong)] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                  Promise
                </p>
                <p className="mt-3 text-xl font-semibold text-[var(--ink)]">
                  {selectedZone.etaMinutes} min
                </p>
              </div>
              <div className="rounded-[22px] bg-[var(--surface-strong)] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                  Coverage
                </p>
                <p className="mt-3 text-xl font-semibold text-[var(--ink)]">
                  {selectedZone.radiusKm} km
                </p>
              </div>
              <div className="rounded-[22px] bg-[var(--surface-strong)] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                  Minimum basket
                </p>
                <p className="mt-3 text-xl font-semibold text-[var(--ink)]">
                  {formatCurrency(selectedZone.minOrder)}
                </p>
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-[var(--muted)]">
            Select a zone from the list to edit it.
          </p>
        )}
      </Panel>
    </div>
  );
}
