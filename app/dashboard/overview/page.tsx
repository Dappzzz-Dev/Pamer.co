"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, ExternalLink, Github, Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase-client";
import { Project, Category } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardOverviewPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    // Fetch projects
    const { data: projectsData } = await supabase
      .from("projects")
      .select("*")
      .order("year", { ascending: false });

    // Fetch categories
    const { data: categoriesData } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    setProjects(projectsData ?? []);
    setCategories(categoriesData ?? []);
    setLoading(false);
  };

  const handleDelete = async (projectId: string, imageUrl: string | null) => {
    if (!confirm("Hapus project ini?")) return;

    setDeletingId(projectId);

    // Delete image if exists
    if (imageUrl) {
      const path = imageUrl.split("/storage/v1/object/public/project-images/")[1];
      if (path) {
        await supabase.storage.from("project-images").remove([path]);
      }
    }

    // Delete project
    await supabase.from("projects").delete().eq("id", projectId);

    setDeletingId(null);
    fetchData();
  };

  const filtered = useMemo(() => {
    let result = [...projects];

    if (activeCategory !== "All") {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.tech_stack?.some((t) => t.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) =>
      sortOrder === "newest" ? b.year - a.year : a.year - b.year
    );

    return result;
  }, [projects, activeCategory, search, sortOrder]);

  const CATEGORY_COLORS: Record<string, string> = {
    "Web Application": "bg-mint",
    "Bot & Automation": "bg-lavender",
    "Desktop Application": "bg-salmon",
    Library: "bg-yellow",
    Scripts: "bg-bg-card",
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 border-b-2 border-border pb-6">
        <h1 className="text-3xl font-bold">Overview</h1>
        <p className="text-sm text-gray-500 font-mono mt-0.5">
          Preview semua projects dalam card view
        </p>
      </div>

      {/* Controls */}
      <div className="space-y-4 mb-8">
        {/* Search */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="brutalist-input pl-10"
          />
        </div>

        {/* Categories + Sort */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {/* All button */}
            <button
              onClick={() => setActiveCategory("All")}
              className={`brutalist-btn text-xs transition-colors ${
                activeCategory === "All"
                  ? "bg-border text-bg-card"
                  : "bg-bg-card"
              }`}
            >
              All
            </button>
            {/* Category buttons */}
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`brutalist-btn text-xs transition-colors ${
                  activeCategory === cat.name
                    ? "bg-border text-bg-card"
                    : "bg-bg-card"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <select
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(e.target.value as "newest" | "oldest")
            }
            className="brutalist-input w-auto cursor-pointer text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="brutalist-card h-96 animate-pulse bg-gray-100"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="brutalist-card p-12 text-center">
          <p className="font-mono text-gray-500">
            {search || activeCategory !== "All"
              ? "No projects found."
              : "Belum ada projects. Tambah sekarang!"}
          </p>
          {!search && activeCategory === "All" && (
            <Link
              href="/dashboard/add"
              className="brutalist-btn bg-yellow mt-4 inline-flex"
            >
              Add First Project
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((project) => {
            const categoryColor =
              CATEGORY_COLORS[project.category] ?? "bg-bg-card";

            return (
              <article
                key={project.id}
                className="brutalist-card flex flex-col overflow-hidden group"
              >
                {/* Preview Image */}
                <div className="relative h-44 overflow-hidden border-b-2 border-border bg-gray-100">
                  {project.image_url ? (
                    <Image
                      src={project.image_url}
                      alt={`Preview ${project.title}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#E8E8E8]">
                      <span className="font-mono text-xs text-gray-400">
                        No Preview
                      </span>
                    </div>
                  )}
                  {/* Year badge */}
                  <span className="absolute top-2 right-2 bg-border text-bg-card font-mono text-xs px-2 py-0.5 font-bold">
                    {project.year}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1 gap-3">
                  {/* Title */}
                  <h3 className="font-bold text-lg leading-tight">
                    {project.title}
                  </h3>

                  {/* Category tag */}
                  <span
                    className={`self-start border border-border px-2 py-0.5 text-xs font-bold ${categoryColor}`}
                  >
                    {project.category}
                  </span>

                  {/* Description */}
                  <p className="text-sm text-gray-700 leading-relaxed flex-1 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  {project.tech_stack?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech_stack.slice(0, 3).map((tech) => (
                        <span key={tech} className="tag">
                          {tech}
                        </span>
                      ))}
                      {project.tech_stack.length > 3 && (
                        <span className="tag text-gray-400">
                          +{project.tech_stack.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="brutalist-btn bg-border text-bg-card text-xs"
                      >
                        <Github size={14} />
                        GitHub
                      </a>
                    )}
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="brutalist-btn bg-mint text-xs"
                      >
                        <ExternalLink size={14} />
                        Live Demo
                      </a>
                    )}
                  </div>

                  {/* Admin Actions */}
                  <div className="flex gap-2 pt-2 border-t border-border">
                    <Link
                      href={`/dashboard/edit/${project.id}`}
                      className="brutalist-btn bg-yellow text-xs flex-1 justify-center"
                    >
                      <Pencil size={13} /> Edit
                    </Link>
                    <button
                      onClick={() =>
                        handleDelete(project.id, project.image_url)
                      }
                      disabled={deletingId === project.id}
                      className="brutalist-btn bg-red-100 hover:bg-red-200 text-xs flex-1 justify-center disabled:opacity-50"
                    >
                      <Trash2 size={13} />
                      {deletingId === project.id ? "..." : "Hapus"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Stats */}
      <div className="mt-8 brutalist-card p-4 bg-yellow">
        <p className="text-sm font-mono">
          <span className="font-bold">{filtered.length}</span> projects shown
          {activeCategory !== "All" && (
            <span> in category "{activeCategory}"</span>
          )}
        </p>
      </div>
    </div>
  );
}
