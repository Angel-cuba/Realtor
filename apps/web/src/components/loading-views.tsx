function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-black/[0.07] ${className}`} />;
}

function ListingCardSkeleton() {
  return (
    <article className="overflow-hidden rounded bg-white shadow-soft">
      <SkeletonBlock className="aspect-[4/3] rounded-none" />
      <div className="grid gap-3 p-5">
        <SkeletonBlock className="h-4 w-24" />
        <SkeletonBlock className="h-7 w-3/4" />
        <SkeletonBlock className="h-4 w-2/3" />
        <div className="flex gap-2 pt-2">
          <SkeletonBlock className="h-8 w-16" />
          <SkeletonBlock className="h-8 w-16" />
          <SkeletonBlock className="h-8 w-20" />
        </div>
      </div>
    </article>
  );
}

export function ListingsLoadingView({ title = "Preparando propiedades" }: { title?: string }) {
  return (
    <main className="min-h-screen bg-linen">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" aria-busy="true" aria-label={title}>
        <div className="grid gap-6">
          <div className="rounded bg-ink p-5 text-white shadow-soft">
            <div className="flex flex-wrap items-center gap-3">
              <SkeletonBlock className="h-11 flex-1 min-w-64 bg-white/15" />
              <SkeletonBlock className="h-11 w-32 bg-gold/30" />
              <SkeletonBlock className="h-11 w-32 bg-white/15" />
            </div>
          </div>
          <div className="flex items-end justify-between gap-4">
            <div className="grid gap-3">
              <SkeletonBlock className="h-4 w-40" />
              <SkeletonBlock className="h-9 w-72 max-w-full" />
            </div>
            <SkeletonBlock className="hidden h-10 w-28 sm:block" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <ListingCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export function PropertyDetailLoadingView() {
  return (
    <main className="min-h-screen bg-linen" aria-busy="true" aria-label="Cargando propiedad">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <SkeletonBlock className="min-h-[420px]" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <SkeletonBlock className="min-h-[200px]" />
            <SkeletonBlock className="min-h-[200px]" />
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
        <article className="rounded bg-white p-6 md:p-8">
          <div className="grid gap-4 border-b border-black/10 pb-6">
            <SkeletonBlock className="h-4 w-52" />
            <SkeletonBlock className="h-12 w-4/5" />
            <SkeletonBlock className="h-5 w-72 max-w-full" />
          </div>
          <div className="grid gap-4 py-6">
            <SkeletonBlock className="h-11 w-52" />
            <SkeletonBlock className="h-5 w-full" />
            <SkeletonBlock className="h-5 w-11/12" />
            <SkeletonBlock className="h-5 w-9/12" />
          </div>
        </article>
        <aside className="grid gap-4 lg:self-start">
          <div className="rounded bg-ink p-5">
            <SkeletonBlock className="h-4 w-32 bg-gold/30" />
            <SkeletonBlock className="mt-4 h-8 w-56 bg-white/15" />
            <SkeletonBlock className="mt-3 h-4 w-40 bg-white/15" />
            <SkeletonBlock className="mt-5 h-12 w-full bg-gold/30" />
          </div>
          <div className="rounded bg-white p-6 shadow-soft">
            <SkeletonBlock className="h-5 w-44" />
            <SkeletonBlock className="mt-4 h-12 w-full" />
            <SkeletonBlock className="mt-3 h-12 w-full" />
            <SkeletonBlock className="mt-3 h-28 w-full" />
          </div>
        </aside>
      </section>
    </main>
  );
}

export function DashboardLoadingView() {
  return (
    <main className="min-h-screen bg-linen px-4 py-8 sm:px-6 lg:px-8" aria-busy="true" aria-label="Cargando dashboard">
      <div className="mx-auto grid max-w-7xl gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="grid gap-3">
            <SkeletonBlock className="h-4 w-36" />
            <SkeletonBlock className="h-10 w-72" />
          </div>
          <SkeletonBlock className="h-11 w-36" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div className="rounded bg-white p-5 shadow-soft" key={item}>
              <SkeletonBlock className="h-4 w-24" />
              <SkeletonBlock className="mt-4 h-10 w-20" />
            </div>
          ))}
        </div>
        <div className="rounded bg-white p-5 shadow-soft">
          <SkeletonBlock className="h-12 w-full" />
          <div className="mt-5 grid gap-3">
            {[0, 1, 2, 3, 4].map((item) => (
              <SkeletonBlock className="h-14 w-full" key={item} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
