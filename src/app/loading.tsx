// src/app/loading.tsx

import ServerHeader from "@/components/ServerHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { DEFAULT_COUNTRY, DEFAULT_CURRENCY } from "@/lib/constants";

export default function Loading() {
  return (
    <>
      <ServerHeader
        country={DEFAULT_COUNTRY}
        year={new Date().getFullYear()}
        currency={DEFAULT_CURRENCY}
        baseCurrency={DEFAULT_CURRENCY}
        rates={null}
        periods={[]}
      />
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
