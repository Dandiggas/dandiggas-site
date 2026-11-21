"use client";

import { useEffect, useState } from "react";

type CopyState = "idle" | "copied" | "failed";

const LABEL: Record<CopyState, string> = {
  idle: "Copy link",
  copied: "Copied",
  failed: "Copy failed",
};

/**
 * Copies `text` to the clipboard. Resolves true only after the browser
 * confirms the write; false when the clipboard is missing (an old browser,
 * a page not served over https) or the write is refused (permission denied).
 */
export async function copyText(text: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** Copy link, LinkedIn, X. Share URLs are built from the canonical post URL. */
export function ShareLinks({ url, title }: { url: string; title: string }) {
  const [state, setState] = useState<CopyState>("idle");
  useEffect(() => {
    if (state === "idle") return;
    const t = setTimeout(() => setState("idle"), state === "copied" ? 1200 : 2400);
    return () => clearTimeout(t);
  }, [state]);

  const u = encodeURIComponent(url);
  return (
    <div className="share" aria-label="Share">
      <button
        type="button"
        data-state={state}
        aria-live="polite"
        onClick={async () => {
          setState((await copyText(window.location.href)) ? "copied" : "failed");
        }}
      >
        {LABEL[state]}
      </button>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`} target="_blank" rel="noopener noreferrer">
        LinkedIn
      </a>
      <a href={`https://x.com/intent/post?url=${u}&text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer">
        X
      </a>
    </div>
  );
}
