import Link from "next/link";
import { Bath, BedDouble, MapPin, Square } from "lucide-react";
import { formatMoney, listingTypeLabel, propertyTypeLabel, type PropertyListing } from "@realtor/domain";
import { PropertyImage } from "@/components/property-image";

export function PropertyCard({ listing }: { listing: PropertyListing }) {
  const priceSuffix = listing.listingType === "rent" ? "/mo" : "";

  return (
    <article className="overflow-hidden rounded border border-black/10 bg-white">
      <Link className="relative block aspect-[4/3] overflow-hidden bg-black/5" href={`/propiedades/${listing.slug}`}>
        <PropertyImage
          src={listing.image}
          alt={listing.title}
          label={propertyTypeLabel(listing.propertyType)}
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover transition duration-500 hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded bg-white px-3 py-1 text-xs font-semibold text-ink">
          {listingTypeLabel(listing.listingType)}
        </span>
      </Link>

      <div className="grid gap-4 p-4">
        <div>
          <p className="text-xl font-semibold">
            {formatMoney(listing.price, listing.currency)}
            <span className="text-sm text-black/50">{priceSuffix}</span>
          </p>
          <Link className="mt-1 line-clamp-2 text-base font-medium hover:underline focus-visible:underline" href={`/propiedades/${listing.slug}`}>
            {listing.title}
          </Link>
        </div>

        <div className="flex items-center gap-2 text-sm text-black/55">
          <MapPin size={16} aria-hidden />
          {listing.addressSummary}
        </div>

        <div className="grid grid-cols-3 gap-2 border-t border-black/10 pt-4 text-sm text-black/70">
          <span className="inline-flex items-center gap-2">
            <BedDouble size={16} aria-hidden />
            {listing.beds || "-"} beds
          </span>
          <span className="inline-flex items-center gap-2">
            <Bath size={16} aria-hidden />
            {listing.baths || "-"} baths
          </span>
          <span className="inline-flex items-center gap-2">
            <Square size={16} aria-hidden />
            {listing.areaSqft.toLocaleString()} sqft
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded bg-linen px-3 py-1 text-xs font-medium">{propertyTypeLabel(listing.propertyType)}</span>
          {listing.tags.slice(0, 2).map((tag) => (
            <span className="rounded bg-black/[0.04] px-3 py-1 text-xs font-medium" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
