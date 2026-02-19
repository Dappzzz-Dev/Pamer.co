"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-client";
import { Category } from "@/lib/types";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
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
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name");
    setCategories(data ?? []);
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

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus kategori "${name}"?\n\nPeringatan: Project dengan kategori ini mungkin akan error.`)) {
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
