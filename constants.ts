
import { OilData, FAQItem } from './types';

// 五力數值參考自標準皂化價與脂肪酸比例表
// 價格參考單位：NTD / 1000g (1kg)
export const OILS: OilData[] = [
  // 基礎三油
  {
    id: 'coconut', name: 'oils.coconut.name', ins: 258, sap: 0.190,
    hardness: 79, cleansing: 67, conditioning: 10, bubbly: 67, creamy: 12,
    defaultPrice: 180,
    description: 'oils.coconut.description'
  },
  {
    id: 'palm', name: 'oils.palm.name', ins: 145, sap: 0.141,
    hardness: 50, cleansing: 1, conditioning: 49, bubbly: 1, creamy: 49,
    defaultPrice: 160,
    description: 'oils.palm.description'
  },
  {
    id: 'olive', name: 'oils.olive.name', ins: 109, sap: 0.134,
    hardness: 17, cleansing: 0, conditioning: 82, bubbly: 0, creamy: 17,
    defaultPrice: 350,
    description: 'oils.olive.description'
  },
  // 1. 高級滋潤類
  {
    id: 'avocado', name: 'oils.avocado.name', ins: 129, sap: 0.133,
    hardness: 22, cleansing: 0, conditioning: 70, bubbly: 0, creamy: 22,
    defaultPrice: 550,
    description: 'oils.avocado.description'
  },
  {
    id: 'macadamia', name: 'oils.macadamia.name', ins: 119, sap: 0.139,
    hardness: 18, cleansing: 0, conditioning: 82, bubbly: 0, creamy: 18,
    defaultPrice: 650,
    description: 'oils.macadamia.description'
  },
  {
    id: 'hazelnut', name: 'oils.hazelnut.name', ins: 94, sap: 0.136,
    hardness: 10, cleansing: 0, conditioning: 90, bubbly: 0, creamy: 10,
    defaultPrice: 600,
    description: 'oils.hazelnut.description'
  },
  {
    id: 'apricot', name: 'oils.apricot.name', ins: 91, sap: 0.135,
    hardness: 7, cleansing: 0, conditioning: 93, bubbly: 0, creamy: 7,
    defaultPrice: 500,
    description: 'oils.apricot.description'
  },
  {
    id: 'sweet_almond', name: 'oils.sweet_almond.name', ins: 97, sap: 0.136,
    hardness: 7, cleansing: 0, conditioning: 89, bubbly: 0, creamy: 7,
    defaultPrice: 480,
    description: 'oils.sweet_almond.description'
  },
  // 2. 硬度與質感調節
  {
    id: 'cocoa_butter', name: 'oils.cocoa_butter.name', ins: 157, sap: 0.137,
    hardness: 61, cleansing: 0, conditioning: 38, bubbly: 0, creamy: 61,
    defaultPrice: 750,
    description: 'oils.cocoa_butter.description'
  },
  {
    id: 'mango_butter', name: 'oils.mango_butter.name', ins: 146, sap: 0.137,
    hardness: 49, cleansing: 0, conditioning: 51, bubbly: 0, creamy: 49,
    defaultPrice: 850,
    description: 'oils.mango_butter.description'
  },
  {
    id: 'shea_butter', name: 'oils.shea_butter.name', ins: 116, sap: 0.128,
    hardness: 45, cleansing: 0, conditioning: 54, bubbly: 0, creamy: 45,
    defaultPrice: 500,
    description: 'oils.shea_butter.description'
  },
  {
    id: 'jojoba', name: 'oils.jojoba.name', ins: 11, sap: 0.069,
    hardness: 0, cleansing: 0, conditioning: 100, bubbly: 0, creamy: 0,
    defaultPrice: 1500,
    description: 'oils.jojoba.description'
  },
  // 3. 特殊療效與修復
  {
    id: 'neem', name: 'oils.neem.name', ins: 124, sap: 0.139,
    hardness: 40, cleansing: 0, conditioning: 60, bubbly: 0, creamy: 40,
    defaultPrice: 800,
    description: 'oils.neem.description'
  },
  {
    id: 'wheatgerm', name: 'oils.wheatgerm.name', ins: 58, sap: 0.131,
    hardness: 15, cleansing: 0, conditioning: 85, bubbly: 0, creamy: 15,
    defaultPrice: 700,
    description: 'oils.wheatgerm.description'
  },
  {
    id: 'evening_primrose', name: 'oils.evening_primrose.name', ins: 30, sap: 0.135,
    hardness: 5, cleansing: 0, conditioning: 95, bubbly: 0, creamy: 5,
    defaultPrice: 1200,
    description: 'oils.evening_primrose.description'
  },
  {
    id: 'rosehip', name: 'oils.rosehip.name', ins: 16, sap: 0.135,
    hardness: 5, cleansing: 0, conditioning: 95, bubbly: 0, creamy: 5,
    defaultPrice: 2800,
    description: 'oils.rosehip.description'
  },
  {
    id: 'castor', name: 'oils.castor.name', ins: 95, sap: 0.128,
    hardness: 0, cleansing: 0, conditioning: 98, bubbly: 90, creamy: 90,
    defaultPrice: 280,
    description: 'oils.castor.description'
  },
  // 4. 本土與平價
  {
    id: 'camellia', name: 'oils.camellia.name', ins: 108, sap: 0.136,
    hardness: 10, cleansing: 0, conditioning: 90, bubbly: 0, creamy: 10,
    defaultPrice: 600,
    description: 'oils.camellia.description'
  },
  {
    id: 'canola', name: 'oils.canola.name', ins: 56, sap: 0.132,
    hardness: 6, cleansing: 0, conditioning: 94, bubbly: 0, creamy: 6,
    defaultPrice: 120,
    description: 'oils.canola.description'
  },
  {
    id: 'lard', name: 'oils.lard.name', ins: 139, sap: 0.138,
    hardness: 41, cleansing: 0, conditioning: 59, bubbly: 0, creamy: 41,
    defaultPrice: 100,
    description: 'oils.lard.description'
  },
];

