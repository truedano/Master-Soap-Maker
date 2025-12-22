
import { OilData, FAQItem } from './types';

// 五力數值參考自標準皂化價與脂肪酸比例表
// 價格參考單位：NTD / 1000g (1kg)
export const OILS: OilData[] = [
  // 基礎三油
  {
    id: 'coconut', name: '椰子油 (Coconut)', ins: 258, sap: 0.190,
    hardness: 79, cleansing: 67, conditioning: 10, bubbly: 67, creamy: 12,
    defaultPrice: 180,
    description: '【基礎類】具有極強的洗淨力，能產生大且豐富的泡沫。是製作手工皂不可或缺的基礎油脂，能讓皂體堅硬。'
  },
  {
    id: 'palm', name: '棕櫚油 (Palm)', ins: 145, sap: 0.141,
    hardness: 50, cleansing: 1, conditioning: 49, bubbly: 1, creamy: 49,
    defaultPrice: 160,
    description: '【基礎類】主要提供手工皂的堅硬度，讓皂體在水中不易溶化變形。雖然沒什麼泡沫，但能使泡沫變得細緻。'
  },
  {
    id: 'olive', name: '橄欖油 (Olive)', ins: 109, sap: 0.134,
    hardness: 17, cleansing: 0, conditioning: 82, bubbly: 0, creamy: 17,
    defaultPrice: 350,
    description: '【基礎類】含有豐富的維他命與角鯊烯。洗感溫和，適合嬰兒及過敏性肌膚。'
  },
  // 1. 高級滋潤類
  {
    id: 'avocado', name: '酪梨油 (Avocado)', ins: 129, sap: 0.133,
    hardness: 22, cleansing: 0, conditioning: 70, bubbly: 0, creamy: 22,
    defaultPrice: 550,
    description: '【高級滋潤】深層清潔、極度溫和。含有豐富維生素 A、D、E，非常適合嬰兒、過敏性或乾燥肌。未精製款成皂呈淡綠色。'
  },
  {
    id: 'macadamia', name: '澳洲堅果油 (Macadamia)', ins: 119, sap: 0.139,
    hardness: 18, cleansing: 0, conditioning: 82, bubbly: 0, creamy: 18,
    defaultPrice: 650,
    description: '【高級滋潤】抗老化之王。富含棕櫚油酸，與人類皮脂接近，容易被吸收，有助修復老化肌膚。'
  },
  {
    id: 'hazelnut', name: '榛果油 (Hazelnut)', ins: 94, sap: 0.136,
    hardness: 10, cleansing: 0, conditioning: 90, bubbly: 0, creamy: 10,
    defaultPrice: 600,
    description: '【高級滋潤】保濕且清爽。滲透力極佳，雖滋潤但不阻塞毛孔，適合油性或混合肌保濕用。'
  },
  {
    id: 'apricot', name: '杏桃核仁油 (Apricot Kernel)', ins: 91, sap: 0.135,
    hardness: 7, cleansing: 0, conditioning: 93, bubbly: 0, creamy: 7,
    defaultPrice: 500,
    description: '【高級滋潤】輕柔透氣。比甜杏仁油更清爽，富含礦物質，能舒緩發癢乾燥皮膚。'
  },
  {
    id: 'sweet_almond', name: '甜杏仁油 (Sweet Almond)', ins: 97, sap: 0.136,
    hardness: 7, cleansing: 0, conditioning: 89, bubbly: 0, creamy: 7,
    defaultPrice: 480,
    description: '【高級滋潤】洗感輕柔滑順，能軟化皮膚，改善乾燥癢感。'
  },
  // 2. 硬度與質感調節
  {
    id: 'cocoa_butter', name: '可可脂 (Cocoa Butter)', ins: 157, sap: 0.137,
    hardness: 61, cleansing: 0, conditioning: 38, bubbly: 0, creamy: 61,
    defaultPrice: 750,
    description: '【質感調節】增加硬度與保護膜。能在皮膚形成鎖水膜，添加量建議 5~15%，過多皂體易脆。'
  },
  {
    id: 'mango_butter', name: '芒果脂 (Mango Butter)', ins: 146, sap: 0.137,
    hardness: 49, cleansing: 0, conditioning: 51, bubbly: 0, creamy: 49,
    defaultPrice: 850,
    description: '【質感調節】類可可脂但更溫和。保濕效果佳，增加皂硬度與滑順感。'
  },
  {
    id: 'shea_butter', name: '乳油木果脂 (Shea)', ins: 116, sap: 0.128,
    hardness: 45, cleansing: 0, conditioning: 54, bubbly: 0, creamy: 45,
    defaultPrice: 500,
    description: '【質感調節】防護屏障、抗敏、乳霜洗感。含有高度非皂化成分，能在皮膚形成保護膜。'
  },
  {
    id: 'jojoba', name: '荷荷芭油 (Jojoba)', ins: 11, sap: 0.069,
    hardness: 0, cleansing: 0, conditioning: 100, bubbly: 0, creamy: 0,
    defaultPrice: 1500,
    description: '【質感調節】液態蠟、洗髮神器。能在表面形成保護層，常作為超脂添加，讓洗感升級。'
  },
  // 3. 特殊療效與修復
  {
    id: 'neem', name: '苦楝油 (Neem)', ins: 124, sap: 0.139,
    hardness: 40, cleansing: 0, conditioning: 60, bubbly: 0, creamy: 40,
    defaultPrice: 800,
    description: '【特殊療效】抗菌驅蟲。對抗濕疹、痘痘效果極佳。味道極重，建議搭配強效精油。'
  },
  {
    id: 'wheatgerm', name: '小麥胚芽油 (Wheatgerm)', ins: 58, sap: 0.131,
    hardness: 15, cleansing: 0, conditioning: 85, bubbly: 0, creamy: 15,
    defaultPrice: 700,
    description: '【特殊療效】抗氧化、維生E寶庫。延緩肥皂酸敗，修復受損肌膚（疤痕）。'
  },
  {
    id: 'evening_primrose', name: '月見草油 (Evening Primrose)', ins: 30, sap: 0.135,
    hardness: 5, cleansing: 0, conditioning: 95, bubbly: 0, creamy: 5,
    defaultPrice: 1200,
    description: '【特殊療效】改善異位性皮膚炎。富含亞麻油酸，極易氧化，建議作為超脂。'
  },
  {
    id: 'rosehip', name: '玫瑰果油 (Rosehip)', ins: 16, sap: 0.135,
    hardness: 5, cleansing: 0, conditioning: 95, bubbly: 0, creamy: 5,
    defaultPrice: 2800,
    description: '【特殊療效】修復疤痕、美白。幫助淡化細紋與色素，昂貴且易氧化。'
  },
  {
    id: 'castor', name: '蓖麻油 (Castor)', ins: 95, sap: 0.128,
    hardness: 0, cleansing: 0, conditioning: 98, bubbly: 90, creamy: 90,
    defaultPrice: 280,
    description: '【特殊療效】增加泡量與泡沫持久。具有視濕特性，能產生絲綢般棉密泡。'
  },
  // 4. 本土與平價
  {
    id: 'camellia', name: '山茶花油 (Camellia)', ins: 108, sap: 0.136,
    hardness: 10, cleansing: 0, conditioning: 90, bubbly: 0, creamy: 10,
    defaultPrice: 600,
    description: '【本土平價】東方橄欖油。台灣在地好油，對頭髮頭皮極佳。比橄欖油清爽。'
  },
  {
    id: 'canola', name: '芥花油 (Canola)', ins: 56, sap: 0.132,
    hardness: 6, cleansing: 0, conditioning: 94, bubbly: 0, creamy: 6,
    defaultPrice: 120,
    description: '【本土平價】練習用、高保濕。價格便宜，泡沫細緻溫和，常用於取代橄欖油。'
  },
  {
    id: 'lard', name: '豬油 (Lard)', ins: 139, sap: 0.138,
    hardness: 41, cleansing: 0, conditioning: 59, bubbly: 0, creamy: 41,
    defaultPrice: 100,
    description: '【本土平價】傳統古早味、極硬。泡沫綿密、皂體雪白堅硬且溫和。'
  },
];

