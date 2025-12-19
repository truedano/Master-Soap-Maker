
import { OilData, FAQItem } from './types';

// 五力數值參考自標準皂化價與脂肪酸比例表
export const OILS: OilData[] = [
  { 
    id: 'coconut', name: '椰子油 (Coconut)', ins: 258, sap: 0.190, 
    hardness: 79, cleansing: 67, conditioning: 10, bubbly: 67, creamy: 12,
    description: '【功效：深層清潔、硬度、起泡】具有極強的洗淨力，能產生大且豐富的泡沫。是製作手工皂不可或缺的基礎油脂，能讓皂體堅硬不易軟爛。' 
  },
  { 
    id: 'palm', name: '棕櫚油 (Palm)', ins: 145, sap: 0.141, 
    hardness: 50, cleansing: 1, conditioning: 49, bubbly: 1, creamy: 49,
    description: '【功效：硬度、耐用度、紮實度】主要提供手工皂的堅硬度，讓皂體在水水中不易溶化變形。雖然沒什麼泡沫，但能使泡沫變得細緻。' 
  },
  { 
    id: 'olive', name: '橄欖油 (Olive)', ins: 109, sap: 0.134, 
    hardness: 17, cleansing: 0, conditioning: 82, bubbly: 0, creamy: 17,
    description: '【功效：保濕滋潤、深層修復、細緻泡】含有豐富的維他命與角鯊烯，能深層滋潤皮膚並鎖住水分。洗感溫和，適合嬰兒及過敏性肌膚。' 
  },
  { 
    id: 'sweet_almond', name: '甜杏仁油 (Sweet Almond)', ins: 97, sap: 0.136, 
    hardness: 7, cleansing: 0, conditioning: 89, bubbly: 0, creamy: 7,
    description: '【功效：軟化皮膚、保濕、舒緩】洗感非常輕柔滑順，能改善皮膚乾燥癢。對於紅腫或受傷的皮膚有極佳的舒緩與修復效果。' 
  },
  { 
    id: 'castor', name: '蓖麻油 (Castor)', ins: 95, sap: 0.128, 
    hardness: 0, cleansing: 0, conditioning: 98, bubbly: 90, creamy: 90,
    description: '【功效：增加泡量、泡沫持久、柔軟】具有吸濕特性，能將水分吸收在皮膚表面。其特有的蓖麻酸能產生絲綢般棉密、且不易消失的泡沫。' 
  },
  { 
    id: 'shea_butter', name: '乳油木果脂 (Shea Butter)', ins: 116, sap: 0.128, 
    hardness: 45, cleansing: 0, conditioning: 54, bubbly: 0, creamy: 45,
    description: '【功效：防護屏障、抗敏、乳霜洗感】含有高度非皂化成分，能在皮膚形成保護膜。能產生如奶油般細緻的泡沫，具優異的保濕效果。' 
  },
  { 
    id: 'rice_bran', name: '糙米油 (Rice Bran)', ins: 70, sap: 0.128, 
    hardness: 26, cleansing: 0, conditioning: 73, bubbly: 0, creamy: 26,
    description: '【功效：抗老化、美白、軟化角質】富含維他命E與穀維素，能抑制黑色素生成。洗感清爽不油膩，能使肥皂產生獨特的洗淨力。' 
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
