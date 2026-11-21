import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FEED_ALTERNATES } from "@/lib/links";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tech.dandiggas.com"),
  title: "Dan Diggas — Engineer & Musician",
  description:
    "Daniel Adekugbe (Dan Diggas): backend and AI engineer, session musician and tool builder. Building things that remove friction.",
  alternates: { types: FEED_ALTERNATES },
  twitter: { card: "summary_large_image", site: "@Dandiggastech" },
};

// Runs before first paint. Only `html.js` CSS rules hide anything, so a
// visitor without JavaScript sees the whole page.
const JS_FLAG = `document.documentElement.classList.add("js")`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
        {/* Vercel Web Analytics: pageviews and referrers, site wide. */}
        <Analytics />
      </body>
    </html>
  );
}
