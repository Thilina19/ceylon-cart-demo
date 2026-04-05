import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { getAdminDefaults, isAdminSessionActive } from "@/lib/admin-auth";

export default async function AdminLoginPage() {
  if (await isAdminSessionActive()) {
    redirect("/admin");
  }

  return <AdminLoginForm defaultEmail={getAdminDefaults().email} />;
}
