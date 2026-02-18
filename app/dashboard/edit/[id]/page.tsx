import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import ProjectForm from "@/components/ProjectForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) notFound();

  return (
    <div>
      <div className="mb-8 border-b-2 border-border pb-6">
        <h1 className="text-3xl font-bold">Edit Project</h1>
        <p className="text-sm text-gray-500 font-mono mt-0.5">
          Mengedit: <span className="font-bold">{project.title}</span>
        </p>
      </div>
      <ProjectForm mode="edit" initialData={project} />
    </div>
  );
}
