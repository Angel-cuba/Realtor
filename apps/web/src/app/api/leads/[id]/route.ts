import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db, leads } from "@realtor/db";
import { leadStatusUpdateSchema } from "@realtor/domain";
import { getAgentForClerkUser } from "@/lib/agent";

const idSchema = z.string().uuid();

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const agentProfile = await getAgentForClerkUser(userId);
  if (!agentProfile) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const idParsed = idSchema.safeParse(id);
  if (!idParsed.success) {
    return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 });
  }

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
      .set({ status: parsed.data.status, updatedAt: sql`now()` })
      .where(eq(leads.id, idParsed.data))
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
