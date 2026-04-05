"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type {
  Category,
  DeliveryZone,
  OrderRecord,
  OrderStatus,
  Product,
} from "@/lib/store-data";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function parseNumberInput(value: string) {
  const normalized = value.trim();

  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "number";
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 outline-none focus:border-[var(--brand)]"
      />
    </label>
  );
}

function SectionShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[32px] bg-white p-6 shadow-[0_18px_42px_rgba(22,50,44,0.06)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
        Admin
      </p>
      <h2 className="mt-2 text-3xl font-semibold text-[var(--ink)]">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--muted)]">
        {subtitle}
      </p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

type AdminDashboardProps = {
  adminEmail: string;
  categories: Category[];
  initialOrders: OrderRecord[];
  initialProducts: Product[];
  initialZones: DeliveryZone[];
};

export function AdminDashboard({
  adminEmail,
  categories,
  initialOrders,
  initialProducts,
  initialZones,
}: AdminDashboardProps) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [zones, setZones] = useState(initialZones);
  const [orders, setOrders] = useState(initialOrders);
  const [banner, setBanner] = useState<{
    tone: "success" | "error";
    text: string;
  } | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: categories.find((category) => category.id !== "all")?.id ?? "produce",
    unit: "",
    price: "",
    wasPrice: "",
    badge: "",
    origin: "",
    rating: "4.5",
    eta: "45 min",
    tint: "bg-[#f1f5f9]",
  });
  const [isPending, startTransition] = useTransition();

  const sellableCategories = categories.filter((category) => category.id !== "all");
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  function setSuccess(text: string) {
    setBanner({ tone: "success", text });
  }

  function setError(text: string) {
    setBanner({ tone: "error", text });
  }

  function updateProductField(
    productId: string,
    field: keyof Product,
    value: string | number | undefined,
  ) {
    setProducts((current) =>
      current.map((product) =>
        product.id === productId ? { ...product, [field]: value } : product,
      ),
    );
  }

  function updateZoneField(
    zoneId: string,
    field: keyof DeliveryZone,
    value: string | number | boolean | DeliveryZone["center"],
  ) {
    setZones((current) =>
      current.map((zone) => (zone.id === zoneId ? { ...zone, [field]: value } : zone)),
    );
  }

  function updateZoneCenter(
    zoneId: string,
    field: "lat" | "lng",
    value: number,
  ) {
    setZones((current) =>
      current.map((zone) =>
        zone.id === zoneId
          ? { ...zone, center: { ...zone.center, [field]: value } }
          : zone,
      ),
    );
  }

  function updateOrderField(
    orderId: string,
    field: keyof OrderRecord,
    value: string,
  ) {
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId ? { ...order, [field]: value } : order,
      ),
    );
  }

  function createProduct() {
    startTransition(async () => {
      setBanner(null);

      const price = parseNumberInput(newProduct.price);
      const wasPrice = parseNumberInput(newProduct.wasPrice);
      const rating = parseNumberInput(newProduct.rating);

      if (!newProduct.name.trim() || !newProduct.unit.trim() || price === null) {
        setError("Product name, unit, and price are required.");
        return;
      }

      try {
        const response = await fetch("/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newProduct.name.trim(),
            category: newProduct.category,
            unit: newProduct.unit.trim(),
            price,
            wasPrice: wasPrice ?? undefined,
            badge: newProduct.badge.trim() || "New",
            origin: newProduct.origin.trim() || "Sri Lanka",
            rating: rating ?? 4.5,
            eta: newProduct.eta.trim() || "45 min",
            tint: newProduct.tint.trim() || "bg-[#f1f5f9]",
          }),
        });

        const payload = (await response.json()) as {
          message?: string;
          product?: Product;
        };

        if (!response.ok || !payload.product) {
          throw new Error(payload.message ?? "Could not create the product.");
        }

        setProducts((current) => [payload.product!, ...current]);
        setNewProduct({
          name: "",
          category: newProduct.category,
          unit: "",
          price: "",
          wasPrice: "",
          badge: "",
          origin: "",
          rating: "4.5",
          eta: "45 min",
          tint: "bg-[#f1f5f9]",
        });
        setSuccess(payload.message ?? "Product created.");
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Could not create the product.",
        );
      }
    });
  }

  function saveProduct(product: Product) {
    startTransition(async () => {
      setBanner(null);

      try {
        const response = await fetch(`/api/products/${product.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        });

        const payload = (await response.json()) as {
          message?: string;
          product?: Product;
        };

        if (!response.ok || !payload.product) {
          throw new Error(payload.message ?? "Could not update the product.");
        }

        setProducts((current) =>
          current.map((item) => (item.id === product.id ? payload.product! : item)),
        );
        setSuccess(payload.message ?? "Product updated.");
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Could not update the product.",
        );
      }
    });
  }

  function removeProduct(productId: string) {
    startTransition(async () => {
      setBanner(null);

      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: "DELETE",
        });

        const payload = (await response.json()) as {
          message?: string;
        };

        if (!response.ok) {
          throw new Error(payload.message ?? "Could not delete the product.");
        }

        setProducts((current) => current.filter((item) => item.id !== productId));
        setSuccess(payload.message ?? "Product deleted.");
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Could not delete the product.",
        );
      }
    });
  }

  function saveZone(zone: DeliveryZone) {
    startTransition(async () => {
      setBanner(null);

      try {
        const response = await fetch("/api/delivery-zones", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(zone),
        });

        const payload = (await response.json()) as {
          message?: string;
          zone?: DeliveryZone;
        };

        if (!response.ok || !payload.zone) {
          throw new Error(payload.message ?? "Could not update the zone.");
        }

        setZones((current) =>
          current.map((item) => (item.id === zone.id ? payload.zone! : item)),
        );
        setSuccess(payload.message ?? "Zone updated.");
      } catch (error) {
        setError(error instanceof Error ? error.message : "Could not update the zone.");
      }
    });
  }

  function saveOrderStatus(orderId: string, status: OrderStatus) {
    startTransition(async () => {
      setBanner(null);

      try {
        const response = await fetch(`/api/orders/${orderId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        });

        const payload = (await response.json()) as {
          message?: string;
          order?: OrderRecord;
        };

        if (!response.ok || !payload.order) {
          throw new Error(payload.message ?? "Could not update the order.");
        }

        setOrders((current) =>
          current.map((item) => (item.id === orderId ? payload.order! : item)),
        );
        setSuccess(payload.message ?? "Order updated.");
      } catch (error) {
        setError(error instanceof Error ? error.message : "Could not update the order.");
      }
    });
  }

  function logout() {
    startTransition(async () => {
      await fetch("/api/admin/logout", { method: "POST" });
      router.replace("/admin/login");
      router.refresh();
    });
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-6 px-4 py-6 lg:px-8 lg:py-8">
      <section className="overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,#12322c,#18453c_58%,#1f7a67)] px-6 py-8 text-white shadow-[0_24px_56px_rgba(22,50,44,0.18)] lg:px-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/62">
              Operations Console
            </p>
            <h1 className="mt-3 font-[var(--font-display)] text-5xl font-semibold leading-[1.02]">
              Ceylon Cart admin dashboard
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/76">
              Manage your catalog, adjust delivery coverage, and keep order flow moving without editing code or touching raw APIs.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-full border border-white/12 bg-white/10 px-5 py-3 text-sm font-semibold text-white/88 backdrop-blur">
              Signed in as {adminEmail}
            </div>
            <button
              type="button"
              onClick={logout}
              disabled={isPending}
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[var(--ink)] disabled:opacity-60"
            >
              Log out
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[26px] border border-white/10 bg-white/8 px-5 py-5 backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/62">
              Products
            </p>
            <p className="mt-2 text-3xl font-semibold">{products.length}</p>
          </div>
          <div className="rounded-[26px] border border-white/10 bg-white/8 px-5 py-5 backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/62">
              Active zones
            </p>
            <p className="mt-2 text-3xl font-semibold">
              {zones.filter((zone) => zone.active).length}
            </p>
          </div>
          <div className="rounded-[26px] border border-white/10 bg-white/8 px-5 py-5 backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/62">
              Order value
            </p>
            <p className="mt-2 text-3xl font-semibold">{formatCurrency(totalRevenue)}</p>
          </div>
        </div>
      </section>

      {banner ? (
        <div
          className={`rounded-[24px] px-5 py-4 text-sm font-semibold ${
            banner.tone === "success"
              ? "bg-[var(--accent-soft)] text-[var(--accent)]"
              : "bg-[#fde8e8] text-[var(--danger)]"
          }`}
        >
          {banner.text}
        </div>
      ) : null}

      <SectionShell
        title="Catalog management"
        subtitle="Create new products and update the details shoppers see on the storefront."
      >
        <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[28px] border border-[var(--line)] bg-[var(--surface-strong)] p-5">
            <h3 className="text-xl font-semibold text-[var(--ink)]">Add product</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <InputField
                label="Name"
                value={newProduct.name}
                onChange={(value) =>
                  setNewProduct((current) => ({ ...current, name: value }))
                }
              />
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Category
                </span>
                <select
                  value={newProduct.category}
                  onChange={(event) =>
                    setNewProduct((current) => ({
                      ...current,
                      category: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 outline-none focus:border-[var(--brand)]"
                >
                  {sellableCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <InputField
                label="Unit"
                value={newProduct.unit}
                onChange={(value) =>
                  setNewProduct((current) => ({ ...current, unit: value }))
                }
              />
              <InputField
                label="Price"
                type="number"
                value={newProduct.price}
                onChange={(value) =>
                  setNewProduct((current) => ({ ...current, price: value }))
                }
              />
              <InputField
                label="Was price"
                type="number"
                value={newProduct.wasPrice}
                onChange={(value) =>
                  setNewProduct((current) => ({ ...current, wasPrice: value }))
                }
              />
              <InputField
                label="Badge"
                value={newProduct.badge}
                onChange={(value) =>
                  setNewProduct((current) => ({ ...current, badge: value }))
                }
              />
              <InputField
                label="Origin"
                value={newProduct.origin}
                onChange={(value) =>
                  setNewProduct((current) => ({ ...current, origin: value }))
                }
              />
              <InputField
                label="Rating"
                type="number"
                value={newProduct.rating}
                onChange={(value) =>
                  setNewProduct((current) => ({ ...current, rating: value }))
                }
              />
              <InputField
                label="ETA"
                value={newProduct.eta}
                onChange={(value) =>
                  setNewProduct((current) => ({ ...current, eta: value }))
                }
              />
              <InputField
                label="Tint class"
                value={newProduct.tint}
                onChange={(value) =>
                  setNewProduct((current) => ({ ...current, tint: value }))
                }
              />
            </div>

            <button
              type="button"
              onClick={createProduct}
              disabled={isPending}
              className="mt-5 rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {isPending ? "Saving..." : "Create product"}
            </button>
          </div>

          <div className="space-y-4">
            {products.map((product) => (
              <article
                key={product.id}
                className="rounded-[28px] border border-[var(--line)] bg-white p-5"
              >
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <InputField
                    label="Name"
                    value={product.name}
                    onChange={(value) => updateProductField(product.id, "name", value)}
                  />
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                      Category
                    </span>
                    <select
                      value={product.category}
                      onChange={(event) =>
                        updateProductField(product.id, "category", event.target.value)
                      }
                      className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 outline-none focus:border-[var(--brand)]"
                    >
                      {sellableCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <InputField
                    label="Unit"
                    value={product.unit}
                    onChange={(value) => updateProductField(product.id, "unit", value)}
                  />
                  <InputField
                    label="Price"
                    type="number"
                    value={String(product.price)}
                    onChange={(value) =>
                      updateProductField(
                        product.id,
                        "price",
                        Number(value || product.price),
                      )
                    }
                  />
                  <InputField
                    label="Was price"
                    type="number"
                    value={product.wasPrice ? String(product.wasPrice) : ""}
                    onChange={(value) =>
                      updateProductField(
                        product.id,
                        "wasPrice",
                        parseNumberInput(value) ?? undefined,
                      )
                    }
                  />
                  <InputField
                    label="Badge"
                    value={product.badge}
                    onChange={(value) => updateProductField(product.id, "badge", value)}
                  />
                  <InputField
                    label="Origin"
                    value={product.origin}
                    onChange={(value) => updateProductField(product.id, "origin", value)}
                  />
                  <InputField
                    label="Rating"
                    type="number"
                    value={String(product.rating)}
                    onChange={(value) =>
                      updateProductField(
                        product.id,
                        "rating",
                        Number(value || product.rating),
                      )
                    }
                  />
                  <InputField
                    label="ETA"
                    value={product.eta}
                    onChange={(value) => updateProductField(product.id, "eta", value)}
                  />
                  <InputField
                    label="Tint class"
                    value={product.tint}
                    onChange={(value) => updateProductField(product.id, "tint", value)}
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => saveProduct(product)}
                    disabled={isPending}
                    className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    Save product
                  </button>
                  <button
                    type="button"
                    onClick={() => removeProduct(product.id)}
                    disabled={isPending}
                    className="rounded-full border border-[#f4c4c7] bg-[#fff4f4] px-4 py-2 text-sm font-semibold text-[var(--danger)] disabled:opacity-60"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell
        title="Delivery zones"
        subtitle="Control where one-hour delivery is available and how each area behaves."
      >
        <div className="grid gap-4 xl:grid-cols-2">
          {zones.map((zone) => (
            <article
              key={zone.id}
              className="rounded-[28px] border border-[var(--line)] bg-[var(--surface-strong)] p-5"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField
                  label="Zone name"
                  value={zone.name}
                  onChange={(value) => updateZoneField(zone.id, "name", value)}
                />
                <InputField
                  label="District"
                  value={zone.district}
                  onChange={(value) => updateZoneField(zone.id, "district", value)}
                />
                <InputField
                  label="Radius km"
                  type="number"
                  value={String(zone.radiusKm)}
                  onChange={(value) =>
                    updateZoneField(zone.id, "radiusKm", Number(value || zone.radiusKm))
                  }
                />
                <InputField
                  label="ETA minutes"
                  type="number"
                  value={String(zone.etaMinutes)}
                  onChange={(value) =>
                    updateZoneField(
                      zone.id,
                      "etaMinutes",
                      Number(value || zone.etaMinutes),
                    )
                  }
                />
                <InputField
                  label="Minimum order"
                  type="number"
                  value={String(zone.minOrder)}
                  onChange={(value) =>
                    updateZoneField(
                      zone.id,
                      "minOrder",
                      Number(value || zone.minOrder),
                    )
                  }
                />
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                    Live status
                  </span>
                  <select
                    value={zone.active ? "active" : "paused"}
                    onChange={(event) =>
                      updateZoneField(zone.id, "active", event.target.value === "active")
                    }
                    className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 outline-none focus:border-[var(--brand)]"
                  >
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                  </select>
                </label>
                <InputField
                  label="Latitude"
                  type="number"
                  value={String(zone.center.lat)}
                  onChange={(value) =>
                    updateZoneCenter(zone.id, "lat", Number(value || zone.center.lat))
                  }
                />
                <InputField
                  label="Longitude"
                  type="number"
                  value={String(zone.center.lng)}
                  onChange={(value) =>
                    updateZoneCenter(zone.id, "lng", Number(value || zone.center.lng))
                  }
                />
              </div>

              <button
                type="button"
                onClick={() => saveZone(zone)}
                disabled={isPending}
                className="mt-4 rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                Save zone
              </button>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        title="Orders"
        subtitle="Review incoming baskets and move each order through its operational status."
      >
        <div className="space-y-4">
          {orders.map((order) => (
            <article
              key={order.id}
              className="rounded-[28px] border border-[var(--line)] bg-[var(--surface-strong)] p-5"
            >
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                    Order {order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-[var(--ink)]">
                    {order.customerName}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">{order.phone}</p>
                  <p className="mt-1 max-w-2xl text-sm leading-7 text-[var(--muted)]">
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
                      updateOrderField(
                        order.id,
                        "status",
                        event.target.value as OrderStatus,
                      )
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
                    onClick={() => saveOrderStatus(order.id, order.status)}
                    disabled={isPending}
                    className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    Update status
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
      </SectionShell>
    </main>
  );
}
