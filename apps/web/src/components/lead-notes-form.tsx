"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";

export function LeadNotesForm({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (body.trim().length < 2) return;
    setSubmitting(true);
    setError(null);

    const res = await fetch(`/api/leads/${leadId}/notes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ body: body.trim() }),
    });

    if (!res.ok) {
      setError("No se pudo guardar la nota.");
      setSubmitting(false);
      return;
    }

    setBody("");
    setSubmitting(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <label className="grid gap-2">
        <span className="text-sm font-medium">Nueva nota</span>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          required
          minLength={2}
          maxLength={2000}
          placeholder="Llamada hecha, dejó mensaje. Vuelvo a contactar el martes..."
          className="rounded border border-black/10 px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        />
      </label>
      {error ? <p className="text-sm font-medium text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={submitting || body.trim().length < 2}
        className="inline-flex w-fit items-center justify-center gap-2 rounded bg-ink px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:opacity-60"
      >
        <Send size={15} aria-hidden />
        {submitting ? "Guardando..." : "Guardar nota"}
      </button>
    </form>
  );
}
