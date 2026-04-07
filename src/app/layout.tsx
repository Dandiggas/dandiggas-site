import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
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
  title: "Dan Diggas — Engineer & Musician",
  description:
    "Daniel Adekugbe — backend engineer at Sophos, session musician, and tool builder. Building things that remove friction.",
};

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
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-neutral-200 dark:border-neutral-800">
            <div className="max-w-2xl mx-auto px-6 py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
              © {new Date().getFullYear()} Dan Diggas
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
