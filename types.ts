
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
  defaultPrice?: number; // Price per 1000g (1kg)
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

export interface SavedFormula {
  id: string;
  name: string;
  items: FormulaItem[];
  waterRatio?: number;
  lyeDiscount?: number;
  additives?: AdditiveItem[];
  date: number;
}

export type AdditiveType = 'scent' | 'color' | 'other';

export interface AdditiveItem {
  id: string;
  name: string;
  type: AdditiveType;
  amount: number;
  unit: 'g' | '%'; // % is based on total oil weight
  price: number; // Price per unit
}
