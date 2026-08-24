import { Container } from "@/components/ui/Container";

export default function StoreLoading() {
  return (
    <Container as="div" className="py-20">
      <div className="mx-auto max-w-md animate-pulse space-y-4">
        <div className="h-3 w-24 rounded bg-muted" />
        <div className="h-10 w-full rounded bg-muted" />
        <div className="h-4 w-3/4 rounded bg-muted" />
      </div>
    </Container>
  );
}
