"use client";

import { useState } from "react";

/**
 * Filter chips for the ledger. Choosing a theme hides the other theme blocks
 * (`[data-theme]` inside #ledger) and fades the chosen one in. It is the
 * visitor's own click, so it works the same under reduce motion.
 */
export function ThemeFilter({ themes, total }: { themes: { key: string; chip: string }[]; total: number }) {
  const [chosen, setChosen] = useState("all");

  const choose = (key: string) => {
    setChosen(key);
    document.querySelectorAll<HTMLElement>("#ledger .theme-block[data-theme]").forEach((el) => {
      const show = key === "all" || el.dataset.theme === key;
      el.dataset.hidden = show ? "false" : "true";
      el.dataset.shown = "false";
      if (show) {
        // Restart the fade on the blocks that stay.
        void el.offsetWidth;
        el.dataset.shown = "true";
      }
    });
  };

  const chips = [{ key: "all", chip: `All ${total}` }, ...themes];
  return (
    <div className="chips" role="group" aria-label="Filter by theme">
      {chips.map((t) => (
        <button key={t.key} type="button" className="chip" aria-pressed={chosen === t.key} onClick={() => choose(t.key)}>
          {t.chip}
        </button>
      ))}
    </div>
  );
}
