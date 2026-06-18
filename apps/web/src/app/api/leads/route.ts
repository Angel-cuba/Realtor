import { NextResponse } from "next/server";
import { leadInputSchema } from "@realtor/domain";
import { db, leads } from "@realtor/db";

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = leadInputSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid lead payload", issues: parsed.error.flatten() }, { status: 400 });
  }

  const { listingSlug, ...data } = parsed.data;
  const score = listingSlug ? 55 : 35;

  try {
    const [lead] = await db
      .insert(leads)
      .values({ ...data, score })
      .returning();
    return NextResponse.json({ lead }, { status: 201 });
  } catch (err) {
    console.error("[api/leads] DB insert failed:", err);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
