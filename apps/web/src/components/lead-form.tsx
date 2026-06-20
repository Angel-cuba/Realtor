"use client";

import { useState } from "react";
import Link from "next/link";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { CheckCircle2, Send } from "lucide-react";

type LeadFormProps = {
  intent: "buy" | "rent" | "sell" | "lease_out" | "general";
  listingSlug?: string;
  compact?: boolean;
};

export function LeadForm({ intent, listingSlug, compact = false }: LeadFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const { isLoaded, isSignedIn } = useAuth();

  async function submit(formData: FormData) {
    if (!isSignedIn) return;

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

  const wrapperClasses = `rounded bg-white p-6 ${compact ? "" : "shadow-soft"}`;
  const title = intent === "sell" || intent === "lease_out" ? "Habla con un asesor" : "Solicitar visita";
  const copy = intent === "sell" || intent === "lease_out"
    ? "Inicia sesion para coordinar la publicacion con un asesor."
    : "Inicia sesion para solicitar disponibilidad, precio y proximos pasos.";

  if (!isLoaded) {
    return (
      <div className={`${wrapperClasses} grid gap-4`} aria-busy="true" aria-label="Cargando formulario">
        <div className="h-5 w-44 animate-pulse rounded bg-black/10" />
        <div className="h-4 w-64 max-w-full animate-pulse rounded bg-black/10" />
        {[0, 1, 2, 3].map((item) => (
          <div className="h-12 animate-pulse rounded bg-black/[0.06]" key={item} />
        ))}
        <div className="h-12 animate-pulse rounded bg-ink/15" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className={`${wrapperClasses} grid gap-4`}>
        <div className="grid h-12 w-12 place-items-center rounded-full bg-gold/15 text-ink">
          <Send size={20} aria-hidden />
        </div>
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-black/60">{copy}</p>
        </div>
        <SignInButton mode="modal">
          <button
            className="inline-flex items-center justify-center gap-2 rounded bg-ink px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
            type="button"
          >
            Iniciar sesion
          </button>
        </SignInButton>
      </div>
    );
  }

  if (status === "sent") {
    const nextHref = intent === "rent" ? "/rentar" : "/comprar";
    const nextLabel = intent === "rent" ? "Ver mas rentas" : "Ver mas propiedades";

    return (
      <div className={`${wrapperClasses} grid gap-4`}>
        <div className="grid h-12 w-12 place-items-center rounded-full bg-moss/15 text-moss">
          <CheckCircle2 size={22} aria-hidden />
        </div>
        <div>
          <h3 className="font-display text-2xl font-medium tracking-tight">Solicitud recibida.</h3>
          <p className="mt-2 text-sm leading-6 text-black/65">
            Te contactaremos en menos de 24 horas con disponibilidad, precio y proximos pasos.
          </p>
        </div>
        <Link
          href={nextHref}
          className="inline-flex items-center justify-center rounded border border-black/15 px-5 py-3 text-sm font-semibold transition-colors hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        >
          {nextLabel}
        </Link>
      </div>
    );
  }

  return (
    <form action={submit} className={`${wrapperClasses} grid gap-3`}>
      <div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-black/55">Te contactamos con disponibilidad, precio y proximos pasos.</p>
      </div>
      <input
        className="rounded border border-black/10 px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        name="name"
        placeholder="Nombre"
        aria-label="Nombre"
        required
      />
      <input
        className="rounded border border-black/10 px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        name="email"
        placeholder="Email"
        aria-label="Email"
        required
        type="email"
      />
      <input
        className="rounded border border-black/10 px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        name="phone"
        placeholder="Telefono"
        aria-label="Telefono"
      />
      <textarea
        className="min-h-28 rounded border border-black/10 px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        name="message"
        placeholder="Cuentanos que estas buscando"
        aria-label="Mensaje"
        required
      />
      <button
        className="inline-flex items-center justify-center gap-2 rounded bg-ink px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:opacity-60"
        disabled={status === "sending"}
        aria-busy={status === "sending"}
        type="submit"
      >
        <Send size={17} aria-hidden />
        {status === "sending" ? "Enviando" : "Enviar solicitud"}
      </button>
      {status === "error" ? <p className="text-sm font-medium text-red-700">No se pudo enviar. Revisa los datos.</p> : null}
    </form>
  );
}
