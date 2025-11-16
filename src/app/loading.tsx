// src/app/loading.tsx

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="mx-auto flex text-lg h-14 max-w-5xl font-light items-center justify-between px-4">
          <span>Government View</span>
          <Skeleton className="h-2/3 bg-card w-1/2" />
        </div>
      </header>
      <div className="p-14  flex flex-col gap-14">
        <div className="flex justify-center">
          <Skeleton className=" h-32 bg-card w-1/3" />
        </div>
        <div className="flex justify-center gap-8">
          <Skeleton className=" h-48 bg-card w-1/3" />
          <Skeleton className=" h-48 bg-card w-1/3" />
        </div>
      </div>
    </>
  );
}
