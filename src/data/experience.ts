// Dynamic portfolio: Experiences are managed via MongoDB and the Admin Panel.
export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  location: string;
  period: string;
  type: 'Work Experience' | 'Education' | 'Certification';
  description: string;
  highlights: string[];
  skills: string[];
  credentialId?: string;
}

export const experienceData: ExperienceItem[] = [];
