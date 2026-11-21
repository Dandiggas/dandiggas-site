"use client";

import { createElement, useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Adds the `in` class once the element scrolls into view. The hiding lives in
 * CSS (globals.css, "Motion system"): only `html.js .reveal` under
 * prefers-reduced-motion: no-preference is hidden. So the server output, a
 * visitor without JavaScript and a visitor with reduce motion on all see the
 * element straight away.
 *
 * `i` is the stagger index (70ms per step). `delay` is the older seconds
 * prop the music page uses; it is turned into the same index.
 */
export function Reveal({
  children,
  as = "div",
  className,
  i,
  delay,
  variant,
  style,
  ...rest
}: {
  children: ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  i?: number;
  delay?: number;
  variant?: "from-left" | "from-right" | "pop";
  style?: CSSProperties;
} & Partial<Record<`data-${string}` | `aria-${string}` | "id" | "href", string>>) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const index = i ?? (delay ? Math.round(delay / 0.07) : undefined);
  const cls = ["reveal", variant, className].filter(Boolean).join(" ");
  const st = index !== undefined ? ({ ...style, ["--i" as string]: index } as CSSProperties) : style;
  return createElement(as, { ref, className: cls, style: st, ...rest }, children);
}
