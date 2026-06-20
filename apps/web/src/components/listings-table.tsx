"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ExternalLink, UploadCloud } from "lucide-react";
import {
  formatMoney,
  listingStatuses,
  listingStatusLabel,
  listingTypeLabel,
  propertyTypeLabel,
  type ListingStatus,
  type ListingType,
  type PropertyType,
} from "@realtor/domain";
import { listingStatusClass } from "@/components/listing-status-pill";

type DashboardListing = {
  slug: string;
  title: string;
  listingType: ListingType;
  status: ListingStatus;
  price: number;
  currency: string;
  propertyType: PropertyType;
  city: string;
  neighborhood: string;
};

export function ListingsTable({ initialListings }: { initialListings: DashboardListing[] }) {
  const [items, setItems] = useState(initialListings);
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);
  const [failedSlug, setFailedSlug] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const pendingId = isPending ? pendingSlug : null;

  function updateLocalStatus(slug: string, status: ListingStatus) {
    setItems((cur) => cur.map((l) => (l.slug === slug ? { ...l, status } : l)));
  }

  function handleStatusChange(slug: string, next: ListingStatus) {
    const current = items.find((l) => l.slug === slug);
    if (!current || current.status === next) return;

    const previous = current.status;
    setFailedSlug(null);
    setPendingSlug(slug);
    updateLocalStatus(slug, next);

    startTransition(async () => {
      const res = await fetch(`/api/listings/${slug}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) {
        updateLocalStatus(slug, previous);
        setFailedSlug(slug);
      }
      setPendingSlug(null);
    });
  }

  if (items.length === 0) {
    return (
      <div className="grid gap-3 px-6 py-12 text-center">
        <p className="text-black/55">Aun no tienes propiedades publicadas.</p>
        <Link
          href="/dashboard/listings/new"
          className="mx-auto inline-flex items-center justify-center gap-2 rounded bg-ink px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        >
          Crear primera propiedad
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-black/10 text-left text-xs font-semibold uppercase tracking-[0.14em] text-black/55">
            <th className="px-6 py-3">Titulo</th>
            <th className="px-6 py-3">Tipo</th>
            <th className="px-6 py-3">Ubicacion</th>
            <th className="px-6 py-3">Precio</th>
            <th className="px-6 py-3">Estado</th>
            <th className="px-6 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/[0.06]">
          {items.map((listing) => {
            const isUpdating = pendingId === listing.slug;
            const didFail = failedSlug === listing.slug;
            const currency = (listing.currency === "EUR" ? "EUR" : "USD") as "EUR" | "USD";

            return (
              <tr key={listing.slug} className="hover:bg-black/[0.02]">
                <td className="px-6 py-4 font-medium">{listing.title}</td>
                <td className="px-6 py-4 text-black/60">
                  {listingTypeLabel(listing.listingType)} · {propertyTypeLabel(listing.propertyType)}
                </td>
                <td className="px-6 py-4 text-black/60">{listing.neighborhood}, {listing.city}</td>
                <td className="px-6 py-4 font-semibold">{formatMoney(listing.price, currency)}</td>
                <td className="px-6 py-4">
                  <div className="grid gap-1">
                    <span className={`inline-flex w-44 rounded px-2 py-1 text-xs font-medium transition-colors ${listingStatusClass(listing.status)} ${isUpdating ? "opacity-60" : ""}`}>
                      <select
                        value={listing.status}
                        disabled={isUpdating}
                        onChange={(e) => handleStatusChange(listing.slug, e.target.value as ListingStatus)}
                        aria-label={`Estado de ${listing.title}`}
                        className="w-full cursor-pointer appearance-none bg-transparent text-inherit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:cursor-not-allowed"
                      >
                        {listingStatuses.map((s) => (
                          <option key={s} value={s} className="bg-white text-ink">
                            {listingStatusLabel(s)}
                          </option>
                        ))}
                      </select>
                    </span>
                    {isUpdating ? <span className="text-xs text-black/55">Guardando...</span> : null}
                    {didFail ? <span className="text-xs font-medium text-red-700">No se pudo actualizar.</span> : null}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-3 text-xs">
                    <Link
                      href={`/dashboard/upload?listing=${listing.slug}`}
                      className="inline-flex items-center gap-1 text-gold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                    >
                      <UploadCloud size={14} aria-hidden />
                      Fotos
                    </Link>
                    {listing.status === "published" && (
                      <Link
                        href={`/propiedades/${listing.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-ink/70 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                      >
                        <ExternalLink size={14} aria-hidden />
                        Ver
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
