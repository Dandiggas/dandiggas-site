"use client";

import { useEffect, useState } from "react";
import type { OutlineItem } from "@/lib/markdown";

/**
 * "In this post": the H2s, with the section you are reading marked
 * (aria-current, strong text, amber dot). The current section is the last
 * heading above the top of the reading area (scrollY + 140). It is state, so
 * it also works under reduce motion.
 */
export function Outline({ items }: { items: OutlineItem[] }) {
  const [current, setCurrent] = useState(items[0]?.id);

  useEffect(() => {
    const heads = items.map((it) => document.getElementById(it.id)).filter((h): h is HTMLElement => Boolean(h));
    if (!heads.length) return;
    let ticking = false;
    const pick = () => {
      ticking = false;
      const top = window.scrollY + 140;
      let on = heads[0];
      for (const h of heads) if (h.getBoundingClientRect().top + window.scrollY <= top) on = h;
      setCurrent(on.id);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(pick);
      }
    };
    const io = "IntersectionObserver" in window ? new IntersectionObserver(onScroll, { rootMargin: "-30% 0px -60% 0px" }) : null;
    heads.forEach((h) => io?.observe(h));
    window.addEventListener("scroll", onScroll, { passive: true });
    pick();
    return () => {
      io?.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [items]);

  if (!items.length) return null;
  return (
    <nav className="post-outline" aria-label="In this post">
      <h4>In this post</h4>
      <ol>
        {items.map((it) => {
          const on = it.id === current;
          return (
            <li key={it.id} className={on ? "on" : undefined}>
              <a href={`#${it.id}`} aria-current={on ? "true" : undefined}>
                {it.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
