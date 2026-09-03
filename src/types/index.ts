export interface Project {
  _id: string;
  slug: string;
  title: string;
  titleFr: string;
  description: string;
  descriptionFr: string;
  longDescription: string;
  longDescriptionFr: string;
  details: {
    context: string;
    duration: string;
    team: string;
    role: string;
    why: string;
    learnings: string[];
    improvements: string[];
  };
  detailsFr: {
    context: string;
    duration: string;
    team: string;
    role: string;
    why: string;
    learnings: string[];
    improvements: string[];
  };
  technologies: string[];
  technologiesFr: string[];
  imageUrl: string;
  bannerUrl: string;
  githubUrl?: string;
  liveUrl?: string;
  category: 'web' | 'ai' | 'other';
  featured: boolean;
  interactive?: boolean;
  interactivePath?: string;
  demoEnabled?: boolean;
  healthCheckUrl?: string;
  maturity?: 'stable' | 'beta';
  createdAt: Date;
}