// src/components/ServerFooter.tsx

import { publicEnv } from "@/lib/env";
import Footer from "@/components/Footer";
import { Suspense } from "react";

export default function ServerFooter({ version }: { version?: string }) {
  const release = version ?? publicEnv.NEXT_PUBLIC_GIT_VERSION;

  return (
    <Suspense fallback={null}>
      <Footer version={release} />
    </Suspense>
  );
}
