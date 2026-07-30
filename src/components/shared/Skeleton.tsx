// shared/Skeleton.tsx — Loading skeleton components
// Pulse animation, no text — purely visual.

export function CardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-3.5 animate-pulse">
      <div className="h-4 bg-surface rounded w-3/4 mb-2" />
      <div className="h-3 bg-surface rounded w-1/2" />
    </div>
  );
}

export function ListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

