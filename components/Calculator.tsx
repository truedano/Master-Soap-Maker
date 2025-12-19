
import React, { useState, useMemo } from 'react';
import { OILS, QUALITY_RANGES } from '../constants';
import { FormulaItem, OilQualities } from '../types';
import { 
  Calculator as CalcIcon, 
  Trash2, 
  PlusCircle, 
  ChevronDown, 
  Scale,
  Droplets,
  Flame,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  TrendingUp,
  Info
} from 'lucide-react';

const RadarChart: React.FC<{ qualities: OilQualities }> = ({ qualities }) => {
  const size = 300;
  const center = size / 2;
  const radius = size * 0.3;
  
  const points = [
    { key: 'cleansing', label: '清潔' },
    { key: 'bubbly', label: '起泡' },
    { key: 'hardness', label: '硬度' },
    { key: 'conditioning', label: '保濕' },
    { key: 'creamy', label: '穩定' },
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
        <polygon points={dataPath} className="fill-lime-700/20 stroke-lime-700" strokeWidth="3" />
        {points.map((p, i) => {
          const coords = getCoordinates(qualities[p.key as keyof OilQualities], i);
          return (
            <circle key={i} cx={coords.x} cy={coords.y} r="4" className="fill-lime-800" />
          );
        })}
        {points.map((p, i) => {
          const coords = getCoordinates(125, i);
          return (
            <text key={i} x={coords.x} y={coords.y} textAnchor="middle" className="text-[12px] font-bold fill-stone-500" dominantBaseline="middle">
              {p.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export const Calculator: React.FC = () => {
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
    setItems(items.filter((_, i) => i !== index));
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

    // 生成健檢建議
    const suggestions: string[] = [];
    if (avgIns > 0) {
      if (avgIns < 120) suggestions.push("INS 值過低，皂體會太軟難脫模，建議增加『椰子油』或『棕櫚油』。");
      if (avgIns > 170) suggestions.push("INS 值過高，皂體容易脆裂且洗感較強，建議增加『橄欖油』或『甜杏仁油』。");
      
      if (avgQualities.cleansing > QUALITY_RANGES.cleansing.max) suggestions.push("清潔力太強可能導致乾澀，建議減少『椰子油』。");
      if (avgQualities.conditioning < QUALITY_RANGES.conditioning.min) suggestions.push("保濕力不足，建議增加『橄欖油』或『乳油木果脂』。");
      if (avgQualities.hardness < QUALITY_RANGES.hardness.min) suggestions.push("皂體硬度不足，使用時容易溶化，建議增加『棕櫚油』。");
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

  const getStatusColor = (val: number, range: { min: number, max: number }) => {
    if (val < range.min) return 'text-orange-500';
    if (val > range.max) return 'text-red-500';
    return 'text-green-600';
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
                <div key={index} className="flex flex-col gap-2 p-3 bg-stone-50/50 rounded-xl border border-stone-100/50 group hover:bg-stone-50 transition-colors">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="flex-1 w-full relative">
                      <select
                        value={item.oilId}
                        onChange={(e) => updateItem(index, 'oilId', e.target.value)}
                        className="w-full p-3 bg-white border border-stone-200 rounded-lg appearance-none outline-none focus:ring-2 focus:ring-amber-200/50 text-stone-700 font-medium pr-10"
                      >
                        {OILS.map(oil => (
                          <option key={oil.id} value={oil.id}>{oil.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-stone-400 pointer-events-none" />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="relative flex items-center bg-[#3f3a36] rounded-lg overflow-hidden group-focus-within:ring-2 ring-amber-400 ring-offset-1 transition-all">
                        <input
                          type="number"
                          value={item.weight || ''}
                          onChange={(e) => updateItem(index, 'weight', Number(e.target.value))}
                          className="w-24 sm:w-28 p-3 bg-transparent text-white font-black text-right outline-none [appearance:textfield]"
                          placeholder="0"
                        />
                        <span className="px-3 text-stone-400 font-bold text-sm border-l border-stone-600/50 h-full flex items-center">g</span>
                      </div>
                      <button onClick={() => removeItem(index)} className="p-3 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* 油脂五力小提示 - 已補足第五項「穩定」 */}
                  {selectedOil && (
                    <div className="flex flex-col gap-2 px-1">
                      <div className="flex items-start gap-2 text-xs text-stone-500 italic leading-relaxed">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>{selectedOil.description}</span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-black uppercase tracking-widest text-stone-400">
                        <span className="flex items-center gap-1">硬度 <span className="text-stone-600">{selectedOil.hardness}</span></span>
                        <span className="flex items-center gap-1">清潔 <span className="text-stone-600">{selectedOil.cleansing}</span></span>
                        <span className="flex items-center gap-1">保濕 <span className="text-stone-600">{selectedOil.conditioning}</span></span>
                        <span className="flex items-center gap-1">起泡 <span className="text-stone-600">{selectedOil.bubbly}</span></span>
                        <span className="flex items-center gap-1">穩定 <span className="text-stone-600">{selectedOil.creamy}</span></span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button onClick={addItem} className="w-full py-4 border-2 border-dashed border-stone-200 rounded-xl text-stone-400 font-bold hover:bg-stone-50 transition-all flex items-center justify-center gap-2 mt-4">
            <PlusCircle className="w-5 h-5" /> 新增油脂材料
          </button>
        </div>
      </div>

      {/* 2. 精確稱重與配方健檢 */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* 左側：稱重清單 */}
        <div className="xl:col-span-7 bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="bg-amber-600 p-4 md:p-6 text-white flex items-center gap-3">
            <Scale className="w-6 h-6" />
            <h2 className="text-xl font-bold tracking-tight">2. 精確稱重清單</h2>
          </div>
          <div className="p-6 space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-stone-400 flex items-center gap-2 border-b border-stone-100 pb-2 uppercase tracking-widest">油相部分</h3>
                  <div className="space-y-1">
                    {items.filter(i => i.weight > 0).map((item, idx) => {
                      const oil = OILS.find(o => o.id === item.oilId);
                      return (
                        <div key={idx} className="flex justify-between items-center p-2 hover:bg-stone-50 rounded">
                          <span className="text-sm font-bold text-stone-600">{oil?.name}</span>
                          <span className="font-black text-amber-700">{item.weight} g</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-stone-400 flex items-center gap-2 border-b border-stone-100 pb-2 uppercase tracking-widest">鹼水與添加物</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between p-2 bg-red-50 rounded text-sm font-bold text-red-800">
                      <span>NaOH 需求量</span><span>{results.totalNaoh} g</span>
                    </div>
                    <div className="flex justify-between p-2 bg-blue-50 rounded text-sm font-bold text-blue-800">
                      <span>水量</span><span>{results.water} g</span>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* 右側：健檢建議與 INS */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-stone-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-600" /> 指標狀態
              </h3>
              <div className="text-right">
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">目前 INS 值</p>
                <p className={`text-4xl font-black ${results.avgIns >= 120 && results.avgIns <= 170 ? 'text-[#5a8d3b]' : 'text-red-500'}`}>
                  {results.avgIns}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              {Object.entries(QUALITY_RANGES).map(([key, range]) => {
                const val = results.qualities[key as keyof OilQualities];
                const colorClass = getStatusColor(val, range);
                return (
                  <div key={key} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                    <span className="text-sm font-bold text-stone-500">{range.label}</span>
                    <div className="flex items-center gap-3">
                      <span className={`text-lg font-black ${colorClass}`}>{val}</span>
                      <span className="text-[10px] text-stone-300 font-bold">({range.min}~{range.max})</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-stone-900 p-6 rounded-2xl shadow-xl text-white">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-amber-400">
              <AlertCircle className="w-5 h-5" /> 配方優化建議
            </h3>
            {results.suggestions.length > 0 ? (
              <ul className="space-y-3">
                {results.suggestions.map((s, i) => (
                  <li key={i} className="text-xs text-stone-300 flex gap-2 leading-relaxed">
                    <span className="text-amber-500">•</span> {s}
                  </li>
                ))}
              </ul>
            ) : results.avgIns > 0 ? (
              <div className="flex items-center gap-3 py-2 text-green-400">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-bold">這是一個比例非常完美的配方！</span>
              </div>
            ) : (
              <p className="text-xs text-stone-500 italic">請先輸入配方重量以進行健檢分析。</p>
            )}
          </div>
        </div>
      </div>

      {/* 3. 配方分析圖表 */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="bg-[#5a8d3b] p-3 md:p-4 text-white flex items-center gap-3">
          <h2 className="text-xl font-bold tracking-tight">3. 五力分布雷達圖 (Distribution)</h2>
        </div>
        <div className="p-8 flex flex-col items-center">
          <RadarChart qualities={results.qualities} />
          <div className="max-w-md w-full mt-4 p-4 bg-lime-50 rounded-xl border border-lime-100 flex items-start gap-3">
             <Info className="w-5 h-5 text-lime-600 flex-shrink-0 mt-0.5" />
             <p className="text-xs text-lime-800 leading-relaxed">
               雷達圖呈現了肥皂在使用時的平衡度。一個理想的日常用皂應該在五個維度上儘量擴展，而非偏向單一極端。
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
