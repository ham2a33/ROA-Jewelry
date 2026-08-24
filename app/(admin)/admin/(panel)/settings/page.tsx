import { redirect } from "next/navigation";
import { siteConfig } from "@/lib/config/site-config";

export default function AdminSettingsIndexPage() {
  redirect(siteConfig.routes.admin.settingsGeneral);
}
