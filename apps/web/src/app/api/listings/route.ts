import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { db, listings, properties } from "@realtor/db";
import { listingInputSchema } from "@realtor/domain";
import { getListingsByType, LISTINGS_PAGE_SIZE } from "@/lib/listings";
import { getAgentForClerkUser } from "@/lib/agent";
import { uniqueListingSlug } from "@/lib/slug";

const querySchema = z.object({
  type: z.enum(["sale", "rent"]),
  page: z
    .string()
    .optional()
    .transform((val) => Math.max(1, Math.floor(Number(val) || 1))),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = querySchema.safeParse({
    type: url.searchParams.get("type"),
    page: url.searchParams.get("page") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { type, page } = parsed.data;
  const { listings: items, total } = await getListingsByType(type, { page });
  const totalPages = Math.max(1, Math.ceil(total / LISTINGS_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  return NextResponse.json({ listings: items, total, page: safePage, totalPages });
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const agentProfile = await getAgentForClerkUser(userId);
  if (!agentProfile) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = listingInputSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid listing payload", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const slug = await uniqueListingSlug(data.title);

  try {
    const [created] = await db.transaction(async (tx) => {
      const [property] = await tx
        .insert(properties)
        .values({
          propertyType: data.propertyType,
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2 || null,
          city: data.city,
          neighborhood: data.neighborhood,
          region: data.region || null,
          postalCode: data.postalCode || null,
          country: data.country,
          beds: data.beds,
          baths: data.baths,
          areaSqft: data.areaSqft,
          lotSqft: data.lotSqft ?? null,
        })
        .returning();

      const [listing] = await tx
        .insert(listings)
        .values({
          propertyId: property.id,
          agentId: agentProfile.agentId,
          slug,
          title: data.title,
          listingType: data.listingType,
          status: "draft",
          price: data.price,
          currency: data.currency,
          summary: data.summary,
          tags: data.tags,
          highlights: data.highlights,
        })
        .returning();

      return [{ listing, property }];
    });

    return NextResponse.json({ listing: created.listing, property: created.property }, { status: 201 });
  } catch (err) {
    console.error("[api/listings] insert failed:", err);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
