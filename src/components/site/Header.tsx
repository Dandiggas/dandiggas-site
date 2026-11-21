"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { List, X } from "@phosphor-icons/react";
import { ThemeToggle } from "../ThemeToggle";

const navItems = [
  { href: "/tech", label: "Tech" },
  { href: "/music", label: "Music" },
  { href: "/brim", label: "Brim" },
  { href: "/about", label: "About" },
];

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
