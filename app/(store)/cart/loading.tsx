import { Container } from "@/components/ui/Container";

function CartItemSkeleton() {
  return (
    <div className="grid gap-4 border-b border-border/70 py-6 sm:grid-cols-[7.5rem_minmax(0,1fr)]">
      <div className="aspect-[4/5] animate-pulse rounded-xl bg-muted" />
      <div className="space-y-3">
        <div className="h-5 w-40 animate-pulse rounded bg-muted" />
        <div className="h-4 w-28 animate-pulse rounded bg-muted" />
        <div className="h-11 w-32 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export default function CartLoading() {
  return (
    <Container as="div" className="py-8 sm:py-10 lg:py-12">
      <div className="mb-8 animate-pulse sm:mb-10">
        <div className="h-10 w-40 rounded bg-muted" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-10">
        <div>
          <CartItemSkeleton />
          <CartItemSkeleton />
        </div>

        <div className="animate-pulse rounded-2xl border border-border/70 bg-card/40 p-6">
          <div className="h-6 w-32 rounded bg-muted" />
          <div className="mt-5 space-y-3">
            <div className="h-4 rounded bg-muted" />
            <div className="h-4 rounded bg-muted" />
          </div>
          <div className="mt-6 h-12 rounded-md bg-muted" />
        </div>
      </div>
    </Container>
  );
}
