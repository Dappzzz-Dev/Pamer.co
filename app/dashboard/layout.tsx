import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { LayoutDashboard, FolderOpen, Plus, LogOut, Tag } from "lucide-react";
import LogoutButton from "./LogoutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen flex bg-bg-main">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r-2 border-border bg-bg-card flex flex-col">
        <div className="p-5 border-b-2 border-border">
          <Link href="/" className="font-bold text-lg hover:underline">
            Pamer.co (DaffaDev)
          </Link>
          <p className="text-xs font-mono text-gray-500 mt-0.5">Dashboard</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <Link
            href="/dashboard/overview"
            className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold hover:bg-yellow transition-colors"
          >
            <LayoutDashboard size={16} /> Overview
          </Link>
          <Link
            href="/dashboard/projects"
            className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold hover:bg-yellow transition-colors"
          >
            <FolderOpen size={16} /> Projects
          </Link>
          <Link
            href="/dashboard/categories"
            className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold hover:bg-yellow transition-colors"
          >
            <Tag size={16} /> Categories
          </Link>
          <Link
            href="/dashboard/add"
            className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold hover:bg-yellow transition-colors"
          >
            <Plus size={16} /> Add Project
          </Link>
        </nav>

        <div className="p-3 border-t-2 border-border">
          <div className="text-xs font-mono text-gray-500 mb-2 px-1 truncate">
            {user.email}
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
