import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { and, asc, eq } from "drizzle-orm";
import { z } from "zod";
import {
  agents,
  db,
  listings as listingsTable,
  properties,
  propertyMedia,
  savedListings,
  userProfiles,
} from "@realtor/db";
import { mapListingRows } from "@/lib/listings";

const saveBodySchema = z.object({ listingId: z.string().uuid() });

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db
    .select({
      listing: listingsTable,
      property: properties,
      agent: agents,
      profile: userProfiles,
    })
    .from(savedListings)
    .innerJoin(listingsTable, eq(savedListings.listingId, listingsTable.id))
    .innerJoin(properties, eq(listingsTable.propertyId, properties.id))
    .leftJoin(agents, eq(listingsTable.agentId, agents.id))
    .leftJoin(userProfiles, eq(agents.userProfileId, userProfiles.id))
    .where(and(eq(savedListings.userId, userId), eq(listingsTable.status, "published")))
    .orderBy(asc(savedListings.createdAt));

  const listings = await mapListingRows(rows);
  return NextResponse.json({ listings });
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = await request.json().catch(() => null);
  const parsed = saveBodySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", issues: parsed.error.flatten() }, { status: 400 });
  }

  await db
    .insert(savedListings)
    .values({ userId, listingId: parsed.data.listingId })
    .onConflictDoNothing();

  return new NextResponse(null, { status: 201 });
}
