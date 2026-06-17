"use client";

import { useState } from "react";
import { Send } from "lucide-react";

type LeadFormProps = {
  intent: "buy" | "rent" | "sell" | "lease_out" | "general";
  listingSlug?: string;
  compact?: boolean;
};

export function LeadForm({ intent, listingSlug, compact = false }: LeadFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(formData: FormData) {
    setStatus("sending");

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        message: formData.get("message"),
        intent,
        listingSlug
      })
    });

    setStatus(response.ok ? "sent" : "error");
  }

  return (
    <form action={submit} className={`grid gap-3 rounded bg-white p-4 ${compact ? "" : "shadow-soft"}`}>
      <div>
        <h3 className="text-xl font-semibold">Habla con un asesor</h3>
        <p className="mt-1 text-sm text-black/55">Te contactamos con disponibilidad, precio y proximos pasos.</p>
      </div>
      <input className="rounded border border-black/10 px-4 py-3 outline-none" name="name" placeholder="Nombre" required />
      <input className="rounded border border-black/10 px-4 py-3 outline-none" name="email" placeholder="Email" required type="email" />
      <input className="rounded border border-black/10 px-4 py-3 outline-none" name="phone" placeholder="Telefono" />
      <textarea
        className="min-h-28 rounded border border-black/10 px-4 py-3 outline-none"
        name="message"
        placeholder="Cuentanos que estas buscando"
        required
      />
      <button
        className="inline-flex items-center justify-center gap-2 rounded bg-ink px-5 py-3 font-semibold text-white disabled:opacity-60"
        disabled={status === "sending"}
        type="submit"
      >
        <Send size={17} aria-hidden />
        {status === "sending" ? "Enviando" : "Enviar solicitud"}
      </button>
      {status === "sent" ? <p className="text-sm font-medium text-moss">Solicitud recibida.</p> : null}
      {status === "error" ? <p className="text-sm font-medium text-red-700">No se pudo enviar. Revisa los datos.</p> : null}
    </form>
  );
}
