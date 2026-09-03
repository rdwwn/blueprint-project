import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { OPPORTUNITIES } from "@/data/opportunities";
import { FindYourPath } from "@/components/find-your-path";

const DISPLAY_COUNT = `${Math.floor(OPPORTUNITIES.length / 100) * 100}+`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://theblueprintproject.vercel.app"),
  title: {
    default: "The Blueprint Project",
    template: "%s · The Blueprint Project",
  },
  description:
    "Discover, track, and win internships, scholarships, and competitions built for high school students.",
  openGraph: {
    title: "The Blueprint Project",
    description:
      `${DISPLAY_COUNT} free internships, scholarships & competitions for high school students, verified by hand.`,
    url: "https://theblueprintproject.vercel.app",
    siteName: "The Blueprint Project",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Blueprint Project",
    description:
      `${DISPLAY_COUNT} free internships, scholarships & competitions for high school students, verified by hand.`,
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/logo-full.png",
    apple: "/logo-full.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Fast path for the image and favicon services used across the site. */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://www.google.com" />
        <link rel="dns-prefetch" href="https://www.google.com" />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <FindYourPath />
      </body>
    </html>
  );
}
