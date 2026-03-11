import Link from "next/link";
import { Github, Linkedin, Instagram } from "lucide-react";

// Custom TikTok Icon Component
const TikTokIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="mt-20 border-t-2 border-border bg-[#D4C5A5] px-4 py-12">
      <div className="max-w-5xl mx-auto text-center">
        <p className="font-bold text-2xl mb-1">Let&apos;s Connect!</p>
        <p className="text-sm text-gray-600 mb-6">Find me on social media</p>
        <div className="flex justify-center gap-4 mb-8">
          {[
            { icon: Github, href: "https://github.com/Dappzzz-Dev", label: "GitHub" },
            { icon: Linkedin, href: "https://www.linkedin.com/in/dappdev-len140428", label: "LinkedIn" },
            { icon: TikTokIcon, href: "https://www.tiktok.com/@daffadev.dapp", label: "TikTok" },
            { icon: Instagram, href: "https://www.instagram.com/dapp.daffadev?igsh=MjVrM3pycTcxbWx2", label: "Instagram" },
          ].map(({ icon: Icon, href, label }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="brutalist-btn bg-bg-card hover:bg-yellow"
              aria-label={label}
            >
              <Icon size={18} />
            </Link>
          ))}
        </div>
        <p className="text-xs text-gray-500 font-mono">
          © {new Date().getFullYear()} Made with{" "}
          <span className="text-red-500">♥</span> using Next.js & TailwindCSS
        </p>
      </div>
    </footer>
  );
}
