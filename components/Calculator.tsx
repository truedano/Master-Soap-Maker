
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { OILS, QUALITY_RANGES, QUALITY_UI } from '../constants';
import { FormulaItem, OilQualities, OilData } from '../types';
import { 
  Calculator as CalcIcon, 
  Trash2, 
  PlusCircle, 
  MinusCircle,
  ChevronDown, 
  Scale,
  Droplets,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Info,
  Lightbulb,
  Shield,
  Zap,
  Waves,
  ArrowDownCircle,
  ArrowUpCircle,
  Check,
  ZapIcon,
  Circle,
  Activity,
  DollarSign,
  Tag,
  Coins
} from 'lucide-react';

// 將 Lucide 圖標對應到 QUALITY_UI
const QualityIcon: React.FC<{ name: string; size?: number; className?: string; color?: string }> = ({ name, size = 16, className, color }) => {
  switch (name) {
    case 'Shield': return <Shield size={size} className={className} style={{ color }} />;
    case 'Sparkles': return <Sparkles size={size} className={className} style={{ color }} />;
    case 'Droplets': return <Droplets size={size} className={className} style={{ color }} />;
    case 'Zap': return <Zap size={size} className={className} style={{ color }} />;
    case 'Waves': return <Waves size={size} className={className} style={{ color }} />;
    default: return <Circle size={size} className={className} />;
  }
};

// 雷達圖組件
const RadarChart: React.FC<{ qualities: OilQualities, previewQualities?: OilQualities | null }> = ({ qualities, previewQualities }) => {
  const size = 320;
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
    <div className="flex flex-col items-center w-full relative">
      <svg width="100%" height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* 背景格線 */}
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
          const val = qualities[p.key as keyof OilQualities];
          const coords = getCoordinates(val, i);
          const labelCoords = getCoordinates(135, i);
          const ui = QUALITY_UI[p.key as keyof typeof QUALITY_UI];

          return (
            <g key={i}>
              <circle cx={coords.x} cy={coords.y} r="4.5" fill={ui.color} className="stroke-white stroke-2 shadow-sm" />
              <g transform={`translate(${labelCoords.x - 15}, ${labelCoords.y - 15})`}>
                <QualityIcon name={ui.icon} size={14} color={ui.color} />
                <text x="18" y="11" className="text-[12px] font-black" fill={ui.color} dominantBaseline="middle">
                  {p.label}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
      
      <div className="flex gap-4 mt-4 bg-stone-50 px-4 py-2 rounded-full border border-stone-100">
        <div className="flex items-center gap-1.5">
           <div className="w-2.5 h-2.5 bg-amber-600 rounded-full" />
           <span className="text-[10px] font-black text-stone-500">目前數據</span>
        </div>
        <div className="flex items-center gap-1.5">
           <div className="w-2.5 h-2.5 bg-stone-200 border border-stone-300 border-dashed rounded-full" />
           <span className="text-[10px] font-black text-stone-500">理想範圍</span>
        </div>
      </div>
    </div>
  );
};

