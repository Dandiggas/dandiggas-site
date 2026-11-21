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
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;
    if (!("IntersectionObserver" in window)) return;

    let raf = 0;
    const settle = () => {
      cancelAnimationFrame(raf);
      el.textContent = final;
    };
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
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        // Checked again here: the reader may have turned "reduce motion" on
        // after the page loaded. Then the number just shows, with no count.
        if (reduce.matches) settle();
        else run();
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    io.observe(el);
    // "Reduce motion" switched on mid-session: stop any count in flight and
    // never start one.
    const onChange = () => {
      if (!reduce.matches) return;
      io.disconnect();
      settle();
    };
    reduce.addEventListener("change", onChange);
    return () => {
      io.disconnect();
      reduce.removeEventListener("change", onChange);
      settle();
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
