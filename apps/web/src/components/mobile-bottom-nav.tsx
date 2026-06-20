import Link from "next/link";
import { Building2, Home, Search, UserRound } from "lucide-react";

const items = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/comprar", label: "Comprar", icon: Search },
  { href: "/rentar", label: "Rentar", icon: Building2 },
  { href: "/perfil", label: "Perfil", icon: UserRound }
];

export function MobileBottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 text-white shadow-soft md:hidden" aria-label="Navegacion movil">
      <div className="grid grid-cols-4 gap-1">
        {items.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href} className="grid justify-items-center gap-1 rounded px-2 py-2 text-[11px] font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
            <Icon size={18} aria-hidden />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
