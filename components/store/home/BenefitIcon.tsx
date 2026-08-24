import {
  Gem,
  Heart,
  Package,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  type LucideIcon,
} from "lucide-react";
import type { BenefitIconName } from "@/types/benefits";
import { cn } from "@/lib/utils/cn";

const benefitIconMap: Record<BenefitIconName, LucideIcon> = {
  Sparkles,
  Gem,
  Truck,
  Heart,
  ShieldCheck,
  Package,
  Star,
};

type BenefitIconProps = {
  name: BenefitIconName;
  className?: string;
};

export function BenefitIcon({ name, className }: BenefitIconProps) {
  const Icon = benefitIconMap[name];

  return (
    <Icon
      aria-hidden="true"
      className={cn("h-5 w-5 text-foreground/55", className)}
      strokeWidth={1.5}
    />
  );
}
