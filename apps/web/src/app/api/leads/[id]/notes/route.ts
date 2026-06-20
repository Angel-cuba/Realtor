import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { db, leadNotes, leads } from "@realtor/db";
import { eq } from "drizzle-orm";
import { leadNoteInputSchema } from "@realtor/domain";
import { getAgentForClerkUser } from "@/lib/agent";

const idSchema = z.string().uuid();

export async function POST(
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

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = leadNoteInputSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid note", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const [exists] = await db
    .select({ id: leads.id })
    .from(leads)
    .where(eq(leads.id, idParsed.data))
    .limit(1);

  if (!exists) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  const author = await currentUser();
  const authorName =
    [author?.firstName, author?.lastName].filter(Boolean).join(" ").trim() ||
    author?.emailAddresses?.[0]?.emailAddress ||
    "Agente";

  try {
    const [note] = await db
      .insert(leadNotes)
      .values({
        leadId: idParsed.data,
        authorClerkId: userId,
        authorName,
        body: parsed.data.body,
      })
      .returning();
    return NextResponse.json({ note }, { status: 201 });
  } catch (err) {
    console.error("[api/leads/[id]/notes] insert failed:", err);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
