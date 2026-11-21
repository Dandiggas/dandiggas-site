"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { List, X } from "@phosphor-icons/react";
import { ThemeToggle } from "../ThemeToggle";

const navItems = [
  { href: "/tech", label: "Tech" },
  { href: "/music", label: "Music" },
  { href: "/brim", label: "Brim" },
  { href: "/about", label: "About" },
];

/** Matches the CSS breakpoint where the desktop nav links show. */
export const DESKTOP_QUERY = "(min-width: 721px)";

// Posts and the Now page live under the Tech side of the site.
export function isActive(href: string, pathname: string) {
  if (href === "/tech") {
    return ["/tech", "/posts", "/now"].some((p) => pathname.startsWith(p));
  }
  return pathname.startsWith(href);
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // The mobile menu belongs to phone widths only. When the window grows past
  // 720px (a phone rotated, a window resized) the menu closes, so it never
  // sits next to the desktop nav and is shut when the window shrinks back.
  // CSS hides it at once; this resets the state.
  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const close = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", close);
    return () => desktop.removeEventListener("change", close);
  }, []);

  return (
    <header className="site-header">
      <div className="wrap bar">
        <Link href="/" className="brand">
          Dan Diggas <span className="tag">Engineer · Musician</span>
        </Link>

        <nav className="nav" aria-label="Main">
          {navItems.map((item) => {
            const active = isActive(item.href, pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link${active ? " active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}

          <ThemeToggle />

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="toggle menu-btn"
          >
            {open ? <X size={20} /> : <List size={20} />}
          </button>
        </nav>
      </div>

      {open && (
        <nav className="mobile-nav" aria-label="Mobile">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={isActive(item.href, pathname) ? "active" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