export const FAQS: FAQItem[] = [
  { symptom: '皂粉 (白粉)', reason: '表面接觸空氣、保溫不足、水量過多', solution: '切掉表面即可使用，下次入模後噴酒精或封保鮮膜。' },
  { symptom: '鬆糕 (易碎掉粉)', reason: '攪拌不足、溫度過低導致油鹼未融合', solution: '失敗。可刨絲熱製成再生皂。' },
  { symptom: '冒汗 (水珠)', reason: '環境濕度太高，皂體吸水', solution: '擦乾即可，開除濕機保持乾燥。' },
  { symptom: '油水分離', reason: '攪拌不足就入模', solution: '倒回鍋中繼續攪拌至 Trace。' },
  { symptom: '火山爆發', reason: '溫度過高、蜂蜜/牛奶糖分過高', solution: '製作含糖/乳皂時不需保溫，甚至需冷藏。' },
];

export const QUALITY_RANGES = {
  hardness: { min: 29, max: 54, label: '硬度' },
  cleansing: { min: 12, max: 22, label: '清潔力' },
  conditioning: { min: 44, max: 69, label: '保濕度' },
  bubbly: { min: 14, max: 46, label: '起泡力' },
  creamy: { min: 16, max: 48, label: '穩定度' },
};

// 統一五力視覺語彙定義
export const QUALITY_UI = {
  cleansing: { label: '清潔', icon: 'Sparkles', color: '#e11d48', tailwind: 'bg-rose-600', bg: 'bg-rose-600' },
  bubbly: { label: '起泡', icon: 'Zap', color: '#ea580c', tailwind: 'bg-orange-600', bg: 'bg-orange-600' },
  hardness: { label: '硬度', icon: 'Shield', color: '#78716c', tailwind: 'bg-stone-500', bg: 'bg-stone-500' },
  conditioning: { label: '保濕', icon: 'Droplets', color: '#0284c7', tailwind: 'bg-sky-600', bg: 'bg-sky-600' },
  creamy: { label: '穩定', icon: 'Waves', color: '#16a34a', tailwind: 'bg-green-600', bg: 'bg-green-600' },
} as const;

export const PRESETS = [
  {
    id: 'marseille',
    name: '經典馬賽皂 (72% 橄欖)',
    description: '最經典的配方，極致溫和與滋潤。',
    items: [
      { oilId: 'olive', weight: 360 }, // 72%
      { oilId: 'coconut', weight: 90 }, // 18%
      { oilId: 'palm', weight: 50 }, // 10%
    ]
  },
  {
    id: 'cleansing',
    name: '清爽加倍 (家事/洗髮)',
    description: '較高的椰子油比例，提供強大的洗淨與起泡力。',
    items: [
      { oilId: 'coconut', weight: 200 }, // 40%
      { oilId: 'palm', weight: 150 }, // 30%
      { oilId: 'olive', weight: 150 }, // 30%
    ]
  },
  {
    id: 'moisturizing',
    name: '極致滋潤 (乾性肌)',
    description: '包含乳油木果脂與酪梨油，適合秋冬。',
    items: [
      { oilId: 'olive', weight: 200 }, // 40%
      { oilId: 'coconut', weight: 75 }, // 15%
      { oilId: 'palm', weight: 75 }, // 15%
      { oilId: 'shea_butter', weight: 75 }, // 15%
      { oilId: 'avocado', weight: 75 }, // 15%
    ]
  }
];
