import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db, leads } from "@realtor/db";
import { leadStatusUpdateSchema } from "@realtor/domain";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const payload = await request.json();
  const parsed = leadStatusUpdateSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid status", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const [lead] = await db
      .update(leads)
      .set({ status: parsed.data.status, updatedAt: new Date() })
      .where(eq(leads.id, id))
      .returning();

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ lead });
  } catch (err) {
    console.error("[api/leads/[id]] PATCH failed:", err);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
