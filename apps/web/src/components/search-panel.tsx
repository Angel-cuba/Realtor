"use client";

import { useRouter } from "next/navigation";
import { MapPin, Search, SlidersHorizontal } from "lucide-react";

type Props = {
  intent?: "buy" | "rent";
  defaultQ?: string;
  defaultBudget?: string;
};

export function SearchPanel({ intent, defaultQ = "", defaultBudget = "" }: Props) {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const q = ((data.get("q") as string) ?? "").trim();
    const operacion = data.get("operacion") as string;
    const budget = data.get("budget") as string;

    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (budget) params.set("budget", budget);

    const base =
      intent === "rent" ? "/rentar" :
      intent === "buy" ? "/comprar" :
      operacion === "rent" ? "/rentar" : "/comprar";

    router.push(`${base}${params.size ? `?${params}` : ""}`);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 rounded bg-white p-3 shadow-soft md:grid-cols-[1.1fr_0.9fr_0.8fr_auto]">
      <label className="flex items-center gap-3 rounded border border-black/10 px-4 py-3">
        <MapPin className="text-gold" size={20} aria-hidden />
        <span className="grid flex-1 gap-1">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Ubicacion</span>
          <input
            name="q"
            defaultValue={defaultQ}
            className="min-w-0 bg-transparent text-sm outline-none"
            placeholder="Ciudad, barrio o codigo postal"
          />
        </span>
      </label>
      <label className="grid gap-1 rounded border border-black/10 px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Operacion</span>
        <select
          name="operacion"
          defaultValue={intent === "rent" ? "rent" : "buy"}
          className="bg-transparent text-sm outline-none"
        >
          <option value="buy">Comprar</option>
          <option value="rent">Rentar</option>
        </select>
      </label>
      <label className="grid gap-1 rounded border border-black/10 px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Presupuesto</span>
        <select name="budget" defaultValue={defaultBudget} className="bg-transparent text-sm outline-none">
          <option value="">Cualquier precio</option>
          <option value="500k">Hasta $500k</option>
          <option value="1m">$500k - $1M</option>
          <option value="1m+">$1M+</option>
        </select>
      </label>
      <button className="inline-flex items-center justify-center gap-2 rounded bg-gold px-5 py-3 font-semibold text-ink" type="submit">
        <Search size={18} aria-hidden />
        Buscar
      </button>
      <button
        className="inline-flex items-center justify-center gap-2 rounded border border-black/10 px-4 py-3 text-sm font-medium md:col-span-4"
        type="button"
      >
        <SlidersHorizontal size={17} aria-hidden />
        Filtros avanzados
      </button>
    </form>
  );
}
