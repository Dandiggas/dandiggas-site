import type { Metadata } from "next";
import Image from "next/image";
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
        <Image
          src="/profile.jpeg"
          alt="Daniel Adekugbe"
          width={96}
          height={96}
          className="w-24 h-24 rounded-full object-cover shrink-0"
          priority
        />
        <div>
          <h2 className="text-xl font-semibold">Daniel Adekugbe</h2>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            a.k.a. Dan Diggas
          </p>
        </div>
      </div>
      <div className="space-y-4 text-neutral-700 dark:text-neutral-300 leading-relaxed">
        <p>
          I&apos;m a software engineer at Sophos working on threat intelligence
          infrastructure. I&apos;m also a professional session musician and producer.
        </p>
        <p>
          I build tools across music, security, and AI. Mostly things that
          remove friction from creative and engineering workflows.
        </p>
        <p>
          Based in London.
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
