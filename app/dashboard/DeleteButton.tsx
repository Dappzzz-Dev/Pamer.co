"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase-client";

interface Props {
  projectId: string;
  imageUrl: string | null;
  projectTitle: string;
}

export default function DeleteButton({ projectId, imageUrl, projectTitle }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    const supabase = createClient();

    // Hapus gambar dari storage dulu jika ada
    if (imageUrl) {
      const path = imageUrl.split("/storage/v1/object/public/project-images/")[1];
      if (path) {
        await supabase.storage.from("project-images").remove([path]);
      }
    }

    // Hapus project dari database
    await supabase.from("projects").delete().eq("id", projectId);

    setLoading(false);
    setShowConfirm(false);
    router.refresh();
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="brutalist-btn bg-red-100 hover:bg-red-200 text-xs py-1 px-3"
      >
        <Trash2 size={13} /> Hapus
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="brutalist-card bg-bg-card p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={22} className="text-red-500 shrink-0" />
              <div>
                <h3 className="font-bold">Hapus Project?</h3>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">&quot;{projectTitle}&quot;</span> akan
                  dihapus permanen.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={loading}
                className="brutalist-btn bg-bg-card flex-1 justify-center text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="brutalist-btn bg-red-500 text-white flex-1 justify-center text-sm disabled:opacity-50"
              >
                {loading ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
