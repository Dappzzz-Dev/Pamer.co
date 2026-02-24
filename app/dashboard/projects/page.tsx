import Link from "next/link";
import Image from "next/image";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import DeleteButton from "../DeleteButton";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("year", { ascending: false });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-sm text-gray-500 font-mono mt-0.5">
            {projects?.length ?? 0} projects total
          </p>
        </div>
        <Link href="/dashboard/add" className="brutalist-btn bg-yellow">
          <Plus size={16} /> Add Project
        </Link>
      </div>

      {/* Table */}
      {!projects || projects.length === 0 ? (
        <div className="brutalist-card p-12 text-center">
          <p className="font-mono text-gray-500 mb-4">
            Belum ada project. Tambah sekarang!
          </p>
          <Link href="/dashboard/add" className="brutalist-btn bg-yellow">
            <Plus size={16} /> Add First Project
          </Link>
        </div>
      ) : (
        <div className="brutalist-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b-2 border-border bg-yellow">
              <tr>
                <th className="text-left px-4 py-3 font-bold">Preview</th>
                <th className="text-left px-4 py-3 font-bold">Title</th>
                <th className="text-left px-4 py-3 font-bold hidden md:table-cell">
                  Category
                </th>
                <th className="text-left px-4 py-3 font-bold hidden lg:table-cell">
                  Year
                </th>
                <th className="text-left px-4 py-3 font-bold hidden lg:table-cell">
                  Stack
                </th>
                <th className="text-right px-4 py-3 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, i) => (
                <tr
                  key={project.id}
                  className={`border-b border-border last:border-none transition-colors hover:bg-yellow/20 ${
                    i % 2 === 0 ? "bg-bg-card" : "bg-bg-main/40"
                  }`}
                >
                  {/* Image */}
                  <td className="px-4 py-3">
                    <div className="w-14 h-10 border border-border overflow-hidden bg-gray-100 shrink-0">
                      {project.image_url ? (
                        <Image
                          src={project.image_url}
                          alt={project.title}
                          width={56}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-[8px] font-mono text-gray-400">
                            N/A
                          </span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Title */}
                  <td className="px-4 py-3">
                    <span className="font-semibold">{project.title}</span>
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 inline-flex items-center text-gray-400 hover:text-gray-700"
                      >
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="tag">{project.category}</span>
                  </td>

                  {/* Year */}
                  <td className="px-4 py-3 font-mono hidden lg:table-cell">
                    {project.year}
                  </td>

                  {/* Stack */}
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                      {project.tech_stack?.slice(0, 3).map((t: string) => (
                        <span key={t} className="tag text-[10px]">
                          {t}
                        </span>
                      ))}
                      {project.tech_stack?.length > 3 && (
                        <span className="tag text-[10px] text-gray-400">
                          +{project.tech_stack.length - 3}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/dashboard/edit/${project.id}`}
                        className="brutalist-btn bg-mint text-xs py-1 px-3"
                      >
                        <Pencil size={13} /> Edit
                      </Link>
                      <DeleteButton
                        projectId={project.id}
                        imageUrl={project.image_url}
                        projectTitle={project.title}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
