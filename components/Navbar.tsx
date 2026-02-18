"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 px-4 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between border-2 border-border bg-bg-card shadow-[4px_4px_0px_#1A1A1A] px-6 py-3">
        <Link href="/" className="font-bold text-xl tracking-tight hover:underline">
          Pamer.co (DaffaDev)
        </Link>
        <div className="flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-semibold text-sm transition-all hover:underline underline-offset-4 ${
                pathname === link.href ? "underline" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
