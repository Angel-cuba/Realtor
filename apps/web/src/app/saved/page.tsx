import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getMessages } from "@realtor/i18n";
import { PropertyCard } from "@/components/property-card";
import { getLocale } from "@/lib/locale";
import { getSavedListingsForUser } from "@/lib/listings";

export default async function SavedPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [locale, listings] = await Promise.all([getLocale(), getSavedListingsForUser(userId)]);
  const m = getMessages(locale);

  return (
    <main className="bg-linen">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">{m.pages.savedKicker}</p>
        <h1 className="mt-3 max-w-3xl font-display text-5xl font-medium leading-tight tracking-tight">
          {m.pages.savedHeading}
        </h1>
      </section>
      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {listings.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <PropertyCard key={listing.slug} listing={listing} messages={m} isSaved={true} />
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-md py-24 text-center">
              <p className="text-xl font-semibold">{m.pages.savedEmpty}</p>
              <p className="mt-3 text-black/55">{m.pages.savedEmptyCopy}</p>
              <a
                className="mt-8 inline-block rounded bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-ink/90"
                href="/comprar"
              >
                {m.nav.buy}
              </a>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
