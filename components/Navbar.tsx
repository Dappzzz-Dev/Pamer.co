"use client";

import Link from "next/link";
import Image from "next/image";
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
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 border-2 border-border overflow-hidden transition-transform group-hover:scale-110">
            <Image
              src="/logo.png"
              alt="Pamer.co Logo"
              fill
              className="object-cover"
              style={{ imageRendering: 'pixelated' }}
              priority
            />
          </div>
          <span className="font-bold text-lg tracking-tight group-hover:underline">
            Pamer.co
          </span>
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
