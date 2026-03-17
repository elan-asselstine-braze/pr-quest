"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { path: "/", label: "Dashboard" },
  { path: "/learn", label: "Learn" },
  { path: "/setup", label: "Setup" },
  { path: "/practice", label: "Practice" },
] as const;

export function TabNav() {
  const pathname = usePathname();

  return (
    <aside
      className="w-52 shrink-0 border-r border-white/10 flex flex-col py-4 px-3 sm:px-4"
      aria-label="Main navigation"
    >
      <span
        className="block text-lg font-bold tracking-tight text-[var(--color-accent)] pb-4 mb-4 border-b border-white/10 px-2"
        aria-hidden
      >
        PR Quest
      </span>
      <nav className="flex flex-col gap-0.5" aria-label="Main">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path;
          return (
            <Link
              key={tab.path}
              href={tab.path}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${isActive ? "bg-[var(--color-accent)]/20 text-[var(--color-accent)]" : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white/5"}
              `}
              aria-current={isActive ? "page" : undefined}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
