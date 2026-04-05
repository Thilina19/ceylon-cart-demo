"use client";

import type { OrderRecord, OrderStatus } from "@/lib/store-data";
import { Panel, formatCurrency, formatDate } from "@/components/admin/admin-ui";

export function AdminOrders({
  filter,
  isPending,
  onFilterChange,
  onOrderStatusChange,
  onSaveOrderStatus,
  orders,
}: {
  filter: "all" | OrderStatus;
  isPending: boolean;
  onFilterChange: (value: "all" | OrderStatus) => void;
  onOrderStatusChange: (orderId: string, status: OrderStatus) => void;
  onSaveOrderStatus: (orderId: string, status: OrderStatus) => void;
  orders: OrderRecord[];
}) {
  return (
    <Panel
      title="Orders"
      subtitle="Filter by status, scan the basket, and move each order through fulfillment."
      actions={
        <div className="flex flex-wrap gap-2">
          {(["all", "pending", "confirmed", "delivering", "completed"] as const).map(
            (value) => (
              <button
                key={value}
                type="button"
                onClick={() => onFilterChange(value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  filter === value
                    ? "bg-[var(--ink)] text-white"
                    : "bg-[var(--surface-strong)] text-[var(--muted)]"
                }`}
              >
                {value}
              </button>
            ),
          )}
        </div>
      }
    >
      <div className="space-y-4">
        {orders.map((order) => (
          <article
            key={order.id}
            className="rounded-[26px] border border-[var(--line)] bg-[var(--surface-strong)] p-5"
          >
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                  Order {order.id.slice(0, 8).toUpperCase()} · {formatDate(order.createdAt)}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-[var(--ink)]">
                  {order.customerName}
                </h3>
                <p className="mt-1 text-sm text-[var(--muted)]">{order.phone}</p>
                <p className="mt-1 max-w-3xl text-sm leading-7 text-[var(--muted)]">
                  {order.address}
                </p>
                {order.note ? (
                  <p className="mt-1 text-sm text-[var(--muted)]">Note: {order.note}</p>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--ink)]">
                  {formatCurrency(order.total)}
                </div>
                <select
                  value={order.status}
                  onChange={(event) =>
                    onOrderStatusChange(order.id, event.target.value as OrderStatus)
                  }
                  className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--ink)] outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="delivering">Delivering</option>
                  <option value="completed">Completed</option>
                </select>
                <button
                  type="button"
                  onClick={() => onSaveOrderStatus(order.id, order.status)}
                  disabled={isPending}
                  className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  Save status
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {order.items.map((item) => (
                <div
                  key={`${order.id}-${item.productId}`}
                  className="rounded-[20px] border border-[var(--line)] bg-white px-4 py-4"
                >
                  <p className="font-semibold text-[var(--ink)]">{item.name}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {item.quantity} x {formatCurrency(item.unitPrice)}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--ink)]">
                    {formatCurrency(item.lineTotal)}
                  </p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </Panel>
  );
}
