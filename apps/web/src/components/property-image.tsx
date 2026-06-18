import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  label?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

export function PropertyImage({ src, alt, label, sizes, priority, className }: Props) {
  if (!src) {
    return (
      <div className="absolute inset-0 flex items-end bg-ink p-4">
        {label && (
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold/50">{label}</span>
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
    />
  );
}
