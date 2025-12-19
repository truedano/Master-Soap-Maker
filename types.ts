
export interface OilQualities {
  hardness: number;
  cleansing: number;
  conditioning: number;
  bubbly: number;
  creamy: number;
}

export interface OilData extends OilQualities {
  id: string;
  name: string;
  ins: number;
  sap: number; // Saponification value for NaOH
  description: string;
}

export interface FormulaItem {
  oilId: string;
  weight: number;
}

export enum SectionType {
  CALCULATOR = 'calculator',
  PRE_PRODUCTION = 'pre-production',
  PRODUCTION = 'production',
  POST_PRODUCTION = 'post-production',
  FAQ = 'faq'
}

export interface FAQItem {
  symptom: string;
  reason: string;
  solution: string;
}
