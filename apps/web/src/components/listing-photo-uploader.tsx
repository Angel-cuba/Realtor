"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageIcon, RefreshCw } from "lucide-react";
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
};

export function ListingPhotoUploader({ listings }: Props) {
  const router = useRouter();
  const [selectedListingId, setSelectedListingId] = useState(listings[0]?.id ?? "");
  const [message, setMessage] = useState<string | null>(null);

  const selectedListing = useMemo(
    () => listings.find((listing) => listing.id === selectedListingId),
    [listings, selectedListingId]
  );

  if (listings.length === 0) {
    return (
      <div className="rounded bg-white p-6 text-center text-black/45">
        No hay propiedades publicadas disponibles para subir fotos.
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
          onChange={(event) => {
            setSelectedListingId(event.target.value);
            setMessage(null);
          }}
          className="mt-3 w-full rounded border border-black/15 bg-white px-3 py-3 text-sm outline-none focus:border-gold"
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
          onClientUploadComplete={() => {
            setMessage("Foto subida correctamente.");
            router.refresh();
          }}
          onUploadError={(error) => {
            setMessage(error.message);
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
        {message && <p className="mt-4 text-sm font-medium text-moss">{message}</p>}
      </section>

      <section className="rounded bg-white p-5 lg:col-span-2">
        <div className="flex items-center justify-between gap-3 border-b border-black/10 pb-4">
          <h2 className="font-semibold">Fotos existentes</h2>
          <button
            className="inline-flex items-center gap-2 rounded border border-black/15 px-3 py-2 text-sm font-medium"
            type="button"
            onClick={() => router.refresh()}
          >
            <RefreshCw size={15} aria-hidden />
            Actualizar
          </button>
        </div>

        {selectedListing?.photos.filter((photo) => photo.url).length ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {selectedListing.photos
              .filter((photo) => photo.url)
              .map((photo) => (
                <div className="overflow-hidden rounded border border-black/10 bg-linen" key={photo.id}>
                  <img className="aspect-[4/3] w-full object-cover" src={photo.url} alt={photo.alt} />
                  <p className="truncate px-3 py-2 text-xs text-black/55">{photo.alt}</p>
                </div>
              ))}
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
