export interface Project {
  _id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  imageUrl: string;
  bannerUrl: string;
  githubUrl?: string;
  liveUrl?: string;
  category: 'web' | 'ai' | 'data' | 'embedded' | 'other';
  featured: boolean;
  interactive?: boolean;
  interactivePath?: string;
  createdAt: Date;
}

export interface Profile {
  name: string;
  title: string;
  bio: string;
  email: string;
  github: string;
  linkedin: string;
  avatarUrl: string;
  skills: Skill[];
  experiences: Experience[];
  education: Education[];
}

export interface Skill {
  name: string;
  category: string;
  level: number;
}

export interface Experience {
  company: string;
  position: string;
  period: string;
  description: string;
  technologies: string[];
}

export interface Education {
  school: string;
  degree: string;
  period: string;
  description: string;
}
