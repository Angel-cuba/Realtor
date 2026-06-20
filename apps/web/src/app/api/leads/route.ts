import { NextResponse } from "next/server";
import { leadInputSchema } from "@realtor/domain";
import { db, leads } from "@realtor/db";
import { sendNewLeadEmail } from "@/lib/email";
import { checkRateLimit, clientIpFromHeaders } from "@/lib/rate-limit";

const LEAD_RATE_LIMIT = { limit: 10, windowMs: 10 * 60 * 1000 };

export async function POST(request: Request) {
  const ip = clientIpFromHeaders(request.headers);
  const limit = checkRateLimit(`leads:${ip}`, LEAD_RATE_LIMIT);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intenta de nuevo en unos minutos." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.max(1, Math.ceil((limit.resetAt - Date.now()) / 1000))),
        },
      }
    );
  }

  const payload = await request.json();
  const parsed = leadInputSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid lead payload", issues: parsed.error.flatten() }, { status: 400 });
  }

  const { listingSlug, ...data } = parsed.data;
  const score = listingSlug ? 55 : 35;

  let lead;
  try {
    [lead] = await db
      .insert(leads)
      .values({ ...data, score })
      .returning();
  } catch (err) {
    console.error("[api/leads] DB insert failed:", err);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  await sendNewLeadEmail({
    leadId: lead.id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    intent: lead.intent,
    message: lead.message,
    listingSlug: listingSlug ?? null,
  });

  return NextResponse.json({ lead }, { status: 201 });
}
