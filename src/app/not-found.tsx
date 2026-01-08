// src/app/not-found.tsx

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="max-w-xl text-center space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          404 error
        </p>
        <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
          We couldn&apos;t find that data
        </h1>
        <p className="text-base text-muted-foreground">
          The salary dataset you requested doesn&apos;t exist yet. Try a different
          year or return to the homepage.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            Go to homepage
          </Link>
          <Link
            href="/world"
            className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted"
          >
            Browse world data
          </Link>
        </div>
      </div>
    </div>
  );
}
