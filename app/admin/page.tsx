import { getAdminDefaults, requireAdminSession } from "@/lib/admin-auth";
import { getOrders, getStorefrontData } from "@/lib/store-db";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default async function AdminPage() {
  await requireAdminSession();

  const [storefront, orders] = await Promise.all([
    getStorefrontData(),
    getOrders(),
  ]);

  return (
    <AdminDashboard
      adminEmail={getAdminDefaults().email}
      categories={storefront.categories}
      initialAnnouncementBanner={storefront.announcementBanner}
      initialOrders={orders}
      initialProducts={storefront.products}
      initialPromoPopup={storefront.promoPopup}
      initialZones={storefront.deliveryZones}
    />
  );
}
