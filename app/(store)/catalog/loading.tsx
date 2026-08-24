import { Container } from "@/components/ui/Container";

function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] rounded-xl border border-border/70 bg-muted" />
      <div className="mt-4 h-4 w-3/4 rounded bg-muted" />
      <div className="mt-2 h-4 w-1/3 rounded bg-muted" />
    </div>
  );
}

export default function CatalogLoading() {
  return (
    <Container as="div" className="py-8 sm:py-10 lg:py-12">
      <div className="animate-pulse border-b border-border/70 pb-6 sm:pb-8">
        <div className="h-3 w-24 rounded bg-muted" />
        <div className="mt-4 h-10 w-48 rounded bg-muted" />
        <div className="mt-3 h-4 max-w-xl rounded bg-muted" />
      </div>

      <div className="mt-6 flex gap-2 overflow-hidden">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-10 w-24 shrink-0 rounded-full bg-muted"
          />
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10">
        <div className="hidden rounded-2xl border border-border/70 bg-card/40 p-5 lg:block">
          <div className="h-6 w-24 rounded bg-muted" />
          <div className="mt-5 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-4 rounded bg-muted" />
            ))}
          </div>
        </div>

        <div>
          <div className="flex flex-col gap-4 border-b border-border/70 pb-5 sm:flex-row">
            <div className="h-11 flex-1 rounded-md bg-muted" />
            <div className="h-11 w-32 rounded-md bg-muted" />
          </div>

          <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <li key={index}>
                <ProductCardSkeleton />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Container>
  );
}
