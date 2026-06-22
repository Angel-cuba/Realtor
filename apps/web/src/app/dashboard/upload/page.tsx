import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { and, asc, eq, inArray } from "drizzle-orm";
import { ArrowLeft, UploadCloud } from "lucide-react";
import { db, listings, propertyMedia } from "@realtor/db";
import { ListingPhotoUploader } from "@/components/listing-photo-uploader";
import { canManageAllListings, canManageAssignedListings, getUserContext } from "@/lib/auth";

export default async function DashboardUploadPage() {
  await auth.protect();
  const { userId } = await auth();
  const userContext = userId ? await getUserContext(userId) : null;
  const scopedAgentId = userContext && canManageAssignedListings(userContext) ? userContext.agentId : null;
  const listingWhere = userContext && canManageAllListings(userContext)
    ? eq(listings.status, "published")
    : scopedAgentId
      ? and(eq(listings.status, "published"), eq(listings.agentId, scopedAgentId))
      : null;

  const publishedListings = listingWhere
    ? await db
        .select({
          id: listings.id,
          slug: listings.slug,
          title: listings.title
        })
        .from(listings)
        .where(listingWhere)
        .orderBy(asc(listings.publishedAt), asc(listings.title))
    : [];

  const emptyMessage = !userContext
    ? "Tu cuenta no tiene un perfil interno asignado. Contacta al administrador."
    : listingWhere
      ? undefined
      : "Tu rol actual no permite administrar fotos de propiedades.";

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
          <ListingPhotoUploader listings={uploadListings} emptyMessage={emptyMessage} />
        </div>
      </div>
    </main>
  );
}