// 微型五力分布圖表
export const MiniQualityBars: React.FC<{ oil: OilData }> = ({ oil }) => {
  const qualities = [
    { key: 'hardness', ...QUALITY_UI.hardness, val: oil.hardness },
    { key: 'cleansing', ...QUALITY_UI.cleansing, val: oil.cleansing },
    { key: 'conditioning', ...QUALITY_UI.conditioning, val: oil.conditioning },
    { key: 'bubbly', ...QUALITY_UI.bubbly, val: oil.bubbly },
    { key: 'creamy', ...QUALITY_UI.creamy, val: oil.creamy },
  ];

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1 px-1">
        <span>五力分布 (Contribution)</span>
      </div>
      <div className="flex gap-0.5 h-2 bg-stone-100 rounded-full overflow-hidden shadow-inner p-[1px]">
        {qualities.map(q => (
          <div 
            key={q.key} 
            className={`${q.bg} h-full rounded-sm transition-all duration-500`} 
            style={{ width: `${Math.max(2, (q.val / 100) * 100)}%` }}
            title={`${q.label}: ${q.val}`}
          />
        ))}
      </div>
      <div className="grid grid-cols-5 gap-0.5 mt-1">
        {qualities.map(q => (
           <div key={q.key} className="flex flex-col items-center">
             <div className={`w-1 h-1 rounded-full ${q.bg} mb-0.5`} />
             <span className="text-[8px] font-black text-stone-400 scale-90">{q.val}</span>
           </div>
        ))}
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

  const getOilTags = (oil: OilData) => {
    const qualities = [
      { key: 'hardness', ...QUALITY_UI.hardness, val: oil.hardness },
      { key: 'cleansing', ...QUALITY_UI.cleansing, val: oil.cleansing },
      { key: 'conditioning', ...QUALITY_UI.conditioning, val: oil.conditioning },
      { key: 'bubbly', ...QUALITY_UI.bubbly, val: oil.bubbly },
      { key: 'creamy', ...QUALITY_UI.creamy, val: oil.creamy },
    ];
    // 找出數值最大的前兩名
    const topTags = qualities.sort((a, b) => b.val - a.val).slice(0, 2);
    // 判斷是否推薦補位
    const isRecommended = lackingKeys.some(key => oil[key as keyof OilQualities] >= 45);
    return { topTags, isRecommended };
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3.5 bg-white border border-stone-200 rounded-xl flex items-center justify-between outline-none focus:ring-4 focus:ring-amber-500/20 text-stone-700 font-bold transition-all"
      >
        <div className="truncate flex items-center gap-2">
          {selectedOil?.name}
          {selectedOil && (
            <div className="hidden sm:flex gap-1 ml-1">
               {getOilTags(selectedOil).topTags.map(tag => (
                 <span key={tag.key} className="text-[9px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-500 font-black">
                   {tag.label}
                 </span>
               ))}
            </div>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full max-h-[350px] bg-white border border-stone-100 rounded-2xl shadow-2xl overflow-y-auto no-scrollbar animate-fade-in">
          {OILS.map((oil) => {
            const { topTags, isRecommended } = getOilTags(oil);
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
                className={`flex items-center justify-between p-4 cursor-pointer transition-all border-b border-stone-50 last:border-none ${
                  value === oil.id ? 'bg-amber-50' : 'hover:bg-stone-50'
                } ${isRecommended ? 'bg-amber-50/20' : ''}`}
              >
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {isRecommended && (
                      <span className="bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm flex items-center gap-1 shadow-sm animate-pulse">
                        ✨ 推薦補位
                      </span>
                    )}
                    <span className={`text-sm font-bold truncate ${isRecommended ? 'text-amber-900' : 'text-stone-700'}`}>
                      {oil.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {topTags.map(tag => (
                        <span key={tag.key} className={`text-[9px] font-black px-1.5 py-0.5 rounded text-white ${tag.bg}`}>
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-[10px] font-black text-stone-300 ml-4 whitespace-nowrap">INS {oil.ins}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface CalculatorProps {
  items: FormulaItem[];
  setItems: React.Dispatch<React.SetStateAction<FormulaItem[]>>;
  oilPrices: Record<string, number>;
  onSetPrice: (id: string, price: number) => void;
  onFindOil: (quality: string) => void;
}

export const Calculator: React.FC<CalculatorProps> = ({ items, setItems, oilPrices, onSetPrice, onFindOil }) => {
  const [waterRatio, setWaterRatio] = useState<number>(2.3);
  const [showCost, setShowCost] = useState(false);
  
  const [hoveredOil, setHoveredOil] = useState<OilData | null>(null);
  const [previewMode, setPreviewMode] = useState<'replacement' | 'addition' | 'reduction' | null>(null);
  const [hoveringSlotIndex, setHoveringSlotIndex] = useState<number | null>(null);
  const [previewWeightChange, setPreviewWeightChange] = useState<number>(0);

  const results = useMemo(() => {
    const calculate = (formulaItems: FormulaItem[]) => {
      let totalWeight = 0;
      let totalInsWeight = 0;
      let totalNaoh = 0;
      let totalCost = 0;
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
          
          const pricePerG = (oilPrices[oil.id] || oil.defaultPrice || 0) / 1000;
          totalCost += pricePerG * item.weight;
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
      return { totalWeight, avgIns, totalNaoh, totalCost, qualities: avgQualities };
    };

    const current = calculate(items);
    const baseSuggestWeight = Math.max(50, Math.round(current.totalWeight * 0.1));

    let preview = null;
    if (hoveredOil) {
      const previewItems = [...items];
      if (previewMode === 'replacement' && hoveringSlotIndex !== null) {
        previewItems[hoveringSlotIndex] = { ...previewItems[hoveringSlotIndex], oilId: hoveredOil.id };
        if (previewItems[hoveringSlotIndex].weight === 0) previewItems[hoveringSlotIndex].weight = 100;
      } else {
        const existingIdx = previewItems.findIndex(i => i.oilId === hoveredOil.id);
        const weightDelta = previewMode === 'reduction' ? -previewWeightChange : (previewWeightChange || baseSuggestWeight);
        
        if (existingIdx > -1) {
          const newWeight = Math.max(0, previewItems[existingIdx].weight + weightDelta);
          previewItems[existingIdx] = { ...previewItems[existingIdx], weight: newWeight };
        } else if (weightDelta > 0) {
          previewItems.push({ oilId: hoveredOil.id, weight: weightDelta });
        }
      }
      preview = calculate(previewItems);
    }

    const lackingKeys = (Object.keys(current.qualities) as Array<keyof OilQualities>).filter(key => {
        return current.totalWeight > 0 && current.qualities[key] < QUALITY_RANGES[key].min;
    });

    const suggestions: { text: string; qualityKey: string; actions: { name: string, weight: number, type: 'add' | 'reduce' }[] }[] = [];
    if (current.avgIns > 0) {
      if (current.avgIns < 120) {
        suggestions.push({ 
          text: "INS 過低 (皂體軟爛)", 
          qualityKey: 'ins', 
          actions: [{ name: "椰子油", weight: baseSuggestWeight, type: 'add' }, { name: "棕櫚油", weight: baseSuggestWeight, type: 'add' }] 
        });
      }
      if (current.avgIns > 170) {
        const actions: any[] = [{ name: "橄欖油", weight: baseSuggestWeight, type: 'add' }];
        const coconutItem = items.find(i => i.oilId === 'coconut');
        if (coconutItem && coconutItem.weight > 50) actions.push({ name: "椰子油", weight: 50, type: 'reduce' });
        suggestions.push({ text: "INS 過高 (皂體脆裂)", qualityKey: 'ins', actions });
      }
      if (current.qualities.cleansing > QUALITY_RANGES.cleansing.max) {
        const actions: any[] = [{ name: "乳油木果脂", weight: baseSuggestWeight, type: 'add' }];
        const coconutItem = items.find(i => i.oilId === 'coconut');
        if (coconutItem && coconutItem.weight > 50) actions.push({ name: "椰子油", weight: 50, type: 'reduce' });
        suggestions.push({ text: "清潔力太強 (易乾癢)", qualityKey: 'cleansing', actions });
      }
      if (current.qualities.conditioning < QUALITY_RANGES.conditioning.min) {
        suggestions.push({ 
          text: "保濕不足 (不夠滋潤)", 
          qualityKey: 'conditioning', 
          actions: [{ name: "酪梨油", weight: baseSuggestWeight, type: 'add' }, { name: "甜杏仁油", weight: baseSuggestWeight, type: 'add' }] 
        });
      }
      if (current.qualities.hardness < QUALITY_RANGES.hardness.min) {
        suggestions.push({ 
          text: "硬度不足 (不耐洗)", 
          qualityKey: 'hardness', 
          actions: [{ name: "棕櫚油", weight: baseSuggestWeight, type: 'add' }, { name: "可可脂", weight: 30, type: 'add' }] 
        });
      }
    }

    let personality = "計算中";
    if (current.totalWeight > 0) {
      if (current.qualities.conditioning > 60) personality = "溫和滋潤型";
      else if (current.qualities.cleansing > 18) personality = "強效清爽型";
      else if (current.qualities.hardness > 45) personality = "極硬耐用型";
      else if (current.avgIns >= 120 && current.avgIns <= 170) personality = "平衡穩定型";
    }

    return {
      totalWeight: current.totalWeight,
      avgIns: current.avgIns,
      totalNaoh: Number(current.totalNaoh.toFixed(1)),
      water: Number((current.totalNaoh * waterRatio).toFixed(1)),
      totalCost: Math.round(current.totalCost),
      qualities: current.qualities,
      previewQualities: preview?.qualities || null,
      suggestions,
      lackingKeys,
      personality,
      baseSuggestWeight
    };
  }, [items, waterRatio, hoveredOil, previewMode, hoveringSlotIndex, previewWeightChange, oilPrices]);

  const applyAdjustment = (oilName: string, weightChange: number, type: 'add' | 'reduce') => {
    const oil = OILS.find(o => o.name.includes(oilName));
    if (oil) {
      const actualChange = type === 'reduce' ? -weightChange : weightChange;
      const existingIdx = items.findIndex(i => i.oilId === oil.id);
      
      if (existingIdx > -1) {
        const newWeight = Math.max(0, items[existingIdx].weight + actualChange);
        if (newWeight === 0 && type === 'reduce') {
          removeItem(existingIdx);
        } else {
          updateItem(existingIdx, 'weight', newWeight);
        }
      } else if (actualChange > 0) {
        setItems([...items, { oilId: oil.id, weight: actualChange }]);
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
      case 'low': return { color: 'text-orange-500', bg: 'bg-orange-500', icon: <ArrowDownCircle className="w-4 h-4" />, label: '數值不足' };
      case 'high': return { color: 'text-red-500', bg: 'bg-red-500', icon: <ArrowUpCircle className="w-4 h-4" />, label: '數值過度' };
      case 'ideal': return { color: 'text-green-600', bg: 'bg-green-600', icon: <CheckCircle2 className="w-4 h-4" />, label: '理想比例' };
      default: return { color: 'text-stone-300', bg: 'bg-stone-100', icon: null, label: '' };
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. 配方組成 */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="bg-[#2d2926] p-4 md:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/20 p-1.5 rounded flex items-center justify-center">
              <CalcIcon className="w-5 h-5 text-amber-500" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">1. 配方組成 (Recipe)</h2>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowCost(!showCost)}
              className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all text-[10px] font-black uppercase tracking-widest ${
                showCost ? 'bg-amber-500 text-white border-amber-600 shadow-sm' : 'bg-white/10 text-stone-400 border-white/20 hover:bg-white/20'
              }`}
            >
              <DollarSign className="w-3 h-3" />
              成本模式: {showCost ? 'ON' : 'OFF'}
            </button>
            {results.totalWeight > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20">
                <Activity className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">配方導向：{results.personality}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4 md:p-6 space-y-4">
          <div className="space-y-3">
            {items.map((item, index) => {
              const currentPrice = oilPrices[item.oilId] || OILS.find(o => o.id === item.oilId)?.defaultPrice || 0;
              return (
                <div key={index} className="flex flex-col gap-3 p-4 bg-stone-50/50 rounded-2xl border border-stone-100 group hover:bg-white hover:shadow-md transition-all">
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
                      <div className="relative flex items-center bg-white border-2 border-stone-800 rounded-xl overflow-hidden transition-all shadow-sm focus-within:ring-4 focus-within:ring-stone-200">
                        <input
                          type="number"
                          value={item.weight || ''}
                          onChange={(e) => updateItem(index, 'weight', Number(e.target.value))}
                          className="w-24 sm:w-28 p-3.5 bg-white text-stone-900 font-black text-right outline-none"
                          placeholder="0"
                        />
                        <span className="px-4 text-stone-500 font-bold text-sm border-l border-stone-200 h-full flex items-center bg-stone-50">g</span>
                      </div>
                      <button onClick={() => removeItem(index)} className="p-3.5 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {showCost && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200 animate-fade-in shadow-sm">
                       <div className="flex items-center gap-3">
                          <div className="bg-amber-600 p-2 rounded-lg shadow-sm">
                            <Tag className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm font-black text-amber-900 tracking-tight">自訂成本</span>
                          <div className="relative flex items-center bg-white border-2 border-amber-500 focus-within:border-amber-700 rounded-xl overflow-hidden h-11 transition-all shadow-md">
                            <span className="pl-3 pr-1.5 text-sm font-black text-amber-700">$</span>
                            <input 
                              type="number"
                              value={currentPrice}
                              onChange={(e) => onSetPrice(item.oilId, Number(e.target.value))}
                              className="w-28 px-1 py-1 text-base font-black text-stone-900 bg-white outline-none placeholder-stone-300"
                              placeholder="0"
                            />
                            <span className="px-3 text-xs font-black text-stone-600 border-l border-amber-100 bg-amber-50/50 h-full flex items-center uppercase tracking-tighter">/ kg</span>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-xl border-2 border-amber-200 shadow-sm">
                          <div className="text-right">
                             <span className="text-[10px] font-black text-stone-500 uppercase block leading-none mb-1">分項小計 (Cost)</span>
                             <div className="flex items-baseline gap-1">
                               <span className="text-xs font-black text-amber-600">$</span>
                               <span className="text-xl font-black text-amber-800 tabular-nums leading-none">
                                 {Math.round((currentPrice / 1000) * item.weight)}
                               </span>
                             </div>
                          </div>
                          <div className="p-1.5 bg-amber-100 rounded-full">
                            <Coins className="w-4 h-4 text-amber-600" />
                          </div>
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
        <div className="xl:col-span-7 space-y-8">
          {/* 精確稱重 */}
          <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
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

          {/* 成本估算面板 */}
          {showCost && (
            <div className="bg-white rounded-3xl shadow-xl border border-amber-100 overflow-hidden animate-fade-in ring-4 ring-amber-50">
              <div className="bg-stone-900 p-6 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-6 h-6 text-amber-400" />
                  <h2 className="text-xl font-bold tracking-tight">3. 成本估算報告 (Estimates)</h2>
                </div>
                <div className="px-3 py-1 bg-amber-500 rounded text-[10px] font-black uppercase">僅供參考</div>
              </div>
              <div className="p-8">
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100">
                       <span className="text-[10px] font-black text-stone-400 uppercase block mb-1">總原料成本</span>
                       <span className="text-4xl font-black text-stone-800 tabular-nums">${results.totalCost}</span>
                       <span className="text-xs font-bold text-stone-400 ml-1">TWD</span>
                    </div>
                    <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100">
                       <span className="text-[10px] font-black text-stone-400 uppercase block mb-1">平均成本 (/100g)</span>
                       <span className="text-4xl font-black text-stone-800 tabular-nums">
                         ${results.totalWeight > 0 ? Math.round((results.totalCost / results.totalWeight) * 100) : 0}
                       </span>
                    </div>
                    <div className="p-6 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col justify-center">
                       <div className="flex items-center gap-2 mb-2">
                          <Info className="w-4 h-4 text-amber-600" />
                          <span className="text-xs font-black text-amber-700">小撇步</span>
                       </div>
                       <p className="text-xs text-amber-800/70 font-medium leading-relaxed">
                         調整橄欖油或椰子油比例，通常是控制成本最快的方法。
                       </p>
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>

        <div className="xl:col-span-5 flex flex-col gap-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 relative overflow-hidden">
            {hoveredOil && (
              <div className={`absolute top-0 right-0 p-3 text-white text-[10px] font-black rounded-bl-2xl z-20 animate-pulse shadow-lg flex items-center gap-2 ${previewMode === 'reduction' ? 'bg-rose-500' : 'bg-amber-500'}`}>
                <Sparkles className="w-3 h-3" /> 數據預覽：{hoveredOil.name} {previewMode === 'reduction' ? '(調降)' : '(補位)'}
              </div>
            )}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-50">
              <h3 className="text-lg font-black text-stone-800 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-amber-600" /> 指標分析
              </h3>
              <div className="text-right">
                <p className="text-[10px] font-black text-stone-400 uppercase mb-1">配方總 INS 值</p>
                <div className="flex items-center justify-end gap-2">
                  <p className={`text-5xl font-black tabular-nums tracking-tighter ${results.avgIns < 120 || results.avgIns > 170 ? 'text-orange-500' : 'text-green-600'}`}>
                    {results.avgIns}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              {(Object.keys(QUALITY_UI) as Array<keyof typeof QUALITY_UI>).map((key) => {
                const ui = QUALITY_UI[key];
                const range = QUALITY_RANGES[key];
                const val = results.qualities[key];
                const previewVal = results.previewQualities ? results.previewQualities[key] : null;
                const status = getIndicatorStatus(val, range);
                const statusUI = getStatusUI(status);

                return (
                  <div key={key} className="space-y-3">
                    <div className="flex items-end justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className={`p-1 rounded bg-stone-50`}>
                            <QualityIcon name={ui.icon} color={ui.color} size={14} />
                          </span>
                          <span className="text-sm font-black text-stone-700">{ui.label}</span>
                        </div>
                        <p className="text-[10px] font-bold text-stone-400 ml-8">建議區間：{range.min} ~ {range.max}</p>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${statusUI.color.replace('text-', 'border-').replace('text-', 'bg-')}/5 ${statusUI.color}`}>
                            {statusUI.label}
                          </span>
                          <span className={`text-2xl font-black tabular-nums ${statusUI.color}`}>
                            {val}
                          </span>
                        </div>
                        {previewVal !== null && previewVal !== val && (
                          <div className={`text-[10px] font-black animate-pulse flex items-center justify-end gap-1 ${previewVal > val ? 'text-green-500' : 'text-red-500'}`}>
                            預估變動: {previewVal > val ? '↑' : '↓'} {previewVal}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="relative h-4 bg-stone-100 rounded-full overflow-hidden shadow-inner border border-stone-200/50">
                      <div 
                        className="absolute h-full bg-stone-200/50 border-x border-stone-300/30 z-0" 
                        style={{ left: `${range.min}%`, width: `${range.max - range.min}%` }} 
                      />
                      <div 
                        className={`h-full ${statusUI.bg} transition-all duration-300 relative z-10 shadow-sm`} 
                        style={{ width: `${Math.min(val, 100)}%` }} 
                      />
                      {previewVal !== null && (
                        <div className={`absolute top-0 h-full opacity-60 transition-all duration-200 z-0 animate-pulse ${previewVal > val ? 'bg-green-400' : 'bg-red-400'}`}
                          style={{ left: `${Math.min(val, previewVal)}%`, width: `${Math.abs(previewVal - val)}%` }} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-stone-900 p-8 rounded-3xl shadow-2xl text-white relative overflow-hidden">
             <div className="absolute -right-10 -top-10 opacity-5">
               <ZapIcon className="w-40 h-40" />
             </div>
            <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-amber-400 relative z-10">
              <Lightbulb className="w-6 h-6" /> 配方專家建議
            </h3>
            {results.suggestions.length > 0 ? (
              <div className="space-y-4 relative z-10">
                {results.suggestions.map((s, i) => (
                  <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className={`text-sm font-black mb-3 ${s.text.includes('過高') || s.text.includes('太強') ? 'text-rose-400' : 'text-orange-400'}`}>{s.text}</p>
                    <div className="flex flex-wrap gap-2">
                      {s.actions.map((action, idx) => {
                        const oilObj = OILS.find(o => o.name.includes(action.name));
                        const isReduce = action.type === 'reduce';
                        return (
                          <button 
                            key={idx} 
                            onMouseEnter={() => { 
                              if(oilObj) { 
                                setHoveredOil(oilObj); 
                                setPreviewMode(isReduce ? 'reduction' : 'addition'); 
                                setPreviewWeightChange(action.weight);
                              } 
                            }}
                            onMouseLeave={() => { setHoveredOil(null); setPreviewMode(null); }}
                            onClick={() => applyAdjustment(action.name, action.weight, action.type)}
                            className={`flex items-center gap-1.5 text-[10px] px-3 py-2 rounded-xl font-bold transition-all group shadow-sm border border-transparent ${
                              isReduce 
                              ? 'bg-rose-500/10 text-rose-300 hover:bg-rose-600 hover:text-white hover:border-rose-400' 
                              : 'bg-white/10 text-stone-300 hover:bg-amber-600 hover:text-white hover:border-amber-400'
                            }`}
                          >
                            {isReduce ? (
                              <MinusCircle className="w-3.5 h-3.5 text-rose-500 group-hover:text-white" />
                            ) : (
                              <PlusCircle className="w-3.5 h-3.5 text-amber-500 group-hover:text-white" />
                            )}
                            <span>{isReduce ? '建議調降' : '建議補位'}：{action.name} <span className="opacity-60 ml-1">({isReduce ? '-' : '+'}{action.weight}g)</span></span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-4 py-6 bg-green-500/10 rounded-2xl border border-green-500/20 p-4 text-green-400 relative z-10">
                <CheckCircle2 className="w-8 h-8" />
                <div>
                  <span className="text-lg font-black leading-none">數據平衡！</span>
                  <p className="text-[10px] opacity-60">配方指標符合專家推薦範圍。</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="bg-stone-800 p-5 text-white flex items-center gap-3">
          <h2 className="text-xl font-bold tracking-tight">4. 五力分布與數據對比</h2>
        </div>
        <div className="p-10 flex flex-col items-center">
          <RadarChart qualities={results.qualities} previewQualities={results.previewQualities} />
        </div>
      </div>
    </div>
  );
};
