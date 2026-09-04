import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {
  about,
  event,
  googleSiteVerification,
  siteUrl,
} from "@/config/event";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const description = `${event.theme}. An independently organized TEDx event at ${event.venue.short} on ${event.dateLabel}. ${about.ourEvent.slice(0, 110)}...`;

export const metadata: Metadata = {
  /** Makes every relative URL in the tags below absolute. */
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  // Omitted entirely until the token is filled in, so no empty tag is written.
  ...(googleSiteVerification
    ? { verification: { google: googleSiteVerification } }
    : {}),
  title: {
    default: `${event.name}: ${event.theme}`,
    template: `%s | ${event.name}`,
  },
  description,
  keywords: [
    "TEDxMIST",
    "TEDx",
    "MIST",
    "Military Institute of Science and Technology",
    "Dhaka",
    "Bangladesh",
    event.theme,
  ],
  openGraph: {
    title: `${event.name}: ${event.theme}`,
    description,
    type: "website",
    locale: "en_US",
    siteName: event.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${event.name}: ${event.theme}`,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      {/* `grain` lays a faint static texture over the whole page. */}
      <body className="grain">{children}</body>
    </html>
  );
}
