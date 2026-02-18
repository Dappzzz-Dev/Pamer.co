import Link from "next/link";
import { Github, Linkedin, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t-2 border-border bg-[#D4C5A5] px-4 py-12">
      <div className="max-w-5xl mx-auto text-center">
        <p className="font-bold text-2xl mb-1">Let&apos;s Connect!</p>
        <p className="text-sm text-gray-600 mb-6">Find me on social media</p>
        <div className="flex justify-center gap-4 mb-8">
          {[
            { icon: Github, href: "https://github.com/Dappzzz-Dev", label: "GitHub" },
            { icon: Linkedin, href: "https://www.linkedin.com/in/%20dappdev-len140428", label: "LinkedIn" },
            { icon: Twitter, href: "#", label: "Twitter" },
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
