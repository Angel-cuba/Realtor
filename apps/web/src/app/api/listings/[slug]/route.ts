import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { eq, sql } from "drizzle-orm";
import { db, listings } from "@realtor/db";
import { listingStatusUpdateSchema } from "@realtor/domain";
import { getPublishedListingBySlug } from "@/lib/listings";
import { getUserContext, isListingOwner } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const listing = await getPublishedListingBySlug(slug);

  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  return NextResponse.json({ listing });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ctx = await getUserContext(userId);
  if (!ctx) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { slug } = await params;

  const [target] = await db
    .select({ id: listings.id, agentId: listings.agentId })
    .from(listings)
    .where(eq(listings.slug, slug))
    .limit(1);

  if (!target) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  if (!isListingOwner(ctx, target.agentId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = listingStatusUpdateSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid status", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const nextStatus = parsed.data.status;
  const publishedAt = nextStatus === "published" ? sql`now()` : undefined;

  try {
    const [listing] = await db
      .update(listings)
      .set({
        status: nextStatus,
        ...(publishedAt ? { publishedAt } : {}),
      })
      .where(eq(listings.id, target.id))
      .returning();

    return NextResponse.json({ listing });
  } catch (err) {
    console.error("[api/listings/[slug]] PATCH failed:", err);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
