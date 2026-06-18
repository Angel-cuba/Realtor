import Link from "next/link";
import { Building2, Menu } from "lucide-react";
import { AuthNav } from "@/components/auth-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-[#f8f5ed]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-3 font-semibold tracking-wide" href="/">
          <span className="grid h-9 w-9 place-items-center rounded bg-ink text-gold">
            <Building2 size={19} aria-hidden />
          </span>
          <span>Realtor</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-black/70 md:flex">
          <Link href="/comprar">Comprar</Link>
          <Link href="/rentar">Rentar</Link>
          <Link href="/#sell">Vender</Link>
          <Link href="/#market">Mercado</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            className="hidden items-center gap-2 rounded border border-black/15 px-4 py-2 text-sm font-medium md:flex"
            href="/#sell"
          >
            Publicar propiedad
          </Link>
          <AuthNav />
          <button className="grid h-10 w-10 place-items-center rounded border border-black/15 md:hidden" type="button">
            <Menu size={18} aria-label="Menu" />
          </button>
        </div>
      </div>
    </header>
  );
}
