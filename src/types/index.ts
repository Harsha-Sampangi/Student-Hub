export interface Opportunity {
  id: string;
  title: string;
  category: OpportunityCategory;
  location: string;
  deadline: string;
  platform: string;
  applyLink: string;
  description: string;
  mode: 'online' | 'offline' | 'hybrid';
  isActive: boolean;
  createdAt: string;
}

export type OpportunityCategory =
  | 'Hackathon'
  | 'Internship'
  | 'Workshop'
  | 'Scholarship'
  | 'Job'
  | 'Open Source'
  | 'Coding Contest'
  | 'Campus Ambassador'
  | 'Fellowship';

export interface Event {
  id: string;
  title: string;
  date: string;
  mode: 'online' | 'offline' | 'hybrid';
  location: string;
  description: string;
  registerLink: string;
  posterUrl: string;
  isActive: boolean;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  tags: string[];
  category: string;
  author: string;
  authorAvatar: string;
  thumbnailUrl: string;
  readingTime: number;
  isPublished: boolean;
  createdAt: string;
}

export interface Resource {
  id: string;
  title: string;
  category: ResourceCategory;
  description: string;
  link: string;
  type: 'pdf' | 'link' | 'repo' | 'video';
  icon?: string;
  createdAt: string;
}

export type ResourceCategory =
  | 'Roadmaps'
  | 'PDFs'
  | 'Learning'
  | 'GitHub Repos'
  | 'Career Prep'
  | 'Tools';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    instagram?: string;
  };
  order: number;
}

export interface CommunityStats {
  studentsReached: number;
  opportunitiesShared: number;
  eventsHosted: number;
  communityMembers: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  student: string;
  category: string;
  icon: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}
