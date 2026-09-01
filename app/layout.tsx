import type { Metadata } from "next";
import { Cormorant_Garamond, Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/shared/Footer";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Encoreats — Experiences Worth Showing Up For",
  description: "A curated cultural experience platform connecting discerning individuals with exclusive culinary tables, analogue listening rooms, secret rooftop stargazing, and private gallery salons.",
  keywords: ["luxury experiences", "private dining", "curated events", "listening bar", "exclusive pop-ups", "chef table"],
  openGraph: {
    title: "Encoreats — Experiences Worth Showing Up For",
    description: "Curated cultural experiences, secret dining tables, and intimate gatherings.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${geistSans.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-obsidian text-warm-ivory selection:bg-champagne selection:text-obsidian bg-noise">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
