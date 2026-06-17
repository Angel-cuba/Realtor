import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, BarChart3, CalendarDays, Home, KeyRound } from "lucide-react";
import { PropertyCard } from "@/components/property-card";
import { SearchPanel } from "@/components/search-panel";
import { LeadForm } from "@/components/lead-form";
import { getFeaturedListings } from "@/lib/listings";

const metrics = [
  { value: "4.9", label: "client rating" },
  { value: "850+", label: "qualified leads tracked" },
  { value: "$5.8B", label: "portfolio value advised" }
];

export default function HomePage() {
  const featured = getFeaturedListings();

  return (
    <main>
      <section className="relative overflow-hidden bg-linen">
        <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="relative z-10">
            <p className="mb-5 inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-black/55">
              Buy, sell, rent
            </p>
            <h1 className="max-w-3xl text-balance text-5xl font-semibold leading-[0.95] text-ink md:text-7xl">
              Encuentra tu proxima casa con asesores que conocen el mercado.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-black/65">
              Propiedades verificadas, busqueda precisa y seguimiento comercial para compradores, renters y propietarios.
            </p>
            <div className="mt-8">
              <SearchPanel />
            </div>
          </div>

          <div className="relative min-h-[520px] overflow-hidden rounded bg-ink">
            <Image
              src="/images/realtor/const-11.webp"
              alt="Modern premium home interior"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover opacity-85"
            />
            <div className="absolute bottom-5 left-5 right-5 grid gap-4 rounded bg-white/92 p-5 backdrop-blur sm:grid-cols-3">
              {metrics.map((metric) => (
                <div key={metric.label}>
                  <p className="text-3xl font-semibold">{metric.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-black/45">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Featured properties</p>
              <h2 className="mt-3 max-w-2xl text-4xl font-semibold leading-tight">Casas, pisos y villas listas para visitas serias.</h2>
            </div>
            <Link className="inline-flex items-center gap-2 rounded bg-ink px-5 py-3 font-semibold text-white" href="/comprar">
              Ver propiedades
              <ArrowRight size={17} aria-hidden />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {featured.map((listing) => (
              <PropertyCard listing={listing} key={listing.slug} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Operating model</p>
            <h2 className="mt-3 text-4xl font-semibold leading-tight">Un sistema comercial para no perder oportunidades.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { icon: Home, title: "Inventory verified", text: "Listings con estado, fotos, precio, disponibilidad y agente responsable." },
              { icon: KeyRound, title: "Buyer intent", text: "Favoritos, busquedas y visitas alimentan prioridad comercial." },
              { icon: CalendarDays, title: "Tours pipeline", text: "Solicitudes, agenda y seguimiento para acelerar decisiones." },
              { icon: BarChart3, title: "Market clarity", text: "Paginas locales y datos para vender con pricing realista." }
            ].map((item) => (
              <div className="rounded border border-white/10 bg-white/[0.04] p-5" key={item.title}>
                <item.icon className="text-gold" size={24} aria-hidden />
                <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/60">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-linen py-16" id="sell">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8">
          <div className="relative min-h-[420px] overflow-hidden rounded">
            <Image
              src="/images/realtor/const-1.webp"
              alt="Premium residential property"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">For owners</p>
            <h2 className="mt-3 text-4xl font-semibold leading-tight">Vende o renta con una estrategia que mide demanda real.</h2>
            <p className="mt-5 text-lg leading-8 text-black/65">
              Captamos propietarios con valoracion, fotos, pipeline de leads, feedback de visitas y reporting para tomar decisiones a tiempo.
            </p>
            <div className="mt-7 grid gap-3 text-sm text-black/70">
              {["Pricing realista", "Marketing de listing", "Seguimiento de visitas", "Panel de propietario"].map((item) => (
                <span className="inline-flex items-center gap-2" key={item}>
                  <BadgeCheck size={17} className="text-moss" aria-hidden />
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-8">
              <LeadForm intent="sell" compact />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16" id="market">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded bg-ink p-8 text-white md:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Market focus</p>
            <h2 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight">
              El producto nace para un mercado con compradores sensibles a precio y vendedores que necesitan precision.
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {["SEO local por ciudad y barrio", "Lead scoring por intencion", "Comparacion compra vs renta"].map((item) => (
                <div className="rounded border border-white/10 p-5" key={item}>
                  <p className="font-semibold">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
