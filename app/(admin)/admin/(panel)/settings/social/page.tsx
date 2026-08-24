import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { SettingsForm } from "@/components/admin/settings/SettingsForm";
import { requirePermission } from "@/lib/auth/guards";
import { siteConfig } from "@/lib/config/site-config";
import {
  ensureSiteSettings,
  getSiteSettingsRecord,
} from "@/server/queries/admin/settings";

const tabs = [
  { href: siteConfig.routes.admin.settingsGeneral, label: "General" },
  { href: siteConfig.routes.admin.settingsContact, label: "Contact" },
  { href: siteConfig.routes.admin.settingsSocial, label: "Social" },
  { href: siteConfig.routes.admin.settingsSeo, label: "SEO" },
];

export default async function AdminSettingsSocialPage() {
  await requirePermission("settings.manage");
  await ensureSiteSettings();
  const settings = await getSiteSettingsRecord();

  return (
    <div>
      <AdminPageHeader title="Settings" description="Social links" />
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Link key={tab.href} href={tab.href} className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm">
            {tab.label}
          </Link>
        ))}
      </div>
      <SettingsForm
        title="Social"
        initialValues={{
          siteName: settings?.siteName,
          instagramUrl: settings?.instagramUrl,
          whatsappUrl: settings?.whatsappUrl,
          telegramUrl: settings?.telegramUrl,
          contactPhone: settings?.contactPhone,
          contactEmail: settings?.contactEmail,
          address: settings?.address,
        }}
        fields={[
          { key: "instagramUrl", label: "Instagram", type: "url" },
          {
            key: "whatsappUrl",
            label: "WhatsApp",
            type: "tel",
            placeholder: "77064126564",
            helperText: "Введите номер WhatsApp, например 77064126564",
          },
          { key: "telegramUrl", label: "Telegram", type: "url" },
        ]}
      />
    </div>
  );
}
