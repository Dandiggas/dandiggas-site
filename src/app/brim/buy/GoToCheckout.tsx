"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";
import { CHECKOUT_URL } from "../checkout";

// Gives the analytics beacon a moment to leave, then hands over to checkout.
// track() is ignored on the Hobby plan and starts counting on Pro, so the
// pageview of this path is the number that always exists.
const HANDOVER_MS = 250;

export function GoToCheckout() {
  useEffect(() => {
    const from = new URLSearchParams(window.location.search).get("from") ?? "";
    track("buy_click", { from });
    const timer = window.setTimeout(() => {
      window.location.replace(CHECKOUT_URL);
    }, HANDOVER_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="brim-root mx-auto max-w-6xl px-6 py-24">
      <p className="text-2xl">Taking you to checkout.</p>
      <p className="brim-muted mt-4">
        If nothing happens,{" "}
        <a href={CHECKOUT_URL} className="brim-link">
          continue to Lemon Squeezy
        </a>
        .
      </p>
    </div>
  );
}
