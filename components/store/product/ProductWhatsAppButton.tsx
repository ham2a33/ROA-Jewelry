import { MessageCircle } from "lucide-react";
import { StoreButton } from "@/components/ui/StoreButton";
import { buildProductWhatsAppUrl } from "@/lib/utils/whatsapp";
import { cn } from "@/lib/utils/cn";

type ProductWhatsAppButtonProps = {
  productName: string;
  className?: string;
};

export function ProductWhatsAppButton({
  productName,
  className,
}: ProductWhatsAppButtonProps) {
  const href = buildProductWhatsAppUrl(productName);

  if (!href) {
    return null;
  }

  return (
    <StoreButton
      className={cn("gap-2", className)}
      fullWidth
      href={href}
      variant="secondary"
    >
      <MessageCircle aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
      Заказать в WhatsApp
    </StoreButton>
  );
}
