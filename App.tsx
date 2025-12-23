import React, { useState, useEffect, useMemo } from 'react';
import { SafetyAlert } from './components/SafetyAlert';
import { Calculator, MiniQualityBars } from './components/Calculator';
import { FAQS, OILS, QUALITY_UI } from './constants';
import { SectionType, OilData, FormulaItem, SavedFormula, AdditiveItem } from './types';
import {
  Droplets,
  FlaskConical,
  Clock,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Box,
  ThermometerSun,
  Info,
  Sparkles,
  BookOpen,
  Search,
  Filter,
  Trophy,
  ChevronDown,
  Shield,
  ShieldCheck,
  Zap,
  Waves,
  DollarSign,
  FileText,
  Palette,
  Leaf,
  Moon,
  Sun
} from 'lucide-react';

const STORAGE_KEY_PRICES = 'soap_master_oil_prices';
const STORAGE_KEY_FORMULA = 'soap_master_formula';
const STORAGE_KEY_SAVED_RECIPES = 'soap_master_saved_recipes';
const STORAGE_KEY_THEME = 'soap_master_theme';
const STORAGE_KEY_WATER_RATIO = 'soap_master_water_ratio';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SectionType>(SectionType.CALCULATOR);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<keyof OilData | 'none'>('none');
  const [theme, setTheme] = useState<'classic' | 'natural' | 'minimal'>(() => {
    return (localStorage.getItem(STORAGE_KEY_THEME) as any) || 'classic';
  });

  // 當主題改變時，同步到 localStorage 並更新 body class
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_THEME, theme);
    const body = document.body;
    body.classList.remove('theme-natural', 'theme-minimal');
    if (theme === 'natural') body.classList.add('theme-natural');
    else if (theme === 'minimal') body.classList.add('theme-minimal');
  }, [theme]);

  // 提升配方狀態 - 從 localStorage 恢復
  const [formulaItems, setFormulaItems] = useState<FormulaItem[]>(() => {
    const savedFormula = localStorage.getItem(STORAGE_KEY_FORMULA);
    if (savedFormula) {
      try {
        const parsed = JSON.parse(savedFormula);
        return Array.isArray(parsed) ? parsed : (parsed.items || []);
      } catch (e) {
        console.error("Failed to parse saved formula", e);
      }
    }
    return [
      { oilId: 'coconut', weight: 150 },
      { oilId: 'palm', weight: 100 },
      { oilId: 'olive', weight: 250 },
    ];
  });

  // 管理添加物狀態
  const [additiveItems, setAdditiveItems] = useState<AdditiveItem[]>(() => {
    const savedFormula = localStorage.getItem(STORAGE_KEY_FORMULA);
    if (savedFormula) {
      try {
        const parsed = JSON.parse(savedFormula);
        // 如果是舊版資料可能沒有 additives 欄位，回傳空陣列
        return parsed.additives || [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // 管理自訂價格狀態 - 初始值嘗試從 localStorage 讀取
  const [oilPrices, setOilPrices] = useState<Record<string, number>>(() => {
    const savedPrices = localStorage.getItem(STORAGE_KEY_PRICES);
    if (savedPrices) {
      try {
        return JSON.parse(savedPrices);
      } catch (e) {
        console.error("Failed to parse saved oil prices", e);
        return {};
      }
    }
    return {};
  });

  // 管理存檔配方列表
  const [savedRecipes, setSavedRecipes] = useState<SavedFormula[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SAVED_RECIPES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved recipes", e);
      }
    }
    return [];
  });

  // 管理預設水量倍數
  const [waterRatio, setWaterRatio] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_WATER_RATIO);
    return saved ? parseFloat(saved) : 2.3;
  });

  // 當價格改變時，同步到 localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PRICES, JSON.stringify(oilPrices));
  }, [oilPrices]);

  // 當配方改變時，同步到 localStorage (包含油脂與添加物)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FORMULA, JSON.stringify({ items: formulaItems, additives: additiveItems }));
  }, [formulaItems, additiveItems]);

  // 當存檔列表改變時，同步到 localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SAVED_RECIPES, JSON.stringify(savedRecipes));
  }, [savedRecipes]);

  // 當水量倍數改變時，同步到 localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_WATER_RATIO, waterRatio.toString());
  }, [waterRatio]);

  useEffect(() => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      window.scrollTo({ top: mainContent.offsetTop - 80, behavior: 'smooth' });
    }
  }, [activeTab]);

  const sortedOils = useMemo(() => {
    let result = [...OILS];
    if (searchTerm) {
      result = result.filter(o =>
        o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.description.includes(searchTerm)
      );
    }
    if (sortBy !== 'none') {
      result.sort((a, b) => (b[sortBy] as number) - (a[sortBy] as number));
    }
    return result;
  }, [searchTerm, sortBy]);

  const handleAddOilToFormula = (oilId: string) => {
    setFormulaItems(prev => {
      const exists = prev.find(item => item.oilId === oilId);
      if (exists) return prev;
      return [...prev, { oilId, weight: 100 }];
    });
    setActiveTab(SectionType.CALCULATOR);
  };

  const handleSetPrice = (oilId: string, price: number) => {
    setOilPrices(prev => ({ ...prev, [oilId]: price }));
  };

  const handleSaveRecipe = (name: string) => {
    const newRecipe: SavedFormula = {
      id: Date.now().toString(),
      name,
      items: [...formulaItems],
      additives: [...additiveItems],
      waterRatio,
      date: Date.now()
    };
    setSavedRecipes(prev => [newRecipe, ...prev]);
  };

  const handleDeleteRecipe = (id: string) => {
    setSavedRecipes(prev => prev.filter(r => r.id !== id));
  };

  const handleLoadRecipe = (recipe: SavedFormula) => {
    setFormulaItems(recipe.items);
    setAdditiveItems(recipe.additives || []);
    if (recipe.waterRatio) {
      setWaterRatio(recipe.waterRatio);
    }
  };

  return (
    <div className={`min-h-screen pb-12 bg-[#fcfaf7] ${theme === 'classic' ? 'theme-classic' : ''}`}>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-100 shadow-sm no-print">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between py-3 md:py-4 gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => setActiveTab(SectionType.CALCULATOR)}>
                <div className="bg-amber-100 p-1.5 md:p-2 rounded-lg md:rounded-xl theme-icon">
                  <Droplets className="w-6 h-6 md:w-8 md:h-8 text-amber-700 theme-text-primary" />
                </div>
                <h1 className="text-lg md:text-2xl font-black text-stone-800 tracking-tight">
                  手工皂<span className="text-amber-600 theme-text-primary">製作大師</span>
                  <span className="ml-2 text-[10px] text-stone-400 font-bold bg-stone-100 px-1.5 py-0.5 rounded-full align-middle md:inline-block hidden">
                    v{(import.meta.env as any).PACKAGE_VERSION}
                  </span>
                </h1>
              </div>

              {/* 主題切換按鈕 */}
              <div className="hidden sm:flex bg-stone-100 p-1 rounded-xl border border-stone-200 ml-4">
                <button
                  onClick={() => setTheme('classic')}
                  className={`p-2 rounded-lg transition-all ${theme === 'classic' ? 'bg-white shadow-sm text-amber-600' : 'text-stone-400 hover:text-stone-600'}`}
                  title="經典橘"
                >
                  <Palette className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setTheme('natural')}
                  className={`p-2 rounded-lg transition-all ${theme === 'natural' ? 'bg-green-100 shadow-sm text-green-700' : 'text-stone-400 hover:text-stone-600'}`}
                  title="自然綠"
                >
                  <Leaf className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setTheme('minimal')}
                  className={`p-2 rounded-lg transition-all ${theme === 'minimal' ? 'bg-stone-800 shadow-sm text-white' : 'text-stone-400 hover:text-stone-600'}`}
                  title="極簡黑"
                >
                  <Sun className="w-4 h-4" />
                </button>
              </div>
            </div>

            <nav className="flex w-full md:w-auto overflow-x-auto no-scrollbar pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
              <div className="flex flex-nowrap md:flex-wrap items-center gap-2 md:gap-4">
                {[
                  { id: SectionType.CALCULATOR, label: '配方計算' },
                  { id: SectionType.PRE_PRODUCTION, label: '油脂百科' },
                  { id: SectionType.PRODUCTION, label: '生產指南' },
                  { id: SectionType.POST_PRODUCTION, label: '脫模晾皂' },
                  { id: SectionType.FAQ, label: '問題排除' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap text-xs md:text-sm font-bold tracking-widest transition-all px-3 py-2 rounded-full border active:scale-95 ${activeTab === tab.id
                      ? 'theme-text-primary theme-bg-light theme-border-primary shadow-sm'
                      : 'text-stone-400 bg-transparent border-transparent hover:text-stone-600 hover:bg-stone-50'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
        <div className="no-print">
          <SafetyAlert />
        </div>

        <div id="main-content" className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          <div className="lg:col-span-8 space-y-8 md:space-y-12">

            {activeTab === SectionType.CALCULATOR && (
              <Calculator
                items={formulaItems}
                setItems={setFormulaItems}
                additives={additiveItems}
                setAdditives={setAdditiveItems}
                waterRatio={waterRatio}
                setWaterRatio={setWaterRatio}
                oilPrices={oilPrices}
                onSetPrice={handleSetPrice}
                savedRecipes={savedRecipes}
                onSaveRecipe={handleSaveRecipe}
                onDeleteRecipe={handleDeleteRecipe}
                onLoadRecipe={handleLoadRecipe}
                onFindOil={(quality) => {
                  setActiveTab(SectionType.PRE_PRODUCTION);
                  setSortBy(quality as any);
                }}
              />
            )}

            {activeTab === SectionType.PRE_PRODUCTION && (
              <div className="space-y-8 animate-fade-in">
                <div className="bg-stone-900 p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-xl relative overflow-hidden">
                  <div className="absolute -right-20 -top-20 opacity-10 pointer-events-none">
                    <BookOpen className="w-80 h-80 text-white" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <BookOpen className="text-amber-400 w-8 h-8" />
                          <h2 className="text-2xl md:text-3xl font-black text-white">油脂百科與五力排行</h2>
                        </div>
                        <p className="text-stone-400 text-sm font-medium">深入了解油脂特性，並可查看市場參考成本</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative">
                        <Search className="absolute left-4 top-3.5 w-5 h-5 text-stone-500" />
                        <input
                          type="text"
                          placeholder="搜尋油脂名稱或特性"
                          className="w-full bg-white/10 text-white border border-white/10 rounded-xl pl-12 pr-4 py-3.5 outline-none focus:ring-4 focus:ring-amber-500/30 transition-all font-medium placeholder:text-stone-600"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <div className="relative">
                        <Filter className="absolute left-4 top-3.5 w-5 h-5 text-amber-500" />
                        <select
                          className="w-full bg-white text-stone-800 rounded-xl pl-12 pr-10 py-3.5 outline-none focus:ring-4 focus:ring-amber-500/30 transition-all font-bold appearance-none cursor-pointer"
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as any)}
                        >
                          <option value="none">-- 選擇排行指標 --</option>
                          <option value="hardness">🏆 按【硬度】排行</option>
                          <option value="cleansing">🏆 按【清潔】排行</option>
                          <option value="conditioning">🏆 按【保濕】排行</option>
                          <option value="bubbly">🏆 按【起泡】排行</option>
                          <option value="creamy">🏆 按【穩定】排行</option>
                          <option value="ins">🏆 按【INS 值】排行</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-stone-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {sortedOils.map((oil, index) => {
                    const currentPrice = oilPrices[oil.id] || oil.defaultPrice;
                    return (
                      <div
                        key={oil.id}
                        className={`bg-white border p-6 rounded-3xl transition-all group relative ${sortBy !== 'none' && index < 3
                          ? 'border-amber-200 shadow-md ring-1 ring-amber-100'
                          : 'border-stone-100 shadow-sm hover:border-amber-200 hover:shadow-md'
                          }`}
                      >
                        {sortBy !== 'none' && index < 3 && (
                          <div className="absolute -top-3 -left-3 flex items-center justify-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 ${index === 0 ? 'bg-yellow-400 border-yellow-200 text-yellow-900' :
                              index === 1 ? 'bg-stone-300 border-stone-100 text-stone-700' :
                                'bg-amber-600 border-amber-400 text-white'
                              }`}>
                              <Trophy className="w-5 h-5" />
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1 min-w-0 pr-2">
                            <h4 className="font-black text-stone-800 text-xl group-hover:text-amber-700 transition-colors truncate">{oil.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">皂化價: {oil.sap}</span>
                              <div className="flex items-center gap-1 bg-stone-50 px-1.5 py-0.5 rounded border border-stone-100">
                                <DollarSign className="w-2.5 h-2.5 text-amber-600" />
                                <span className="text-[10px] font-black text-amber-700">${currentPrice}/kg</span>
                              </div>
                            </div>
                          </div>
                          <div className="bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-100 flex-shrink-0">
                            <p className="text-[10px] font-black text-stone-400 uppercase leading-none text-center">INS</p>
                            <p className="text-lg font-black text-stone-700 leading-tight text-center">{oil.ins}</p>
                          </div>
                        </div>

                        <div className="mb-6 p-4 bg-stone-50/50 rounded-2xl border border-stone-100/50">
                          <MiniQualityBars oil={oil} />
                        </div>

                        <p className="text-stone-600 text-sm leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: oil.description }}></p>

                        <button
                          onClick={() => handleAddOilToFormula(oil.id)}
                          className="mt-2 w-full py-3 bg-amber-600 text-white text-xs font-black rounded-xl hover:bg-amber-700 transition-all flex items-center justify-center gap-2 uppercase tracking-widest shadow-md active:scale-95"
                        >
                          加入配方計算 <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === SectionType.PRODUCTION && (
              <div className="space-y-8 animate-fade-in">
                <div className="bg-amber-50 p-6 md:p-10 rounded-2xl md:rounded-3xl border border-amber-100">
                  <h2 className="text-2xl md:text-3xl font-black text-stone-800 mb-6 md:mb-8 flex items-center gap-3">
                    <FlaskConical className="text-amber-600 w-6 h-6 md:w-8 md:h-8" /> 生產指南 (Production Guide)
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                      <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
                        <ThermometerSun className="text-orange-500" /> 溫度控制 (Temperature)
                      </h3>
                      <div className="inline-flex items-center justify-center px-6 py-4 bg-orange-50 border-2 border-orange-100 rounded-2xl font-black text-3xl text-orange-700 shadow-inner">
                        40℃ ~ 45℃
                      </div>
                      <p className="mt-4 text-sm text-stone-500 leading-relaxed">這是油鹼混合的最佳溫度區間，有助於反應順暢且不易產生皂粉。</p>
                    </div>

                    <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
                      <h3 className="text-lg font-bold text-rose-800 mb-4 flex items-center gap-2">
                        <Shield className="text-rose-600" /> 安全防護 (Safety)
                      </h3>
                      <ul className="space-y-2 text-sm text-rose-700 font-bold">
                        <li className="flex items-center gap-2">✅ 佩戴耐強鹼手套</li>
                        <li className="flex items-center gap-2">✅ 全程戴上護目鏡</li>
                        <li className="flex items-center gap-2">✅ 穿著長袖衣物</li>
                        <li className="flex items-center gap-2">✅ 保持環境通風</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {[
                    { title: "1. 溶鹼 (Lye Solution)", desc: "將氫氧化鈉加入水中（切記：不可將水加入氫氧化鈉！），攪拌至完全透明並等待降溫。" },
                    { title: "2. 融油 (Oils)", desc: "將固態油脂加熱溶解，並與液態油混合均勻，調整溫度至與鹼水相近。" },
                    { title: "3. 混合 (Mixing)", desc: "緩緩將鹼水倒入油脂中，手動或使用攪拌棒持續攪拌至呈現濃稠狀 (Trace)。" },
                    { title: "4. 入模 (Molding)", desc: "加入精油或添加物後攪拌均勻，倒入模具並輕敲排出氣泡。" }
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4 p-6 bg-white rounded-2xl border border-stone-100 shadow-sm">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center font-black">{i + 1}</div>
                      <div>
                        <h4 className="font-black text-stone-800 mb-1">{step.title}</h4>
                        <p className="text-sm text-stone-500 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === SectionType.POST_PRODUCTION && (
              <div className="bg-white p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-sm border border-stone-100 animate-fade-in">
                <h2 className="text-2xl md:text-3xl font-black text-stone-800 mb-6 md:mb-8 flex items-center gap-3">
                  <Box className="text-stone-600 w-6 h-6 md:w-8 md:h-8" /> 脫模與晾皂
                </h2>
                <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                  <p className="text-stone-600 leading-relaxed">入模後需保溫 24 小時。保溫不足易產生「皂粉」；保溫過度則可能產生果凍效應。</p>
                </div>
              </div>
            )}

            {activeTab === SectionType.FAQ && (
              <div className="bg-white p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-sm border border-stone-100 animate-fade-in">
                <h2 className="text-2xl md:text-3xl font-black text-stone-800 mb-8 md:mb-10 flex items-center gap-3">
                  <HelpCircle className="text-amber-600 w-6 h-6 md:w-8 md:h-8" /> 常見問題排除
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  {FAQS.map((faq, i) => (
                    <div key={i} className="border border-stone-100 rounded-3xl p-6 hover:shadow-lg transition-all bg-white">
                      <h3 className="text-xl font-black text-stone-800 mb-4">{faq.symptom}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-stone-50 p-4 rounded-xl text-sm">
                          <p className="font-bold text-stone-400 mb-1">可能原因</p>
                          <p className="text-stone-600">{faq.reason}</p>
                        </div>
                        <div className="bg-amber-50 p-4 rounded-xl text-sm">
                          <p className="font-bold text-amber-600 mb-1">解決方法</p>
                          <p className="text-amber-900 font-bold">{faq.solution}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          <div className="lg:col-span-4 space-y-6 md:space-y-8">
            <div className="p-8 bg-white border border-stone-100 rounded-3xl shadow-sm">
              <h3 className="font-black text-stone-800 mb-8 flex items-center gap-2 text-lg">
                <Clock className="w-6 h-6 text-amber-600" /> 操作時間軸
              </h3>
              <div className="space-y-10 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[3px] before:bg-stone-50">
                <div className="relative pl-10 group">
                  <div className="absolute left-0 top-1 w-[26px] h-[26px] bg-white border-[6px] border-amber-500 rounded-full z-10" />
                  <p className="text-sm font-black text-stone-800">攪拌 Trace (皂化期)</p>
                  <p className="text-xs text-stone-400 mt-1">約 20 ~ 60 分鐘</p>
                </div>
                <div className="relative pl-10 group">
                  <div className="absolute left-0 top-1 w-[26px] h-[26px] bg-white border-[6px] border-stone-100 rounded-full z-10" />
                  <p className="text-sm font-black text-stone-800">入模保溫</p>
                  <p className="text-xs text-stone-400 mt-1">24 小時不可移動</p>
                </div>
                <div className="relative pl-10 group">
                  <div className="absolute left-0 top-1 w-[26px] h-[26px] bg-white border-[6px] border-stone-100 rounded-full z-10" />
                  <p className="text-sm font-black text-stone-800">熟成晾皂</p>
                  <p className="text-xs text-stone-400 mt-1">4 ~ 8 週</p>
                </div>
              </div>
            </div>

            <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100">
              <h3 className="font-black text-stone-800 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-600" /> 系統狀態
              </h3>
              <p className="text-stone-500 text-xs leading-relaxed">
                所有配方與成本估算皆在瀏覽器端即時完成，資料完全隱私且支援離線使用。
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto border-t border-stone-100 py-12 px-6 text-center mt-12 opacity-60 pb-32 md:pb-12 no-print">
        <p className="text-stone-400 text-xs italic">本站僅供教學與輔助計算參考。進行化學反應時，請務必佩戴防護裝備。</p>
      </footer>

      {/* 行動裝置底部導航 */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] md:hidden bg-white/90 backdrop-blur-lg border-t border-stone-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] px-4 pb-safe no-print">
        <div className="flex items-center justify-around h-20">
          <button
            onClick={() => setActiveTab(SectionType.CALCULATOR)}
            className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === SectionType.CALCULATOR ? 'text-amber-600 scale-110' : 'text-stone-400'}`}
          >
            <div className={`p-2 rounded-2xl transition-all ${activeTab === SectionType.CALCULATOR ? 'bg-amber-100' : 'bg-transparent'}`}>
              <FlaskConical className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black tracking-tighter uppercase">計算</span>
          </button>

          <button
            onClick={() => setActiveTab(SectionType.PRODUCTION)}
            className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === SectionType.PRODUCTION ? 'text-blue-600 scale-110' : 'text-stone-400'}`}
          >
            <div className={`p-2 rounded-2xl transition-all ${activeTab === SectionType.PRODUCTION ? 'bg-blue-100' : 'bg-transparent'}`}>
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black tracking-tighter uppercase">生產指南</span>
          </button>

          <button
            onClick={() => setActiveTab(SectionType.FAQ)}
            className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === SectionType.FAQ ? 'text-rose-600 scale-110' : 'text-stone-400'}`}
          >
            <div className={`p-2 rounded-2xl transition-all ${activeTab === SectionType.FAQ ? 'bg-rose-100' : 'bg-transparent'}`}>
              <HelpCircle className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black tracking-tighter uppercase">QA</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
