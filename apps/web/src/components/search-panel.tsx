import { MapPin, Search, SlidersHorizontal } from "lucide-react";

export function SearchPanel() {
  return (
    <form className="grid gap-3 rounded bg-white p-3 shadow-soft md:grid-cols-[1.1fr_0.9fr_0.8fr_auto]">
      <label className="flex items-center gap-3 rounded border border-black/10 px-4 py-3">
        <MapPin className="text-gold" size={20} aria-hidden />
        <span className="grid flex-1 gap-1">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Ubicacion</span>
          <input className="min-w-0 bg-transparent text-sm outline-none" placeholder="Ciudad, barrio o codigo postal" />
        </span>
      </label>
      <label className="grid gap-1 rounded border border-black/10 px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Operacion</span>
        <select className="bg-transparent text-sm outline-none">
          <option>Comprar</option>
          <option>Rentar</option>
        </select>
      </label>
      <label className="grid gap-1 rounded border border-black/10 px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Presupuesto</span>
        <select className="bg-transparent text-sm outline-none">
          <option>Cualquier precio</option>
          <option>Hasta $500k</option>
          <option>$500k - $1M</option>
          <option>$1M+</option>
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
