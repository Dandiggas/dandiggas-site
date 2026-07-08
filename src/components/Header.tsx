"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { List, X } from "@phosphor-icons/react";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { href: "/tech", label: "Tech" },
  { href: "/music", label: "Music" },
  { href: "/about", label: "About" },
];

function isActive(href: string, pathname: string) {
  if (href === "/tech") {
    return pathname.startsWith("/tech") || pathname.startsWith("/posts");
  }
  return pathname.startsWith(href);
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-background/80 backdrop-blur-md dark:border-neutral-800">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight transition-colors hover:text-amber-700 dark:hover:text-amber-400"
        >
          Dan Diggas
        </Link>

        <div className="flex items-center gap-1">
          <nav className="hidden items-center gap-1 sm:flex">
            {navItems.map((item) => {
              const active = isActive(item.href, pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                    active
                      ? "font-medium text-amber-700 dark:text-amber-400"
                      : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <ThemeToggle />

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 sm:hidden"
          >
            {open ? <X size={20} /> : <List size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-neutral-200 px-6 py-3 dark:border-neutral-800 sm:hidden">
          <div className="flex flex-col">
            {navItems.map((item) => {
              const active = isActive(item.href, pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-md px-3 py-2.5 text-sm transition-colors ${
                    active
                      ? "font-medium text-amber-700 dark:text-amber-400"
                      : "text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
