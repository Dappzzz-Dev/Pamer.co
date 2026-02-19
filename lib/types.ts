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

export type Category = {
  id: string;
  name: string;
  created_at: string;
};
