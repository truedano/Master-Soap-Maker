
import React, { useState, useMemo } from 'react';
import { OILS, QUALITY_RANGES, QUALITY_UI } from '../constants';
import { FormulaItem, OilQualities } from '../types';
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
  ArrowUpCircle
} from 'lucide-react';

const RadarChart: React.FC<{ qualities: OilQualities }> = ({ qualities }) => {
  const size = 300;
  const center = size / 2;
  const radius = size * 0.3;
  
  const points = [
    { key: 'cleansing', label: QUALITY_UI.cleansing.label },
    { key: 'bubbly', label: QUALITY_UI.bubbly.label },
    { key: 'hardness', label: QUALITY_UI.hardness.label },
    { key: 'conditioning', label: QUALITY_UI.conditioning.label },
    { key: 'creamy', label: QUALITY_UI.creamy.label },
  ] as const;

  const getCoordinates = (value: number, index: number, max: number = 100) => {
    const angle = (Math.PI * 2 * index) / points.length - Math.PI / 2;
    const r = (Math.min(value, max) / max) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const dataPath = points.map((p, i) => {
    const coords = getCoordinates(qualities[p.key as keyof OilQualities], i);
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
            <polygon key={i} points={gridPath} className="fill-none stroke-stone-200" strokeWidth="1" />
          );
        })}
        {points.map((p, i) => {
          const coords = getCoordinates(100, i);
          return (
            <line key={i} x1={center} y1={center} x2={coords.x} y2={coords.y} className="stroke-stone-200" strokeWidth="1" />
          );
        })}
        <polygon points={dataPath} className="fill-amber-600/10 stroke-amber-600" strokeWidth="3" strokeLinejoin="round" />
        {points.map((p, i) => {
          const coords = getCoordinates(qualities[p.key as keyof OilQualities], i);
          return (
            <circle key={i} cx={coords.x} cy={coords.y} r="4" className="fill-amber-700 shadow-sm" />
          );
        })}
        {points.map((p, i) => {
          const coords = getCoordinates(130, i);
          const ui = QUALITY_UI[p.key as keyof typeof QUALITY_UI];
          return (
            <text key={i} x={coords.x} y={coords.y} textAnchor="middle" className="text-[12px] font-black" fill={ui.color} dominantBaseline="middle">
              {p.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

interface CalculatorProps {
  onFindOil?: (qualityKey: string) => void;
}

export const Calculator: React.FC<CalculatorProps> = ({ onFindOil }) => {
  const [items, setItems] = useState<FormulaItem[]>([
    { oilId: 'coconut', weight: 150 },
    { oilId: 'palm', weight: 100 },
    { oilId: 'olive', weight: 250 },
  ]);
  const [waterRatio, setWaterRatio] = useState<number>(2.3);
  const [additiveWeight, setAdditiveWeight] = useState<number>(0);

  const addItem = () => {
    setItems([...items, { oilId: OILS[0].id, weight: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter(((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof FormulaItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const results = useMemo(() => {
    let totalWeight = 0;
    let totalInsWeight = 0;
    let totalNaoh = 0;
    const totalQualities: OilQualities = {
      hardness: 0,
      cleansing: 0,
      conditioning: 0,
      bubbly: 0,
      creamy: 0,
    };

    items.forEach(item => {
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
    const naoh = Number(totalNaoh.toFixed(1));
    const water = Number((totalNaoh * waterRatio).toFixed(1));
    const estimatedTotal = Number((totalWeight + naoh + water + additiveWeight).toFixed(0));

    const suggestions: { text: string; qualityKey: string; recommend: string[] }[] = [];
    if (avgIns > 0) {
      if (avgIns < 120) suggestions.push({ text: "INS 值過低 (軟爛)", qualityKey: 'ins', recommend: ["椰子油", "可可脂"] });
      if (avgIns > 170) suggestions.push({ text: "INS 值過高 (易碎)", qualityKey: 'ins', recommend: ["甜杏仁油", "橄欖油"] });
      
      if (avgQualities.cleansing > QUALITY_RANGES.cleansing.max) suggestions.push({ text: "清潔力太強 (乾澀)", qualityKey: 'conditioning', recommend: ["增加橄欖油", "增加乳油木果脂"] });
      if (avgQualities.conditioning < QUALITY_RANGES.conditioning.min) suggestions.push({ text: "保濕力不足", qualityKey: 'conditioning', recommend: ["酪梨油", "榛果油", "山茶花油"] });
      if (avgQualities.hardness < QUALITY_RANGES.hardness.min) suggestions.push({ text: "皂體硬度不足", qualityKey: 'hardness', recommend: ["棕櫚油", "豬油", "可可脂"] });
      if (avgQualities.bubbly < QUALITY_RANGES.bubbly.min) suggestions.push({ text: "起泡力不足", qualityKey: 'bubbly', recommend: ["椰子油", "蓖麻油"] });
      if (avgQualities.creamy < QUALITY_RANGES.creamy.min) suggestions.push({ text: "泡沫穩定度不足", qualityKey: 'creamy', recommend: ["蓖麻油", "乳油木果脂"] });
    }

    return {
      totalWeight,
      avgIns,
      totalNaoh: naoh,
      water,
      estimatedTotal,
      qualities: avgQualities,
      suggestions
    };
  }, [items, waterRatio, additiveWeight]);

  const getIndicatorStatus = (val: number, range: { min: number, max: number }) => {
    if (val === 0) return 'none';
    if (val < range.min) return 'low';
    if (val > range.max) return 'high';
    return 'ideal';
  };

  const getStatusUI = (status: 'none' | 'low' | 'high' | 'ideal') => {
    switch (status) {
      case 'low': return { color: 'text-orange-500', bg: 'bg-orange-500', icon: <ArrowDownCircle className="w-3.5 h-3.5" />, label: '不足' };
      case 'high': return { color: 'text-red-500', bg: 'bg-red-500', icon: <ArrowUpCircle className="w-3.5 h-3.5" />, label: '過高' };
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
      {/* 1. 油脂配方輸入區 */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="bg-[#2d2926] p-4 md:p-5 text-white flex items-center gap-3">
          <div className="bg-amber-500/20 p-1.5 rounded flex items-center justify-center">
            <CalcIcon className="w-5 h-5 text-amber-500" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">1. 配方組成 (Recipe)</h2>
        </div>
        
        <div className="p-4 md:p-6 space-y-4">
          <div className="space-y-3">
            {items.map((item, index) => {
              const selectedOil = OILS.find(o => o.id === item.oilId);
              return (
                <div key={index} className="flex flex-col gap-2 p-4 bg-stone-50/50 rounded-2xl border border-stone-100 group hover:bg-white hover:shadow-md transition-all">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-1 w-full relative">
                      <select
                        value={item.oilId}
                        onChange={(e) => updateItem(index, 'oilId', e.target.value)}
                        className="w-full p-3.5 bg-white border border-stone-200 rounded-xl appearance-none outline-none focus:ring-4 focus:ring-amber-500/20 text-stone-700 font-bold pr-10"
                      >
                        {OILS.map(oil => (
                          <option key={oil.id} value={oil.id}>{oil.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-4 w-4 h-4 text-stone-400 pointer-events-none" />
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="relative flex items-center bg-[#3f3a36] rounded-xl overflow-hidden group-focus-within:ring-4 ring-amber-400/50 transition-all">
                        <input
                          type="number"
                          value={item.weight || ''}
                          onChange={(e) => updateItem(index, 'weight', Number(e.target.value))}
                          className="w-24 sm:w-28 p-3.5 bg-transparent text-white font-black text-right outline-none [appearance:textfield]"
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
                      <div className="grid grid-cols-5 gap-2">
                        {(Object.keys(QUALITY_UI) as Array<keyof typeof QUALITY_UI>).map((key) => {
                          const ui = QUALITY_UI[key];
                          return (
                            <div key={key} className="flex flex-col items-center p-1.5 bg-stone-100 rounded-lg">
                              <span className={`flex items-center gap-0.5 text-[9px] font-black uppercase ${ui.tailwind.replace('bg-', 'text-')}`}>
                                {getQualityIcon(key)} {ui.label[0]}
                              </span>
                              <span className="text-[11px] font-black text-stone-700">{selectedOil[key]}</span>
                            </div>
                          );
                        })}
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
            <h2 className="text-xl font-bold tracking-tight">2. 精確稱重清單 (Scaling)</h2>
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
                  <h3 className="text-sm font-black text-stone-400 flex items-center gap-2 border-b border-stone-100 pb-2 uppercase tracking-widest">鹼水部分</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between p-4 bg-red-50 rounded-2xl text-sm font-bold text-red-800 shadow-sm border border-red-100">
                      <span>NaOH 需求量</span><span>{results.totalNaoh} g</span>
                    </div>
                    <div className="flex justify-between p-4 bg-blue-50 rounded-2xl text-sm font-bold text-blue-800 shadow-sm border border-blue-100">
                      <span>水量 (2.3倍)</span><span>{results.water} g</span>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </div>

        <div className="xl:col-span-5 flex flex-col gap-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-stone-800 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-amber-600" /> 指標分析
              </h3>
              <div className="text-right">
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">配方 INS 總值</p>
                <div className="flex items-center justify-end gap-2">
                   <p className={`text-5xl font-black tracking-tighter ${results.avgIns === 0 ? 'text-stone-300' : results.avgIns >= 120 && results.avgIns <= 170 ? 'text-green-600' : 'text-red-500'}`}>
                    {results.avgIns}
                  </p>
                  {results.avgIns > 0 && (
                    <div className={`flex flex-col items-center ${results.avgIns >= 120 && results.avgIns <= 170 ? 'text-green-600' : 'text-red-500'}`}>
                      {results.avgIns >= 120 && results.avgIns <= 170 ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6 animate-pulse" />}
                      <span className="text-[10px] font-black uppercase">{results.avgIns >= 120 && results.avgIns <= 170 ? '理想' : '警示'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {(Object.keys(QUALITY_UI) as Array<keyof typeof QUALITY_UI>).map((key) => {
                const ui = QUALITY_UI[key];
                const range = QUALITY_RANGES[key];
                const val = results.qualities[key];
                const status = getIndicatorStatus(val, range);
                const statusUI = getStatusUI(status);

                return (
                  <div key={key} className="group space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`flex items-center gap-1.5 text-xs font-black ${ui.tailwind.replace('bg-', 'text-')}`}>
                          {getQualityIcon(key)} {ui.label}
                        </span>
                        <span className="text-[10px] text-stone-300 font-bold">({range.min}~{range.max})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1 text-[10px] font-black px-1.5 py-0.5 rounded-full bg-stone-50 border border-stone-100 ${statusUI.color}`}>
                          {statusUI.icon}
                          {statusUI.label}
                        </div>
                        <span className={`text-lg font-black ${statusUI.color}`}>{val}</span>
                      </div>
                    </div>
                    <div className="h-2.5 bg-stone-50 rounded-full overflow-hidden shadow-inner border border-stone-100/50">
                      <div 
                        className={`h-full ${statusUI.bg} transition-all duration-700 ease-out relative`}
                        style={{ width: `${Math.min(val, 100)}%` }}
                      >
                        {/* 目標區間高亮 */}
                        <div 
                          className="absolute top-0 bottom-0 bg-white/20 border-x border-white/40"
                          style={{ 
                            left: `${(range.min / 100) * 100}%`, 
                            width: `${((range.max - range.min) / 100) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-stone-900 p-8 rounded-3xl shadow-2xl text-white">
            <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-amber-400">
              <Lightbulb className="w-6 h-6 animate-bounce" /> 健檢優化建議
            </h3>
            {results.suggestions.length > 0 ? (
              <div className="space-y-4">
                {results.suggestions.map((s, i) => (
                  <div 
                    key={i} 
                    className="p-4 bg-white/5 rounded-2xl border border-white/10 group cursor-pointer hover:bg-white/10 transition-all active:scale-95"
                    onClick={() => onFindOil?.(s.qualityKey)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                        <p className="text-sm font-black text-orange-400">{s.text}</p>
                      </div>
                      <div className="bg-amber-600/20 px-2 py-1 rounded-lg flex items-center gap-1 group-hover:bg-amber-600 transition-colors">
                        <Search className="w-3 h-3 text-amber-300 group-hover:text-white" />
                        <span className="text-[10px] font-black text-amber-300 group-hover:text-white uppercase">找尋補位油</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {s.recommend.map((oil, idx) => (
                        <span key={idx} className="text-[10px] bg-white/10 text-stone-400 px-3 py-1 rounded-full font-bold group-hover:text-white group-hover:bg-white/20 transition-all">
                          {oil}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : results.avgIns > 0 ? (
              <div className="flex items-center gap-4 py-6 bg-green-500/10 rounded-2xl border border-green-500/20 p-4">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
                <div className="space-y-1">
                  <span className="text-lg font-black text-green-400">極品配方！</span>
                  <p className="text-xs text-green-400/60 font-medium">您的油脂比例配置非常均衡，這將是一塊好皂。</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-stone-500 italic font-medium">請先輸入配方重量，AI 將為您進行即時分析。</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="bg-stone-800 p-5 text-white flex items-center gap-3">
          <h2 className="text-xl font-bold tracking-tight">3. 五力分布雷達圖 (Radar View)</h2>
        </div>
        <div className="p-10 flex flex-col items-center">
          <RadarChart qualities={results.qualities} />
          <div className="max-w-md w-full mt-8 p-6 bg-stone-50 rounded-2xl border border-stone-100 flex items-start gap-4 shadow-inner">
             <Info className="w-6 h-6 text-stone-400 flex-shrink-0 mt-0.5" />
             <p className="text-xs text-stone-500 leading-relaxed font-medium">
               雷達圖視覺化了您這批皂的洗感分布。平衡的「大面積五角形」代表這是一款全能皂；若偏向某一側，則代表該皂具有鮮明的特殊功效（如極度保濕）。
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
