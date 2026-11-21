"use client";

import { useEffect, useRef } from "react";

const fmt = (n: number, prefix = "", suffix = "") => prefix + Math.round(n).toLocaleString("en-GB") + suffix;

/**
 * A number that counts up from 0 when it scrolls into view. The server renders
 * the final number, so without JavaScript, or with reduce motion on, the
 * reader sees the real value at once. Screen readers get the final value from
 * aria-label; the animating text is aria-hidden.
 */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  className,
  duration = 1100,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const final = fmt(value, prefix, suffix);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    let raf = 0;
    const run = () => {
      let t0: number | null = null;
      const tick = (t: number) => {
        if (t0 === null) t0 = t;
        const p = Math.min(1, (t - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = p < 1 ? fmt(value * eased, prefix, suffix) : final;
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      el.textContent = fmt(0, prefix, suffix);
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          run();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.textContent = final;
    };
  }, [value, prefix, suffix, duration, final]);

  return (
    <b className={className} aria-label={final} data-final={final}>
      <span ref={ref} aria-hidden="true">
        {final}
      </span>
    </b>
  );
}
