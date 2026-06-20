"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, X } from "lucide-react";
import { leadIntents, leadIntentLabel, leadStatuses, leadStatusLabel } from "@realtor/domain";

type Props = {
  defaultStatus: string;
  defaultIntent: string;
  defaultQ: string;
};

export function LeadsFilter({ defaultStatus, defaultIntent, defaultQ }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(defaultStatus);
  const [intent, setIntent] = useState(defaultIntent);
  const [q, setQ] = useState(defaultQ);
  const hasFilters = Boolean(status || intent || q);

  function navigate(next: { status?: string; intent?: string; q?: string }) {
    const params = new URLSearchParams();
    const newStatus = next.status ?? status;
    const newIntent = next.intent ?? intent;
    const newQ = next.q ?? q;
    if (newStatus) params.set("status", newStatus);
    if (newIntent) params.set("intent", newIntent);
    if (newQ.trim()) params.set("q", newQ.trim());
    router.push(`/dashboard${params.size ? `?${params}` : ""}`);
  }

  function clear() {
    setStatus("");
    setIntent("");
    setQ("");
    router.push("/dashboard");
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        navigate({});
      }}
      className="grid gap-3 border-b border-black/10 px-6 py-4 sm:grid-cols-[1fr_auto_auto_auto] sm:items-end"
    >
      <label className="grid gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-black/55">Buscar</span>
        <div className="flex items-center gap-2 rounded border border-black/10 px-3">
          <Search size={15} className="text-black/45" aria-hidden />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Nombre o email"
            className="w-full bg-transparent py-2 text-sm outline-none"
          />
        </div>
      </label>

      <label className="grid gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-black/55">Estado</span>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            navigate({ status: e.target.value });
          }}
          className="rounded border border-black/10 bg-white px-3 py-2 text-sm"
        >
          <option value="">Todos</option>
          {leadStatuses.map((s) => (
            <option key={s} value={s}>{leadStatusLabel(s)}</option>
          ))}
        </select>
      </label>

      <label className="grid gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-black/55">Intencion</span>
        <select
          value={intent}
          onChange={(e) => {
            setIntent(e.target.value);
            navigate({ intent: e.target.value });
          }}
          className="rounded border border-black/10 bg-white px-3 py-2 text-sm"
        >
          <option value="">Todas</option>
          {leadIntents.map((i) => (
            <option key={i} value={i}>{leadIntentLabel(i)}</option>
          ))}
        </select>
      </label>

      {hasFilters ? (
        <button
          type="button"
          onClick={clear}
          className="inline-flex items-center justify-center gap-1 rounded border border-black/15 px-3 py-2 text-xs font-medium transition-colors hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        >
          <X size={13} aria-hidden />
          Limpiar
        </button>
      ) : (
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded bg-ink px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        >
          Buscar
        </button>
      )}
    </form>
  );
}
