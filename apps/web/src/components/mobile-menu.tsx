"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/comprar", label: "Comprar" },
  { href: "/rentar", label: "Rentar" },
  { href: "/#sell", label: "Vender" },
  { href: "/#market", label: "Mercado" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
        aria-expanded={open}
        className="grid h-10 w-10 place-items-center rounded border border-black/15 transition-colors hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 md:hidden"
      >
        <Menu size={18} aria-hidden />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Menu de navegacion">
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Cerrar menu"
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
          />
          <div className="absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col gap-8 bg-linen p-6 shadow-soft animate-in slide-in-from-right">
            <div className="flex items-center justify-between">
              <p className="font-display text-2xl font-medium tracking-tight">Menu</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar menu"
                className="grid h-10 w-10 place-items-center rounded border border-black/15 transition-colors hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
              >
                <X size={18} aria-hidden />
              </button>
            </div>

            <nav className="grid gap-1 text-lg">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded px-3 py-3 font-medium transition-colors hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <Link
              href="/#sell"
              onClick={() => setOpen(false)}
              className="mt-auto inline-flex items-center justify-center rounded bg-ink px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
            >
              Publicar propiedad
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
