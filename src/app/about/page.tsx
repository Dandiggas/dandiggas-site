import type { Metadata } from "next";
import { SocialLinks } from "@/components/SocialLinks";

export const metadata: Metadata = {
  title: "About — Dan Diggas",
  description: "About Daniel Adekugbe — engineer, musician, tool builder.",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold tracking-tight mb-8">About</h1>
      <div className="flex items-start gap-6 mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-3xl font-bold shrink-0">
          DD
        </div>
        <div>
          <h2 className="text-xl font-semibold">Daniel Adekugbe</h2>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            a.k.a. Dan Diggas
          </p>
        </div>
      </div>
      <div className="space-y-4 text-neutral-700 dark:text-neutral-300 leading-relaxed">
        <p>
          15 years as a professional session musician and producer. Central Cee,
          Mahalia, Wireless Festival, Akai. Now a backend and platform engineer
          at Sophos, building threat intelligence infrastructure.
        </p>
        <p>
          I make tools for musicians and engineers. Things that remove friction
          and let you focus on the work that matters.
        </p>
      </div>
      <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-800">
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
          Find me elsewhere
        </p>
        <SocialLinks />
      </div>
    </div>
  );
}
