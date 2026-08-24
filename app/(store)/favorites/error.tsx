"use client";

export default function FavoritesError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[50vh] w-full max-w-[1400px] flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
      <h1 className="font-serif text-[clamp(1.75rem,3vw,2.25rem)] leading-tight tracking-[0.02em] text-foreground">
        Не удалось загрузить избранное
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
        Попробуйте обновить страницу или повторить попытку чуть позже.
      </p>
      <button
        className="mt-8 inline-flex min-h-11 items-center justify-center rounded-md border border-foreground/10 bg-foreground px-6 py-2.5 text-sm font-medium tracking-[0.04em] text-background transition-colors duration-200 hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        onClick={reset}
        type="button"
      >
        Попробовать снова
      </button>
    </div>
  );
}
