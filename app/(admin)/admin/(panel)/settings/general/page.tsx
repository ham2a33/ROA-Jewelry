import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { SettingsForm } from "@/components/admin/settings/SettingsForm";
import { requirePermission } from "@/lib/auth/guards";
import { siteConfig } from "@/lib/config/site-config";
import {
  ensureSiteSettings,
  getSiteSettingsRecord,
} from "@/server/queries/admin/settings";
import type { AdminMediaPickerValue } from "@/types/admin-media";

const tabs = [
  { href: siteConfig.routes.admin.settingsGeneral, label: "General" },
  { href: siteConfig.routes.admin.settingsContact, label: "Contact" },
  { href: siteConfig.routes.admin.settingsSocial, label: "Social" },
  { href: siteConfig.routes.admin.settingsSeo, label: "SEO" },
];

function toPickerValue(
  media: {
    id: string;
    url: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    alt: string | null;
  } | null | undefined,
): AdminMediaPickerValue {
  if (!media) {
    return null;
  }

  return {
    id: media.id,
    url: media.url,
    filename: media.filename,
    originalName: media.originalName,
    mimeType: media.mimeType,
    size: media.size,
    alt: media.alt,
  };
}

async function getSettings() {
  await ensureSiteSettings();
  return getSiteSettingsRecord();
}

export default async function AdminSettingsGeneralPage() {
  await requirePermission("settings.manage");
  const settings = await getSettings();

  return (
    <div>
      <AdminPageHeader title="Settings" description="General settings" />
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm hover:bg-neutral-50"
          >
            {tab.label}
          </Link>
        ))}
      </div>
      <SettingsForm
        title="General"
        initialValues={{
          siteName: settings?.siteName,
          tagline: settings?.tagline,
          logoId: settings?.logoId,
          faviconId: settings?.faviconId,
          defaultOgImageId: settings?.defaultOgImageId,
        }}
        initialMedia={{
          logoId: toPickerValue(settings?.logo),
          faviconId: toPickerValue(settings?.favicon),
          defaultOgImageId: toPickerValue(settings?.defaultOgImage),
        }}
        fields={[
          { key: "siteName", label: "Store name" },
          { key: "tagline", label: "Description" },
        ]}
        mediaFields={[
          {
            key: "logoId",
            label: "Logo",
            helperText: "Отображается в шапке и футере сайта.",
            aspectClassName: "aspect-[3/1]",
            uploadLabel: "Загрузить логотип",
            libraryLabel: "Выбрать из Media",
          },
          {
            key: "faviconId",
            label: "Favicon",
            helperText: "Иконка вкладки браузера.",
            aspectClassName: "aspect-square max-w-[96px]",
            uploadLabel: "Загрузить favicon",
            libraryLabel: "Выбрать из Media",
          },
          {
            key: "defaultOgImageId",
            label: "Default OG image",
            helperText: "Изображение по умолчанию для соцсетей.",
            uploadLabel: "Загрузить изображение",
            libraryLabel: "Выбрать из Media",
          },
        ]}
      />
    </div>
  );
}
