import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Keyboard Manual Assistant — Dan Diggas",
  description:
    "A grounded RAG system for answering keyboard manual questions with citations, refusals, evals, and Langfuse observability.",
};

const stack = [
  ["FastAPI", "Backend API for PDF upload, retrieval, answer generation, and streaming responses."],
  ["Qdrant", "Vector database for storing and retrieving embedded manual chunks."],
  ["sentence-transformers", "Local embedding model for turning questions and manual chunks into vectors."],
  ["LocalAI + Llama 3.1 8B", "Local answer generation without relying on a hosted model for every request."],
  ["Langfuse", "Tracing for retrieval, generation, token usage, latency, and debugging failed answers."],
  ["Docker Compose", "Portable local stack for the API, embedding service, vector DB, LLM, and frontend."],
];

const productionSignals = [
  "Grounded answers constrained to retrieved manual excerpts rather than general model knowledge.",
  "Refusal behaviour for questions the manual does not answer.",
  "Eval harness with positive cases and refusal cases so changes can be measured instead of guessed.",
  "Langfuse traces showing retrieved chunks, generation inputs, timings, and token usage.",
  "Failure categorisation for retrieval misses, wrong-document retrieval, LLM timeouts, and weak answers.",
];

export default function KeyboardManualAssistantPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Link
        href="/projects"
        className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
      >
        ← Back to projects
      </Link>

      <article className="mt-8">
        <header className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-3">
            Flagship project
          </p>
          <h1 className="text-3xl font-bold tracking-tight">
            Keyboard Manual Assistant
          </h1>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
            A grounded RAG system that answers questions about keyboard
            synthesizer manuals using retrieved evidence, refusal behaviour,
            evals, and Langfuse observability.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/posts/building-keyboard-manual-rag"
              className="text-sm font-medium text-amber-700 dark:text-amber-400 hover:underline"
            >
              Read write-up
            </Link>
            <Link
              href="https://www.loom.com/share/d0b6df37b0514febab2706f1488a3a84"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-amber-700 dark:text-amber-400 hover:underline"
            >
              Watch demo ↗
            </Link>
            <Link
              href="https://github.com/Dandiggas/keyboard-manual-assistant"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-amber-700 dark:text-amber-400 hover:underline"
            >
              GitHub ↗
            </Link>
          </div>
        </header>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">Problem</h2>
          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
            Professional keyboard players often request a specific board for a
            gig and arrive to find something different on stage. The manual may
            be hundreds of pages long, but the player has minutes to answer
            practical questions: how to split the keyboard, layer sounds, save a
            performance, or change controller behaviour.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">Why it matters in real gigs</h2>
          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
            This comes from lived experience, not a synthetic demo. If you have
            twenty minutes of soundcheck, generic search results are too slow
            and generic LLM answers are too risky. The assistant needs to answer
            from the official manual, show enough context to trust the answer,
            and refuse when the manual does not support the question.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">Architecture</h2>
          <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-4 overflow-x-auto">
            <pre className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
{`Manual PDF upload
    ↓
Extract text and split into chunks
    ↓
Embed chunks with sentence-transformers
    ↓
Store vectors in Qdrant
    ↓
User asks a question
    ↓
Embed question and retrieve top matching chunks
    ↓
Build constrained prompt from retrieved manual excerpts
    ↓
Generate answer with Llama 3.1 via LocalAI
    ↓
Trace retrieval, prompt, answer, timings, and failures in Langfuse`}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">Stack</h2>
          <div className="grid gap-3">
            {stack.map(([name, description]) => (
              <div
                key={name}
                className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-4"
              >
                <h3 className="font-semibold">{name}</h3>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">
            What makes it production-minded
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-neutral-700 dark:text-neutral-300 leading-relaxed">
            {productionSignals.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">Demo</h2>
          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
            The demo shows PDF upload, manual-grounded answers, Langfuse traces,
            retrieved chunks, and an example of where the system needs tighter
            evaluation.
          </p>
          <p className="mt-3">
            <Link
              href="https://www.loom.com/share/d0b6df37b0514febab2706f1488a3a84"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-amber-700 dark:text-amber-400 hover:underline"
            >
              Watch the Loom demo ↗
            </Link>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">Code</h2>
          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
            The source includes the FastAPI backend, embedding service, frontend,
            Docker Compose setup, Langfuse tracing, and a basic eval harness.
          </p>
          <p className="mt-3">
            <Link
              href="https://github.com/Dandiggas/keyboard-manual-assistant"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-amber-700 dark:text-amber-400 hover:underline"
            >
              View on GitHub ↗
            </Link>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Next steps</h2>
          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
            The next useful version would run in the cloud on demand, keep the
            manual index updated from trusted manufacturer sources, and expand
            the eval set across more keyboards and failure cases.
          </p>
        </section>
      </article>
    </div>
  );
}
