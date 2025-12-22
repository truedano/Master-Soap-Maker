
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { OILS, QUALITY_RANGES, QUALITY_UI } from '../constants';
import { FormulaItem, OilQualities, OilData } from '../types';
import { 
  Calculator as CalcIcon, 
  Trash2, 
  PlusCircle, 
  ChevronDown, 
  Scale,
  Droplets,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Info,
  Lightbulb,
  Search,
  Shield,
  Zap,
  Waves,
  ArrowDownCircle,
  ArrowUpCircle,
  Dna,
  Check,
  ZapIcon
} from 'lucide-react';

// 雷達圖組件
const RadarChart: React.FC<{ qualities: OilQualities, previewQualities?: OilQualities | null }> = ({ qualities, previewQualities }) => {
  const size = 300;
  const center = size / 2;
  const radius = size * 0.35;
  
  const points = [
    { key: 'cleansing', label: QUALITY_UI.cleansing.label },
    { key: 'bubbly', label: QUALITY_UI.bubbly.label },
    { key: 'hardness', label: QUALITY_UI.hardness.label },
    { key: 'conditioning', label: QUALITY_UI.conditioning.label },
    { key: 'creamy', label: QUALITY_UI.creamy.label },
  ] as const;

  const getCoordinates = (value: number, index: number, max: number = 100) => {
    const angle = (Math.PI * 2 * index) / points.length - Math.PI / 2;
    const r = (Math.min(value, 100) / max) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const dataPath = points.map((p, i) => {
    const coords = getCoordinates(qualities[p.key as keyof OilQualities], i);
    return `${coords.x},${coords.y}`;
  }).join(' ');

  const previewPath = previewQualities ? points.map((p, i) => {
    const coords = getCoordinates(previewQualities[p.key as keyof OilQualities], i);
    return `${coords.x},${coords.y}`;
  }).join(' ') : null;

  const idealMaxPath = points.map((p, i) => {
    const range = QUALITY_RANGES[p.key as keyof typeof QUALITY_RANGES];
    const coords = getCoordinates(range.max, i);
    return `${coords.x},${coords.y}`;
  }).join(' ');

  const idealMinPath = points.map((p, i) => {
    const range = QUALITY_RANGES[p.key as keyof typeof QUALITY_RANGES];
    const coords = getCoordinates(range.min, i);
    return `${coords.x},${coords.y}`;
  }).join(' ');

  return (
    <div className="flex flex-col items-center w-full">
      <svg width="100%" height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {[0.2, 0.4, 0.6, 0.8, 1].map((p, i) => {
          const gridPath = points.map((_, idx) => {
            const coords = getCoordinates(100 * p, idx);
            return `${coords.x},${coords.y}`;
          }).join(' ');
          return (
            <polygon key={i} points={gridPath} className="fill-none stroke-stone-100" strokeWidth="1" />
          );
        })}
        {points.map((p, i) => {
          const coords = getCoordinates(100, i);
          return (
            <line key={i} x1={center} y1={center} x2={coords.x} y2={coords.y} className="stroke-stone-100" strokeWidth="1" />
          );
        })}
        <polygon points={idealMaxPath} className="fill-stone-200/40" />
        <polygon points={idealMinPath} className="fill-white" />
        <polygon points={idealMaxPath} className="fill-none stroke-stone-300 stroke-dashed" strokeWidth="1" strokeDasharray="4,4" />
        
        {previewPath && (
          <polygon points={previewPath} className="fill-amber-400/20 stroke-amber-400/40 stroke-2 stroke-dashed animate-pulse" />
        )}

        <polygon points={dataPath} className="fill-amber-600/15 stroke-amber-600 shadow-xl" strokeWidth="3" strokeLinejoin="round" />
        
        {points.map((p, i) => {
          const coords = getCoordinates(qualities[p.key as keyof OilQualities], i);
          return (
            <circle key={i} cx={coords.x} cy={coords.y} r="4" className="fill-amber-700 stroke-white stroke-2 shadow-sm" />
          );
        })}
        {points.map((p, i) => {
          const coords = getCoordinates(125, i);
          const ui = QUALITY_UI[p.key as keyof typeof QUALITY_UI];
          return (
            <text key={i} x={coords.x} y={coords.y} textAnchor="middle" className="text-[12px] font-black" fill={ui.color} dominantBaseline="middle">
              {p.label}
            </text>
          );
        })}
      </svg>
      <div className="flex gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-stone-200 border border-stone-300 rounded-sm"></div>
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">標準範圍</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-amber-600/20 border border-amber-600 rounded-sm"></div>
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">目前配方</span>
        </div>
        {previewQualities && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-400/20 border border-amber-400 border-dashed rounded-sm"></div>
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">預覽</span>
          </div>
        )}
      </div>
    </div>
  );
};

