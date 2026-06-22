import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";
import { z } from "zod";
import { agents, db, listings, propertyMedia, userProfiles } from "@realtor/db";

const mediaIdSchema = z.string().uuid();

function uploadThingKeyFromUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (!["ufs.sh", "utfs.io"].some((host) => parsed.hostname === host || parsed.hostname.endsWith("." + host))) {
      return null;
    }

    const match = parsed.pathname.match(/\/f\/([^/]+)/);
    return match?.[1] ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const parsedId = mediaIdSchema.safeParse(id);
  if (!parsedId.success) {
    return NextResponse.json({ error: "Invalid media id" }, { status: 400 });
  }

  const [[media], [agentRow]] = await Promise.all([
    db
      .select({
        id: propertyMedia.id,
        url: propertyMedia.url,
        uploadThingKey: propertyMedia.uploadThingKey,
        agentId: listings.agentId,
      })
      .from(propertyMedia)
      .innerJoin(listings, eq(propertyMedia.listingId, listings.id))
      .where(eq(propertyMedia.id, parsedId.data))
      .limit(1),
    db
      .select({ id: agents.id })
      .from(agents)
      .innerJoin(userProfiles, eq(agents.userProfileId, userProfiles.id))
      .where(and(eq(userProfiles.clerkUserId, userId)))
      .limit(1),
  ]);

  if (!media) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!agentRow || media.agentId !== agentRow.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const fileKey = media.uploadThingKey ?? uploadThingKeyFromUrl(media.url);
  if (fileKey) {
    try {
      const utapi = new UTApi();
      await utapi.deleteFiles(fileKey);
    } catch {
      return NextResponse.json({ error: "Could not delete remote file" }, { status: 502 });
    }
  }

  await db.delete(propertyMedia).where(eq(propertyMedia.id, media.id));

  return new NextResponse(null, { status: 204 });
}
