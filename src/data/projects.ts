export interface Project {
  id: string;
  title: string;
  category: string;
  year?: string;
  subtitle?: string;
  summary?: string;
  description?: string;
  bulletPoints?: string[];
  techStack?: string[];
  metrics?: string[];
  github?: string;
  live?: string;
  imageUrl?: string;
  gallery?: string[];
  featured?: boolean;
  color?: string;
  icon?: string;
}

// Live portfolio projects are loaded dynamically from MongoDB via `/api/portfolio`
export const projectsData: Project[] = [];
