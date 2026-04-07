"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Posts" },
    { href: "/projects", label: "Projects" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="w-full border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
        >
          Dan Diggas
        </Link>
        <div className="flex items-center gap-1">
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    isActive
                      ? "text-amber-700 dark:text-amber-400 font-medium"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
