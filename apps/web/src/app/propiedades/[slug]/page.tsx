import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Bath, BedDouble, CalendarDays, MapPin, Square } from "lucide-react";
import { getMessages } from "@realtor/i18n";
import { formatMoney, propertyTypeLabel } from "@realtor/domain";
import { LeadForm } from "@/components/lead-form";
import { PropertyImage } from "@/components/property-image";
import { getLocale } from "@/lib/locale";
import { getListingBySlug, getPublishedListingSlugs } from "@/lib/listings";

export async function generateStaticParams() {
  const slugs = await getPublishedListingSlugs();
  return slugs.map((slug) => ({ slug }));
}

export const metadata: Metadata = {
  title: "Propiedad | Realtor",
  description: "Detalle de propiedad con precio, ubicacion, galeria y contacto con asesor."
};

export default async function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);
  const listing = await getListingBySlug(slug);

  if (!listing) notFound();

  const m = getMessages(locale);
  const priceSuffix = listing.listingType === "rent" ? m.listing.perMonth : "";
  const listingType = listing.listingType === "rent" ? m.listing.rentLabel : m.listing.saleLabel;
  const gallerySlots = [listing.image, ...(listing.gallery ?? [])].slice(0, 3);

  return (
    <main className="bg-linen">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative min-h-[420px] overflow-hidden rounded bg-black/5">
            <PropertyImage
              src={gallerySlots[0] ?? ""}
              alt={listing.title}
              label={propertyTypeLabel(listing.propertyType)}
              priority
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {[1, 2].map((i) => (
              <div className="relative min-h-[200px] overflow-hidden rounded bg-black/5" key={i}>
                <PropertyImage
                  src={gallerySlots[i] ?? ""}
                  alt={listing.title}
                  sizes="(min-width: 1024px) 35vw, 50vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
        <article className="rounded bg-white p-6 md:p-8">
          <div className="border-b border-black/10 pb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">
              {listingType} / {propertyTypeLabel(listing.propertyType)}
            </p>
            <h1 className="mt-3 font-display text-4xl font-medium leading-tight tracking-tight">{listing.title}</h1>
            <p className="mt-3 inline-flex items-center gap-2 text-black/55">
              <MapPin size={17} aria-hidden />
              {listing.addressSummary}
            </p>
          </div>

          <div className="flex flex-col gap-5 border-b border-black/10 py-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-display text-4xl font-medium tracking-tight">
                {formatMoney(listing.price, listing.currency)}
                <span className="ml-1 align-baseline text-base font-sans text-black/50">{priceSuffix}</span>
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-black/55">{m.listing.listingPrice}</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-black/70">
              <span className="inline-flex items-center gap-2">
                <BedDouble size={18} aria-hidden />
                {listing.beds || "-"} {m.listing.beds}
              </span>
              <span className="inline-flex items-center gap-2">
                <Bath size={18} aria-hidden />
                {listing.baths || "-"} {m.listing.baths}
              </span>
              <span className="inline-flex items-center gap-2">
                <Square size={18} aria-hidden />
                {listing.areaSqft.toLocaleString()} {m.listing.sqft}
              </span>
            </div>
          </div>

          <div className="py-6">
            <h2 className="text-2xl font-semibold">{m.listing.overview}</h2>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-black/65">{listing.description}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {listing.highlights.map((highlight) => (
                <div className="rounded bg-linen px-4 py-3 text-sm font-medium" key={highlight}>
                  {highlight}
                </div>
              ))}
            </div>
          </div>
        </article>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="mb-4 rounded bg-ink p-5 text-white">
            <p className="text-sm uppercase tracking-[0.18em] text-gold">{m.listing.assignedAgent}</p>
            <h2 className="mt-3 text-2xl font-semibold">{listing.agentName}</h2>
            <p className="mt-1 text-white/60">{listing.agentTitle}</p>
            <a
              href="#lead-form"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded bg-gold px-5 py-3 font-semibold text-ink transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              <CalendarDays size={17} aria-hidden />
              {m.listing.requestVisit}
            </a>
          </div>
          <div id="lead-form">
            <LeadForm intent={listing.listingType === "rent" ? "rent" : "buy"} listingSlug={listing.slug} />
          </div>
        </aside>
      </section>
    </main>
  );
}
