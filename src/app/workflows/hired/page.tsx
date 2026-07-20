import type { Metadata } from "next";
import Link from "next/link";
import CopyPromptBlock from "@/components/CopyPromptBlock";
import { HIRED_PROMPT } from "@/lib/hiredPrompt";

export const metadata: Metadata = {
  title: "The Get Hired Kit — Dan Diggas",
  description:
    "The job application method from my video as one paste-in prompt. Works with free ChatGPT, Claude or Gemini. No signup.",
};

const gatherList = [
  {
    title: "Your CV as plain text.",
    body: "All of it, not just the first page. Copy it out of the PDF.",
  },
  {
    title: "2 or 3 recent wins that are NOT on your CV yet.",
    body: "The CV is always behind reality. A project you finished last month, a number you moved, a thing you fixed. This is what makes your answers sound current instead of recycled.",
  },
  {
    title: "The full job description.",
    body: 'Copy the whole thing, including the "you might not be a fit if" section and any application tips. Those sections matter most.',
  },
  {
    title: "Anything you know about the company.",
    body: "Recent news, their product, funding, blog posts. If your AI can browse the web, it will do this for you. If not, 5 minutes of Googling and paste what you find.",
  },
  {
    title: "The actual application questions, word for word.",
    body: "",
  },
];

const rules = [
  {
    title: "Never skip the pain point step.",
    body: "Answering only what the JD literally asks is what everyone else does. The inferred pains are where you stand out.",
  },
  {
    title: "One application at a time. Never reuse answers.",
    body: "Recruiters can smell a recycled answer. The whole point of this method is fresh evidence aimed at this company's specific problems.",
  },
  {
    title: "You submit, not the AI.",
    body: "Read every word before it goes anywhere. The AI drafts, you decide. That rule is why this works and auto apply tools get people blacklisted.",
  },
];

export default function HiredKitPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <p className="text-sm font-mono uppercase tracking-widest text-amber-700 dark:text-amber-400">
        Workflows
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">
        The Get Hired Kit
      </h1>
      <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300">
        You commented &ldquo;hired&rdquo; on my video. Here it is.
      </p>

      <div className="mt-8 space-y-5 text-neutral-800 dark:text-neutral-200 leading-relaxed">
        <p>
          I use an AI setup that answers job applications in my voice, using my
          real evidence, aimed at what the company actually cares about. This
          page gives you the same method as one prompt you can paste into any
          AI: free ChatGPT, Claude, Gemini, whatever you have. No special tools
          needed.
        </p>
      </div>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">
        Before you paste anything: gather these 5 things
      </h2>
      <p className="mt-3 text-neutral-600 dark:text-neutral-400">
        The AI is only as good as what you feed it. Spend 10 minutes collecting:
      </p>
      <ol className="mt-5 space-y-4">
        {gatherList.map((item, i) => (
          <li key={item.title} className="flex gap-4">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950 text-sm font-semibold text-amber-800 dark:text-amber-400">
              {i + 1}
            </span>
            <div>
              <span className="font-semibold">{item.title}</span>{" "}
              {item.body && (
                <span className="text-neutral-600 dark:text-neutral-400">
                  {item.body}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">The prompt</h2>
      <p className="mt-3 mb-5 text-neutral-600 dark:text-neutral-400">
        Paste this into your AI, then paste your 5 things underneath it.
      </p>
      <CopyPromptBlock text={HIRED_PROMPT} />

      <h2 className="mt-12 text-xl font-semibold tracking-tight">
        Three rules that make this actually work
      </h2>
      <ol className="mt-5 space-y-4">
        {rules.map((rule, i) => (
          <li key={rule.title} className="flex gap-4">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950 text-sm font-semibold text-amber-800 dark:text-amber-400">
              {i + 1}
            </span>
            <div>
              <span className="font-semibold">{rule.title}</span>{" "}
              <span className="text-neutral-600 dark:text-neutral-400">
                {rule.body}
              </span>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-12 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5">
        <h2 className="text-lg font-semibold tracking-tight">Who made this</h2>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400 leading-relaxed">
          I&rsquo;m Dan. Backend engineer working in threat intelligence,
          building AI agent systems on the side and writing about what actually
          works at{" "}
          <Link
            href="/tech"
            className="text-amber-700 dark:text-amber-400 underline hover:no-underline"
          >
            tech.dandiggas.com
          </Link>
          . This kit is the generalised version of the setup from the video. If
          it gets you an interview, comment on the video and tell me. I want
          the receipts.
        </p>
      </div>
    </div>
  );
}
