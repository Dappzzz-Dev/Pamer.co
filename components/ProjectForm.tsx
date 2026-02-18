"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, X, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase-client";
import { CATEGORIES, Project } from "@/lib/types";

interface Props {
  initialData?: Partial<Project>;
  mode: "add" | "edit";
}

export default function ProjectForm({ initialData, mode }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [year, setYear] = useState(initialData?.year?.toString() ?? new Date().getFullYear().toString());
  const [category, setCategory] = useState(initialData?.category ?? "Web Application");
  const [techInput, setTechInput] = useState("");
  const [techStack, setTechStack] = useState<string[]>(initialData?.tech_stack ?? []);
  const [githubUrl, setGithubUrl] = useState(initialData?.github_url ?? "");
  const [liveUrl, setLiveUrl] = useState(initialData?.live_url ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(initialData?.image_url ?? "");

  const addTech = () => {
    const trimmed = techInput.trim();
    if (trimmed && !techStack.includes(trimmed)) {
      setTechStack([...techStack, trimmed]);
      setTechInput("");
    }
  };

  const removeTech = (tech: string) => {
    setTechStack(techStack.filter((t) => t !== tech));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    let image_url = initialData?.image_url ?? null;

    // Upload gambar baru jika ada
    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(fileName, imageFile, { upsert: true });

      if (uploadError) {
        setError("Gagal upload gambar: " + uploadError.message);
        setLoading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("project-images")
        .getPublicUrl(uploadData.path);

      // Hapus gambar lama jika edit
      if (mode === "edit" && initialData?.image_url) {
        const oldPath = initialData.image_url.split("/storage/v1/object/public/project-images/")[1];
        if (oldPath) {
          await supabase.storage.from("project-images").remove([oldPath]);
        }
      }

      image_url = publicUrl;
    }

    const projectData = {
      title,
      description,
      year: parseInt(year),
      category,
      tech_stack: techStack,
      github_url: githubUrl || null,
      live_url: liveUrl || null,
      image_url,
    };

    if (mode === "add") {
      const { error: dbError } = await supabase.from("projects").insert(projectData);
      if (dbError) {
        setError(dbError.message);
        setLoading(false);
        return;
      }
    } else {
      const { error: dbError } = await supabase
        .from("projects")
        .update(projectData)
        .eq("id", initialData!.id!);
      if (dbError) {
        setError(dbError.message);
        setLoading(false);
        return;
      }
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Title */}
      <div>
        <label className="block text-sm font-bold mb-1.5">
          Project Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Safepay — Digital Bank App"
          required
          className="brutalist-input"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-bold mb-1.5">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Jelaskan apa project ini dan apa yang dibuatnya..."
          required
          rows={3}
          className="brutalist-input resize-none"
        />
      </div>

      {/* Year + Category */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold mb-1.5">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            min="2018"
            max={new Date().getFullYear() + 1}
            required
            className="brutalist-input"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1.5">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="brutalist-input cursor-pointer"
          >
            {CATEGORIES.filter((c) => c !== "All").map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tech Stack */}
      <div>
        <label className="block text-sm font-bold mb-1.5">Tech Stack</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTech();
              }
            }}
            placeholder="Next.js, TailwindCSS, ..."
            className="brutalist-input flex-1"
          />
          <button type="button" onClick={addTech} className="brutalist-btn bg-yellow">
            <Plus size={16} />
          </button>
        </div>
        {techStack.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="tag flex items-center gap-1.5 cursor-pointer hover:bg-red-100"
                onClick={() => removeTech(tech)}
              >
                {tech} <X size={11} />
              </span>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-400 font-mono mt-1">
          Tekan Enter atau klik + untuk tambah. Klik tag untuk hapus.
        </p>
      </div>

      {/* Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold mb-1.5">GitHub URL</label>
          <input
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/..."
            className="brutalist-input"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1.5">Live Demo URL</label>
          <input
            type="url"
            value={liveUrl}
            onChange={(e) => setLiveUrl(e.target.value)}
            placeholder="https://..."
            className="brutalist-input"
          />
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-bold mb-1.5">Preview Image</label>
        <div className="flex flex-col gap-3">
          {imagePreview && (
            <div className="relative w-full h-48 border-2 border-border overflow-hidden">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview("");
                  setImageFile(null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white border border-border p-1 hover:bg-red-600"
              >
                <X size={14} />
              </button>
            </div>
          )}
          <label className="brutalist-btn bg-bg-card cursor-pointer w-fit">
            <Upload size={16} />
            {imagePreview ? "Ganti Gambar" : "Upload Gambar"}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
          <p className="text-xs text-gray-400 font-mono">
            Recommended: 16:9 ratio, max 5MB
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="border-2 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-700 font-medium">
          {error}
        </div>
      )}

      {/* Submit */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="brutalist-btn bg-yellow font-bold disabled:opacity-50"
        >
          {loading
            ? mode === "add"
              ? "Menyimpan..."
              : "Mengupdate..."
            : mode === "add"
            ? "Simpan Project"
            : "Update Project"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="brutalist-btn bg-bg-card"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
