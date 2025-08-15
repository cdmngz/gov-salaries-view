// src/app/loading.tsx

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <header className="w-full p-4 bg-background shadow">
        <div className="text-lg flex items-center gap-2 font-medium">
          <span aria-hidden>🏛️</span>
          <span className="truncate">Government viewer</span>
        </div>
      </header>
      <div className="p-8 flex flex-col gap-8">
        <div className="flex justify-center">
          <Skeleton className="animate-pulse h-20 bg-card w-1/2" />
        </div>
        <div className="flex justify-center gap-4">
          <Skeleton className="animate-pulse h-44 bg-card w-1/4" />
          <Skeleton className="animate-pulse h-44 bg-card w-1/4" />
          <Skeleton className="animate-pulse h-44 bg-card w-1/4" />
        </div>
        <div className="flex justify-center">
          <Skeleton className="animate-pulse h-24 bg-card w-1/2" />
        </div>
        <div className="flex justify-center gap-4">
          <Skeleton className="animate-pulse h-44 bg-card w-1/4" />
          <Skeleton className="animate-pulse h-44 bg-card w-1/4" />
          <Skeleton className="animate-pulse h-44 bg-card w-1/4" />
        </div>
      </div>
    </>
  );
}
