"use client";

import { useState } from "react";
import Link from "next/link";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { CheckCircle2, Send } from "lucide-react";
import { useLocale } from "@/contexts/locale-context";

type LeadFormProps = {
  intent: "buy" | "rent" | "sell" | "lease_out" | "general";
  listingSlug?: string;
  compact?: boolean;
};

export function LeadForm({ intent, listingSlug, compact = false }: LeadFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const { isLoaded, isSignedIn } = useAuth();
  const { messages: m } = useLocale();

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

  const isSell = intent === "sell" || intent === "lease_out";
  const title = isSell ? m.leadForm.titleAdvisor : m.leadForm.titleVisit;
  const signInCopy = isSell ? m.leadForm.signInPromptAdvisor : m.leadForm.signInPromptVisit;
  const wrapperClasses = `rounded bg-white p-6 ${compact ? "" : "shadow-soft"}`;

  if (!isLoaded) {
    return (
      <div className={`${wrapperClasses} grid gap-4`} aria-busy="true" aria-label={m.leadForm.loadingLabel}>
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
          <p className="mt-2 text-sm leading-6 text-black/60">{signInCopy}</p>
        </div>
        <SignInButton mode="modal">
          <button
            className="inline-flex items-center justify-center gap-2 rounded bg-ink px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
            type="button"
          >
            {m.leadForm.signIn}
          </button>
        </SignInButton>
      </div>
    );
  }

  if (status === "sent") {
    const successBody = intent === "rent" ? m.leadForm.successBodyRent : isSell ? m.leadForm.successBodySell : m.leadForm.successBodyBuy;
    const backLabel = intent === "rent" ? m.leadForm.backToRent : listingSlug ? m.leadForm.backToHome : m.leadForm.backToBuy;
    const backHref = intent === "rent" ? "/rentar" : listingSlug ? "/" : "/comprar";

    return (
      <div className={`${wrapperClasses} grid gap-4`}>
        <div className="grid h-12 w-12 place-items-center rounded-full bg-moss/15 text-moss">
          <CheckCircle2 size={22} aria-hidden />
        </div>
        <div>
          <h3 className="font-display text-2xl font-medium tracking-tight">{m.leadForm.successTitle}</h3>
          <p className="mt-2 text-sm leading-6 text-black/65">{successBody}</p>
        </div>
        <Link
          href={backHref}
          className="inline-flex items-center justify-center rounded border border-black/15 px-5 py-3 text-sm font-semibold transition-colors hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        >
          {backLabel}
        </Link>
      </div>
    );
  }

  return (
    <form action={submit} className={`${wrapperClasses} grid gap-3`}>
      <div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-black/55">{m.leadForm.signInPromptVisit}</p>
      </div>
      <input
        className="rounded border border-black/10 px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        name="name"
        placeholder={m.leadForm.namePlaceholder}
        aria-label={m.leadForm.name}
        required
      />
      <input
        className="rounded border border-black/10 px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        name="email"
        placeholder={m.leadForm.emailPlaceholder}
        aria-label={m.leadForm.email}
        required
        type="email"
      />
      <input
        className="rounded border border-black/10 px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        name="phone"
        placeholder={m.leadForm.phonePlaceholder}
        aria-label={m.leadForm.phone}
      />
      <textarea
        className="min-h-28 rounded border border-black/10 px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        name="message"
        placeholder={m.leadForm.messagePlaceholder}
        aria-label={m.leadForm.message}
        required
      />
      <button
        className="inline-flex items-center justify-center gap-2 rounded bg-ink px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:opacity-60"
        disabled={status === "sending"}
        aria-busy={status === "sending"}
        type="submit"
      >
        <Send size={17} aria-hidden />
        {status === "sending" ? m.leadForm.submitting : m.leadForm.submit}
      </button>
      {status === "error" ? <p className="text-sm font-medium text-red-700">{m.leadForm.errorMessage}</p> : null}
    </form>
  );
}
