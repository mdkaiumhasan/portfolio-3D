export interface ProfileData {
  name: string;
  titles: string[];
  bio: string;
  shortBio: string;
  email: string;
  phone: string;
  location: string;
  openToRemote: boolean;
  github: string;
  linkedin: string;
  portfolio: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  education?: Array<{
    degree: string;
    institution: string;
    period: string;
    status: 'Completed' | 'In Progress';
    details: string;
  }>;
  stats?: Array<{
    label: string;
    value: string;
    detail: string;
  }>;
}

// Live profile data is fetched dynamically from MongoDB via `/api/portfolio`
export const profileData: Partial<ProfileData> = {};
