import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { asc, eq, inArray } from "drizzle-orm";
import { ArrowLeft, UploadCloud } from "lucide-react";
import { db, listings, propertyMedia } from "@realtor/db";
import { ListingPhotoUploader } from "@/components/listing-photo-uploader";

export default async function DashboardUploadPage() {
  await auth.protect();

  const publishedListings = await db
    .select({
      id: listings.id,
      slug: listings.slug,
      title: listings.title
    })
    .from(listings)
    .where(eq(listings.status, "published"))
    .orderBy(asc(listings.publishedAt), asc(listings.title));

  const listingIds = publishedListings.map((listing) => listing.id);
  const photos =
    listingIds.length > 0
      ? await db
          .select({
            id: propertyMedia.id,
            listingId: propertyMedia.listingId,
            url: propertyMedia.url,
            alt: propertyMedia.alt
          })
          .from(propertyMedia)
          .where(inArray(propertyMedia.listingId, listingIds))
          .orderBy(asc(propertyMedia.sortOrder))
      : [];

  const photosByListingId = photos.reduce((grouped, photo) => {
    const current = grouped.get(photo.listingId) ?? [];
    current.push({ id: photo.id, url: photo.url, alt: photo.alt });
    grouped.set(photo.listingId, current);
    return grouped;
  }, new Map<string, { id: string; url: string; alt: string }[]>());

  const uploadListings = publishedListings.map((listing) => ({
    ...listing,
    photos: photosByListingId.get(listing.id) ?? []
  }));

  return (
    <main className="min-h-[calc(100svh-4rem)] bg-linen">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 border-b border-black/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Link className="inline-flex items-center gap-2 text-sm font-medium text-black/55" href="/dashboard">
              <ArrowLeft size={16} aria-hidden />
              Dashboard
            </Link>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-gold">Fotos de propiedades</p>
            <h1 className="mt-2 text-3xl font-semibold">Subir fotos para listings publicados</h1>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded bg-ink text-gold">
            <UploadCloud size={22} aria-hidden />
          </div>
        </div>

        <div className="mt-8">
          <ListingPhotoUploader listings={uploadListings} />
        </div>
      </div>
    </main>
  );
}
