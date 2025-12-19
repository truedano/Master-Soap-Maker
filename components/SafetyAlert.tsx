
import React from 'react';
import { AlertTriangle, ShieldAlert, Droplets, Wind, HardHat } from 'lucide-react';

export const SafetyAlert: React.FC = () => {
  return (
    <section className="bg-red-50 border-l-4 md:border-l-8 border-red-500 p-6 md:p-8 rounded-xl md:rounded-r-2xl shadow-lg mb-8 md:mb-12 animate-fade-in">
      <div className="flex items-center gap-3 md:gap-4 mb-6">
        <div className="bg-red-500 p-2 rounded-lg text-white animate-pulse">
          <AlertTriangle className="w-6 h-6 md:w-8 md:h-8" />
        </div>
        <h2 className="text-xl md:text-3xl font-black text-red-700 tracking-tight">安全第一：NaOH 使用守則</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 bg-red-100 p-2.5 rounded-xl h-10 w-10 md:h-12 md:w-12 flex items-center justify-center">
              <Droplets className="text-red-600 w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h3 className="font-bold text-red-800 text-base md:text-lg">順序至關重要！</h3>
              <p className="text-red-700/80 text-xs md:text-sm leading-relaxed">
                務必將 <span className="underline font-black text-red-800">氫氧化鈉倒入水中</span>。絕對不可將水倒入強鹼，以免噴濺沸騰造成灼傷。
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 bg-red-100 p-2.5 rounded-xl h-10 w-10 md:h-12 md:w-12 flex items-center justify-center">
              <Wind className="text-red-600 w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h3 className="font-bold text-red-800 text-base md:text-lg">確保良好通風</h3>
              <p className="text-red-700/80 text-xs md:text-sm leading-relaxed">
                溶鹼會產生刺鼻鹼氣。請在抽油煙機下或戶外操作，並避免直接吸入煙霧。
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 bg-red-100 p-2.5 rounded-xl h-10 w-10 md:h-12 md:w-12 flex items-center justify-center">
              <HardHat className="text-red-600 w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h3 className="font-bold text-red-800 text-base md:text-lg">完善防護裝備</h3>
              <p className="text-red-700/80 text-xs md:text-sm leading-relaxed">
                全程佩戴護目鏡與橡膠手套。若不慎噴濺，請立即用大量清水沖洗。
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 bg-red-100 p-2.5 rounded-xl h-10 w-10 md:h-12 md:w-12 flex items-center justify-center">
              <ShieldAlert className="text-red-600 w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h3 className="font-bold text-red-800 text-base md:text-lg">器具材質禁忌</h3>
              <p className="text-red-700/80 text-xs md:text-sm leading-relaxed">
                <span className="font-black text-red-800">禁用鋁製品</span>。推薦使用 304 不鏽鋼或耐熱 PP5 / 玻璃材質。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
