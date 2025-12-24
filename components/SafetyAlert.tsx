import React from 'react';
import { AlertTriangle, ShieldAlert, Droplets, Wind, HardHat } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const SafetyAlert: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-red-50 border-l-4 md:border-l-8 border-red-500 p-6 md:p-8 rounded-xl md:rounded-r-2xl shadow-lg mb-8 md:mb-12 animate-fade-in">
      <div className="flex items-center gap-3 md:gap-4 mb-6">
        <div className="bg-red-500 p-2 rounded-lg text-white animate-pulse">
          <AlertTriangle className="w-6 h-6 md:w-8 md:h-8" />
        </div>
        <h2 className="text-xl md:text-3xl font-black text-red-700 tracking-tight">{t('safety_alert.title')}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 bg-red-100 p-2.5 rounded-xl h-10 w-10 md:h-12 md:w-12 flex items-center justify-center">
              <Droplets className="text-red-600 w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h3 className="font-bold text-red-800 text-base md:text-lg">{t('safety_alert.order_title')}</h3>
              <p className="text-red-700/80 text-xs md:text-sm leading-relaxed">
                {t('safety_alert.order_desc')}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 bg-red-100 p-2.5 rounded-xl h-10 w-10 md:h-12 md:w-12 flex items-center justify-center">
              <Wind className="text-red-600 w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h3 className="font-bold text-red-800 text-base md:text-lg">{t('safety_alert.ventilation_title')}</h3>
              <p className="text-red-700/80 text-xs md:text-sm leading-relaxed">
                {t('safety_alert.ventilation_desc')}
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
              <h3 className="font-bold text-red-800 text-base md:text-lg">{t('safety_alert.protection_title')}</h3>
              <p className="text-red-700/80 text-xs md:text-sm leading-relaxed">
                {t('safety_alert.protection_desc')}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 bg-red-100 p-2.5 rounded-xl h-10 w-10 md:h-12 md:w-12 flex items-center justify-center">
              <ShieldAlert className="text-red-600 w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h3 className="font-bold text-red-800 text-base md:text-lg">{t('safety_alert.material_title')}</h3>
              <p className="text-red-700/80 text-xs md:text-sm leading-relaxed">
                {t('safety_alert.material_desc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
