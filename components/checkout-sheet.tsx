"use client";

import type { DeliveryZone, RegisteredUser } from "@/lib/store-data";
import { Icon } from "@/components/icons";

type CheckoutItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  lineTotal: number;
};

type CheckoutSheetProps = {
  address: string;
  items: CheckoutItem[];
  message: string;
  name: string;
  note: string;
  open: boolean;
  pending: boolean;
  phone: string;
  registeredUser: RegisteredUser | null;
  serviceabilityZone: DeliveryZone | null;
  subtotal: number;
  total: number;
  onAddressChange: (value: string) => void;
  onClose: () => void;
  onNameChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onQuantityChange: (productId: string, quantity: number) => void;
  onSubmit: () => void;
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function CheckoutSheet({
  address,
  items,
  message,
  name,
  note,
  open,
  pending,
  phone,
  registeredUser,
  serviceabilityZone,
  subtotal,
  total,
  onAddressChange,
  onClose,
  onNameChange,
  onNoteChange,
  onPhoneChange,
  onQuantityChange,
  onSubmit,
}: CheckoutSheetProps) {
  if (!open) {
    return null;
  }

  const deliveryFee = Math.max(total - subtotal, 0);

  return (
    <div className="fixed inset-0 z-50 bg-[rgba(10,20,17,0.34)] backdrop-blur-sm">
      <button
        type="button"
        aria-label="Close basket"
        className="absolute inset-0 bg-transparent"
        onClick={onClose}
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[560px] flex-col overflow-y-auto bg-[#f6f7f2] shadow-[-24px_0_60px_rgba(10,20,17,0.22)]">
        <div className="flex items-center justify-between border-b border-[var(--line)] bg-white px-6 py-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              Basket
            </p>
            <h2 className="mt-1 text-3xl font-semibold text-[var(--ink)]">
              Complete your order
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold text-[var(--muted)]"
          >
            Close
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-6 px-6 py-6">
          <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_42px_rgba(22,50,44,0.06)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                  Delivery zone
                </p>
                <p className="mt-2 text-lg font-semibold text-[var(--ink)]">
                  {serviceabilityZone?.name ?? "Select a delivery location"}
                </p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {serviceabilityZone
                    ? `${serviceabilityZone.district} - around ${serviceabilityZone.etaMinutes} minutes`
                    : "Use the GPS delivery checker on the homepage before placing the order."}
                </p>
              </div>
              <div className="rounded-full bg-[var(--accent-soft)] p-3 text-[var(--accent)]">
                <Icon name="truck" className="h-5 w-5" />
              </div>
            </div>
          </section>

          <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_42px_rgba(22,50,44,0.06)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                  Items
                </p>
                <p className="mt-2 text-lg font-semibold text-[var(--ink)]">
                  {items.length
                    ? `${items.length} product${items.length > 1 ? "s" : ""}`
                    : "Your basket is empty"}
                </p>
              </div>
              <div className="rounded-full bg-[var(--surface-strong)] p-3 text-[var(--accent)]">
                <Icon name="cart" className="h-5 w-5" />
              </div>
            </div>

            {items.length ? (
              <div className="mt-5 space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[22px] border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[var(--ink)]">{item.name}</p>
                        <p className="mt-1 text-sm text-[var(--muted)]">{item.unit}</p>
                      </div>
                      <p className="text-sm font-semibold text-[var(--ink)]">
                        {formatCurrency(item.lineTotal)}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="text-sm text-[var(--muted)]">
                        {formatCurrency(item.unitPrice)} each
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                          className="h-9 w-9 rounded-full border border-[var(--line)] bg-white text-lg font-semibold text-[var(--ink)]"
                        >
                          -
                        </button>
                        <span className="min-w-8 text-center text-sm font-semibold text-[var(--ink)]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                          className="h-9 w-9 rounded-full border border-[var(--line)] bg-white text-lg font-semibold text-[var(--ink)]"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-[22px] border border-dashed border-[var(--line)] bg-[var(--surface-strong)] px-4 py-8 text-center text-sm text-[var(--muted)]">
                Add a few products from the storefront and your order summary will appear here.
              </div>
            )}
          </section>

          <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_42px_rgba(22,50,44,0.06)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              Delivery details
            </p>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[var(--muted)]">
                  Full name
                </span>
                <input
                  value={name}
                  onChange={(event) => onNameChange(event.target.value)}
                  placeholder={registeredUser?.name ?? "Kavindi Perera"}
                  className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 outline-none focus:border-[var(--brand)]"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[var(--muted)]">
                  Mobile number
                </span>
                <input
                  value={phone}
                  onChange={(event) => onPhoneChange(event.target.value)}
                  placeholder={registeredUser?.phone ?? "07XXXXXXXX"}
                  className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 outline-none focus:border-[var(--brand)]"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[var(--muted)]">
                  Delivery address
                </span>
                <textarea
                  value={address}
                  onChange={(event) => onAddressChange(event.target.value)}
                  placeholder="Apartment, street, landmark, and delivery notes"
                  rows={4}
                  className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 outline-none focus:border-[var(--brand)]"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[var(--muted)]">
                  Optional note
                </span>
                <input
                  value={note}
                  onChange={(event) => onNoteChange(event.target.value)}
                  placeholder="Gate code, nearest landmark, or rider instructions"
                  className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 outline-none focus:border-[var(--brand)]"
                />
              </label>
            </div>
          </section>

          <section className="rounded-[28px] bg-[linear-gradient(135deg,#0f2420,#17342e)] p-5 text-white shadow-[0_22px_48px_rgba(22,50,44,0.18)]">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-white/72">Subtotal</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-white/72">Delivery fee</span>
                <span className="font-semibold">{formatCurrency(deliveryFee)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-white/14 pt-3 text-base">
                <span className="font-semibold text-white">Total</span>
                <span className="font-semibold text-white">{formatCurrency(total)}</span>
              </div>
            </div>

            {message ? (
              <p className="mt-4 rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/86">
                {message}
              </p>
            ) : null}

            <button
              type="button"
              onClick={onSubmit}
              disabled={pending || !items.length}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-bold text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Icon name="check" className="h-4 w-4" />
              {pending ? "Placing order..." : "Place order"}
            </button>
          </section>
        </div>
      </aside>
    </div>
  );
}
