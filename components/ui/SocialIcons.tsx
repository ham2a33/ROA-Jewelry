import { cn } from "@/lib/utils/cn";

type IconProps = {
  className?: string;
};

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("h-4 w-4", className)}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        height="17"
        rx="4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        width="17"
        x="3.5"
        y="3.5"
      />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.2" cy="6.8" fill="currentColor" r="1" />
    </svg>
  );
}

export function TelegramIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("h-4 w-4", className)}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.5 4.5L2.8 11.2c-.9.3-.9 1.6.1 1.9l4.8 1.5 1.8 5.6c.3.9 1.4 1 1.9.2l2.6-3.8 4.9 3.6c.8.6 1.9.1 2.1-.9L22 6.2c.2-1-.6-1.9-1.5-1.7Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M8.5 13.5 17 7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("h-4 w-4", className)}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 3a8.5 8.5 0 0 0-7.3 12.8L3 21l5.4-1.4A8.5 8.5 0 1 0 12 3Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M9.2 9.1c.2-.5.8-.8 1.3-.7.4.1.9.4 1.2.8.4.5.7 1.1.8 1.7.1.5-.1 1-.5 1.3-.3.2-.7.3-1 .2-.3-.1-.6-.3-.8-.5-.2-.2-.4-.4-.5-.7-.1-.2 0-.5.2-.7.2-.2.5-.2.7 0 .2.2.4.5.6.7.3.3.7.5 1.1.4.4-.1.8-.4 1-.8.2-.4.2-.9 0-1.3-.2-.4-.5-.7-.9-.9-.8-.4-1.8-.2-2.4.4-.6.6-.8 1.5-.5 2.3.3.8 1 1.4 1.8 1.6.8.2 1.7 0 2.3-.6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
