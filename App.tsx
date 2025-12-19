
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { SafetyAlert } from './components/SafetyAlert';
import { Calculator } from './components/Calculator';
import { Assistant } from './components/Assistant';
import { FAQS, OILS, QUALITY_RANGES, QUALITY_UI } from './constants';
import { SectionType, OilData } from './types';
import { 
  Droplets, 
  Settings, 
  FlaskConical, 
  Clock, 
  HelpCircle, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Box,
  ThermometerSun,
  Info,
  Sparkles,
  BookOpen,
  Search,
  Filter,
  Trophy,
  MessageSquareText,
  ChevronDown,
  Shield,
  Zap,
  Waves
} from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SectionType>(SectionType.CALCULATOR);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<keyof OilData | 'none'>('none');
  const [showAssistant, setShowAssistant] = useState(false);

  // 切換分頁時自動捲動到內容區域上方
  useEffect(() => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      window.scrollTo({ top: mainContent.offsetTop - 80, behavior: 'smooth' });
    }
  }, [activeTab]);

  // 排序與過濾邏輯
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
    <div className="min-h-screen pb-12 bg-[#fcfaf7]">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between py-3 md:py-4 gap-4">
            <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => setActiveTab(SectionType.CALCULATOR)}>
              <div className="bg-amber-100 p-1.5 md:p-2 rounded-lg md:rounded-xl">
                <Droplets className="w-6 h-6 md:w-8 md:h-8 text-amber-700" />
              </div>
              <h1 className="text-lg md:text-2xl font-black text-stone-800 tracking-tight">
                手工皂<span className="text-amber-600">製作大師</span>
              </h1>
            </div>
            
            <nav className="flex w-full md:w-auto overflow-x-auto no-scrollbar pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
              <div className="flex flex-nowrap md:flex-wrap items-center gap-2 md:gap-4">
                {[
                  { id: SectionType.CALCULATOR, label: '配方計算' },
                  { id: SectionType.PRE_PRODUCTION, label: '油脂百科' },
                  { id: SectionType.PRODUCTION, label: '製作關鍵' },
                  { id: SectionType.POST_PRODUCTION, label: '脫模晾皂' },
                  { id: SectionType.FAQ, label: '問題排除' },
                ].map((tab) => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap text-xs md:text-sm font-bold tracking-widest transition-all px-3 py-2 rounded-full border ${
                      activeTab === tab.id 
                      ? 'text-amber-700 bg-amber-50 border-amber-200 shadow-sm' 
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
        <SafetyAlert />

        <div id="main-content" className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          <div className="lg:col-span-8 space-y-8 md:space-y-12">
            
            {activeTab === SectionType.CALCULATOR && (
              <Calculator 
                onFindOil={(quality) => {
                  setActiveTab(SectionType.PRE_PRODUCTION);
                  setSortBy(quality as any);
                }} 
              />
            )}

            {activeTab === SectionType.PRE_PRODUCTION && (
              <div className="space-y-8 animate-fade-in">
                {/* 搜尋與篩選工具列 */}
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
                        <p className="text-stone-400 text-sm font-medium">點擊下方排序，快速找出最適合您配方的強效油脂</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative">
                        <Search className="absolute left-4 top-3.5 w-5 h-5 text-stone-500" />
                        <input 
                          type="text" 
                          placeholder="搜尋油脂名稱或特性 (例如: 溫和、頭髮...)" 
                          className="w-full bg-white/10 text-white border border-white/10 rounded-xl pl-12 pr-4 py-3.5 outline-none focus:ring-4 focus:ring-amber-500/30 transition-all font-medium placeholder:text-stone-600 focus:bg-white/20"
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
                          <option value="hardness">🏆 按【{QUALITY_UI.hardness.label}】排行</option>
                          <option value="cleansing">🏆 按【{QUALITY_UI.cleansing.label}】排行</option>
                          <option value="conditioning">🏆 按【{QUALITY_UI.conditioning.label}】排行</option>
                          <option value="bubbly">🏆 按【{QUALITY_UI.bubbly.label}】排行</option>
                          <option value="creamy">🏆 按【{QUALITY_UI.creamy.label}】排行</option>
                          <option value="ins">🏆 按【INS 值】排行</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-stone-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 油品排行列表 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {sortedOils.map((oil, index) => (
                    <div 
                      key={oil.id} 
                      className={`bg-white border p-6 rounded-3xl transition-all group relative ${
                        sortBy !== 'none' && index < 3 
                        ? 'border-amber-200 shadow-md ring-1 ring-amber-100' 
                        : 'border-stone-100 shadow-sm hover:border-amber-200 hover:shadow-md'
                      }`}
                    >
                      {/* 排行獎牌 */}
                      {sortBy !== 'none' && index < 3 && (
                        <div className="absolute -top-3 -left-3 flex items-center justify-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 ${
                            index === 0 ? 'bg-yellow-400 border-yellow-200 text-yellow-900' : 
                            index === 1 ? 'bg-stone-300 border-stone-100 text-stone-700' : 
                            'bg-amber-600 border-amber-400 text-white'
                          }`}>
                            <Trophy className="w-5 h-5" />
                          </div>
                          <span className="ml-2 text-xs font-black text-amber-800 uppercase bg-amber-100 px-2 py-0.5 rounded-full">
                            TOP {index + 1}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-black text-stone-800 text-xl group-hover:text-amber-700 transition-colors">{oil.name}</h4>
                          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">皂化價: {oil.sap}</span>
                        </div>
                        <div className="bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-100">
                          <p className="text-[10px] font-black text-stone-400 uppercase leading-none">INS</p>
                          <p className="text-lg font-black text-stone-700 leading-tight">{oil.ins}</p>
                        </div>
                      </div>

                      <p className="text-stone-600 text-sm leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: oil.description }}></p>
                      
                      {/* 五力進度條 */}
                      <div className="space-y-3 pt-4 border-t border-stone-50">
                        {(Object.keys(QUALITY_UI) as Array<keyof typeof QUALITY_UI>).map((key) => {
                          const ui = QUALITY_UI[key];
                          const val = oil[key];
                          return (
                            <div key={key} className="space-y-1">
                              <div className="flex justify-between items-end">
                                <span className={`flex items-center gap-1 text-[10px] font-black ${sortBy === key ? ui.tailwind.replace('bg-', 'text-') : 'text-stone-400'}`}>
                                  {getQualityIcon(key)} {ui.label} {sortBy === key && '🎯'}
                                </span>
                                <span className={`text-xs font-black ${sortBy === key ? ui.tailwind.replace('bg-', 'text-') : 'text-stone-600'}`}>
                                  {val}
                                </span>
                              </div>
                              <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${sortBy === key ? 'bg-amber-500' : ui.bg} transition-all duration-500`}
                                  style={{ width: `${Math.min(val, 100)}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <button 
                        onClick={() => {
                          setActiveTab(SectionType.CALCULATOR);
                        }}
                        className="mt-6 w-full py-3 bg-stone-50 text-stone-400 text-xs font-black rounded-xl hover:bg-amber-600 hover:text-white transition-all flex items-center justify-center gap-2 uppercase tracking-widest shadow-sm active:scale-95"
                      >
                        加入配方計算 <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === SectionType.PRODUCTION && (
              <div className="bg-amber-50 p-6 md:p-10 rounded-2xl md:rounded-3xl border border-amber-100 animate-fade-in">
                <h2 className="text-2xl md:text-3xl font-black text-stone-800 mb-6 md:mb-8 flex items-center gap-3">
                  <FlaskConical className="text-amber-600 w-6 h-6 md:w-8 md:h-8" /> 製作過程關鍵
                </h2>
                <div className="space-y-8 md:space-y-10">
                  <div className="bg-white p-5 md:p-8 rounded-xl md:rounded-2xl shadow-sm border border-stone-100">
                    <h3 className="text-lg md:text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
                      <ThermometerSun className="text-orange-500" /> 溫度控制 (Temperature)
                    </h3>
                    <p className="text-stone-600 text-sm md:text-base mb-4 leading-relaxed">
                      油溫與鹼液溫度的「溫差」建議在 10℃ 以內。混合最佳區間：
                    </p>
                    <div className="inline-flex items-center justify-center px-6 py-4 bg-orange-50 border-2 border-orange-100 rounded-2xl font-black text-2xl md:text-3xl text-orange-700 shadow-inner">
                      40℃ ~ 45℃
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-stone-800 mb-6">攪拌狀態 (Trace) 判定</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                        <h4 className="font-bold text-amber-700 mb-3 border-b border-amber-50 pb-2">Light Trace (輕T)</h4>
                        <p className="text-xs md:text-sm text-stone-500 leading-relaxed">像玉米濃湯，液體流動但有痕跡。此時適合分鍋、調色。</p>
                      </div>
                      <div className="bg-white p-6 rounded-2xl border-2 border-amber-400 shadow-lg ring-4 ring-amber-100/30">
                        <h4 className="font-bold text-amber-800 mb-3 border-b border-amber-50 pb-2">Trace (推薦入模)</h4>
                        <p className="text-xs md:text-sm text-stone-600 leading-relaxed font-medium">像美乃滋。用刮刀畫「8」字痕跡不會立刻消失。適合加入精油。</p>
                      </div>
                      <div className="bg-stone-100 p-6 rounded-2xl border border-stone-200 opacity-60">
                        <h4 className="font-bold text-stone-400 mb-3 border-b border-stone-50 pb-2">Over Trace (重T)</h4>
                        <p className="text-xs md:text-sm text-stone-400 leading-relaxed">過於濃稠。入模會產生氣泡空隙，成品表面粗糙。</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === SectionType.POST_PRODUCTION && (
              <div className="bg-white p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-sm border border-stone-100 animate-fade-in">
                <h2 className="text-2xl md:text-3xl font-black text-stone-800 mb-6 md:mb-8 flex items-center gap-3">
                  <Box className="text-stone-600 w-6 h-6 md:w-8 md:h-8" /> 脫模與晾皂
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="bg-stone-50 p-6 md:p-8 rounded-2xl border border-stone-100">
                    <h3 className="text-lg md:text-xl font-bold text-stone-800 mb-4">保溫的重要性</h3>
                    <p className="text-stone-600 text-sm md:text-base leading-relaxed">
                      入模後需保溫 24 小時。保溫不足易產生「白粉（皂粉）」；保溫過度則可能產生果凍效應。
                    </p>
                  </div>
                  <div className="bg-stone-900 p-6 md:p-8 rounded-2xl text-white shadow-xl">
                    <h3 className="text-lg md:text-xl font-bold mb-4 text-amber-400">熟成參考表</h3>
                    <ul className="space-y-4">
                      <li className="flex justify-between items-center border-b border-white/10 pb-2">
                        <span className="text-stone-400 font-medium">一般手工皂</span>
                        <span className="font-black text-xl">4 ~ 6 週</span>
                      </li>
                      <li className="flex justify-between items-center border-b border-white/10 pb-2">
                        <span className="text-stone-400 font-medium">純橄欖皂</span>
                        <span className="font-black text-xl">8 週以上</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === SectionType.FAQ && (
              <div className="bg-white p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-sm border border-stone-100 animate-fade-in">
                <h2 className="text-2xl md:text-3xl font-black text-stone-800 mb-8 md:mb-10 flex items-center gap-3">
                  <HelpCircle className="text-amber-600 w-6 h-6 md:w-8 md:h-8" /> 常見問題 (Troubleshooting)
                </h2>
                <div className="grid grid-cols-1 gap-6 md:gap-8">
                  {FAQS.map((faq, i) => (
                    <div key={i} className="group border border-stone-100 rounded-3xl p-6 md:p-8 hover:border-amber-200 hover:shadow-xl transition-all bg-white">
                      <div className="flex items-start gap-4 mb-6">
                        <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-amber-100 text-amber-700 rounded-2xl text-lg font-black shadow-inner">
                          {i + 1}
                        </span>
                        <h3 className="text-xl md:text-2xl font-black text-stone-800 leading-tight">
                          {faq.symptom}
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="bg-stone-50 p-5 rounded-2xl border border-stone-100">
                          <p className="text-[10px] md:text-xs font-black text-stone-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Info className="w-3 h-3" /> 可能原因
                          </p>
                          <p className="text-stone-600 text-sm md:text-base leading-relaxed">{faq.reason}</p>
                        </div>
                        <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100">
                          <p className="text-[10px] md:text-xs font-black text-amber-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3" /> 解決方法
                          </p>
                          <p className="text-amber-900 text-sm md:text-base font-bold leading-relaxed">{faq.solution}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-6 md:space-y-8">
            <div className="bg-stone-900 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity">
                <ShieldCheck className="w-48 h-48" />
              </div>
              <h3 className="text-2xl font-black mb-4 relative z-10 text-amber-400">智能 AI 助手</h3>
              <p className="text-stone-400 text-sm mb-8 relative z-10 leading-relaxed font-medium">
                遇到製作困難？直接詢問 AI 導師獲取專業建議。
              </p>
              <button 
                onClick={() => setShowAssistant(!showAssistant)}
                className="w-full flex items-center justify-between p-4 bg-amber-600 rounded-2xl font-black hover:bg-amber-500 transition-all shadow-lg active:scale-95"
              >
                {showAssistant ? '隱藏助理' : '開啟 AI 導師'}
                <MessageSquareText className="w-5 h-5" />
              </button>
            </div>

            {showAssistant && (
              <div className="animate-fade-in">
                <Assistant />
              </div>
            )}

            <div className="p-8 bg-white border border-stone-100 rounded-3xl shadow-sm">
              <h3 className="font-black text-stone-800 mb-8 flex items-center gap-2 text-lg">
                <Clock className="w-6 h-6 text-amber-600" /> 操作時間軸
              </h3>
              <div className="space-y-10 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[3px] before:bg-stone-50">
                <div className="relative pl-10 group">
                  <div className="absolute left-0 top-1 w-[26px] h-[26px] bg-white border-[6px] border-amber-500 rounded-full z-10 transition-transform group-hover:scale-125" />
                  <p className="text-sm font-black text-stone-800 group-hover:text-amber-700">攪拌 Trace (皂化期)</p>
                  <p className="text-xs text-stone-400 mt-1 font-medium">約 20 ~ 60 分鐘</p>
                </div>
                <div className="relative pl-10 group">
                  <div className="absolute left-0 top-1 w-[26px] h-[26px] bg-white border-[6px] border-stone-100 rounded-full z-10 transition-transform group-hover:scale-125" />
                  <p className="text-sm font-black text-stone-800">入模保溫</p>
                  <p className="text-xs text-stone-400 mt-1 font-medium">24 小時不可移動</p>
                </div>
                <div className="relative pl-10 group">
                  <div className="absolute left-0 top-1 w-[26px] h-[26px] bg-white border-[6px] border-stone-100 rounded-full z-10 transition-transform group-hover:scale-125" />
                  <p className="text-sm font-black text-stone-800">熟成晾皂</p>
                  <p className="text-xs text-stone-400 mt-1 font-medium">4 ~ 8 週 (視氣候)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto border-t border-stone-100 py-12 px-6 text-center mt-12 opacity-60">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 grayscale">
            <Droplets className="w-6 h-6" />
            <span className="font-black text-sm tracking-widest uppercase">手工皂製作大師</span>
          </div>
          <p className="text-stone-400 text-xs italic max-w-md mx-auto leading-relaxed">
            本站僅供教學與輔助計算參考。進行化學反應時，請務必佩戴防護裝備。
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
