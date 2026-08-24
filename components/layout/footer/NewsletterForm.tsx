"use client";

import { useState } from "react";
import { emailSchema } from "@/lib/validations/common";
import { cn } from "@/lib/utils/cn";

type NewsletterFormProps = {
  className?: string;
};

export function NewsletterForm({ className }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const result = emailSchema.safeParse(email.trim());
    if (!result.success) {
      setError("Введите корректный e-mail");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 350));
    setIsSubmitting(false);
    setSubmitted(true);
    setEmail("");
  }

  if (submitted) {
    return (
      <div className={cn("rounded-md border border-border/70 bg-background/40 px-4 py-3", className)}>
        <p className="text-sm text-foreground/85" role="status">
          Спасибо за подписку
        </p>
      </div>
    );
  }

  return (
    <form className={cn("space-y-3", className)} noValidate onSubmit={handleSubmit}>
      <div>
        <label className="sr-only" htmlFor="newsletter-email">
          Ваш e-mail
        </label>
        <input
          aria-describedby={error ? "newsletter-error" : undefined}
          aria-invalid={Boolean(error)}
          autoComplete="email"
          className="h-11 w-full rounded-md border border-border/80 bg-background/50 px-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          disabled={isSubmitting}
          id="newsletter-email"
          name="email"
          placeholder="Ваш e-mail"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (error) {
              setError(null);
            }
          }}
        />
        {error ? (
          <p className="mt-2 text-xs text-red-700/80" id="newsletter-error" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      <button
        className="inline-flex h-11 w-full items-center justify-center rounded-md border border-foreground/15 bg-foreground px-4 text-sm font-medium tracking-[0.02em] text-background transition-colors duration-200 hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-footer disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Отправка..." : "Подписаться"}
      </button>
    </form>
  );
}
