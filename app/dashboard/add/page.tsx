import ProjectForm from "@/components/ProjectForm";

export default function AddProjectPage() {
  return (
    <div>
      <div className="mb-8 border-b-2 border-border pb-6">
        <h1 className="text-3xl font-bold">Add New Project</h1>
        <p className="text-sm text-gray-500 font-mono mt-0.5">
          Isi semua detail project yang ingin ditampilkan.
        </p>
      </div>
      <ProjectForm mode="add" />
    </div>
  );
}
