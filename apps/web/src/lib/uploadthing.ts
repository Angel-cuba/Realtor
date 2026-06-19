import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";
import { db, listings, propertyMedia } from "@realtor/db";

const f = createUploadthing();

export const ourFileRouter = {
  listingImageUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 10 } })
    .input(z.object({ listingId: z.string().uuid() }))
    .middleware(async ({ input }) => {
      const user = await currentUser();
      if (!user) throw new UploadThingError({ code: "FORBIDDEN", message: "Unauthorized" });

      const [listing] = await db
        .select({ id: listings.id })
        .from(listings)
        .where(eq(listings.id, input.listingId))
        .limit(1);

      if (!listing) throw new UploadThingError({ code: "NOT_FOUND", message: "Listing not found" });

      return { userId: user.id, listingId: input.listingId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const [placeholder] = await db
        .select({ id: propertyMedia.id })
        .from(propertyMedia)
        .where(and(eq(propertyMedia.listingId, metadata.listingId), eq(propertyMedia.url, "")))
        .limit(1);

      if (placeholder) {
        await db
          .update(propertyMedia)
          .set({ url: file.ufsUrl, alt: file.name, sortOrder: 0 })
          .where(eq(propertyMedia.id, placeholder.id));

        return { url: file.ufsUrl };
      }

      const existing = await db
        .select({ id: propertyMedia.id })
        .from(propertyMedia)
        .where(eq(propertyMedia.listingId, metadata.listingId));

      await db.insert(propertyMedia).values({
        listingId: metadata.listingId,
        url: file.ufsUrl,
        alt: file.name,
        sortOrder: existing.length
      });

      return { url: file.ufsUrl };
    })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
