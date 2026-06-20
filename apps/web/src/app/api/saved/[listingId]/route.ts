import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db, savedListings } from "@realtor/db";

const paramSchema = z.string().uuid();

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ listingId: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { listingId } = await params;
  if (!paramSchema.safeParse(listingId).success) {
    return NextResponse.json({ error: "Invalid listing ID" }, { status: 400 });
  }

  await db
    .delete(savedListings)
    .where(and(eq(savedListings.userId, userId), eq(savedListings.listingId, listingId)));

  return new NextResponse(null, { status: 204 });
}
