"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { StoreButton } from "@/components/ui/StoreButton";
import { siteConfig } from "@/lib/config/site-config";

type StoreErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function StoreError({ error, reset }: StoreErrorProps) {
  useEffect(() => {
    console.error("[store]", error);
  }, [error]);

  return (
    <Container as="div" className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.32em] text-muted-foreground">
        {siteConfig.name}
      </p>
      <h1 className="mt-4 font-serif text-3xl tracking-[0.02em] text-foreground">
        Что-то пошло не так
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
        Не удалось загрузить страницу. Попробуйте обновить или вернитесь на
        главную.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <StoreButton onClick={reset} variant="primary">
          Попробовать снова
        </StoreButton>
        <StoreButton href={siteConfig.routes.home} variant="secondary">
          На главную
        </StoreButton>
      </div>
    </Container>
  );
}
