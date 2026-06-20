import { Resend } from "resend";
import { leadIntentLabel } from "@realtor/domain";

type NewLeadEmail = {
  name: string;
  email: string;
  phone?: string | null;
  intent: string;
  message: string;
  listingSlug?: string | null;
  leadId: string;
};

function buildEmail(lead: NewLeadEmail, siteUrl: string) {
  const subject = `Nuevo lead: ${lead.name} — ${leadIntentLabel(lead.intent)}`;
  const listingLine = lead.listingSlug
    ? `Listing: ${siteUrl}/propiedades/${lead.listingSlug}`
    : "Sin listing asociado";
  const text = [
    `Nuevo lead en Realtor`,
    ``,
    `Nombre: ${lead.name}`,
    `Email: ${lead.email}`,
    lead.phone ? `Telefono: ${lead.phone}` : null,
    `Intencion: ${leadIntentLabel(lead.intent)}`,
    listingLine,
    ``,
    `Mensaje:`,
    lead.message,
    ``,
    `Abrir en dashboard: ${siteUrl}/dashboard`,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#111111">
      <p style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#8c6a00;margin:0">Realtor</p>
      <h1 style="font-size:24px;font-weight:600;margin:8px 0 24px">Nuevo lead recibido</h1>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:6px 0;color:#555">Nombre</td><td style="padding:6px 0;font-weight:600">${lead.name}</td></tr>
        <tr><td style="padding:6px 0;color:#555">Email</td><td style="padding:6px 0;font-weight:600">${lead.email}</td></tr>
        ${lead.phone ? `<tr><td style="padding:6px 0;color:#555">Telefono</td><td style="padding:6px 0;font-weight:600">${lead.phone}</td></tr>` : ""}
        <tr><td style="padding:6px 0;color:#555">Intencion</td><td style="padding:6px 0;font-weight:600">${leadIntentLabel(lead.intent)}</td></tr>
        ${lead.listingSlug ? `<tr><td style="padding:6px 0;color:#555">Listing</td><td style="padding:6px 0"><a href="${siteUrl}/propiedades/${lead.listingSlug}" style="color:#8c6a00">${lead.listingSlug}</a></td></tr>` : ""}
      </table>
      <div style="margin-top:24px;padding:16px;background:#f8f5ed;border-radius:6px;font-size:14px;line-height:1.6;white-space:pre-wrap">${lead.message}</div>
      <p style="margin-top:32px">
        <a href="${siteUrl}/dashboard" style="display:inline-block;background:#111111;color:#ffffff;padding:12px 20px;border-radius:4px;font-weight:600;text-decoration:none">Abrir dashboard</a>
      </p>
    </div>
  `.trim();

  return { subject, text, html };
}

export async function sendNewLeadEmail(lead: NewLeadEmail) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEADS_NOTIFY_EMAIL;
  const from = process.env.LEADS_NOTIFY_FROM ?? "Realtor <onboarding@resend.dev>";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  if (!apiKey || !to) {
    console.info("[email] Resend not configured — skipping notification", {
      leadId: lead.leadId,
      hasKey: Boolean(apiKey),
      hasRecipient: Boolean(to),
    });
    return { sent: false, reason: "not-configured" as const };
  }

  const { subject, text, html } = buildEmail(lead, siteUrl);

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({ from, to, subject, text, html });
    if (error) {
      console.error("[email] Resend returned error", error);
      return { sent: false, reason: "resend-error" as const };
    }
    return { sent: true, id: data?.id };
  } catch (err) {
    console.error("[email] Resend threw", err);
    return { sent: false, reason: "exception" as const };
  }
}
