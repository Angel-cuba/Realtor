import Link from "next/link";
import { Building2 } from "lucide-react";
import { getMessages } from "@realtor/i18n";
import { getLocale } from "@/lib/locale";
import { AuthNav } from "@/components/auth-nav";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { MobileMenu } from "@/components/mobile-menu";

export async function SiteHeader() {
  const locale = await getLocale();
  const m = getMessages(locale);

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-[#f8f5ed]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-3 rounded font-semibold tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2" href="/" aria-label="Realtor — ir al inicio">
          <span className="grid h-9 w-9 place-items-center rounded bg-ink text-gold">
            <Building2 size={19} aria-hidden />
          </span>
          <span>Realtor</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-black/70 md:flex">
          <Link className="rounded transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2" href="/comprar">{m.nav.buy}</Link>
          <Link className="rounded transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2" href="/rentar">{m.nav.rent}</Link>
          <Link className="rounded transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2" href="/#sell">{m.nav.sell}</Link>
          <Link className="rounded transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2" href="/#market">{m.nav.market}</Link>
          <Link className="rounded transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2" href="/perfil">{m.nav.profile}</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            className="hidden items-center gap-2 rounded border border-black/15 px-4 py-2 text-sm font-medium transition-colors hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 md:flex"
            href="/#sell"
          >
            {m.nav.listProperty}
          </Link>
          <LocaleSwitcher />
          <AuthNav />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