export const FAQS: FAQItem[] = [
  { symptom: 'faqs.powder.symptom', reason: 'faqs.powder.reason', solution: 'faqs.powder.solution' },
  { symptom: 'faqs.sponge.symptom', reason: 'faqs.sponge.reason', solution: 'faqs.sponge.solution' },
  { symptom: 'faqs.sweat.symptom', reason: 'faqs.sweat.reason', solution: 'faqs.sweat.solution' },
  { symptom: 'faqs.seperation.symptom', reason: 'faqs.seperation.reason', solution: 'faqs.seperation.solution' },
  { symptom: 'faqs.volcano.symptom', reason: 'faqs.volcano.reason', solution: 'faqs.volcano.solution' },
];

export const QUALITY_RANGES = {
  hardness: { min: 29, max: 54, label: 'quality.hardness' },
  cleansing: { min: 12, max: 22, label: 'quality.cleansing' },
  conditioning: { min: 44, max: 69, label: 'quality.conditioning' },
  bubbly: { min: 14, max: 46, label: 'quality.bubbly' },
  creamy: { min: 16, max: 48, label: 'quality.creamy' },
};

// 統一五力視覺語彙定義
export const QUALITY_UI = {
  cleansing: { label: 'quality.ui.cleansing', icon: 'Sparkles', color: '#e11d48', tailwind: 'bg-rose-600', bg: 'bg-rose-600' },
  bubbly: { label: 'quality.ui.bubbly', icon: 'Zap', color: '#ea580c', tailwind: 'bg-orange-600', bg: 'bg-orange-600' },
  hardness: { label: 'quality.ui.hardness', icon: 'Shield', color: '#78716c', tailwind: 'bg-stone-500', bg: 'bg-stone-500' },
  conditioning: { label: 'quality.ui.conditioning', icon: 'Droplets', color: '#0284c7', tailwind: 'bg-sky-600', bg: 'bg-sky-600' },
  creamy: { label: 'quality.ui.creamy', icon: 'Waves', color: '#16a34a', tailwind: 'bg-green-600', bg: 'bg-green-600' },
} as const;

export const PRESETS = [
  {
    id: 'marseille',
    name: 'presets.marseille.name',
    description: 'presets.marseille.description',
    items: [
      { oilId: 'olive', weight: 360 }, // 72%
      { oilId: 'coconut', weight: 90 }, // 18%
      { oilId: 'palm', weight: 50 }, // 10%
    ]
  },
  {
    id: 'cleansing',
    name: 'presets.cleansing.name',
    description: 'presets.cleansing.description',
    items: [
      { oilId: 'coconut', weight: 200 }, // 40%
      { oilId: 'palm', weight: 150 }, // 30%
      { oilId: 'olive', weight: 150 }, // 30%
    ]
  },
  {
    id: 'moisturizing',
    name: 'presets.moisturizing.name',
    description: 'presets.moisturizing.description',
    items: [
      { oilId: 'olive', weight: 200 }, // 40%
      { oilId: 'coconut', weight: 75 }, // 15%
      { oilId: 'palm', weight: 75 }, // 15%
      { oilId: 'shea_butter', weight: 75 }, // 15%
      { oilId: 'avocado', weight: 75 }, // 15%
    ]
  }
];
