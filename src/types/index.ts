
export interface Link {
  type: 'GitHub' | 'LinkedIn' | 'HackerRank' | 'Portfolio' | 'Other';
  url: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  address: string;
  title: string;
  summary: string; // Added for manual editing
  links: Link[];
  linkedin?: string;
  website?: string;
}

export interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  location?: string;
  description: string;
}

export interface Education {
  institution: string;
  location: string;
  degreeType: string;
  field: string;
  startMonthYear: string;
  gradMonthYear: string;
  scoreType: 'GPA' | 'PERCENTAGE';
  scoreValue: string;
  degree?: string;
  graduationDate?: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface Project {
  name: string;
  technologies: string;
  link: string;
  description: string;
}

export interface Certification {
  name: string;
  link: string;
  issuedBy: string;
}

export interface CustomSectionItem {
  title: string;
  description: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export interface UserProfile {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skillCategories: SkillCategory[];
  projects: Project[];
  certifications: Certification[];
  customSections: CustomSection[];
  skills: string[]; // Legacy
}

export interface ResumeContent {
  summary: string;
  experience: Experience[];
  education: Education[];
  skillCategories: SkillCategory[];
  projects: Project[];
  certifications: Certification[];
  customSections: CustomSection[];
}

export interface ATSScore {
  overall: number;
  keyword_match: number;
  missing_keywords: string[];
  sectionScores: {
    summary: number;
    experience: number;
    education: number;
    skills: number;
    projects: number;
  };
}

export type ResumeTheme = 'Standard' | 'LaTeX Classic' | 'LaTeX Modern' | 'Modern Serif' | 'Minimalist' | 'Deedy Style' | 'Executive' | 'AltaCV';

export interface GeneratedResumeResponse {
  selected_template: {
    id: string;
    name: string;
    reason: string;
  };
  resume_content: ResumeContent;
  ats_score: ATSScore;
  optimization_suggestions: string[];
  regeneration_options: string[];
}

export interface ResumeWork {
  id: string;
  name: string;
  updatedAt: number;
  theme: ResumeTheme;
  generatedResume: GeneratedResumeResponse | null;
  jobDescription: string;
  tone: Tone;
  conciseness: number;
}

export interface BookmarkedResume {
  id: string;
  name: string;
  timestamp: number;
  theme: ResumeTheme;
  generatedResume: GeneratedResumeResponse;
}

export type Tone = 'Professional' | 'Impactful' | 'Startup-friendly';
