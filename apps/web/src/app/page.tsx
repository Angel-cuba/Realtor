import Link from "next/link";
import { ArrowRight, BadgeCheck, BarChart3, CalendarDays, Home, KeyRound } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { getMessages } from "@realtor/i18n";
import { PropertyCard } from "@/components/property-card";
import { PropertyImage } from "@/components/property-image";
import { SearchPanel } from "@/components/search-panel";
import { LeadForm } from "@/components/lead-form";
import { getLocale } from "@/lib/locale";
import { getFeaturedListings, getSavedListingIds } from "@/lib/listings";
import { propertyTypeLabel } from "@realtor/domain";

const metricValues = ["4.9", "850+", "$5.8B"];

export default async function HomePage() {
  const [featured, locale, { userId }] = await Promise.all([getFeaturedListings(), getLocale(), auth()]);
  const savedIds = await getSavedListingIds(userId);
  const m = getMessages(locale);
  const heroListing = featured[0];
  const ownerListing = featured[1] ?? featured[0];

  const metrics = [
    { value: metricValues[0], label: m.pages.homeMetric1 },
    { value: metricValues[1], label: m.pages.homeMetric2 },
    { value: metricValues[2], label: m.pages.homeMetric3 }
  ];

  const operatingCards = [
    { icon: Home, title: m.pages.homeOperatingCard1Title, text: m.pages.homeOperatingCard1Text },
    { icon: KeyRound, title: m.pages.homeOperatingCard2Title, text: m.pages.homeOperatingCard2Text },
    { icon: CalendarDays, title: m.pages.homeOperatingCard3Title, text: m.pages.homeOperatingCard3Text },
    { icon: BarChart3, title: m.pages.homeOperatingCard4Title, text: m.pages.homeOperatingCard4Text }
  ];

  const ownerBullets = [
    m.pages.homeOwnersBullet1,
    m.pages.homeOwnersBullet2,
    m.pages.homeOwnersBullet3,
    m.pages.homeOwnersBullet4
  ];

  const marketBullets = [
    m.pages.homeMarketBullet1,
    m.pages.homeMarketBullet2,
    m.pages.homeMarketBullet3
  ];

  return (
    <main>
      <section className="relative overflow-hidden bg-linen">
        <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="relative z-10">
            <p className="mb-5 inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-black/55">
              {m.pages.homeHeroBadge}
            </p>
            <h1 className="max-w-3xl text-balance font-display text-5xl font-medium leading-[0.95] tracking-tight text-ink md:text-7xl">
              {m.pages.homeHeroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-black/65">
              {m.pages.homeHeroCopy}
            </p>
            <div className="mt-8">
              <SearchPanel />
            </div>
          </div>

          <div className="relative min-h-[520px] overflow-hidden rounded bg-ink">
            {heroListing && (
              <PropertyImage
                src={heroListing.image}
                alt={heroListing.title}
                label={propertyTypeLabel(heroListing.propertyType)}
                priority
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover"
              />
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" aria-hidden />
            {heroListing && (
              <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-ink backdrop-blur">
                {m.pages.homeFeaturedBadge}
              </div>
            )}
            <div className="absolute bottom-5 left-5 right-5 grid gap-4 rounded bg-white/92 p-5 backdrop-blur sm:grid-cols-3">
              {metrics.map((metric) => (
                <div key={metric.label}>
                  <p className="font-display text-3xl font-medium tracking-tight">{metric.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-black/55">{metric.label}</p>
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
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">{m.pages.homeFeaturedKicker}</p>
              <h2 className="mt-3 max-w-2xl font-display text-4xl font-medium leading-tight tracking-tight">{m.pages.homeFeaturedHeading}</h2>
            </div>
            <Link
              className="inline-flex items-center gap-2 rounded bg-ink px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
              href="/comprar"
            >
              {m.pages.homeViewAll}
              <ArrowRight size={17} aria-hidden />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {featured.map((listing) => (
              <PropertyCard listing={listing} key={listing.slug} messages={m} isSaved={savedIds.has(listing.id)} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">{m.pages.homeOperatingKicker}</p>
            <h2 className="mt-3 font-display text-4xl font-medium leading-tight tracking-tight">{m.pages.homeOperatingHeading}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {operatingCards.map((item) => (
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
          <div className="relative min-h-[420px] overflow-hidden rounded bg-ink">
            {ownerListing && (
              <PropertyImage
                src={ownerListing.image}
                alt={ownerListing.title}
                label={propertyTypeLabel(ownerListing.propertyType)}
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover"
              />
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-ink/55 via-transparent to-transparent" aria-hidden />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">{m.pages.homeOwnersKicker}</p>
            <h2 className="mt-3 font-display text-4xl font-medium leading-tight tracking-tight">{m.pages.homeOwnersHeading}</h2>
            <p className="mt-5 text-lg leading-8 text-black/65">{m.pages.homeOwnersCopy}</p>
            <div className="mt-7 grid gap-3 text-sm text-black/70">
              {ownerBullets.map((item) => (
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
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">{m.pages.homeMarketKicker}</p>
            <h2 className="mt-3 max-w-3xl font-display text-4xl font-medium leading-tight tracking-tight">
              {m.pages.homeMarketHeading}
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {marketBullets.map((item) => (
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
