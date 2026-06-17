import { NextResponse } from "next/server";
import { leadInputSchema } from "@realtor/domain";

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = leadInputSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid lead payload", issues: parsed.error.flatten() }, { status: 400 });
  }

  const lead = {
    ...parsed.data,
    id: crypto.randomUUID(),
    status: "new",
    score: parsed.data.listingSlug ? 55 : 35,
    createdAt: new Date().toISOString()
  };

  return NextResponse.json({ lead }, { status: 201 });
}
