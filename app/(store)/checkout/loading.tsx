import { Container } from "@/components/ui/Container";

export default function CheckoutLoading() {
  return (
    <Container as="div" className="py-8 sm:py-10 lg:py-12">
      <div className="mb-8 animate-pulse sm:mb-10">
        <div className="h-10 w-56 rounded bg-muted" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-10">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div className="h-11 animate-pulse rounded-md bg-muted" key={index} />
          ))}
        </div>
        <div className="animate-pulse rounded-2xl border border-border/70 bg-card/40 p-6">
          <div className="h-6 w-32 rounded bg-muted" />
          <div className="mt-5 space-y-4">
            <div className="h-20 rounded bg-muted" />
            <div className="h-20 rounded bg-muted" />
          </div>
          <div className="mt-6 h-12 rounded-md bg-muted" />
        </div>
      </div>
    </Container>
  );
}
