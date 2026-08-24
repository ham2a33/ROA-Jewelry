import { z } from "zod";
import {
  DEFAULT_BENEFIT_ICON,
  isBenefitIconName,
  type BenefitIconName,
  type BenefitItem,
  type BenefitsSectionData,
  type BenefitsSettings,
} from "@/types/benefits";

const benefitSettingsItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
  sortOrder: z.number().int(),
  isActive: z.boolean().optional(),
});

const benefitsSettingsSchema = z.object({
  items: z.array(benefitSettingsItemSchema),
});

function resolveBenefitIcon(icon: string): BenefitIconName {
  return isBenefitIconName(icon) ? icon : DEFAULT_BENEFIT_ICON;
}

function parseBenefitsSettings(settings: unknown): BenefitsSettings | null {
  const parsed = benefitsSettingsSchema.safeParse(settings);
  return parsed.success ? parsed.data : null;
}

function mapBenefitItem(
  item: z.infer<typeof benefitSettingsItemSchema>,
): BenefitItem | null {
  if (item.isActive === false) {
    return null;
  }

  return {
    id: item.id,
    title: item.title.trim(),
    description: item.description.trim(),
    icon: resolveBenefitIcon(item.icon),
    sortOrder: item.sortOrder,
  };
}

export function mapBenefitsSection(section: {
  id: string;
  title: string | null;
  subtitle: string | null;
  settings: unknown;
}): BenefitsSectionData | null {
  const settings = parseBenefitsSettings(section.settings);

  if (!settings) {
    return null;
  }

  const items = settings.items
    .map(mapBenefitItem)
    .filter((item): item is BenefitItem => item !== null)
    .sort((left, right) => left.sortOrder - right.sortOrder);

  if (items.length === 0) {
    return null;
  }

  return {
    id: section.id,
    title: section.title,
    subtitle: section.subtitle,
    items,
  };
}
