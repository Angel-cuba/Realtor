"use client";

import { useState } from "react";
import Image from "next/image";
import { Building2 } from "lucide-react";

type Props = {
  src: string;
  alt: string;
  label?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

export function PropertyImage({ src, alt, label, sizes, priority, className }: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink">
        <Building2 className="text-gold/25" size={36} aria-hidden />
        {label && (
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold/40">{label}</span>
        )}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
