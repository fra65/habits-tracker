'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function ProfileSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          {/* Label Skeleton */}
          <Skeleton
            className="h-4 w-2/5 rounded-[var(--radius)] bg-[var(--input)] animate-pulse"
            style={{ background: 'var(--input)' }}
          />
          {/* Input Skeleton */}
          <Skeleton
            className="h-9 w-full rounded-[var(--radius)] bg-[var(--muted)] animate-pulse"
            style={{ background: 'var(--muted)' }}
          />
        </div>
      ))}
    </div>
  );
}
