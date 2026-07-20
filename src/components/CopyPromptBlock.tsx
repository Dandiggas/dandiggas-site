"use client";

import { useState } from "react";

export default function CopyPromptBlock({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Selection fallback: clipboard API can be unavailable in embedded browsers
      const selection = window.getSelection();
      const pre = document.getElementById("hired-prompt");
      if (selection && pre) {
        const range = document.createRange();
        range.selectNodeContents(pre);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={copy}
        className="absolute right-3 top-3 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:border-amber-500 hover:text-amber-700 dark:hover:text-amber-400 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        {copied ? "Copied ✓" : "Copy prompt"}
      </button>
      <pre
        id="hired-prompt"
        className="whitespace-pre-wrap rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-4 pt-14 sm:pt-4 sm:pr-32 text-[13px] leading-relaxed font-mono text-neutral-800 dark:text-neutral-200 overflow-x-auto"
      >
        {text}
      </pre>
    </div>
  );
}
