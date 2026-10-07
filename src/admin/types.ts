export interface StatItem {
  heading: string;
  description: string;
}

export interface SkillItem {
  name: string;
  percent: number;
  category: string;
}

export interface ActivityItem {
  title: string;
  description: string;
  imageUrl?: string;
}

export interface ProjectItem {
  title: string;
  category: string;
  role?: string;
  technology?: string;
  imageUrl?: string;
  live?: string;
  github?: string;
  shortDesc?: string;
  fullDetails?: string;
}

export interface ExperienceItem {
  title: string;
  date: string;
  description: string;
  imageUrl?: string;
}

export interface BlogPostItem {
  title: string;
  category: string;
  date: string;
  shortDesc?: string;
  fullContent?: string;
  imageUrl?: string;
}

export interface ContactDetailItem {
  type: string;
  value: string;
}

export interface SocialLinkItem {
  platform: string;
  url: string;
}

export interface InboxMessageItem {
  id: string;
  fromName: string;
  fromEmail: string;
  subject: string;
  body: string;
  date: string;
}

export interface PortfolioData {
  home_heading: string;
  home_subheading: string;
  home_cv_link: string;
  home_profile_image: string;
  about_info_heading: string;
  about_info_text: string;
  about_cv_link: string;
  stats: StatItem[];
  skills: SkillItem[];
  skill_categories: string[];
  activities: ActivityItem[];
  projects: ProjectItem[];
  project_categories: string[];
  portfolio_cv_link: string;
  portfolio__showConstructionMessage?: boolean;
  experiences: ExperienceItem[];
  timeline_cv_link: string;
  timeline__showConstructionMessage?: boolean;
  posts: BlogPostItem[];
  blogs_cv_link: string;
  blogs__showConstructionMessage?: boolean;
  contact_info_heading: string;
  contact_info_text: string;
  contact_cv_link: string;
  contactDetails: ContactDetailItem[];
  socialLinks: SocialLinkItem[];
}

export type AdminSection =
  | 'dashboard'
  | 'hero-about'
  | 'certifications'
  | 'skills'
  | 'projects'
  | 'timeline'
  | 'blogs'
  | 'activities'
  | 'contact-inbox';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}
