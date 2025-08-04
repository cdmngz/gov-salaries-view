// src/components/PageSkeleton.tsx

import { Skeleton } from "@/components/ui/skeleton";

export default function PageSkeleton() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-center">
        <Skeleton className="h-52 w-1/2" />
      </div>
      <Skeleton className="h-72 w-full" />
    </div>
  );
}
