import { Container } from "@/components/ui/Container";

function FavoriteCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] rounded-xl bg-muted" />
      <div className="mt-4 h-4 w-3/4 rounded bg-muted" />
      <div className="mt-2 h-4 w-1/3 rounded bg-muted" />
    </div>
  );
}

export default function FavoritesLoading() {
  return (
    <Container as="div" className="py-8 sm:py-10 lg:py-12">
      <div className="mb-8 animate-pulse sm:mb-10">
        <div className="h-3 w-24 rounded bg-muted" />
        <div className="mt-4 h-10 w-48 rounded bg-muted" />
        <div className="mt-3 h-4 max-w-xs rounded bg-muted" />
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <li key={index}>
            <FavoriteCardSkeleton />
          </li>
        ))}
      </ul>
    </Container>
  );
}
