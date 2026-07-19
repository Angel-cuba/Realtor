import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ArrowLeft } from "lucide-react";
import { getMessages } from "@realtor/i18n";
import { getAgentForClerkUser } from "@/lib/agent";
import { NewListingForm } from "@/components/new-listing-form";
import { getLocale } from "@/lib/locale";

export default async function NewListingPage() {
  await auth.protect();
  const [user, locale] = await Promise.all([currentUser(), getLocale()]);
  if (!user) return null;
  const m = getMessages(locale);

  const agentProfile = await getAgentForClerkUser(user.id);

  if (!agentProfile) {
    return (
      <main className="min-h-[calc(100svh-4rem)] bg-linen">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl font-medium tracking-tight">{m.dashboard.noAgentTitle}</h1>
          <p className="mt-4 text-black/65">{m.dashboard.noAgentBodyShort}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100svh-4rem)] bg-linen">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/dashboard/listings"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-black/55 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        >
          <ArrowLeft size={15} aria-hidden />
          {m.dashboard.backToListings}
        </Link>
        <div className="mt-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">{m.dashboard.listingsKicker}</p>
          <h1 className="mt-2 font-display text-3xl font-medium tracking-tight">{m.dashboard.newListing}</h1>
          <p className="mt-2 text-sm text-black/55">{m.dashboard.newListingCopy}</p>
        </div>
        <div className="mt-8">
          <NewListingForm />
        </div>
      </div>
    </main>
  );
}
