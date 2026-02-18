export type Project = {
  id: string;
  title: string;
  description: string;
  year: number;
  category: string;
  tech_stack: string[];
  image_url: string | null;
  github_url: string | null;
  live_url: string | null;
  created_at: string;
};

export const CATEGORIES = [
  "All",
  "Web Application",
  "Bot & Automation",
  "Desktop Application",
  "Library",
  "Scripts",
] as const;
