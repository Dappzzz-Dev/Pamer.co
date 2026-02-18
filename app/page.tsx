import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Code2, Layers, Zap } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();
  const { count } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-16">
        {/* Hero */}
        <section className="mb-20">
          <div className="brutalist-card bg-yellow p-8 md:p-12 relative overflow-hidden">
            {/* Decorative background shape */}
            <div className="absolute -right-10 -top-10 w-40 h-40 border-4 border-border bg-salmon opacity-40 rotate-12" />
            <div className="absolute -right-4 -bottom-8 w-24 h-24 border-4 border-border bg-mint opacity-50 -rotate-6" />

            <div className="relative z-10 max-w-xl">
              <p className="font-mono text-sm font-bold mb-3 bg-border text-bg-card inline-block px-2 py-0.5">
                — AVAILABLE FOR WORK
              </p>
              <h1 className="text-4xl md:text-6xl font-bold leading-none tracking-tight mb-4">
                Hi, I&apos;m
                <br />
                <span className="underline decoration-4 underline-offset-4">Daffa</span>
              </h1>
              <p className="text-base md:text-lg font-medium text-gray-800 mb-8 leading-relaxed">
                Junior Software Engineer building scalable web, mobile, and
                automation systems. Started with game server scripting in 2020,
                now deep in full-stack development.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/projects"
                  className="brutalist-btn bg-border text-bg-card text-sm"
                >
                  View Projects <ArrowRight size={16} />
                </Link>
                <Link
                  href="mailto:daffafarash@gmail.com"
                  className="brutalist-btn bg-bg-card text-sm"
                >
                  Contact Me
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats strip */}
        <section className="grid grid-cols-3 gap-4 mb-20">
          {[
            { icon: Code2, label: "Projects Built", value: count ?? "—" },
            { icon: Zap, label: "Years Coding", value: "5+" },
            { icon: Layers, label: "Tech Stacks", value: "10+" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="brutalist-card p-5 text-center">
              <Icon size={22} className="mx-auto mb-2 opacity-70" />
              <p className="text-3xl font-bold">{value}</p>
              <p className="text-xs font-mono text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </section>

        {/* Quick about */}
        <section className="grid md:grid-cols-2 gap-6 mb-20">
          <div className="brutalist-card bg-mint p-6">
            <h2 className="font-bold text-xl mb-3">What I Do</h2>
            <ul className="space-y-2 text-sm">
              {[
                "Website & WebApp Development (Next.js, React, Svelte)",
                "Backend & API (Node.js, Hono.js, Laravel Herd)",
                "Content Creation (CapCut, TikTok, Wink, Canva, Pixellab)",
                "Learning & Experimentation (AI, New Frameworks, Side Projects)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-0.5 font-mono font-bold">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="brutalist-card bg-salmon p-6">
            <h2 className="font-bold text-xl mb-3">Quick Bio</h2>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Location", value: "Sukoharjo, Indonesia" },
                { label: "Focus", value: "Frontend Development & AI Enthusiast" },
                { label: "Started", value: "2023 (Technology Enthusiast)" },
                { label: "Now", value: "Website & WebApp Development" },
              ].map(({ label, value }) => (
                <li key={label} className="flex gap-2">
                  <span className="font-mono font-bold w-20 shrink-0">{label}:</span>
                  <span>{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="brutalist-card bg-lavender p-8 text-center">
          <h2 className="font-bold text-2xl mb-3">
            Want to see what I&apos;ve built?
          </h2>
          <p className="text-sm text-gray-700 mb-6">
            Browse through {count ?? "all"} projects across web, desktop, and
            automation.
          </p>
          <Link
            href="/projects"
            className="brutalist-btn bg-border text-bg-card"
          >
            Explore Project Gallery <ArrowRight size={16} />
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
