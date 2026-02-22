import { redirect } from "next/navigation";

export default function DashboardPage() {
  // Default dashboard view: Overview (card view)
  redirect("/dashboard/overview");
}
