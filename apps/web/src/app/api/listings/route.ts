import { NextResponse } from "next/server";
import { z } from "zod";
import { getListingsByType, LISTINGS_PAGE_SIZE } from "@/lib/listings";

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
  const { listings, total } = await getListingsByType(type, { page });
  const totalPages = Math.max(1, Math.ceil(total / LISTINGS_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  return NextResponse.json({ listings, total, page: safePage, totalPages });
}
