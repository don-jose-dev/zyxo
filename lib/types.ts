// TypeScript interfaces for content types

export interface Contact {
  whatsapp: string;
  email: string;
  website: string;
}

export interface Brand {
  name: string;
  tagline: string;
  contact: Contact;
}

export interface Hero {
  headline: string;
  subhead: string;
  cta: string;
}

export interface Module {
  title: string;
  desc: string;
  icon: 'Bot' | 'MapPin' | 'FileText' | 'Sparkles';
}

export interface SystemSpecs {
  title: string;
  subtitle: string;
  modules: Module[];
}

export interface Package {
  name: string;
  label: string;
  price: string;
  currency: string;
  suffix: string;
  timeline: string;
  desc: string;
  why?: string;
  highlight?: boolean;
  features: string[];
}

export interface Pricing {
  title: string;
  subtitle: string;
  packages: Package[];
}

export interface ComparisonRow {
  item: string;
  a: boolean;
  b: boolean;
}

export interface Comparison {
  title: string;
  subtitle: string;
  headers: [string, string, string];
  rows: ComparisonRow[];
}

export interface Risks {
  title: string;
  items: string[];
}

export interface FinalCta {
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

export interface Content {
  brand: Brand;
  hero: Hero;
  systemSpecs: SystemSpecs;
  pricing: Pricing;
  comparison: Comparison;
  risks: Risks;
  finalCta: FinalCta;
}

