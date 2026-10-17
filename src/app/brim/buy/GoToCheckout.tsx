"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

// The analytics script loads deferred and sets window.vai once it has run and
// sent the pageview. Leaving before that loses the count, so wait for it,
// give the beacon a moment, then hand over. Never wait longer than the cap.
const GRACE_MS = 150;
const CAP_MS = 1500;
const POLL_MS = 50;

declare global {
  interface Window {
    vai?: boolean;
  }
}

type Props = {
  url: string;
  event: "buy_click" | "trial_click";
  heading: string;
};

export function GoToCheckout({ url, event, heading }: Props) {
  useEffect(() => {
    const from = new URLSearchParams(window.location.search).get("from") ?? "";
    // Ignored on the Hobby plan; starts counting on Pro.
    track(event, { from });

    const go = () => window.location.replace(url);
    const started = Date.now();
    const timer = window.setInterval(() => {
      const ran = window.vai === true;
      const late = Date.now() - started >= CAP_MS;
      if (ran || late) {
        window.clearInterval(timer);
        window.setTimeout(go, ran ? GRACE_MS : 0);
      }
    }, POLL_MS);
    return () => window.clearInterval(timer);
  }, [url, event]);

  return (
    <div className="brim-root mx-auto max-w-6xl px-6 py-24">
      <p className="text-2xl">{heading}</p>
      <p className="brim-muted mt-4">
        If nothing happens,{" "}
        <a href={url} className="brim-link">
          continue to Lemon Squeezy
        </a>
        .
      </p>
    </div>
  );
}
