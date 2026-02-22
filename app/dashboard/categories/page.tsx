"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-client";
import { Category } from "@/lib/types";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

type CategoryWithCount = Category & {
  project_count: number;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [error, setError] = useState("");

  const supabase = createClient();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);

    // Fetch categories
    const { data: categoriesData } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (!categoriesData) {
      setLoading(false);
      return;
    }

    // Fetch all projects to count usage
    const { data: projectsData } = await supabase
      .from("projects")
      .select("category");

    // Count projects per category
    const categoriesWithCount = categoriesData.map((cat) => {
      const count = projectsData?.filter((p) => p.category === cat.name).length ?? 0;
      return {
        ...cat,
        project_count: count,
      };
    });

    setCategories(categoriesWithCount);
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setError("");
    const { error: insertError } = await supabase
      .from("categories")
      .insert({ name: newCategoryName.trim() });

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setNewCategoryName("");
    fetchCategories();
  };

  const handleEdit = async (id: string) => {
    if (!editingName.trim()) return;

    const { error: updateError } = await supabase
      .from("categories")
      .update({ name: editingName.trim() })
      .eq("id", id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setEditingId(null);
    setEditingName("");
    fetchCategories();
  };

  const handleDelete = async (id: string, name: string, projectCount: number) => {
    const message =
      projectCount > 0
        ? `Hapus kategori "${name}"?\n\n⚠️ WARNING: ${projectCount} project masih menggunakan kategori ini!\n\nProject-project tersebut akan error setelah kategori dihapus.`
        : `Hapus kategori "${name}"?`;

    if (!confirm(message)) {
      return;
    }

    const { error: deleteError } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    fetchCategories();
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 border-b-2 border-border pb-6">
        <h1 className="text-3xl font-bold">Manage Categories</h1>
        <p className="text-sm text-gray-500 font-mono mt-0.5">
          {categories.length} categories total
        </p>
      </div>

      {/* Add Form */}
      <form onSubmit={handleAdd} className="brutalist-card p-6 mb-8">
        <h2 className="font-bold text-lg mb-4">Add New Category</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="e.g., Mobile App, Game Development..."
            className="brutalist-input flex-1"
          />
          <button type="submit" className="brutalist-btn bg-yellow">
            <Plus size={16} /> Add
          </button>
        </div>
        {error && (
          <div className="mt-3 border-2 border-red-500 bg-red-50 px-3 py-2 text-sm text-red-700 font-medium">
            {error}
          </div>
        )}
      </form>

      {/* List */}
      {loading ? (
        <div className="brutalist-card p-12 text-center">
          <p className="font-mono text-gray-500">Loading...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="brutalist-card p-12 text-center">
          <p className="font-mono text-gray-500 mb-4">
            Belum ada kategori. Tambah sekarang!
          </p>
        </div>
      ) : (
        <div className="brutalist-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b-2 border-border bg-mint">
              <tr>
                <th className="text-left px-4 py-3 font-bold">Category Name</th>
                <th className="text-left px-4 py-3 font-bold">Usage</th>
                <th className="text-right px-4 py-3 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, i) => (
                <tr
                  key={cat.id}
                  className={`border-b border-border last:border-none transition-colors hover:bg-mint/20 ${
                    i % 2 === 0 ? "bg-bg-card" : "bg-bg-main/40"
                  }`}
                >
                  {/* Name */}
                  <td className="px-4 py-3">
                    {editingId === cat.id ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleEdit(cat.id);
                          if (e.key === "Escape") {
                            setEditingId(null);
                            setEditingName("");
                          }
                        }}
                        className="brutalist-input py-1 px-2 text-sm"
                        autoFocus
                      />
                    ) : (
                      <span className="font-semibold">{cat.name}</span>
                    )}
                  </td>

                  {/* Usage Count */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold ${
                          cat.project_count > 0
                            ? "text-green-700"
                            : "text-gray-400"
                        }`}
                      >
                        {cat.project_count}
                      </span>
                      <span className="text-xs text-gray-500 font-mono">
                        {cat.project_count === 1 ? "project" : "projects"}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {editingId === cat.id ? (
                        <>
                          <button
                            onClick={() => handleEdit(cat.id)}
                            className="brutalist-btn bg-mint text-xs py-1 px-3"
                          >
                            <Check size={13} /> Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditingName("");
                            }}
                            className="brutalist-btn bg-bg-card text-xs py-1 px-3"
                          >
                            <X size={13} /> Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingId(cat.id);
                              setEditingName(cat.name);
                            }}
                            className="brutalist-btn bg-yellow text-xs py-1 px-3"
                          >
                            <Pencil size={13} /> Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(cat.id, cat.name, cat.project_count)
                            }
                            className="brutalist-btn bg-red-100 hover:bg-red-200 text-xs py-1 px-3"
                          >
                            <Trash2 size={13} /> Hapus
                          </button>
                        </>
                      )}
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


  return (
    <div>
      {/* Header */}
      <div className="mb-8 border-b-2 border-border pb-6">
        <h1 className="text-3xl font-bold">Manage Categories</h1>
        <p className="text-sm text-gray-500 font-mono mt-0.5">
          {categories.length} categories total
        </p>
      </div>

      {/* Add Form */}
      <form onSubmit={handleAdd} className="brutalist-card p-6 mb-8">
        <h2 className="font-bold text-lg mb-4">Add New Category</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="e.g., Mobile App, Game Development..."
            className="brutalist-input flex-1"
          />
          <button type="submit" className="brutalist-btn bg-yellow">
            <Plus size={16} /> Add
          </button>
        </div>
        {error && (
          <div className="mt-3 border-2 border-red-500 bg-red-50 px-3 py-2 text-sm text-red-700 font-medium">
            {error}
          </div>
        )}
      </form>

      {/* List */}
      {loading ? (
        <div className="brutalist-card p-12 text-center">
          <p className="font-mono text-gray-500">Loading...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="brutalist-card p-12 text-center">
          <p className="font-mono text-gray-500 mb-4">
            Belum ada kategori. Tambah sekarang!
          </p>
        </div>
      ) : (
        <div className="brutalist-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b-2 border-border bg-mint">
              <tr>
                <th className="text-left px-4 py-3 font-bold">Category Name</th>
                <th className="text-left px-4 py-3 font-bold">Created</th>
                <th className="text-right px-4 py-3 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, i) => (
                <tr
                  key={cat.id}
                  className={`border-b border-border last:border-none transition-colors hover:bg-mint/20 ${
                    i % 2 === 0 ? "bg-bg-card" : "bg-bg-main/40"
                  }`}
                >
                  {/* Name */}
                  <td className="px-4 py-3">
                    {editingId === cat.id ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleEdit(cat.id);
                          if (e.key === "Escape") {
                            setEditingId(null);
                            setEditingName("");
                          }
                        }}
                        className="brutalist-input py-1 px-2 text-sm"
                        autoFocus
                      />
                    ) : (
                      <span className="font-semibold">{cat.name}</span>
                    )}
                  </td>

                  {/* Created */}
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">
                    {new Date(cat.created_at).toLocaleDateString("id-ID")}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {editingId === cat.id ? (
                        <>
                          <button
                            onClick={() => handleEdit(cat.id)}
                            className="brutalist-btn bg-mint text-xs py-1 px-3"
                          >
                            <Check size={13} /> Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditingName("");
                            }}
                            className="brutalist-btn bg-bg-card text-xs py-1 px-3"
                          >
                            <X size={13} /> Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingId(cat.id);
                              setEditingName(cat.name);
                            }}
                            className="brutalist-btn bg-yellow text-xs py-1 px-3"
                          >
                            <Pencil size={13} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id, cat.name)}
                            className="brutalist-btn bg-red-100 hover:bg-red-200 text-xs py-1 px-3"
                          >
                            <Trash2 size={13} /> Hapus
                          </button>
                        </>
                      )}
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
