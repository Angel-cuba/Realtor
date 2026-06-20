"use client";

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";

type Props = {
  listingId: string;
  isSaved: boolean;
  saveLabel: string;
  unsaveLabel: string;
};

export function HeartButton({ listingId, isSaved: initialSaved, saveLabel, unsaveLabel }: Props) {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [pending, setPending] = useState(false);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    if (pending) return;
    setPending(true);
    setSaved((prev) => !prev);

    try {
      if (saved) {
        await fetch(`/api/saved/${listingId}`, { method: "DELETE" });
      } else {
        await fetch("/api/saved", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ listingId }),
        });
      }
      router.refresh();
    } catch {
      setSaved((prev) => !prev);
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      aria-label={saved ? unsaveLabel : saveLabel}
      aria-pressed={saved}
      className={[
        "absolute right-3 top-3 flex size-8 items-center justify-center rounded-full",
        "bg-white/90 backdrop-blur-sm transition-colors hover:bg-white",
        pending ? "opacity-50" : "",
      ]
        .join(" ")
        .trim()}
      onClick={toggle}
      type="button"
    >
      <Heart
        aria-hidden
        className={saved ? "fill-red-500 stroke-red-500" : "stroke-black/50"}
        size={16}
      />
    </button>
  );
}
