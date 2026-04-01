export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface Project {
  id?: string;
  title: string;
  description: string;
  category: 'Residencial' | 'Comercial' | 'Institucional' | 'Urbanístico';
  images: string[];
  renderings?: string[];
  pdfUrl?: string;
  floorPlans?: string[];
  slug: string;
  createdAt: string;
}

export interface ArchitectWork {
  architect: string;
  works: string[];
}

export interface Style {
  id?: string;
  title: string;
  description: string;
  context: string;
  characteristics: string[];
  architects: string;
  architectWorks: ArchitectWork[];
  examples: string;
  images: string[];
  slug: string;
}

export interface BlogPost {
  id?: string;
  title: string;
  content: string;
  author: string;
  date: string;
  images: string[];
  image?: string;
  slug: string;
  category?: string;
}

export interface Lead {
  id?: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  projectType: string;
  area: string;
  style: string;
  description: string;
  createdAt: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
  siteNameTop: string;
  siteNameBottom: string;
  heroImage: string;
  aboutTitle: string;
  aboutImage: string;
  stylesTitle: string;
  renderExpressTitle: string;
  renderExpressDescription: string;
  renderExpressImage: string;
  processTitle: string;
  portfolioTitle: string;
  portfolioTagline: string;
  stylesPageTitle: string;
  stylesPageTagline: string;
  blogPageTitle: string;
  blogPageTagline: string;
  blogPageDescription: string;
  contactPageTitle: string;
  contactPageTagline: string;
  logoFontSize: number;
  heroLogoFontSize: number;
  heroTitle: string;
  heroTitlePosition: { x: number; y: number };
  taglinePosition: { x: number; y: number };
  heroButtonsPosition: { x: number; y: number };
  logoTopPosition: { x: number; y: number };
  logoBottomPosition: { x: number; y: number };
}
