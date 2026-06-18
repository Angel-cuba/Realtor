import { notFound } from "next/navigation";
import { Bath, BedDouble, CalendarDays, Heart, MapPin, Share2, Square } from "lucide-react";
import { formatMoney, listingTypeLabel, propertyTypeLabel } from "@realtor/domain";
import { LeadForm } from "@/components/lead-form";
import { PropertyImage } from "@/components/property-image";
import { getListingBySlug, listings } from "@/lib/listings";

export function generateStaticParams() {
  return listings.map((listing) => ({ slug: listing.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const listing = getListingBySlug(slug);

  if (!listing) return {};

  return {
    title: `${listing.title} | Realtor`,
    description: listing.description,
    ...(listing.image ? { openGraph: { images: [listing.image] } } : {})
  };
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const listing = getListingBySlug(slug);

  if (!listing) notFound();

  const priceSuffix = listing.listingType === "rent" ? "/mo" : "";
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
          <div className="flex flex-col justify-between gap-4 border-b border-black/10 pb-6 md:flex-row md:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">
                {listingTypeLabel(listing.listingType)} / {propertyTypeLabel(listing.propertyType)}
              </p>
              <h1 className="mt-3 text-4xl font-semibold leading-tight">{listing.title}</h1>
              <p className="mt-3 inline-flex items-center gap-2 text-black/55">
                <MapPin size={17} aria-hidden />
                {listing.addressSummary}
              </p>
            </div>
            <div className="flex gap-2">
              <button className="grid h-11 w-11 place-items-center rounded border border-black/10" type="button">
                <Heart size={18} aria-label="Guardar" />
              </button>
              <button className="grid h-11 w-11 place-items-center rounded border border-black/10" type="button">
                <Share2 size={18} aria-label="Compartir" />
              </button>
            </div>
          </div>

          <div className="grid gap-4 border-b border-black/10 py-6 sm:grid-cols-4">
            <div>
              <p className="text-3xl font-semibold">
                {formatMoney(listing.price, listing.currency)}
                <span className="text-sm text-black/50">{priceSuffix}</span>
              </p>
              <p className="mt-1 text-sm text-black/45">Listing price</p>
            </div>
            <span className="inline-flex items-center gap-2 text-black/70">
              <BedDouble size={18} aria-hidden />
              {listing.beds || "-"} beds
            </span>
            <span className="inline-flex items-center gap-2 text-black/70">
              <Bath size={18} aria-hidden />
              {listing.baths || "-"} baths
            </span>
            <span className="inline-flex items-center gap-2 text-black/70">
              <Square size={18} aria-hidden />
              {listing.areaSqft.toLocaleString()} sqft
            </span>
          </div>

          <div className="py-6">
            <h2 className="text-2xl font-semibold">Overview</h2>
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
            <p className="text-sm uppercase tracking-[0.18em] text-gold">Assigned agent</p>
            <h2 className="mt-3 text-2xl font-semibold">{listing.agentName}</h2>
            <p className="mt-1 text-white/60">{listing.agentTitle}</p>
            <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded bg-gold px-5 py-3 font-semibold text-ink" type="button">
              <CalendarDays size={17} aria-hidden />
              Solicitar visita
            </button>
          </div>
          <LeadForm intent={listing.listingType === "rent" ? "rent" : "buy"} listingSlug={listing.slug} />
        </aside>
      </section>
    </main>
  );
}
