"use client";

import { useEffect, useId, useState } from "react";
import { getNewsletterConfig } from "@/lib/newsletter";
import { LINKS } from "@/lib/links";

const SENT_NOTE = "Opened Buttondown in a new tab. Confirm your address there and you are in.";

/**
 * The email sign-up. A plain HTML form posting to Buttondown in a new tab
 * (Buttondown needs a real form submit so it can show its own confirm or
 * CAPTCHA page). It never calls Buttondown from JavaScript, never stores the
 * address, and never claims "subscribed".
 *
 * States: coming soon (no username configured), ready, sent (8s), invalid
 * (the browser's own validation, plus the amber ring).
 */
export function Subscribe({ note, username }: { note: string; username?: string }) {
  const config = getNewsletterConfig(username);
  const id = useId();
  const [sent, setSent] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!sent) return;
    const t = setTimeout(() => setSent(false), 8000);
    return () => clearTimeout(t);
  }, [sent]);

  if (!config.enabled) {
    return (
      <div className="subscribe" data-state="coming-soon">
        <form aria-disabled="true" onSubmit={(e) => e.preventDefault()}>
          <label className="sr-only" htmlFor={id}>Email address</label>
          <input id={id} type="email" name="email" placeholder="you@example.com" disabled aria-disabled="true" />
          <button type="submit" className="btn" disabled aria-disabled="true">Get the next post</button>
        </form>
        <p className="note">
          Email sign-up opens soon. Until then, the <a href={LINKS.rss}>RSS feed</a> carries every post.
        </p>
      </div>
    );
  }

  return (
    <div className="subscribe" data-state={sent ? "sent" : "ready"}>
      <form
        action={config.action}
        method="post"
        target="_blank"
        rel="noopener"
        onSubmit={() => setSent(true)}
      >
        <label className="sr-only" htmlFor={id}>Email address</label>
        <input
          id={id}
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          inputMode="email"
          className={touched ? "touched" : undefined}
          onInvalid={() => setTouched(true)}
          onBlur={() => setTouched(true)}
        />
        <input type="hidden" name="tag" value="tech-site" />
        <button type="submit" className="btn">Get the next post</button>
      </form>
      <p className="note" aria-live="polite">{sent ? SENT_NOTE : note}</p>
    </div>
  );
}