// 自定義下拉選單組件
const CustomOilSelect: React.FC<{
  value: string;
  onChange: (id: string) => void;
  onHover: (oil: OilData | null) => void;
  lackingKeys: string[];
}> = ({ value, onChange, onHover, lackingKeys }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOil = OILS.find(o => o.id === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onHover(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onHover]);

  const getSmartTags = (oil: OilData) => {
    const qualities = [
      { key: 'hardness', label: '硬度', val: oil.hardness },
      { key: 'cleansing', label: '清潔', val: oil.cleansing },
      { key: 'conditioning', label: '滋潤', val: oil.conditioning },
      { key: 'bubbly', label: '多泡', val: oil.bubbly },
      { key: 'creamy', label: '綿密', val: oil.creamy },
    ];
    const topTags = qualities.filter(q => q.val > 35).sort((a, b) => b.val - a.val).slice(0, 2).map(q => q.label);
    const isRecommended = lackingKeys.some(key => oil[key as keyof OilQualities] >= 45);
    const helpReason = lackingKeys.filter(key => oil[key as keyof OilQualities] >= 45).map(key => QUALITY_UI[key as keyof typeof QUALITY_UI].label);

    return { topTags, isRecommended, helpReason };
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3.5 bg-white border border-stone-200 rounded-xl flex items-center justify-between outline-none focus:ring-4 focus:ring-amber-500/20 text-stone-700 font-bold transition-all"
      >
        <span className="truncate flex items-center gap-2">
          {selectedOil?.name}
          <span className="text-stone-300 font-normal text-xs truncate">
            ({getSmartTags(selectedOil!).topTags.join('、')})
          </span>
        </span>
        <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full max-h-[300px] bg-white border border-stone-100 rounded-2xl shadow-2xl overflow-y-auto no-scrollbar animate-fade-in">
          {OILS.map((oil) => {
            const tags = getSmartTags(oil);
            return (
              <div
                key={oil.id}
                onMouseEnter={() => onHover(oil)}
                onMouseLeave={() => onHover(null)}
                onClick={() => {
                  onChange(oil.id);
                  setIsOpen(false);
                  onHover(null);
                }}
                className={`flex items-center justify-between p-4 cursor-pointer transition-colors border-b border-stone-50 last:border-none ${
                  value === oil.id ? 'bg-amber-50' : 'hover:bg-stone-50'
                }`}
              >
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    {tags.isRecommended && <span className="text-amber-500 text-xs">✨</span>}
                    <span className={`text-sm font-bold ${tags.isRecommended ? 'text-amber-900' : 'text-stone-700'}`}>
                      {oil.name}
                    </span>
                    {value === oil.id && <Check className="w-3.5 h-3.5 text-amber-600" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-stone-400 font-medium">{tags.topTags.join('、')}</span>
                    {tags.isRecommended && (
                      <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-black">
                        補足：{tags.helpReason.join('、')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-[10px] font-black text-stone-300">INS {oil.ins}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface CalculatorProps {
  onFindOil: (quality: string) => void;
}

export const Calculator: React.FC<CalculatorProps> = ({ onFindOil }) => {
  const [items, setItems] = useState<FormulaItem[]>([
    { oilId: 'coconut', weight: 150 },
    { oilId: 'palm', weight: 100 },
    { oilId: 'olive', weight: 250 },
  ]);
  const [waterRatio, setWaterRatio] = useState<number>(2.3);
  
  // 影子預覽狀態
  const [hoveredOil, setHoveredOil] = useState<OilData | null>(null);
  const [previewMode, setPreviewMode] = useState<'replacement' | 'addition' | null>(null);
  const [hoveringSlotIndex, setHoveringSlotIndex] = useState<number | null>(null);

  const results = useMemo(() => {
    const calculate = (formulaItems: FormulaItem[]) => {
      let totalWeight = 0;
      let totalInsWeight = 0;
      let totalNaoh = 0;
      const totalQualities: OilQualities = { hardness: 0, cleansing: 0, conditioning: 0, bubbly: 0, creamy: 0 };

      formulaItems.forEach(item => {
        const oil = OILS.find(o => o.id === item.oilId);
        if (oil && item.weight > 0) {
          totalWeight += item.weight;
          totalInsWeight += (oil.ins * item.weight);
          totalNaoh += (oil.sap * item.weight);
          totalQualities.hardness += (oil.hardness * item.weight);
          totalQualities.cleansing += (oil.cleansing * item.weight);
          totalQualities.conditioning += (oil.conditioning * item.weight);
          totalQualities.bubbly += (oil.bubbly * item.weight);
          totalQualities.creamy += (oil.creamy * item.weight);
        }
      });

      const avgQualities: OilQualities = {
        hardness: totalWeight > 0 ? Math.round(totalQualities.hardness / totalWeight) : 0,
        cleansing: totalWeight > 0 ? Math.round(totalQualities.cleansing / totalWeight) : 0,
        conditioning: totalWeight > 0 ? Math.round(totalQualities.conditioning / totalWeight) : 0,
        bubbly: totalWeight > 0 ? Math.round(totalQualities.bubbly / totalWeight) : 0,
        creamy: totalWeight > 0 ? Math.round(totalQualities.creamy / totalWeight) : 0,
      };

      const avgIns = totalWeight > 0 ? Number((totalInsWeight / totalWeight).toFixed(1)) : 0;
      return { totalWeight, avgIns, totalNaoh, qualities: avgQualities };
    };

    const current = calculate(items);
    
    // 計算預覽結果
    let preview = null;
    if (hoveredOil) {
      const previewItems = [...items];
      if (previewMode === 'replacement' && hoveringSlotIndex !== null) {
        // 替換模式：模擬更換油品
        previewItems[hoveringSlotIndex] = { ...previewItems[hoveringSlotIndex], oilId: hoveredOil.id };
        if (previewItems[hoveringSlotIndex].weight === 0) previewItems[hoveringSlotIndex].weight = 100;
      } else {
        // 新增模式：模擬加入補位重量 (15% 總重)
        const suggestWeight = Math.max(50, Math.round(current.totalWeight * 0.15));
        const existingIdx = previewItems.findIndex(i => i.oilId === hoveredOil.id);
        if (existingIdx > -1) {
          previewItems[existingIdx] = { ...previewItems[existingIdx], weight: previewItems[existingIdx].weight + suggestWeight };
        } else {
          previewItems.push({ oilId: hoveredOil.id, weight: suggestWeight });
        }
      }
      preview = calculate(previewItems);
    }

    const lackingKeys = (Object.keys(current.qualities) as Array<keyof OilQualities>).filter(key => {
        return current.totalWeight > 0 && current.qualities[key] < QUALITY_RANGES[key].min;
    });

    const suggestions: { text: string; qualityKey: string; recommend: string[] }[] = [];
    if (current.avgIns > 0) {
      if (current.avgIns < 120) suggestions.push({ text: "INS 過低 (軟爛)", qualityKey: 'ins', recommend: ["椰子油", "可可脂"] });
      if (current.avgIns > 170) suggestions.push({ text: "INS 過高 (脆裂)", qualityKey: 'ins', recommend: ["甜杏仁油", "橄欖油"] });
      if (current.qualities.cleansing > QUALITY_RANGES.cleansing.max) suggestions.push({ text: "清潔太強", qualityKey: 'conditioning', recommend: ["乳油木果脂", "橄欖油"] });
      if (current.qualities.conditioning < QUALITY_RANGES.conditioning.min) suggestions.push({ text: "保濕不足", qualityKey: 'conditioning', recommend: ["酪梨油", "榛果油", "山茶花油"] });
      if (current.qualities.hardness < QUALITY_RANGES.hardness.min) suggestions.push({ text: "硬度不足", qualityKey: 'hardness', recommend: ["棕櫚油", "可可脂"] });
      if (current.qualities.bubbly < QUALITY_RANGES.bubbly.min) suggestions.push({ text: "起泡不足", qualityKey: 'bubbly', recommend: ["椰子油", "蓖麻油"] });
    }

    let personality = "調整中";
    if (current.totalWeight > 0) {
      if (current.qualities.conditioning > 60) personality = "溫和滋潤型";
      else if (current.qualities.cleansing > 18) personality = "強效清爽型";
      else if (current.qualities.hardness > 45) personality = "極硬耐用型";
      else if (current.avgIns >= 120 && current.avgIns <= 170) personality = "經典平衡型";
    }

    return {
      totalWeight: current.totalWeight,
      avgIns: current.avgIns,
      totalNaoh: Number(current.totalNaoh.toFixed(1)),
      water: Number((current.totalNaoh * waterRatio).toFixed(1)),
      qualities: current.qualities,
      previewQualities: preview?.qualities || null,
      suggestions,
      lackingKeys,
      personality
    };
  }, [items, waterRatio, hoveredOil, previewMode, hoveringSlotIndex]);

  // 智慧一鍵修復功能
  const quickFixWithOil = (oilName: string) => {
    const oil = OILS.find(o => o.name.includes(oilName));
    if (oil) {
      // 智慧重量：約佔總重 15% 或 至少 50g
      const suggestWeight = Math.max(50, Math.round(results.totalWeight * 0.15));
      const existingIdx = items.findIndex(i => i.oilId === oil.id);
      
      if (existingIdx > -1) {
        updateItem(existingIdx, 'weight', items[existingIdx].weight + suggestWeight);
      } else {
        setItems([...items, { oilId: oil.id, weight: suggestWeight }]);
      }
    }
  };

  const updateItem = (index: number, field: keyof FormulaItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const addItem = () => {
    setItems([...items, { oilId: OILS[0].id, weight: 0 }]);
  };

  const getIndicatorStatus = (val: number, range: { min: number, max: number }) => {
    if (val === 0) return 'none';
    if (val < range.min) return 'low';
    if (val > range.max) return 'high';
    return 'ideal';
  };

  const getStatusUI = (status: 'none' | 'low' | 'high' | 'ideal') => {
    switch (status) {
      case 'low': return { color: 'text-orange-500', bg: 'bg-orange-500', icon: <ArrowDownCircle className="w-3.5 h-3.5" />, label: '不足' };
      case 'high': return { color: 'text-red-500', bg: 'bg-red-500', icon: <ArrowUpCircle className="w-3.5 h-3.5" />, label: '過度' };
      case 'ideal': return { color: 'text-green-600', bg: 'bg-green-600', icon: <CheckCircle2 className="w-3.5 h-3.5" />, label: '理想' };
      default: return { color: 'text-stone-300', bg: 'bg-stone-100', icon: null, label: '' };
    }
  };

  const getQualityIcon = (key: string) => {
    switch (key) {
      case 'hardness': return <Shield className="w-3.5 h-3.5" />;
      case 'cleansing': return <Sparkles className="w-3.5 h-3.5" />;
      case 'conditioning': return <Droplets className="w-3.5 h-3.5" />;
      case 'bubbly': return <Zap className="w-3.5 h-3.5" />;
      case 'creamy': return <Waves className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="bg-[#2d2926] p-4 md:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/20 p-1.5 rounded flex items-center justify-center">
              <CalcIcon className="w-5 h-5 text-amber-500" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">1. 配方組成 (Recipe)</h2>
          </div>
          {results.totalWeight > 0 && (
            <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20">
               <Dna className="w-3.5 h-3.5 text-amber-400" />
               <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">性格：{results.personality}</span>
            </div>
          )}
        </div>
        
        <div className="p-4 md:p-6 space-y-4">
          <div className="space-y-3">
            {items.map((item, index) => {
              const selectedOil = OILS.find(o => o.id === item.oilId);
              return (
                <div key={index} className="flex flex-col gap-2 p-4 bg-stone-50/50 rounded-2xl border border-stone-100 group hover:bg-white hover:shadow-md transition-all">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-1 w-full relative">
                      <CustomOilSelect
                        value={item.oilId}
                        lackingKeys={results.lackingKeys}
                        onChange={(id) => updateItem(index, 'oilId', id)}
                        onHover={(oil) => {
                          setHoveredOil(oil);
                          setPreviewMode(oil ? 'replacement' : null);
                          setHoveringSlotIndex(oil ? index : null);
                        }}
                      />
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="relative flex items-center bg-[#3f3a36] rounded-xl overflow-hidden group-focus-within:ring-4 ring-amber-400/50 transition-all">
                        <input
                          type="number"
                          value={item.weight || ''}
                          onChange={(e) => updateItem(index, 'weight', Number(e.target.value))}
                          className="w-24 sm:w-28 p-3.5 bg-transparent text-white font-black text-right outline-none"
                          placeholder="0"
                        />
                        <span className="px-4 text-stone-400 font-bold text-sm border-l border-stone-600/50 h-full flex items-center">g</span>
                      </div>
                      <button onClick={() => removeItem(index)} className="p-3.5 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  {selectedOil && (
                    <div className="flex flex-col gap-3 px-1 mt-1">
                      <div className="flex items-start gap-2 text-xs text-stone-500 italic leading-relaxed">
                        <Info className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>{selectedOil.description}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button onClick={addItem} className="w-full py-5 border-2 border-dashed border-stone-200 rounded-2xl text-stone-400 font-black hover:bg-stone-50 hover:border-amber-200 hover:text-amber-600 transition-all flex items-center justify-center gap-2 mt-4 uppercase tracking-widest">
            <PlusCircle className="w-5 h-5" /> 新增油脂材料
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-7 bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="bg-amber-600 p-6 text-white flex items-center gap-3">
            <Scale className="w-6 h-6" />
            <h2 className="text-xl font-bold tracking-tight">2. 精確稱重清單</h2>
          </div>
          <div className="p-8 space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-stone-400 flex items-center gap-2 border-b border-stone-100 pb-2 uppercase tracking-widest">油相部分</h3>
                  <div className="space-y-2">
                    {items.filter(i => i.weight > 0).map((item, idx) => {
                      const oil = OILS.find(o => o.id === item.oilId);
                      return (
                        <div key={idx} className="flex justify-between items-center p-3 hover:bg-stone-50 rounded-xl transition-colors">
                          <span className="text-sm font-bold text-stone-600">{oil?.name}</span>
                          <span className="font-black text-amber-700">{item.weight} g</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-stone-400 border-b border-stone-100 pb-2 uppercase tracking-widest">鹼水部分</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between p-4 bg-red-50 rounded-2xl text-sm font-bold text-red-800 border border-red-100">
                      <span>NaOH 需求量</span><span>{results.totalNaoh} g</span>
                    </div>
                    <div className="flex justify-between p-4 bg-blue-50 rounded-2xl text-sm font-bold text-blue-800 border border-blue-100">
                      <span>水量 (2.3倍)</span><span>{results.water} g</span>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </div>

        <div className="xl:col-span-5 flex flex-col gap-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 relative overflow-hidden">
            {hoveredOil && (
              <div className="absolute top-0 right-0 p-3 bg-amber-500 text-white text-[10px] font-black rounded-bl-2xl z-20 animate-pulse shadow-lg flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> 預覽：{hoveredOil.name} ({previewMode === 'replacement' ? '替換' : '補位'})
              </div>
            )}
            
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-stone-800 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-amber-600" /> 指標分析
              </h3>
              <div className="text-right">
                <p className="text-[10px] font-black text-stone-400 uppercase mb-1">配方 INS</p>
                <div className="flex items-center justify-end gap-2">
                   <p className={`text-5xl font-black tracking-tighter ${
                     results.avgIns === 0 ? 'text-stone-300' : 
                     results.avgIns < 120 ? 'text-orange-500' : 
                     results.avgIns > 170 ? 'text-red-500' : 
                     'text-green-600'
                   }`}>{results.avgIns}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {(Object.keys(QUALITY_UI) as Array<keyof typeof QUALITY_UI>).map((key) => {
                const ui = QUALITY_UI[key];
                const range = QUALITY_RANGES[key];
                const val = results.qualities[key];
                const previewVal = results.previewQualities ? results.previewQualities[key] : null;
                const status = getIndicatorStatus(val, range);
                const statusUI = getStatusUI(status);

                return (
                  <div key={key} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className={`flex items-center gap-1.5 text-xs font-black ${ui.tailwind.replace('bg-', 'text-')}`}>
                        {getQualityIcon(key)} {ui.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full bg-stone-50 ${statusUI.color}`}>{statusUI.label}</span>
                        <div className="flex items-center gap-1">
                          <span className={`text-lg font-black ${statusUI.color}`}>{val}</span>
                          {previewVal !== null && previewVal !== val && (
                            <span className={`text-xs font-black animate-bounce ${previewVal > val ? 'text-green-500' : 'text-red-500'}`}>
                              ({previewVal > val ? '↑' : '↓'} {previewVal})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="h-4 bg-stone-100 rounded-full overflow-hidden shadow-inner border border-stone-200/50 relative">
                      <div className="absolute h-full bg-stone-300/20" style={{ left: `${(range.min / 100) * 100}%`, width: `${((range.max - range.min) / 100) * 100}%` }} />
                      <div className={`h-full ${statusUI.bg} transition-all duration-300 relative z-10`} style={{ width: `${Math.min(val, 100)}%` }} />
                      
                      {previewVal !== null && (
                        <div 
                          className={`absolute top-0 h-full opacity-60 transition-all duration-200 z-0 animate-pulse ${previewVal > val ? 'bg-green-400' : 'bg-red-400'}`}
                          style={{ 
                            left: `${Math.min(val, previewVal) / 100 * 100}%`,
                            width: `${Math.abs(previewVal - val) / 100 * 100}%`
                          }} 
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-stone-900 p-8 rounded-3xl shadow-2xl text-white relative overflow-hidden group/health">
             <div className="absolute -right-10 -top-10 opacity-5 group-hover/health:opacity-10 transition-opacity">
               <ZapIcon className="w-40 h-40" />
             </div>

            <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-amber-400 relative z-10">
              <Lightbulb className="w-6 h-6 animate-bounce" /> AI 健檢與推薦
            </h3>
            {results.suggestions.length > 0 ? (
              <div className="space-y-4 relative z-10">
                {results.suggestions.map((s, i) => (
                  <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                    <p className={`text-sm font-black mb-3 ${s.text.includes('不足') ? 'text-orange-400' : 'text-red-400'}`}>{s.text}</p>
                    <div className="flex flex-wrap gap-2">
                      {s.recommend.map((oilName, idx) => {
                        const oilObj = OILS.find(o => o.name.includes(oilName));
                        return (
                          <button 
                            key={idx} 
                            onMouseEnter={() => {
                              if(oilObj) {
                                setHoveredOil(oilObj);
                                setPreviewMode('addition');
                              }
                            }}
                            onMouseLeave={() => {
                              setHoveredOil(null);
                              setPreviewMode(null);
                            }}
                            onClick={() => quickFixWithOil(oilName)}
                            className="flex items-center gap-1.5 text-[10px] bg-white/10 text-stone-300 px-3 py-1.5 rounded-xl font-bold hover:bg-amber-600 hover:text-white transition-all group/btn shadow-sm"
                          >
                            <PlusCircle className="w-3 h-3 text-amber-500 group-hover/btn:text-white" />
                            <span>智慧補位：{oilName}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : results.avgIns > 0 ? (
              <div className="flex items-center gap-4 py-6 bg-green-500/10 rounded-2xl border border-green-500/20 p-4 text-green-400 relative z-10">
                <CheckCircle2 className="w-8 h-8" />
                <div>
                  <span className="text-lg font-black leading-none">極品配方！</span>
                  <p className="text-[10px] opacity-60">數據非常平衡，這將會是一塊頂級的手工皂。</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-stone-500 italic relative z-10">輸入油脂重量，AI 將為您精準引導。</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="bg-stone-800 p-5 text-white flex items-center gap-3">
          <h2 className="text-xl font-bold tracking-tight">3. 五力分布與標準對比</h2>
        </div>
        <div className="p-10 flex flex-col items-center">
          <RadarChart qualities={results.qualities} previewQualities={results.previewQualities} />
          <div className="max-w-md w-full mt-8 p-6 bg-stone-50 rounded-2xl border border-stone-100 flex items-start gap-4">
             <Info className="w-6 h-6 text-stone-400 flex-shrink-0" />
             <p className="text-xs text-stone-500 leading-relaxed">
               灰色區域為專家建議的「黃金比例帶」。<span className="text-amber-600 font-bold">虛線多邊形</span> 為當前操作或健檢推薦的預覽效果。點擊健檢區塊的推薦按鈕，系統將自動計算並加入最適合的重量。
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
