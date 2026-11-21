"use client";

import { useEffect, useState } from "react";

/** Copy link, LinkedIn, X. Share URLs are built from the canonical post URL. */
export function ShareLinks({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1200);
    return () => clearTimeout(t);
  }, [copied]);

  const u = encodeURIComponent(url);
  return (
    <div className="share" aria-label="Share">
      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(window.location.href).catch(() => {});
          setCopied(true);
        }}
      >
        {copied ? "Copied" : "Copy link"}
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
