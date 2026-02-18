import Image from "next/image";
import Link from "next/link";
import { Github, ExternalLink } from "lucide-react";
import { Project } from "@/lib/types";

// Warna accent berbeda tiap category
const CATEGORY_COLORS: Record<string, string> = {
  "Web Application": "bg-mint",
  "Bot & Automation": "bg-lavender",
  "Desktop Application": "bg-salmon text-white",
  Library: "bg-yellow",
  Scripts: "bg-bg-card",
};

export default function ProjectCard({ project }: { project: Project }) {
  const categoryColor = CATEGORY_COLORS[project.category] ?? "bg-bg-card";

  return (
    <article className="brutalist-card flex flex-col overflow-hidden group">
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
            <span className="font-mono text-xs text-gray-400">No Preview</span>
          </div>
        )}
        {/* Year badge */}
        <span className="absolute top-2 right-2 bg-border text-bg-card font-mono text-xs px-2 py-0.5 font-bold">
          {project.year}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Title + Category */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-lg leading-tight">{project.title}</h3>
        </div>

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
            {project.tech_stack.map((tech) => (
              <span key={tech} className="tag">
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        <div className="flex gap-2 mt-1">
          {project.github_url && (
            <Link
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="brutalist-btn bg-border text-bg-card text-xs"
            >
              <Github size={14} />
              GitHub
            </Link>
          )}
          {project.live_url && (
            <Link
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="brutalist-btn bg-mint text-xs"
            >
              <ExternalLink size={14} />
              Live Demo
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
