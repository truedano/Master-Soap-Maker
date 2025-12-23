
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { OILS, QUALITY_RANGES, QUALITY_UI, PRESETS } from '../constants';
import { FormulaItem, OilQualities, OilData, SavedFormula } from '../types';
import { NumberTicker } from './NumberTicker';
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
  AlertTriangle,
  AlertCircle,
  Check,
  ZapIcon,
  Circle,
  Activity,
  DollarSign,
  Tag,
  Coins,
  Bookmark,
  History,
  Save,
  FolderOpen,
  X,
  FileText,
  Percent,
  GripVertical,
  LayoutGrid,
  Printer
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

// 簡單提示組件
const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div className="absolute z-[100] bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-2 bg-stone-900 text-white text-[10px] rounded-lg shadow-xl animate-fade-in pointer-events-none border border-white/10">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-stone-900" />
        </div>
      )}
    </div>
  );
};

// 成本分佈圖
const CostChart: React.FC<{ items: FormulaItem[], oilPrices: Record<string, number> }> = ({ items, oilPrices }) => {
  const breakdown = useMemo(() => {
    let total = 0;
    const data = items.map(item => {
      const oil = OILS.find(o => o.id === item.oilId);
      if (!oil || item.weight <= 0) return null;
      const price = ((oilPrices[oil.id] || oil.defaultPrice || 0) / 1000) * item.weight;
      total += price;
      return { name: oil.name, price };
    }).filter(Boolean) as { name: string, price: number }[];

    return { total, data: data.sort((a, b) => b.price - a.price) };
  }, [items, oilPrices]);

  if (breakdown.total === 0) return null;

  return (
    <div className="space-y-3 mt-4 p-4 bg-stone-50 rounded-2xl border border-stone-100">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">預算分佈 (Cost Distribution)</span>
        <span className="text-[10px] font-black text-amber-600">Total: NT$ {Math.round(breakdown.total)}</span>
      </div>
      <div className="flex h-3 w-full rounded-full overflow-hidden shadow-inner bg-stone-200">
        {breakdown.data.map((item, i) => {
          const percent = (item.price / breakdown.total) * 100;
          return (
            <div
              key={i}
              className="h-full transition-all duration-500 hover:opacity-80 cursor-help"
              style={{
                width: `${percent}%`,
                backgroundColor: `hsl(${20 + i * 40}, 70%, 50%)`
              }}
              title={`${item.name}: ${Math.round(percent)}%`}
            />
          );
        })}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {breakdown.data.slice(0, 4).map((item, i) => (
          <div key={i} className="flex items-center gap-1.5 overflow-hidden">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: `hsl(${20 + i * 40}, 70%, 50%)` }} />
            <span className="text-[9px] font-bold text-stone-500 truncate">{item.name}</span>
            <span className="text-[9px] font-black text-stone-400 ml-auto">{Math.round((item.price / breakdown.total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 製作模式 Overlay
const ProductionMode: React.FC<{
  items: FormulaItem[],
  results: any,
  onClose: () => void
}> = ({ items, results, onClose }) => {
  const [steps, setSteps] = useState<Record<string, boolean>>({});

  const toggleStep = (id: string) => {
    setSteps(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="fixed inset-0 z-[200] bg-white overflow-y-auto animate-fade-in">
      <div className="max-w-3xl mx-auto p-6 md:p-12 space-y-12 pb-32">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-stone-100 pb-6">
          <div>
            <h1 className="text-4xl font-black text-stone-900 tracking-tighter">打皂製作單</h1>
            <p className="text-stone-400 font-bold mt-1">請準備好防護裝備：手套、口罩、護目鏡</p>
          </div>
          <button onClick={onClose} className="p-3 bg-stone-100 rounded-2xl hover:bg-stone-200 transition-all">
            <X className="w-8 h-8 text-stone-600" />
          </button>
        </div>

        {/* 核心數據 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-stone-900 text-white rounded-[2.5rem] space-y-1">
            <p className="text-xs font-black text-stone-400 uppercase tracking-widest">氫氧化鈉 (NaOH)</p>
            <p className="text-5xl font-black tabular-nums tracking-tighter text-amber-400">{results.totalNaoh}<span className="text-xl ml-1">g</span></p>
          </div>
          <div className="p-8 bg-blue-600 text-white rounded-[2.5rem] space-y-1 shadow-xl shadow-blue-100">
            <p className="text-xs font-black text-blue-200 uppercase tracking-widest">純水 (Water)</p>
            <p className="text-5xl font-black tabular-nums tracking-tighter">{results.water}<span className="text-xl ml-1">g</span></p>
          </div>
          <div className="p-8 bg-stone-100 text-stone-900 rounded-[2.5rem] space-y-1 border-2 border-stone-200">
            <p className="text-xs font-black text-stone-400 uppercase tracking-widest">總油脂 (Total Oil)</p>
            <p className="text-5xl font-black tabular-nums tracking-tighter">{results.totalWeight}<span className="text-xl ml-1">g</span></p>
          </div>
        </div>

        {/* 油脂清單 */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-stone-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <span className="text-amber-600 text-sm">1</span>
            </div>
            稱取油脂 (Weighing Oils)
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {items.map((item, i) => {
              const oil = OILS.find(o => o.id === item.oilId);
              if (!oil || item.weight <= 0) return null;
              const stepId = `oil-${i}`;
              return (
                <div
                  key={i}
                  onClick={() => toggleStep(stepId)}
                  className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all cursor-pointer ${steps[stepId] ? 'bg-stone-50 border-stone-200 opacity-40' : 'bg-white border-stone-800 shadow-sm hover:translate-x-1'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${steps[stepId] ? 'bg-green-500 border-green-500' : 'border-stone-800'}`}>
                      {steps[stepId] && <CheckCircle2 className="w-5 h-5 text-white" />}
                    </div>
                    <span className="text-xl font-black text-stone-800">{oil.name}</span>
                  </div>
                  <span className="text-2xl font-black tabular-nums">{item.weight}g</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 製作步驟紀錄 */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-stone-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 text-sm">2</span>
            </div>
            製作流程 (Workflow)
          </h2>
          <div className="space-y-4">
            {[
              { id: 'mix-water', label: '鹼水製作 (冷卻至 40-45°C)' },
              { id: 'mix-oil', label: '油脂融合 (加溫至 40-45°C)' },
              { id: 'blend', label: '油鹼混合 (攪拌至 Trace)' },
              { id: 'essential', label: '添加精油/添加物' },
              { id: 'mold', label: '入模並封保鮮膜' },
            ].map((step) => (
              <div
                key={step.id}
                onClick={() => toggleStep(step.id)}
                className={`flex items-center gap-4 p-6 rounded-3xl border-2 transition-all cursor-pointer ${steps[step.id] ? 'bg-green-50 border-green-200 opacity-40' : 'bg-white border-stone-200 hover:border-blue-400'}`}
              >
                <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center ${steps[step.id] ? 'bg-green-500 border-green-500' : 'border-stone-300'}`}>
                  {steps[step.id] && <CheckCircle2 className="w-5 h-5 text-white" />}
                </div>
                <span className={`text-lg font-black ${steps[step.id] ? 'text-green-700' : 'text-stone-600'}`}>{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-stone-100 md:hidden">
        <button onClick={onClose} className="w-full py-4 bg-stone-900 text-white rounded-2xl font-black text-lg">結束製作</button>
      </div>
    </div>
  );
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
              <foreignObject x={labelCoords.x - 20} y={labelCoords.y - 20} width="80" height="40" className="overflow-visible">
                <Tooltip text={ui.label === '清潔' ? '去除油脂的能力' : ui.label === '保濕' ? '成皂後的滋潤程度' : ui.label === '硬度' ? '皂體的堅硬耐久度' : ui.label === '起泡' ? '產生大泡沫的能力' : '保護小泡沫不破裂的能力'}>
                  <div className="flex items-center gap-1 cursor-help whitespace-nowrap p-1">
                    <QualityIcon name={ui.icon} size={14} color={ui.color} />
                    <span className="text-[12px] font-black" style={{ color: ui.color }}>
                      {p.label}
                    </span>
                  </div>
                </Tooltip>
              </foreignObject>
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
    <div className="space-y-3">
      <div className="flex items-center justify-between text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">
        <span>五力數值 (Quality Metrics)</span>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        {qualities.map(q => (
          <div key={q.key} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <QualityIcon name={q.icon} size={13} color={q.color} />
                <span className="text-xs font-bold text-stone-600">{q.label}</span>
              </div>
              <span className="text-xs font-black text-stone-800 tabular-nums">{q.val}</span>
            </div>
            <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${q.bg}`}
                style={{ width: `${Math.min(100, Math.max(5, q.val))}%` }}
              />
            </div>
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

  const renderQualityBadges = (oil: OilData) => {
    const qualities = [
      { key: 'hardness', ...QUALITY_UI.hardness, val: oil.hardness },
      { key: 'cleansing', ...QUALITY_UI.cleansing, val: oil.cleansing },
      { key: 'conditioning', ...QUALITY_UI.conditioning, val: oil.conditioning },
      { key: 'bubbly', ...QUALITY_UI.bubbly, val: oil.bubbly },
      { key: 'creamy', ...QUALITY_UI.creamy, val: oil.creamy },
    ];

    return (
      <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
        {qualities.map(q => (
          <div
            key={q.key}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded border ${q.val > 0 ? 'bg-white border-stone-200' : 'bg-stone-50 border-transparent opacity-40'}`}
            title={q.label}
          >
            <QualityIcon name={q.icon} size={10} color={q.color} />
            <span className={`text-[10px] font-bold tabular-nums ${q.val > 0 ? 'text-stone-700' : 'text-stone-400'}`}>
              {q.val}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-stone-200 bg-stone-100 ml-auto">
          <span className="text-[10px] font-black text-stone-500">INS</span>
          <span className="text-[10px] font-bold text-stone-700">{oil.ins}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 bg-white border border-stone-200 rounded-xl flex flex-col outline-none focus:ring-4 focus:ring-amber-500/20 text-stone-700 font-bold transition-all shadow-sm hover:border-amber-300"
      >
        <div className="flex items-center justify-between w-full">
          <span className="truncate">{selectedOil?.name || '選擇油脂'}</span>
          <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
        {selectedOil && renderQualityBadges(selectedOil)}
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full max-h-[350px] bg-white border border-stone-100 rounded-2xl shadow-2xl overflow-y-auto no-scrollbar animate-fade-in">
          {OILS.map((oil) => {
            const isRecommended = lackingKeys.some(key => oil[key as keyof OilQualities] >= 45);
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
                className={`flex flex-col p-3 cursor-pointer transition-all border-b border-stone-50 last:border-none ${value === oil.id ? 'bg-amber-50' : 'hover:bg-stone-50'
                  } ${isRecommended ? 'bg-amber-50/10' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isRecommended && (
                      <span className="bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm flex items-center gap-1 shadow-sm">
                        ✨ 推薦
                      </span>
                    )}
                    <span className={`text-sm font-bold truncate ${isRecommended ? 'text-amber-900 font-black' : 'text-stone-700'}`}>
                      {oil.name}
                    </span>
                  </div>
                  {value === oil.id && <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                </div>
                {renderQualityBadges(oil)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const RecipePrintCard: React.FC<{
  name: string;
  items: FormulaItem[];
  results: any;
  waterRatio: number;
}> = ({ name, items, results, waterRatio }) => {
  const date = new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="print-only print-card p-4 bg-white text-stone-900 font-sans">
      {/* Header */}
      <div className="flex justify-between items-start border-b-4 border-stone-800 pb-8 mb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter mb-2">{name || '未命名專家配方'}</h1>
          <p className="text-stone-500 font-bold">手工皂製作大師 · 專業配方報告</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-black text-stone-400 uppercase tracking-widest leading-none mb-1">製作日期</p>
          <p className="text-xl font-black">{date}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-8 mb-12">
        <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">NaOH (氫氧化鈉)</p>
          <p className="text-3xl font-black">{results.totalNaoh}g</p>
        </div>
        <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">純水需求 (倍數: {waterRatio})</p>
          <p className="text-3xl font-black">{results.water}g</p>
        </div>
        <div className="p-6 bg-stone-100 rounded-2xl border border-stone-200">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">配方總油脂重</p>
          <p className="text-3xl font-black">{results.totalWeight}g</p>
        </div>
      </div>

      {/* Main Content: Oils */}
      <div className="mb-12">
        <h2 className="text-xl font-black mb-4 flex items-center gap-2 border-b-2 border-stone-100 pb-2">
          <Scale className="w-5 h-5" /> 油脂成分表 (Ingredients)
        </h2>
        <table className="w-full text-left">
          <thead>
            <tr className="text-stone-400 text-[10px] font-black uppercase tracking-widest border-b border-stone-100">
              <th className="py-3">油脂名稱</th>
              <th className="py-3 text-right">重量 (g)</th>
              <th className="py-3 text-right">比例 (%)</th>
            </tr>
          </thead>
          <tbody className="text-stone-700 font-bold">
            {items.map((item, idx) => {
              const oil = OILS.find(o => o.id === item.oilId);
              if (!oil || item.weight <= 0) return null;
              return (
                <tr key={idx} className="border-b border-stone-100">
                  <td className="py-4">{oil.name}</td>
                  <td className="py-4 text-right tabular-nums">{item.weight}g</td>
                  <td className="py-4 text-right tabular-nums">
                    {Math.round((item.weight / (results.totalWeight || 1)) * 100)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Quality Analysis */}
      <div className="grid grid-cols-2 gap-12 mb-12">
        <div>
          <h2 className="text-xl font-black mb-4 flex items-center gap-2 border-b-2 border-stone-100 pb-2">
            <TrendingUp className="w-5 h-5" /> 五力分布與 INS
          </h2>
          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-black text-stone-500">配方 INS 值 (建議 120-170)</span>
              <span className={`text-2xl font-black ${results.avgIns < 120 || results.avgIns > 170 ? 'text-orange-500' : 'text-green-600'}`}>{results.avgIns}</span>
            </div>
            {(Object.keys(QUALITY_UI) as Array<keyof typeof QUALITY_UI>).map((key) => {
              const ui = QUALITY_UI[key];
              const range = QUALITY_RANGES[key];
              const val = results.qualities[key];
              return (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-black uppercase">
                    <span>{ui.label}</span>
                    <span className="text-stone-400">{val} / 建議 {range.min}-{range.max}</span>
                  </div>
                  <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-stone-800" style={{ width: `${Math.min(val, 100)}%` }} />
                  </div>
                </div>
              );
            })}`
          </div>
        </div>

        <div>
          <h2 className="text-xl font-black mb-4 flex items-center gap-2 border-b-2 border-stone-100 pb-2">
            <FileText className="w-5 h-5" /> 實作紀錄與筆記 (Notes)
          </h2>
          <div className="h-48 border border-dashed border-stone-200 rounded-2xl p-4 flex flex-col justify-between">
            <div className="border-b border-stone-100 pb-4" />
            <div className="border-b border-stone-100 pb-4" />
            <div className="border-b border-stone-100 pb-4" />
            <div className="border-b border-stone-100 pb-4 last:border-0" />
          </div>
          <p className="text-[10px] text-stone-400 mt-2 font-bold italic">💡 建議記錄：環境溫度、溼度、攪拌時間、保溫方式。</p>
        </div>
      </div>

      {/* Safety Alert */}
      <div className="p-8 bg-stone-100 rounded-[2.5rem] flex items-center gap-6 border border-stone-200">
        <Shield className="w-12 h-12 text-stone-400 flex-shrink-0" />
        <div>
          <p className="font-black text-lg mb-1">【安全警語 · Safety Standards】</p>
          <p className="text-xs text-stone-600 leading-relaxed font-bold opacity-80">
            操作氫氧化納具有強腐蝕性。製作過程中請務必全程配戴長袖衣物、護目鏡及防酸鹼手套。
            油鹼混合時會產生化學放熱，請於通風良好處製作。如不慎接觸皮膚，請立即以大量清水沖洗並視情況就醫。
          </p>
        </div>
      </div>

      <p className="text-center text-[10px] font-bold text-stone-400 mt-16 pt-8 border-t border-stone-100 tracking-widest flex items-center justify-center gap-2 uppercase">
        <Sparkles className="w-3 h-3 text-amber-500" /> Master Soap Maker · Professional Recipe Report · 版權所有 © 2024
      </p>
    </div>
  );
};

interface CalculatorProps {
  items: FormulaItem[];
  setItems: React.Dispatch<React.SetStateAction<FormulaItem[]>>;
  waterRatio: number;
  setWaterRatio: (ratio: number) => void;
  oilPrices: Record<string, number>;
  onSetPrice: (id: string, price: number) => void;
  onFindOil: (quality: string) => void;
  savedRecipes: SavedFormula[];
  onSaveRecipe: (name: string) => void;
  onLoadRecipe: (recipe: SavedFormula) => void;
  onDeleteRecipe: (id: string) => void;
}

export const Calculator: React.FC<CalculatorProps> = ({
  items,
  setItems,
  waterRatio,
  setWaterRatio,
  oilPrices,
  onSetPrice,
  onFindOil,
  savedRecipes,
  onSaveRecipe,
  onLoadRecipe,
  onDeleteRecipe
}) => {
  const [showCost, setShowCost] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [recipeName, setRecipeName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [inputMode, setInputMode] = useState<'weight' | 'percent'>('weight');
  const [showPresets, setShowPresets] = useState(false);
  const [showProduction, setShowProduction] = useState(false);

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
      calculate,
      totalWeight: current.totalWeight,
      avgIns: current.avgIns,
      totalNaoh: Number(current.totalNaoh.toFixed(1)),
      water: Number((current.totalNaoh * waterRatio).toFixed(1)),
      totalCost: Math.round(current.totalCost),
      qualities: current.qualities,
      suggestions,
      lackingKeys,
      personality,
      baseSuggestWeight
    };
  }, [items, waterRatio, oilPrices]);

  const previewResults = useMemo(() => {
    if (!hoveredOil) return null;

    const previewItems = [...items];
    const baseSuggestWeight = results.baseSuggestWeight;

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
    return results.calculate(previewItems);
  }, [items, hoveredOil, previewMode, hoveringSlotIndex, previewWeightChange, results]);

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
      case 'low': return { color: 'text-orange-500', bg: 'bg-orange-500', icon: <AlertCircle className="w-4 h-4" />, label: '數值不足' };
      case 'high': return { color: 'text-red-500', bg: 'bg-red-500', icon: <AlertTriangle className="w-4 h-4" />, label: '數值過度' };
      case 'ideal': return { color: 'text-green-600', bg: 'bg-green-600', icon: <CheckCircle2 className="w-4 h-4" />, label: '理想比例' };
      default: return { color: 'text-stone-300', bg: 'bg-stone-100', icon: null, label: '' };
    }
  };

  return (
    <div className="calculator-container">
      <RecipePrintCard
        name={recipeName}
        items={items}
        results={results}
        waterRatio={waterRatio}
      />
      <div className="space-y-8 animate-fade-in no-print">
        {/* 1. 配方組成 */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="bg-[#2d2926] p-4 md:p-5 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-amber-500/20 p-1.5 rounded flex items-center justify-center">
                <CalcIcon className="w-5 h-5 text-amber-500" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-xl font-bold tracking-tight leading-none">1. 配方組成 (Recipe)</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest shrink-0">目前名稱:</span>
                  <input
                    type="text"
                    placeholder="點擊輸入配方名稱..."
                    value={recipeName}
                    onChange={(e) => setRecipeName(e.target.value)}
                    className="bg-transparent border-none text-amber-400 text-sm font-black p-0 outline-none focus:ring-0 placeholder:text-stone-600 w-48 truncate"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex bg-white/10 p-1 rounded-lg border border-white/20">
                <button
                  onClick={() => setInputMode('weight')}
                  className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest transition-all ${inputMode === 'weight' ? 'bg-amber-500 text-white shadow-sm' : 'text-stone-400 hover:text-white'}`}
                >
                  克 (g)
                </button>
                <button
                  onClick={() => setInputMode('percent')}
                  className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest transition-all ${inputMode === 'percent' ? 'theme-bg-primary text-white shadow-sm' : 'text-stone-400 hover:text-white'}`}
                >
                  比例 (%)
                </button>
              </div>
              <button
                onClick={() => setShowPresets(!showPresets)}
                className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all text-[10px] font-black uppercase tracking-widest active:scale-95 ${showPresets ? 'theme-bg-primary text-white border-transparent shadow-sm' : 'bg-white/10 text-stone-400 border-white/20 hover:bg-white/20'
                  }`}
              >
                <LayoutGrid className="w-3 h-3" />
                懶人包
              </button>
              <button
                onClick={() => setShowLibrary(!showLibrary)}
                className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all text-[10px] font-black uppercase tracking-widest active:scale-95 ${showLibrary ? 'bg-amber-500 text-white border-amber-600 shadow-sm' : 'bg-white/10 text-stone-400 border-white/20 hover:bg-white/20'
                  }`}
              >
                <FolderOpen className="w-3 h-3" />
                配方庫 ({savedRecipes.length})
              </button>
              <button
                onClick={() => setShowCost(!showCost)}
                className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all text-[10px] font-black uppercase tracking-widest active:scale-95 ${showCost ? 'bg-amber-500 text-white border-amber-600 shadow-sm' : 'bg-white/10 text-stone-400 border-white/20 hover:bg-white/20'
                  }`}
              >
                <DollarSign className="w-3 h-3" />
                成本模式: {showCost ? 'ON' : 'OFF'}
              </button>
              <button
                onClick={() => setShowProduction(true)}
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-full border border-blue-700 transition-all text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 active:scale-95 shadow-lg shadow-blue-100"
              >
                <FileText className="w-3 h-3" />
                開始製作 (Production)
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-3 py-1 bg-white text-stone-700 rounded-full border border-stone-200 transition-all text-[10px] font-black uppercase tracking-widest hover:bg-stone-50 active:scale-95 shadow-sm"
              >
                <Printer className="w-3 h-3" />
                輸出 PDF / 列印
              </button>
              {results.totalWeight > 0 && (
                <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">配方導向：{results.personality}</span>
                </div>
              )}
            </div>
          </div>

          {/* 懶人包選單 */}
          {showPresets && (
            <div className="bg-stone-50 border-b border-stone-100 p-4 grid grid-cols-1 md:grid-cols-3 gap-3 animate-fade-in shadow-inner">
              {PRESETS.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setItems(preset.items);
                    setShowPresets(false);
                  }}
                  className="p-4 bg-white border border-stone-200 rounded-2xl text-left hover:theme-border-primary hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-stone-700 group-hover:theme-text-primary transition-colors uppercase tracking-tight text-xs">{preset.name}</span>
                    <div className="w-5 h-5 bg-stone-100 rounded-full flex items-center justify-center">
                      <Zap className="w-3 h-3 text-stone-300 group-hover:theme-text-primary" />
                    </div>
                  </div>
                  <p className="text-[10px] text-stone-400 font-bold leading-tight line-clamp-2">{preset.description}</p>
                </button>
              ))}
            </div>
          )}

          <div className="p-4 md:p-6 space-y-4">
            <div className="space-y-4">
              {items.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 px-6 bg-white/50 rounded-[3rem] border-2 border-dashed border-stone-200 animate-fade-in text-center soap-texture">
                  <div className="relative mb-6">
                    <div className="absolute -inset-4 theme-bg-light rounded-full blur-2xl animate-pulse" />
                    <img src="soap_empty.png" alt="Happy Soap" className="w-48 h-48 object-contain relative z-10 drop-shadow-xl" />
                  </div>
                  <h3 className="text-2xl font-black text-stone-800 mb-2 tracking-tight">開始調配您的第一塊完美手工皂吧！</h3>
                  <p className="text-stone-400 font-bold max-w-xs leading-relaxed mb-8">
                    選擇下方的「新增油脂」或使用「懶人包」，<br />展開您的專業打皂旅程。
                  </p>
                  <button
                    onClick={() => addItem()}
                    className="flex items-center gap-2 px-8 py-4 theme-bg-primary text-white rounded-2xl font-black shadow-lg shadow-amber-200/20 hover:opacity-90 transition-all active:scale-95"
                  >
                    <PlusCircle className="w-5 h-5" />
                    新增第一項油脂
                  </button>
                </div>
              )}
              {items.map((item, index) => {
                const currentPrice = oilPrices[item.oilId] || OILS.find(o => o.id === item.oilId)?.defaultPrice || 0;
                return (
                  <div key={index} className="flex flex-col gap-4 p-5 bg-white rounded-3xl border border-stone-100 shadow-sm hover:shadow-md transition-all relative group" style={{ zIndex: 10 + items.length - index }}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="flex items-center gap-3 w-full sm:flex-1">
                        <div className="p-2 bg-stone-50 rounded-lg text-stone-300 hidden sm:block">
                          <GripVertical className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
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
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex flex-col gap-2 flex-1 sm:flex-none">
                          <div className="relative flex items-center bg-stone-50 border-2 border-stone-800 rounded-2xl overflow-hidden transition-all shadow-sm focus-within:ring-4 focus-within:ring-amber-500/20">
                            <input
                              type="number"
                              value={inputMode === 'weight' ? (item.weight || '') : (results.totalWeight > 0 ? Number(((item.weight / results.totalWeight) * 100).toFixed(1)) : 0)}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                if (inputMode === 'weight') {
                                  updateItem(index, 'weight', val);
                                } else {
                                  const newWeight = results.totalWeight > 0 ? (val / 100) * results.totalWeight : val;
                                  updateItem(index, 'weight', newWeight);
                                }
                              }}
                              className="w-full sm:w-32 p-4 bg-transparent text-stone-900 font-bold text-right outline-none text-lg"
                              placeholder="0"
                            />
                            <span className="px-5 text-stone-500 font-black text-sm border-l border-stone-200 h-full flex items-center bg-white/50 w-12 justify-center">
                              {inputMode === 'weight' ? 'g' : '%'}
                            </span>
                          </div>
                          {/* 快速調整滑桿 */}
                          <div className="px-2 flex items-center gap-2">
                            <input
                              type="range"
                              min="0"
                              max={inputMode === 'weight' ? Math.max(1000, results.totalWeight) : 100}
                              step={inputMode === 'weight' ? 10 : 1}
                              value={inputMode === 'weight' ? item.weight : (results.totalWeight > 0 ? (item.weight / results.totalWeight) * 100 : 0)}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                if (inputMode === 'weight') {
                                  updateItem(index, 'weight', val);
                                } else {
                                  const newWeight = results.totalWeight > 0 ? (val / 100) * results.totalWeight : val;
                                  updateItem(index, 'weight', newWeight);
                                }
                              }}
                              className="flex-1 h-2 bg-stone-100 rounded-full appearance-none cursor-pointer accent-stone-800 hover:accent-amber-500 transition-all"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(index)}
                          className="p-4 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-90 h-14 w-14 flex items-center justify-center flex-shrink-0"
                          title="移除油脂"
                        >
                          <Trash2 className="w-6 h-6" />
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

                        <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-xl border-2 border-stone-100 shadow-sm transition-all group-hover:theme-border-primary">
                          <div className="text-right">
                            <span className="text-[10px] font-black text-stone-500 uppercase block leading-none mb-1">分項小計 (Cost)</span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-xs font-black theme-text-primary">$</span>
                              <NumberTicker
                                value={Math.round((currentPrice / 1000) * item.weight)}
                                className="text-xl font-black text-stone-800 tabular-nums leading-none"
                              />
                            </div>
                          </div>
                          <div className="p-1.5 theme-icon rounded-full">
                            <Coins className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={addItem} className="flex-1 py-5 border-2 border-dashed border-stone-200 rounded-2xl text-stone-400 font-black hover:bg-white hover:theme-border-primary hover:theme-text-primary transition-all flex items-center justify-center gap-2 uppercase tracking-widest active:scale-[0.98]">
                <PlusCircle className="w-5 h-5" /> 新增油脂材料
              </button>
              <button
                onClick={() => setShowSaveModal(true)}
                className="px-8 py-5 theme-bg-primary text-white rounded-2xl font-black hover:opacity-90 transition-all flex items-center justify-center gap-2 uppercase tracking-widest active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                disabled={items.length === 0 || results.totalWeight === 0}
              >
                <Save className="w-5 h-5 text-white/70" /> 儲存目前配方
              </button>
            </div>

            {/* 配方庫列表 */}
            {showLibrary && (
              <div className="mt-6 border-t border-stone-100 pt-6 animate-fade-in">
                <h3 className="text-sm font-black text-stone-400 mb-4 flex items-center gap-2 uppercase tracking-widest">
                  <History className="w-4 h-4" /> 已儲存的配方
                </h3>
                {savedRecipes.length === 0 ? (
                  <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-100 italic text-stone-400 text-sm">
                    目前還沒有任何存檔配方...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {savedRecipes.map(recipe => (
                      <div key={recipe.id} className="p-4 bg-white border border-stone-200 rounded-2xl flex items-center justify-between group hover:theme-border-primary hover:shadow-md transition-all">
                        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => {
                          onLoadRecipe(recipe);
                          setRecipeName(recipe.name);
                          setShowLibrary(false);
                        }}>
                          <p className="font-black text-stone-800 truncate group-hover:theme-text-primary transition-colors">{recipe.name}</p>
                          <p className="text-[10px] text-stone-400 font-bold mt-1">
                            {new Date(recipe.date).toLocaleDateString()} · {recipe.items.length} 支油脂 · {recipe.items.reduce((acc, i) => acc + i.weight, 0)}g
                          </p>
                        </div>
                        <div className="flex gap-1 ml-4">
                          <button
                            onClick={() => onDeleteRecipe(recipe.id)}
                            className="p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 儲存選單 Modal */}
        {showSaveModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowSaveModal(false)} />
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 animate-scale-up border border-stone-100">
              <button
                onClick={() => setShowSaveModal(false)}
                className="absolute top-6 right-6 p-2 text-stone-400 hover:text-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 theme-bg-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Bookmark className="w-8 h-8 theme-text-primary" />
                </div>
                <h3 className="text-2xl font-black text-stone-800">為您的配方命名</h3>
                <p className="text-stone-500 text-sm mt-2">命名後即可存入您的私藏配方庫</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mt-1">配方總額 (成本)</p>
                  {showCost && (
                    <CostChart items={items} oilPrices={oilPrices} />
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-stone-400 uppercase tracking-widest pl-1">配方名稱</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300" />
                    <input
                      type="text"
                      autoFocus
                      placeholder="例如：春季薰衣草馬賽皂"
                      className="w-full pl-12 pr-4 py-4 bg-stone-50 border-2 border-stone-100 rounded-2xl outline-none focus:border-amber-500 focus:bg-white transition-all font-bold text-stone-800"
                      value={recipeName}
                      onChange={(e) => setRecipeName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && recipeName.trim()) {
                          onSaveRecipe(recipeName);
                          // 不再清空名稱，保持同步
                          setShowSaveModal(false);
                          setShowLibrary(true);
                        }
                      }}
                    />
                  </div>
                </div>

                <button
                  disabled={!recipeName.trim()}
                  onClick={() => {
                    onSaveRecipe(recipeName);
                    // 不再清空名稱，保持同步
                    setShowSaveModal(false);
                    setShowLibrary(true);
                  }}
                  className="w-full py-4 theme-bg-primary text-white rounded-2xl font-black hover:opacity-90 transition-all active:scale-95 disabled:opacity-30 disabled:grayscale shadow-lg shadow-amber-600/10 flex items-center justify-center gap-2"
                >
                  確 定 儲 存
                </button>
              </div>
            </div>
          </div>
        )}

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
                        <span>NaOH 需求量</span>
                        <NumberTicker value={results.totalNaoh} precision={1} suffix=" g" className="font-black" />
                      </div>
                      <div className="flex justify-between p-4 bg-blue-50 rounded-2xl text-sm font-bold text-blue-800 border border-blue-100 flex-wrap gap-y-2">
                        <div className="flex items-center gap-2">
                          <span>水量要求</span>
                          <div className="flex items-center bg-white rounded-lg border border-blue-200 px-2 py-0.5">
                            <input
                              type="number"
                              value={waterRatio}
                              step="0.1"
                              min="1"
                              max="5"
                              onChange={(e) => setWaterRatio(Number(e.target.value))}
                              className="w-10 bg-transparent outline-none text-center font-black text-xs p-0"
                            />
                            <span className="text-[10px] text-blue-400 opacity-60">倍</span>
                          </div>
                        </div>
                        <NumberTicker value={results.water} precision={1} suffix=" g" className="font-black" />
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
                      <NumberTicker value={results.totalCost} prefix="$" className="text-4xl font-black text-stone-800 tabular-nums" />
                      <span className="text-xs font-bold text-stone-400 ml-1">TWD</span>
                    </div>
                    <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100">
                      <span className="text-[10px] font-black text-stone-400 uppercase block mb-1">平均成本 (/100g)</span>
                      <NumberTicker
                        value={results.totalWeight > 0 ? Math.round((results.totalCost / results.totalWeight) * 100) : 0}
                        prefix="$"
                        className="text-4xl font-black text-stone-800 tabular-nums"
                      />
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
                  <CostChart items={items} oilPrices={oilPrices} />
                </div>
              </div>
            )}
          </div>

          <div className="xl:col-span-5">
            <div className="xl:sticky xl:top-8 space-y-6">
              {/* 4. 五力分布 (已搬移至此) */}
              <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
                <div className="bg-stone-800 p-4 text-white flex items-center gap-3">
                  <Waves className="w-5 h-5 text-amber-500" />
                  <h2 className="text-sm font-bold tracking-tight">數據對比 (Radar Chart)</h2>
                </div>
                <div className="p-4 flex flex-col items-center bg-stone-50/30">
                  <RadarChart qualities={results.qualities} previewQualities={previewResults?.qualities} />
                </div>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 relative">
                {hoveredOil && (
                  <div className={`absolute top-0 right-0 p-3 text-white text-[10px] font-black rounded-bl-2xl z-20 animate-pulse shadow-lg flex items-center gap-2 ${previewMode === 'reduction' ? 'bg-rose-500' : 'theme-bg-primary'}`}>
                    <Sparkles className="w-3 h-3" /> 數據預覽：{hoveredOil.name} {previewMode === 'reduction' ? '(調降)' : '(補位)'}
                  </div>
                )}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-100">
                  <h3 className="text-lg font-black text-stone-800 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 theme-text-primary" /> 指標分析
                  </h3>
                  <div className="text-right">
                    <Tooltip text="INS 值代表肥皂的軟硬程度，建議範圍在 120-170 之間。">
                      <div className="flex flex-col items-end cursor-help group/ins min-h-[64px] justify-center">
                        <p className="text-[10px] font-black text-stone-400 uppercase mb-1 flex items-center gap-1 group-hover/ins:theme-text-primary transition-colors">
                          配方總 INS 值 <Info className="w-3 h-3" />
                        </p>
                        <div className="flex items-center justify-end gap-2">
                          {results.avgIns > 0 && (
                            <div className={`${results.avgIns < 120 || results.avgIns > 170 ? 'text-orange-500' : 'text-green-600'} flex items-center gap-1`}>
                              {results.avgIns < 120 ? <AlertCircle className="w-5 h-5" /> : results.avgIns > 170 ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                            </div>
                          )}
                          <div className="relative">
                            <NumberTicker
                              value={results.avgIns}
                              precision={1}
                              className={`text-5xl font-black tabular-nums tracking-tighter ${results.avgIns < 120 || results.avgIns > 170 ? 'text-orange-500' : 'text-green-600'}`}
                            />
                            {previewResults?.avgIns !== undefined && previewResults.avgIns !== results.avgIns && (
                              <div className={`absolute -bottom-4 right-0 text-[10px] font-black animate-pulse whitespace-nowrap ${previewResults.avgIns > results.avgIns ? 'text-green-500' : 'text-red-500'}`}>
                                預估: {previewResults.avgIns > results.avgIns ? '↑' : '↓'} {previewResults.avgIns}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Tooltip>
                  </div>
                </div>

                <div className="space-y-8">
                  {(Object.keys(QUALITY_UI) as Array<keyof typeof QUALITY_UI>).map((qKey) => {
                    const ui = QUALITY_UI[qKey];
                    const range = QUALITY_RANGES[qKey];
                    const val = results.qualities[qKey];
                    const previewVal = previewResults?.qualities ? previewResults.qualities[qKey] : null;
                    const status = getIndicatorStatus(val, range);
                    const statusUI = getStatusUI(status);

                    return (
                      <div key={qKey} className="space-y-3">
                        <div className="flex items-end justify-between">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <Tooltip text={ui.label === '清潔' ? '去除油脂的能力' : ui.label === '保濕' ? '成皂後的滋潤程度' : ui.label === '硬度' ? '皂體的堅硬耐久度' : ui.label === '起泡' ? '產生大泡沫的能力' : '保護小泡沫不破裂的能力'}>
                                <div className="flex items-center gap-2 cursor-help group/item">
                                  <span className={`p-1 rounded bg-stone-50 group-hover/item:bg-amber-50 transition-colors`}>
                                    <QualityIcon name={ui.icon} color={ui.color} size={14} />
                                  </span>
                                  <span className="text-sm font-black text-stone-700 group-hover/item:text-amber-600 transition-colors">{ui.label}</span>
                                </div>
                              </Tooltip>
                            </div>
                            <p className="text-[10px] font-bold text-stone-400 ml-8">建議區間：{range.min} ~ {range.max}</p>
                          </div>

                          <div className="text-right h-12 flex flex-col justify-center">
                            <div className="flex items-center justify-end gap-2">
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border flex items-center gap-1 ${statusUI.color.replace('text-', 'border-').replace('text-', 'bg-')}/5 ${statusUI.color} ${status !== 'ideal' && status !== 'none' ? 'animate-pulse' : ''}`}>
                                {statusUI.icon}
                                {statusUI.label}
                              </span>
                              <NumberTicker
                                value={val}
                                className={`text-2xl font-black tabular-nums ${statusUI.color}`}
                              />
                            </div>
                            <div className="h-4 relative">
                              {previewVal !== null && previewVal !== val && (
                                <div className={`absolute right-0 top-0 text-[10px] font-black animate-pulse flex items-center justify-end gap-1 ${previewVal > val ? 'text-green-500' : 'text-red-500'}`}>
                                  預估變動: {previewVal > val ? '↑' : '↓'} {previewVal}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className={`relative h-4 bg-stone-100 rounded-full overflow-hidden shadow-inner border transition-all duration-300 ${status === 'low' ? 'border-orange-200 ring-2 ring-orange-100' : status === 'high' ? 'border-red-200 ring-2 ring-red-100' : 'border-stone-200/50'}`}>
                          <div
                            className="absolute h-full bg-stone-200/50 border-x border-stone-300/30 z-0"
                            style={{ left: `${range.min}%`, width: `${range.max - range.min}%` }}
                          />
                          <div
                            className={`h-full ${statusUI.bg} shadow-sm transition-all duration-500 relative z-10`}
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

              <div className="bg-stone-900 p-8 rounded-3xl shadow-2xl text-white relative min-h-[200px]">
                <div className="absolute -right-10 -top-10 opacity-5">
                  <ZapIcon className="w-40 h-40" />
                </div>
                <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-amber-400 relative z-10">
                  <Lightbulb className="w-6 h-6" /> 配方專家建議
                </h3>
                {results.suggestions.length > 0 ? (
                  <div className="space-y-4 relative z-10">
                    {results.suggestions.map((s, i) => (
                      <div key={`s-${s.qualityKey}-${i}`} className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <p className={`text-sm font-black mb-3 ${s.text.includes('過高') || s.text.includes('太強') ? 'text-rose-400' : 'text-orange-400'}`}>{s.text}</p>
                        <div className="flex flex-wrap gap-2">
                          {s.actions.map((action) => {
                            const oilObj = OILS.find(o => o.name.includes(action.name));
                            const isReduce = action.type === 'reduce';
                            return (
                              <button
                                key={`${action.name}-${action.type}`}
                                onMouseEnter={() => {
                                  if (oilObj) {
                                    setHoveredOil(oilObj);
                                    setPreviewMode(isReduce ? 'reduction' : 'addition');
                                    setPreviewWeightChange(action.weight);
                                  }
                                }}
                                onMouseLeave={() => { setHoveredOil(null); setPreviewMode(null); }}
                                onClick={() => applyAdjustment(action.name, action.weight, action.type)}
                                className={`flex items-center gap-1.5 text-[10px] px-3 py-2 rounded-xl font-bold transition-all group shadow-sm border border-transparent ${isReduce
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

          {/* 製作模式 Overlay */}
          {showProduction && (
            <ProductionMode
              items={items}
              results={results}
              onClose={() => setShowProduction(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
