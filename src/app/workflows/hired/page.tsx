import type { Metadata } from "next";
import Link from "next/link";
import CopyPromptBlock from "@/components/CopyPromptBlock";
import { HIRED_PROMPT } from "@/lib/hiredPrompt";

export const metadata: Metadata = {
  title: "The Funding Scout — Dan Diggas",
  description:
    "The workflow from my video: an AI that finds companies that just raised money and drafts your outreach before the jobs are even posted. Works with free ChatGPT.",
};

const levels = [
  {
    title: "Level 1: run it by hand. Works for everyone, free.",
    body: "You need any AI chatbot that can search the web: free ChatGPT, Gemini, Copilot or Perplexity all can. Paste the prompt below with your details each morning with your coffee. Takes about 2 minutes of your time.",
  },
  {
    title: "Level 2: make it automatic.",
    body: "ChatGPT has scheduled tasks and Gemini has scheduled actions. Set the prompt to run every weekday morning and the report comes to you. This is the closest to what the video shows without touching code.",
  },
  {
    title: "Level 3: what I actually run. For developers.",
    body: "An AI agent (I use a coding agent with terminal access) on a cron schedule, weekday mornings, that sweeps the news, drafts the emails and sends the report to my phone. If the words cron and agent harness mean something to you, you can rebuild this in an evening from the prompt below.",
  },
];

const rules = [
  {
    title: "Click the source link before you send anything.",
    body: "AI can hallucinate a funding round. Every raise in the report comes with a link. Open it. If there is no link or the link does not check out, bin it.",
  },
  {
    title: "Quality over volume. 0 to 2 companies a day.",
    body: "Some days there is nothing and the right answer is nothing. One specific email to the right person beats twenty sprayed ones.",
  },
  {
    title: "You send, not the AI.",
    body: "The workflow drafts. You read, edit and send from your own email or LinkedIn. Automated sending under your name is how you burn your reputation with the exact companies you want.",
  },
];

const details = [
  {
    title: "The industry and role you want.",
    body: 'Be specific: "backend engineering at AI startups", "marketing at consumer brands", "finance roles in fintech". This works for any industry, not just tech.',
  },
  {
    title: "Your location and what you will accept.",
    body: "City, remote, hybrid. The scout uses this to filter.",
  },
  {
    title: "Your 2 or 3 strongest credentials.",
    body: "With real numbers where you have them. These get woven into the outreach email so it sounds like you, not a template.",
  },
  {
    title: "Companies you have already applied to.",
    body: "So the scout never suggests a company where you are already in the pipeline.",
  },
];

export default function HiredKitPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <p className="text-sm font-mono uppercase tracking-widest text-amber-700 dark:text-amber-400">
        Workflows
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">
        The Funding Scout
      </h1>
      <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300">
        You commented &ldquo;hired&rdquo; on my video. Here it is.
      </p>

      <div className="mt-8 space-y-5 text-neutral-800 dark:text-neutral-200 leading-relaxed">
        <p>
          The idea from the video: when a company raises money, they hire.
          Nine times out of ten the jobs follow the funding. So instead of
          refreshing job boards with everyone else, this workflow checks the
          funding news every morning, finds companies in your industry that
          just raised, works out who to contact, and drafts the outreach email
          for you. You get there before the job post exists.
        </p>
      </div>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">
        What you need to run this
      </h2>
      <p className="mt-3 text-neutral-600 dark:text-neutral-400">
        The version in the video runs on my own agent setup. You do not need
        that. There are three levels:
      </p>
      <ol className="mt-5 space-y-4">
        {levels.map((item, i) => (
          <li key={item.title} className="flex gap-4">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950 text-sm font-semibold text-amber-800 dark:text-amber-400">
              {i + 1}
            </span>
            <div>
              <span className="font-semibold">{item.title}</span>{" "}
              <span className="text-neutral-600 dark:text-neutral-400">
                {item.body}
              </span>
            </div>
          </li>
        ))}
      </ol>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">
        Before you paste it: know your 4 details
      </h2>
      <p className="mt-3 text-neutral-600 dark:text-neutral-400">
        The prompt ends with four blanks. The scout is only as sharp as what
        you put in them:
      </p>
      <ol className="mt-5 space-y-4">
        {details.map((item, i) => (
          <li key={item.title} className="flex gap-4">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950 text-sm font-semibold text-amber-800 dark:text-amber-400">
              {i + 1}
            </span>
            <div>
              <span className="font-semibold">{item.title}</span>{" "}
              <span className="text-neutral-600 dark:text-neutral-400">
                {item.body}
              </span>
            </div>
          </li>
        ))}
      </ol>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">The prompt</h2>
      <p className="mt-3 mb-5 text-neutral-600 dark:text-neutral-400">
        Paste this into your AI (one with web search turned on), fill in the
        four blanks at the bottom, and run it each weekday morning. Or set it
        as a scheduled task and let it come to you.
      </p>
      <CopyPromptBlock text={HIRED_PROMPT} />

      <h2 className="mt-12 text-xl font-semibold tracking-tight">
        Three rules that keep this from backfiring
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
          . This is the same workflow I run for myself every weekday morning,
          with my personal details taken out. If it gets you an interview,
          comment on the video and tell me. I want the receipts.
        </p>
      </div>
    </div>
  );
}
