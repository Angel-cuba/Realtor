"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, ImageIcon, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing-client";

type ListingPhoto = {
  id: string;
  url: string;
  alt: string;
};

type ListingOption = {
  id: string;
  slug: string;
  title: string;
  photos: ListingPhoto[];
};

type Props = {
  listings: ListingOption[];
  emptyMessage?: string;
};

type StatusMessage = {
  text: string;
  type: "info" | "success" | "error";
};

export function ListingPhotoUploader({ listings, emptyMessage }: Props) {
  const router = useRouter();
  const [selectedListingId, setSelectedListingId] = useState(listings[0]?.id ?? "");
  const [message, setMessage] = useState<StatusMessage | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  const selectedListing = useMemo(
    () => listings.find((listing) => listing.id === selectedListingId),
    [listings, selectedListingId]
  );
  const visiblePhotos = useMemo(
    () => selectedListing?.photos.filter((photo) => photo.url && !deletedIds.has(photo.id)) ?? [],
    [deletedIds, selectedListing]
  );

  async function handleDelete(photoId: string) {
    if (!window.confirm("Eliminar esta foto de la propiedad?")) return;

    setDeletingIds((prev) => new Set(prev).add(photoId));
    setMessage({ text: "Eliminando foto...", type: "info" });

    try {
      const res = await fetch(`/api/media/${photoId}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Error al eliminar la foto");
      }
      setDeletedIds((prev) => new Set(prev).add(photoId));
      setMessage({ text: "Foto eliminada correctamente.", type: "success" });
      router.refresh();
    } catch (err) {
      setMessage({ text: err instanceof Error ? err.message : "Error inesperado", type: "error" });
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(photoId);
        return next;
      });
    }
  }

  if (listings.length === 0) {
    return (
      <div className="rounded bg-white p-6 text-center text-black/45">
        {emptyMessage ?? "No hay propiedades publicadas disponibles para subir fotos."}
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <section className="rounded bg-white p-5">
        <label className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45" htmlFor="listingId">
          Propiedad
        </label>
        <select
          id="listingId"
          value={selectedListingId}
          disabled={uploading || deletingIds.size > 0}
          onChange={(event) => {
            setSelectedListingId(event.target.value);
            setMessage(null);
            setUploadProgress(null);
            setDeletedIds(new Set());
          }}
          className="mt-3 w-full rounded border border-black/15 bg-white px-3 py-3 text-sm outline-none focus:border-gold disabled:cursor-wait disabled:bg-black/[0.03] disabled:text-black/35"
        >
          {listings.map((listing) => (
            <option value={listing.id} key={listing.id}>
              {listing.title}
            </option>
          ))}
        </select>

        {selectedListing && (
          <div className="mt-5 rounded bg-linen p-4 text-sm text-black/60">
            <p className="font-medium text-ink">{selectedListing.title}</p>
            <p className="mt-1">/{selectedListing.slug}</p>
          </div>
        )}
      </section>

      <section className="rounded bg-white p-5">
        <UploadDropzone
          key={selectedListingId}
          endpoint="listingImageUploader"
          input={{ listingId: selectedListingId }}
          onUploadBegin={() => {
            setUploading(true);
            setUploadProgress(0);
            setMessage({ text: "Subiendo fotos...", type: "info" });
          }}
          onUploadProgress={(progress) => {
            setUploadProgress(progress);
          }}
          onClientUploadComplete={() => {
            setUploading(false);
            setUploadProgress(null);
            setMessage({ text: "Fotos subidas correctamente.", type: "success" });
            router.refresh();
          }}
          onUploadError={(error) => {
            setUploading(false);
            setUploadProgress(null);
            setMessage({ text: error.message, type: "error" });
          }}
          appearance={{
            container:
              "border-black/15 bg-linen p-8 ut-ready:border-gold ut-uploading:cursor-wait ut-uploading:border-moss",
            label: "text-ink text-base font-semibold",
            allowedContent: "text-black/45 text-xs",
            button: "bg-ink text-white hover:bg-black"
          }}
          content={{
            label: "Arrastra fotos o selecciona archivos",
            allowedContent: "Imagenes hasta 8MB, maximo 10 por carga",
            button: "Subir fotos"
          }}
        />
        {uploading && uploadProgress !== null && (
          <div className="mt-4 h-2 overflow-hidden rounded bg-black/10" aria-hidden>
            <div className="h-full rounded bg-moss transition-all" style={{ width: `${uploadProgress}%` }} />
          </div>
        )}
        {message && (
          <div
            className={[
              "mt-4 flex items-start gap-2 rounded px-3 py-2 text-sm font-medium",
              message.type === "success" ? "bg-moss/10 text-moss" : "",
              message.type === "error" ? "bg-red-50 text-red-700" : "",
              message.type === "info" ? "bg-gold/10 text-ink" : "",
            ].join(" ")}
            role={message.type === "error" ? "alert" : "status"}
          >
            {message.type === "success" ? <CheckCircle2 size={16} aria-hidden /> : null}
            {message.type === "error" ? <AlertCircle size={16} aria-hidden /> : null}
            {message.type === "info" ? <Loader2 size={16} className="animate-spin" aria-hidden /> : null}
            <p>{message.text}</p>
          </div>
        )}
      </section>

      <section className="rounded bg-white p-5 lg:col-span-2">
        <div className="flex items-center justify-between gap-3 border-b border-black/10 pb-4">
          <h2 className="font-semibold">
            Fotos existentes
            {visiblePhotos.length > 0 && (
              <span className="ml-2 text-xs font-normal text-black/45">
                ({visiblePhotos.length})
              </span>
            )}
          </h2>
          <button
            className="inline-flex items-center gap-2 rounded border border-black/15 px-3 py-2 text-sm font-medium transition-colors hover:bg-linen"
            type="button"
            onClick={() => router.refresh()}
          >
            <RefreshCw size={15} aria-hidden />
            Actualizar
          </button>
        </div>

        {visiblePhotos.length ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visiblePhotos.map((photo) => {
                const isDeleting = deletingIds.has(photo.id);
                return (
                  <div
                    key={photo.id}
                    className={`group relative overflow-hidden rounded border border-black/10 bg-linen transition-opacity ${isDeleting ? "pointer-events-none opacity-40" : ""}`}
                  >
                    <div className="relative aspect-[4/3] w-full">
                      <Image
                        fill
                        src={photo.url}
                        alt={photo.alt}
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2 px-3 py-2">
                      <p className="truncate text-xs text-black/55">{photo.alt}</p>
                      <button
                        type="button"
                        aria-label={`Eliminar foto ${photo.alt}`}
                        onClick={() => handleDelete(photo.id)}
                        disabled={isDeleting || uploading}
                        className="shrink-0 rounded p-1 text-black/35 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                      >
                        {isDeleting ? <Loader2 size={14} className="animate-spin" aria-hidden /> : <Trash2 size={14} aria-hidden />}
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="mt-5 flex min-h-40 flex-col items-center justify-center gap-2 rounded bg-linen text-black/45">
            <ImageIcon size={28} aria-hidden />
            <p className="text-sm">Esta propiedad aun no tiene fotos reales.</p>
          </div>
        )}
      </section>
    </div>
  );
}
