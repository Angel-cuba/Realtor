import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { getMessages } from "@realtor/i18n";
import { Building2, CalendarDays, Heart, UserRound } from "lucide-react";
import { PropertyCard } from "@/components/property-card";
import { getLocale } from "@/lib/locale";
import { getSavedListingsForUser } from "@/lib/listings";

export default async function ProfilePage() {
  const [{ userId }, locale] = await Promise.all([auth(), getLocale()]);
  const m = getMessages(locale);
  const [user, savedListings] = userId
    ? await Promise.all([currentUser(), getSavedListingsForUser(userId)])
    : [null, []];
  const displayName = user?.firstName ?? user?.fullName ?? m.profile.guest;
  const email = user?.emailAddresses[0]?.emailAddress ?? m.profile.signedOutEmail;
  const stats = [
    { label: m.profile.statsSaved, value: String(savedListings.length) },
    { label: m.profile.statsTours, value: "3" },
    { label: m.profile.statsAlerts, value: "5" }
  ];
  const favoritePreview = savedListings.slice(0, 3);

  return (
    <main className="min-h-[calc(100svh-4rem)] bg-linen px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="rounded bg-ink p-6 text-white shadow-soft">
          <div className="grid h-16 w-16 place-items-center rounded bg-gold text-ink">
            <UserRound size={28} aria-hidden />
          </div>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-gold">{m.profile.title}</p>
          <h1 className="mt-3 font-display text-4xl font-medium tracking-tight">{displayName}</h1>
          <p className="mt-2 text-white/62">{email}</p>
          <Link href={userId ? "/dashboard" : "/sign-in"} className="mt-8 inline-flex w-full items-center justify-center rounded bg-gold px-5 py-3 text-sm font-semibold text-ink transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            {userId ? m.profile.openDashboard : m.profile.signIn}
          </Link>
        </aside>

        <div className="grid gap-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded bg-white p-5 shadow-[0_18px_50px_rgba(17,17,17,0.06)]">
                <p className="font-display text-4xl font-medium tracking-tight">{stat.value}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-black/55">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="rounded bg-white p-6 shadow-[0_18px_50px_rgba(17,17,17,0.06)]">
            <div className="flex items-center gap-3 border-b border-black/10 pb-5">
              <Heart className="text-gold" size={20} aria-hidden />
              <h2 className="text-xl font-semibold">{m.profile.preferencesTitle}</h2>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded bg-linen p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-black/45">{m.profile.city}</p>
                <p className="mt-2 font-semibold">Miami</p>
              </div>
              <div className="rounded bg-linen p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-black/45">{m.profile.budget}</p>
                <p className="mt-2 font-semibold">$750k - $1.2M</p>
              </div>
              <div className="rounded bg-linen p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-black/45">{m.profile.type}</p>
                <p className="mt-2 font-semibold">House / Villa</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Link href="/comprar" className="rounded bg-white p-5 shadow-[0_18px_50px_rgba(17,17,17,0.06)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
              <Building2 className="text-gold" size={22} aria-hidden />
              <h2 className="mt-4 text-lg font-semibold">{m.profile.exploreTitle}</h2>
              <p className="mt-2 text-sm leading-6 text-black/60">{m.profile.exploreCopy}</p>
            </Link>
            <Link href="/#sell" className="rounded bg-white p-5 shadow-[0_18px_50px_rgba(17,17,17,0.06)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
              <CalendarDays className="text-gold" size={22} aria-hidden />
              <h2 className="mt-4 text-lg font-semibold">{m.profile.advisorTitle}</h2>
              <p className="mt-2 text-sm leading-6 text-black/60">{m.profile.advisorCopy}</p>
            </Link>
          </div>

          <section aria-labelledby="profile-favorites-title" className="grid gap-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">{m.pages.savedKicker}</p>
                <h2 id="profile-favorites-title" className="mt-2 text-2xl font-semibold tracking-tight">
                  {m.pages.savedHeading}
                </h2>
              </div>
              {userId ? (
                <Link href="/saved" className="rounded px-3 py-2 text-sm font-semibold text-ink transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                  {m.nav.saved}
                </Link>
              ) : null}
            </div>

            {userId ? (
              favoritePreview.length > 0 ? (
                <div className="grid gap-5 md:grid-cols-2">
                  {favoritePreview.map((listing) => (
                    <PropertyCard key={listing.slug} listing={listing} messages={m} isSaved />
                  ))}
                </div>
              ) : (
                <div className="rounded bg-white px-5 py-8 text-center shadow-[0_18px_50px_rgba(17,17,17,0.06)]">
                  <p className="text-lg font-semibold">{m.pages.savedEmpty}</p>
                  <p className="mt-2 text-sm leading-6 text-black/55">{m.pages.savedEmptyCopy}</p>
                  <Link href="/comprar" className="mt-5 inline-flex rounded bg-ink px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                    {m.nav.buy}
                  </Link>
                </div>
              )
            ) : (
              <div className="rounded bg-white px-5 py-8 text-center shadow-[0_18px_50px_rgba(17,17,17,0.06)]">
                <p className="text-lg font-semibold">{m.pages.savedSignIn}</p>
                <p className="mt-2 text-sm leading-6 text-black/55">{m.pages.savedSignInCopy}</p>
                <Link href="/sign-in" className="mt-5 inline-flex rounded bg-ink px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                  {m.profile.signIn}
                </Link>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
