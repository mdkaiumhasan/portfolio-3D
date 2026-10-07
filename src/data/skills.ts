// Dynamic portfolio: Skills are managed via MongoDB and the Admin Panel.
export interface SkillGroup {
  id: string;
  category: string;
  description: string;
  icon: string;
  skills: Array<{
    name: string;
    level: 'Expert' | 'Advanced' | 'Proficient';
    tag?: string;
  }>;
}

export const skillGroups: SkillGroup[] = [];
