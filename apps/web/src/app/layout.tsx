import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Fraunces, Geist } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import "@uploadthing/react/styles.css";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz"]
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Realtor Platform | Buy, sell, and rent premium homes",
  description: "A premium real estate platform for homes, apartments, villas, rentals, and owner leads.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="es" className={`${fraunces.variable} ${geist.variable}`}>
        <body className="font-sans">
          <SiteHeader />
          <div className="pb-20 md:pb-0">{children}</div>
          <MobileBottomNav />
        </body>
      </html>
    </ClerkProvider>
  );
}
