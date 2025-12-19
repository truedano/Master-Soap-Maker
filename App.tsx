
import React, { useState, useEffect } from 'react';
import { SafetyAlert } from './components/SafetyAlert';
import { Calculator } from './components/Calculator';
import { FAQS, OILS } from './constants';
import { SectionType } from './types';
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
  BookOpen
} from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SectionType>(SectionType.CALCULATOR);

  // 切換分頁時自動捲動到內容區域上方
  useEffect(() => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      window.scrollTo({ top: mainContent.offsetTop - 80, behavior: 'smooth' });
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen pb-12 bg-[#fcfaf7]">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between py-3 md:py-4 gap-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="bg-amber-100 p-1.5 md:p-2 rounded-lg md:rounded-xl">
                <Droplets className="w-6 h-6 md:w-8 md:h-8 text-amber-700" />
              </div>
              <h1 className="text-lg md:text-2xl font-black text-stone-800 tracking-tight">
                手工皂<span className="text-amber-600">製作大師</span>
              </h1>
            </div>
            
            {/* 響應式導航 */}
            <nav className="flex w-full md:w-auto overflow-x-auto no-scrollbar pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
              <div className="flex flex-nowrap md:flex-wrap items-center gap-2 md:gap-4">
                {[
                  { id: SectionType.CALCULATOR, label: '配方計算' },
                  { id: SectionType.PRE_PRODUCTION, label: '新手必讀' },
                  { id: SectionType.PRODUCTION, label: '製作關鍵' },
                  { id: SectionType.POST_PRODUCTION, label: '脫模晾皂' },
                  { id: SectionType.FAQ, label: '問題排除' },
                ].map((tab) => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap text-xs md:text-sm font-bold tracking-widest transition-all px-3 py-2 rounded-full border ${
                      activeTab === tab.id 
                      ? 'text-amber-700 bg-amber-50 border-amber-200' 
                      : 'text-stone-400 bg-transparent border-transparent hover:text-stone-600'
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
            
            {activeTab === SectionType.CALCULATOR && <Calculator />}

            {activeTab === SectionType.PRE_PRODUCTION && (
              <div className="space-y-8 animate-fade-in">
                {/* 基礎概念卡片 */}
                <div className="bg-white p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-sm border border-stone-100">
                  <h2 className="text-2xl md:text-3xl font-black text-stone-800 mb-6 md:mb-8 flex items-center gap-3">
                    <Settings className="text-amber-600 w-6 h-6 md:w-8 md:h-8" /> 配方與準備
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 text-stone-600 leading-relaxed">
                    <div className="space-y-6">
                      <section>
                        <h3 className="text-lg md:text-xl font-bold text-stone-800 border-b-2 border-amber-100 pb-2 mb-3">精準測量</h3>
                        <p className="text-sm md:text-base">油、水、鹼的重量必須精確。建議電子秤精確到 0.1g，配方偏差可能導致燒手或成品酸敗。</p>
                      </section>
                      <section>
                        <h3 className="text-lg md:text-xl font-bold text-stone-800 border-b-2 border-amber-100 pb-2 mb-3">INS 值指標</h3>
                        <p className="text-sm md:text-base">建議總 INS 值落在 120~170。過低肥皂會太軟、難脫模；過高則容易脆裂。</p>
                      </section>
                    </div>
                    <div className="bg-stone-50 p-6 rounded-2xl">
                      <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-amber-500" /> 經典 321 配方</h3>
                      <p className="text-sm md:text-base mb-4">最適合新手的成功保證：</p>
                      <ul className="space-y-2">
                        <li className="flex justify-between items-center text-sm font-medium p-2 bg-white rounded-lg border border-stone-100">
                          <span>橄欖油</span><span className="font-black text-amber-700">50%</span>
                        </li>
                        <li className="flex justify-between items-center text-sm font-medium p-2 bg-white rounded-lg border border-stone-100">
                          <span>椰子油</span><span className="font-black text-amber-700">30%</span>
                        </li>
                        <li className="flex justify-between items-center text-sm font-medium p-2 bg-white rounded-lg border border-stone-100">
                          <span>棕櫚油</span><span className="font-black text-amber-700">20%</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 油脂功效百科 */}
                <div className="bg-amber-900 p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-xl">
                  <h2 className="text-2xl md:text-3xl font-black text-white mb-8 flex items-center gap-3">
                    <BookOpen className="text-amber-400 w-6 h-6 md:w-8 md:h-8" /> 常用油脂功效百科
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    {OILS.map((oil) => (
                      <div key={oil.id} className="bg-white/10 backdrop-blur-sm border border-white/20 p-5 rounded-2xl hover:bg-white/15 transition-all group">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-black text-amber-300 text-lg">{oil.name}</h4>
                          <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-white/50 font-bold uppercase tracking-widest">INS: {oil.ins}</span>
                        </div>
                        <p className="text-white/80 text-sm leading-relaxed mb-4 group-hover:text-white transition-colors">
                          {oil.description}
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          <span className="text-[10px] font-bold py-0.5 px-2 bg-amber-500/20 text-amber-200 rounded-full">清潔 {oil.cleansing}</span>
                          <span className="text-[10px] font-bold py-0.5 px-2 bg-blue-500/20 text-blue-200 rounded-full">保濕 {oil.conditioning}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 製作關鍵 (Production) */}
            {activeTab === SectionType.PRODUCTION && (
              <div className="bg-amber-50 p-6 md:p-10 rounded-2xl md:rounded-3xl border border-amber-100 animate-fade-in">
                <h2 className="text-2xl md:text-3xl font-black text-stone-800 mb-6 md:mb-8 flex items-center gap-3">
                  <FlaskConical className="text-amber-600 w-6 h-6 md:w-8 md:h-8" /> 製作過程關鍵
                </h2>
                <div className="space-y-8 md:space-y-10">
                  <div className="bg-white p-5 md:p-8 rounded-xl md:rounded-2xl shadow-sm">
                    <h3 className="text-lg md:text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
                      <ThermometerSun className="text-orange-500" /> 溫度控制
                    </h3>
                    <p className="text-stone-600 text-sm md:text-base mb-4">油溫與鹼液溫度的「溫差」建議在 10℃ 以內。混合最佳區間：</p>
                    <div className="inline-flex items-center justify-center px-6 py-3 bg-orange-50 border-2 border-orange-100 rounded-xl font-black text-xl md:text-2xl text-orange-700">
                      40℃ ~ 45℃
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-stone-800 mb-4">攪拌狀態 (Trace) 判定</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
                        <h4 className="font-bold text-amber-700 mb-2 border-b border-amber-50 pb-2">Light Trace</h4>
                        <p className="text-xs md:text-sm text-stone-600">流動性好。適合添加天然色粉或分鍋。</p>
                      </div>
                      <div className="bg-white p-5 rounded-xl border-2 border-amber-400 shadow-md ring-4 ring-amber-100/50">
                        <h4 className="font-bold text-amber-800 mb-2 border-b border-amber-50 pb-2">Trace (推薦)</h4>
                        <p className="text-xs md:text-sm text-stone-600">像美乃滋。畫「8」字不消失即可入模。</p>
                      </div>
                      <div className="bg-white p-5 rounded-xl border border-red-100 shadow-sm opacity-80">
                        <h4 className="font-bold text-red-700 mb-2 border-b border-red-50 pb-2">Over Trace</h4>
                        <p className="text-xs md:text-sm text-stone-600">過於濃稠。入模易有氣泡，成品表面粗糙。</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 脫模與晾皂 (Post-production) */}
            {activeTab === SectionType.POST_PRODUCTION && (
              <div className="bg-stone-50 p-6 md:p-10 rounded-2xl md:rounded-3xl border border-stone-200 animate-fade-in">
                <h2 className="text-2xl md:text-3xl font-black text-stone-800 mb-6 md:mb-8 flex items-center gap-3">
                  <Box className="text-stone-600 w-6 h-6 md:w-8 md:h-8" /> 脫模與晾皂
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="bg-white p-5 md:p-8 rounded-xl md:rounded-2xl shadow-sm border border-stone-100">
                    <h3 className="text-lg md:text-xl font-bold text-stone-800 mb-4">保溫的重要性</h3>
                    <p className="text-stone-600 text-sm md:text-base mb-4 leading-relaxed">
                      入模後需保溫 24 小時。保溫不足易產生「白粉（皂粉）」；過度則中心可能顏色較深。
                    </p>
                    <div className="p-4 bg-blue-50 text-blue-800 text-xs md:text-sm rounded-xl flex items-start gap-3">
                      <Info className="w-5 h-5 flex-shrink-0 text-blue-400" />
                      果凍效應指中心透明化，不影響使用。
                    </div>
                  </div>
                  <div className="bg-white p-5 md:p-8 rounded-xl md:rounded-2xl shadow-sm border border-stone-100">
                    <h3 className="text-lg md:text-xl font-bold text-stone-800 mb-4">熟成參考表</h3>
                    <ul className="space-y-4">
                      <li className="flex justify-between items-center border-b border-stone-50 pb-2">
                        <span className="text-stone-500 text-sm md:text-base">一般手工皂</span>
                        <span className="font-bold text-stone-800 bg-stone-100 px-3 py-1 rounded-full text-xs md:text-sm">4 ~ 6 週</span>
                      </li>
                      <li className="flex justify-between items-center border-b border-stone-50 pb-2">
                        <span className="text-stone-500 text-sm md:text-base">純橄欖皂</span>
                        <span className="font-bold text-stone-800 bg-stone-100 px-3 py-1 rounded-full text-xs md:text-sm">8 週以上</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* 問題排除 (FAQ) */}
            {activeTab === SectionType.FAQ && (
              <div className="bg-white p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-sm border border-stone-100 animate-fade-in">
                <h2 className="text-2xl md:text-3xl font-black text-stone-800 mb-8 md:mb-10 flex items-center gap-3">
                  <HelpCircle className="text-amber-600 w-6 h-6 md:w-8 md:h-8" /> 常見問題
                </h2>
                <div className="grid grid-cols-1 gap-6 md:gap-8">
                  {FAQS.map((faq, i) => (
                    <div key={i} className="group border border-stone-100 rounded-xl md:rounded-2xl p-6 md:p-8 hover:border-amber-200 hover:shadow-lg transition-all">
                      <h3 className="text-lg md:text-xl font-bold text-stone-800 mb-6 flex items-start gap-3">
                        <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 bg-amber-100 text-amber-700 rounded-lg text-xs font-black">
                          {i + 1}
                        </span>
                        {faq.symptom}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="bg-stone-50 p-4 md:p-5 rounded-xl">
                          <p className="text-[10px] md:text-xs font-black text-stone-400 uppercase tracking-widest mb-2">原因分析</p>
                          <p className="text-stone-600 text-sm leading-relaxed">{faq.reason}</p>
                        </div>
                        <div className="bg-amber-50 p-4 md:p-5 rounded-xl">
                          <p className="text-[10px] md:text-xs font-black text-amber-500 uppercase tracking-widest mb-2">解決方案</p>
                          <p className="text-amber-900 text-sm font-bold leading-relaxed">{faq.solution}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-6 md:space-y-8">
            <div className="bg-stone-900 p-6 md:p-8 rounded-2xl md:rounded-3xl text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <ShieldCheck className="w-24 h-24 md:w-32 md:h-32" />
              </div>
              <h3 className="text-xl font-bold mb-4 relative z-10">配方建議</h3>
              <p className="text-stone-400 text-sm mb-8 relative z-10 leading-relaxed">
                初學者建議從「321 配方」開始，椰子油、棕櫚油與橄欖油的完美比例。
              </p>
              <button 
                onClick={() => setActiveTab(SectionType.CALCULATOR)}
                className="w-full flex items-center justify-between p-4 bg-amber-600 rounded-xl font-bold hover:bg-amber-500 transition-all"
              >
                開始計算
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 bg-white border border-stone-100 rounded-2xl md:rounded-3xl shadow-sm">
              <h3 className="font-bold text-stone-800 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-stone-400" /> 操作時間軸
              </h3>
              <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-stone-100">
                <div className="relative pl-8">
                  <div className="absolute left-0 top-1 w-[24px] h-[24px] bg-white border-4 border-amber-500 rounded-full z-10" />
                  <p className="text-sm font-bold text-stone-800">攪拌 Trace</p>
                  <p className="text-xs text-stone-500 mt-1">約 20~60 分鐘</p>
                </div>
                <div className="relative pl-8">
                  <div className="absolute left-0 top-1 w-[24px] h-[24px] bg-white border-4 border-stone-200 rounded-full z-10" />
                  <p className="text-sm font-bold text-stone-800">入模保溫</p>
                  <p className="text-xs text-stone-500 mt-1">24 小時不可震動</p>
                </div>
                <div className="relative pl-8">
                  <div className="absolute left-0 top-1 w-[24px] h-[24px] bg-white border-4 border-stone-200 rounded-full z-10" />
                  <p className="text-sm font-bold text-stone-800">脫模切皂</p>
                  <p className="text-xs text-stone-500 mt-1">1~3 天依硬度而定</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto border-t border-stone-100 py-10 md:py-16 px-6 text-center mt-12">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 opacity-30 grayscale">
            <Droplets className="w-6 h-6" />
            <span className="font-bold text-sm">手工皂製作大師</span>
          </div>
          <p className="text-stone-400 text-[10px] md:text-xs italic max-w-md mx-auto leading-relaxed">
            本站僅供教學與輔助計算參考。進行化學反應時，請務必遵循安全規範並配戴防護裝備。
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
