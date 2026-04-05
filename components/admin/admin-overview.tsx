"use client";

import type { AnnouncementBanner, DeliveryZone, OrderRecord, OrderStatus, PromoPopup } from "@/lib/store-data";
import { Panel, formatCurrency } from "@/components/admin/admin-ui";

export function AdminOverview({
  announcementBanner,
  orders,
  promoPopup,
  zones,
}: {
  announcementBanner: AnnouncementBanner;
  orders: OrderRecord[];
  promoPopup: PromoPopup;
  zones: DeliveryZone[];
}) {
  const ordersByStatus = ([
    "pending",
    "confirmed",
    "delivering",
    "completed",
  ] as OrderStatus[]).map((status) => ({
    status,
    count: orders.filter((order) => order.status === status).length,
  }));

  const maxStatusCount = Math.max(...ordersByStatus.map((item) => item.count), 1);

  const topProducts = Array.from(
    orders.reduce(
      (map, order) => {
        for (const item of order.items) {
          const existing = map.get(item.productId);

          if (existing) {
            existing.units += item.quantity;
            existing.revenue += item.lineTotal;
          } else {
            map.set(item.productId, {
              name: item.name,
              units: item.quantity,
              revenue: item.lineTotal,
            });
          }
        }

        return map;
      },
      new Map<string, { name: string; units: number; revenue: number }>(),
    ).values(),
  )
    .sort((left, right) => right.revenue - left.revenue)
    .slice(0, 5);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <Panel
        title="Trading snapshot"
        subtitle="A quick read on demand, revenue, and which products are carrying the store."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[26px] bg-[var(--surface-strong)] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              Orders by status
            </p>
            <div className="mt-5 space-y-4">
              {ordersByStatus.map((item) => (
                <div key={item.status}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold capitalize text-[var(--ink)]">
                      {item.status}
                    </span>
                    <span className="text-[var(--muted)]">{item.count} orders</span>
                  </div>
                  <div className="mt-2 h-3 rounded-full bg-white">
                    <div
                      className="h-3 rounded-full bg-[var(--accent)]"
                      style={{
                        width: `${Math.max(
                          (item.count / maxStatusCount) * 100,
                          item.count ? 12 : 0,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[26px] bg-[var(--surface-strong)] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              Best-selling products
            </p>
            <div className="mt-5 space-y-3">
              {topProducts.length ? (
                topProducts.map((product) => (
                  <div
                    key={product.name}
                    className="flex items-center justify-between gap-3 rounded-[20px] bg-white px-4 py-3"
                  >
                    <div>
                      <p className="font-semibold text-[var(--ink)]">{product.name}</p>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {product.units} units sold
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-[var(--ink)]">
                      {formatCurrency(product.revenue)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[var(--muted)]">
                  Product analytics will appear as soon as orders come in.
                </p>
              )}
            </div>
          </div>
        </div>
      </Panel>

      <div className="space-y-6">
        <Panel
          title="Marketing status"
          subtitle="Check what is currently live on the storefront."
        >
          <div className="space-y-4">
            <div className="rounded-[24px] bg-[var(--surface-strong)] p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                    Announcement banner
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[var(--ink)]">
                    {announcementBanner.active ? "Live" : "Hidden"}
                  </p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[var(--accent)]">
                  {announcementBanner.ctaLabel || "No CTA"}
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                {announcementBanner.text}
              </p>
            </div>

            <div className="rounded-[24px] bg-[var(--surface-strong)] p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                    Homepage popup
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[var(--ink)]">
                    {promoPopup.active ? "Live" : "Hidden"}
                  </p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[var(--accent)]">
                  {promoPopup.primaryLabel}
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                {promoPopup.title}
              </p>
            </div>
          </div>
        </Panel>

        <Panel
          title="Location coverage"
          subtitle="See all active and paused delivery zones at a glance."
        >
          <div className="space-y-3">
            {zones.map((zone) => (
              <div
                key={zone.id}
                className="flex items-center justify-between gap-3 rounded-[22px] bg-[var(--surface-strong)] px-4 py-4"
              >
                <div>
                  <p className="font-semibold text-[var(--ink)]">{zone.name}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{zone.district}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[var(--ink)]">
                    {zone.radiusKm} km
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {zone.active ? "Active" : "Paused"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
