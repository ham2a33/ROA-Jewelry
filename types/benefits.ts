export const BENEFIT_ICON_NAMES = [
  "Sparkles",
  "Gem",
  "Truck",
  "Heart",
  "ShieldCheck",
  "Package",
  "Star",
] as const;

export type BenefitIconName = (typeof BENEFIT_ICON_NAMES)[number];

export type BenefitItem = {
  id: string;
  title: string;
  description: string;
  icon: BenefitIconName;
  sortOrder: number;
};

export type BenefitsSectionData = {
  id: string;
  title: string | null;
  subtitle: string | null;
  items: BenefitItem[];
};

export type BenefitsSettings = {
  items: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    sortOrder: number;
    isActive?: boolean;
  }>;
};

export function isBenefitIconName(value: string): value is BenefitIconName {
  return BENEFIT_ICON_NAMES.includes(value as BenefitIconName);
}

export const DEFAULT_BENEFIT_ICON: BenefitIconName = "Sparkles";
