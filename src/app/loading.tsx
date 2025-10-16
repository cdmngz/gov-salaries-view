// src/app/loading.tsx

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <header className="w-full p-4 bg-background shadow">
        <div className="text-lg flex items-center gap-2 font-medium">
          <span aria-hidden>🏛️</span>
          <span className="truncate font-semibold">Government viewer</span>
        </div>
      </header>
      <div className="p-14 rounded-none flex flex-col gap-14">
        <div className="flex justify-center">
          <Skeleton className="rounded-none h-32 bg-card w-1/3" />
        </div>
        <div className="flex justify-center gap-8">
          <Skeleton className="rounded-none h-48 bg-card w-1/3" />
          <Skeleton className="rounded-none h-48 bg-card w-1/3" />
        </div>
      </div>
    </>
  );
}
