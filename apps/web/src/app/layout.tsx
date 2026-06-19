import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { SiteHeader } from "@/components/site-header";
import "@uploadthing/react/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Realtor Platform | Buy, sell, and rent premium homes",
  description: "A premium real estate platform for homes, apartments, villas, rentals, and owner leads.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <SiteHeader />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
