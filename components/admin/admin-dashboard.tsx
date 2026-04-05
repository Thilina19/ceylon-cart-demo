"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type {
  AnnouncementBanner,
  Category,
  DeliveryZone,
  OrderRecord,
  OrderStatus,
  Product,
  PromoPopup,
} from "@/lib/store-data";
import { AdminLocations } from "@/components/admin/admin-locations";
import { AdminMarketing } from "@/components/admin/admin-marketing";
import { AdminOrders } from "@/components/admin/admin-orders";
import { AdminOverview } from "@/components/admin/admin-overview";
import { AdminProducts } from "@/components/admin/admin-products";
import {
  SectionToggle,
  StatCard,
  formatCurrency,
  parseNumberInput,
} from "@/components/admin/admin-ui";

type AdminSection = "overview" | "products" | "locations" | "marketing" | "orders";

export function AdminDashboard({
  adminEmail,
  categories,
  initialAnnouncementBanner,
  initialOrders,
  initialProducts,
  initialPromoPopup,
  initialZones,
}: {
  adminEmail: string;
  categories: Category[];
  initialAnnouncementBanner: AnnouncementBanner;
  initialOrders: OrderRecord[];
  initialProducts: Product[];
  initialPromoPopup: PromoPopup;
  initialZones: DeliveryZone[];
}) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");
  const [products, setProducts] = useState(initialProducts);
  const [zones, setZones] = useState(initialZones);
  const [orders, setOrders] = useState(initialOrders);
  const [announcementBanner, setAnnouncementBanner] = useState(
    initialAnnouncementBanner,
  );
  const [promoPopup, setPromoPopup] = useState(initialPromoPopup);
  const [productSearch, setProductSearch] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(
    initialProducts[0]?.id ?? "",
  );
  const [selectedZoneId, setSelectedZoneId] = useState(initialZones[0]?.id ?? "");
  const [orderFilter, setOrderFilter] = useState<"all" | OrderStatus>("all");
  const [flash, setFlash] = useState<{
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

  const filteredProducts = products.filter((product) => {
    const text = productSearch.trim().toLowerCase();

    if (!text) {
      return true;
    }

    return (
      product.name.toLowerCase().includes(text) ||
      product.category.toLowerCase().includes(text) ||
      product.origin.toLowerCase().includes(text)
    );
  });

  const selectedProduct =
    products.find((product) => product.id === selectedProductId) ?? null;
  const selectedZone = zones.find((zone) => zone.id === selectedZoneId) ?? null;
  const visibleOrders =
    orderFilter === "all"
      ? orders
      : orders.filter((order) => order.status === orderFilter);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const averageOrderValue = orders.length ? totalRevenue / orders.length : 0;
  const pendingOrders = orders.filter((order) => order.status === "pending").length;
  const activeZones = zones.filter((zone) => zone.active).length;

  function setSuccess(text: string) {
    setFlash({ tone: "success", text });
  }

  function setError(text: string) {
    setFlash({ tone: "error", text });
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

  function updateOrderStatusDraft(orderId: string, status: OrderStatus) {
    setOrders((current) =>
      current.map((order) => (order.id === orderId ? { ...order, status } : order)),
    );
  }

  function createProduct() {
    startTransition(async () => {
      setFlash(null);

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
          headers: { "Content-Type": "application/json" },
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
        setSelectedProductId(payload.product.id);
        setNewProduct((current) => ({
          ...current,
          name: "",
          unit: "",
          price: "",
          wasPrice: "",
          badge: "",
          origin: "",
          rating: "4.5",
          eta: "45 min",
          tint: "bg-[#f1f5f9]",
        }));
        setSuccess(payload.message ?? "Product created.");
      } catch (error) {
        setError(error instanceof Error ? error.message : "Could not create the product.");
      }
    });
  }

  function saveProduct(product: Product) {
    startTransition(async () => {
      setFlash(null);

      try {
        const response = await fetch(`/api/products/${product.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
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
        setError(error instanceof Error ? error.message : "Could not update the product.");
      }
    });
  }

  function deleteProduct(productId: string) {
    startTransition(async () => {
      setFlash(null);

      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: "DELETE",
        });
        const payload = (await response.json()) as { message?: string };

        if (!response.ok) {
          throw new Error(payload.message ?? "Could not delete the product.");
        }

        const nextProducts = products.filter((product) => product.id !== productId);
        setProducts(nextProducts);
        setSelectedProductId(nextProducts[0]?.id ?? "");
        setSuccess(payload.message ?? "Product deleted.");
      } catch (error) {
        setError(error instanceof Error ? error.message : "Could not delete the product.");
      }
    });
  }

  function saveZone(zone: DeliveryZone) {
    startTransition(async () => {
      setFlash(null);

      try {
        const response = await fetch("/api/delivery-zones", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
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

  function saveMarketing() {
    startTransition(async () => {
      setFlash(null);

      try {
        const response = await fetch("/api/store", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ announcementBanner, promoPopup }),
        });

        const payload = (await response.json()) as { message?: string };

        if (!response.ok) {
          throw new Error(payload.message ?? "Could not update marketing.");
        }

        setSuccess(payload.message ?? "Marketing updated.");
      } catch (error) {
        setError(error instanceof Error ? error.message : "Could not update marketing.");
      }
    });
  }

  function saveOrderStatus(orderId: string, status: OrderStatus) {
    startTransition(async () => {
      setFlash(null);

      try {
        const response = await fetch(`/api/orders/${orderId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
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
    <main className="mx-auto flex min-h-screen max-w-[1680px] flex-col gap-6 px-4 py-6 lg:px-8 lg:py-8">
      <section className="overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,#102e29,#18453c_56%,#1f7a67)] px-6 py-8 text-white shadow-[0_26px_56px_rgba(22,50,44,0.18)] lg:px-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/62">
              Store operations
            </p>
            <h1 className="mt-3 font-[var(--font-display)] text-5xl font-semibold leading-[1.02]">
              Cleaner control for products, locations, and campaigns
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/76">
              Analytics, catalog management, delivery coverage, storefront marketing, and orders all live in one structured workspace.
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

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Revenue"
            value={formatCurrency(totalRevenue)}
            hint="Gross order value recorded so far"
          />
          <StatCard
            label="Orders"
            value={String(orders.length)}
            hint={`${pendingOrders} still waiting for action`}
          />
          <StatCard
            label="Average basket"
            value={formatCurrency(averageOrderValue)}
            hint="Current order value benchmark"
          />
          <StatCard
            label="Active zones"
            value={String(activeZones)}
            hint={`${zones.length - activeZones} currently paused`}
          />
        </div>
      </section>

      {flash ? (
        <div
          className={`rounded-[24px] px-5 py-4 text-sm font-semibold ${
            flash.tone === "success"
              ? "bg-[var(--accent-soft)] text-[var(--accent)]"
              : "bg-[#fde8e8] text-[var(--danger)]"
          }`}
        >
          {flash.text}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-3 xl:sticky xl:top-6 xl:self-start">
          <SectionToggle
            active={activeSection === "overview"}
            label="Overview"
            description="Analytics, top products, and live storefront status"
            onClick={() => setActiveSection("overview")}
          />
          <SectionToggle
            active={activeSection === "products"}
            label="Products"
            description="Search, edit, and add catalog items"
            onClick={() => setActiveSection("products")}
          />
          <SectionToggle
            active={activeSection === "locations"}
            label="Locations"
            description="Manage delivery zones, radius, ETA, and GPS points"
            onClick={() => setActiveSection("locations")}
          />
          <SectionToggle
            active={activeSection === "marketing"}
            label="Banner and popup"
            description="Control the live announcement bar and homepage popup"
            onClick={() => setActiveSection("marketing")}
          />
          <SectionToggle
            active={activeSection === "orders"}
            label="Orders"
            description="Track workflow and update order statuses"
            onClick={() => setActiveSection("orders")}
          />
        </aside>

        <div className="min-w-0">
          {activeSection === "overview" ? (
            <AdminOverview
              announcementBanner={announcementBanner}
              orders={orders}
              promoPopup={promoPopup}
              zones={zones}
            />
          ) : null}

          {activeSection === "products" ? (
            <AdminProducts
              categories={categories}
              isPending={isPending}
              newProduct={newProduct}
              onCreateProduct={createProduct}
              onDeleteProduct={deleteProduct}
              onNewProductChange={(field, value) =>
                setNewProduct((current) => ({ ...current, [field]: value }))
              }
              onProductSearchChange={setProductSearch}
              onSaveSelectedProduct={saveProduct}
              onProductSelect={setSelectedProductId}
              onProductUpdate={updateProductField}
              productSearch={productSearch}
              products={filteredProducts}
              selectedProduct={selectedProduct}
            />
          ) : null}

          {activeSection === "locations" ? (
            <AdminLocations
              isPending={isPending}
              onSaveZone={saveZone}
              onSelectZone={setSelectedZoneId}
              onZoneCenterChange={updateZoneCenter}
              onZoneUpdate={updateZoneField}
              selectedZone={selectedZone}
              zones={zones}
            />
          ) : null}

          {activeSection === "marketing" ? (
            <AdminMarketing
              announcementBanner={announcementBanner}
              isPending={isPending}
              onAnnouncementBannerChange={(field, value) =>
                setAnnouncementBanner((current) => ({ ...current, [field]: value }))
              }
              onPromoPopupChange={(field, value) =>
                setPromoPopup((current) => ({ ...current, [field]: value }))
              }
              onSave={saveMarketing}
              promoPopup={promoPopup}
            />
          ) : null}

          {activeSection === "orders" ? (
            <AdminOrders
              filter={orderFilter}
              isPending={isPending}
              onFilterChange={setOrderFilter}
              onOrderStatusChange={updateOrderStatusDraft}
              onSaveOrderStatus={saveOrderStatus}
              orders={visibleOrders}
            />
          ) : null}
        </div>
      </div>
    </main>
  );
}
