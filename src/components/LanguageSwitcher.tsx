import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../i18n/translations';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-1 p-2 rounded-md hover:bg-zinc-800 transition-colors"
        aria-label={t('language.switch')}
        title={t('language.switch')}
      >
        <Globe size={20} className="text-white" />
        <span className="hidden md:inline-block text-white text-sm">{language.toUpperCase()}</span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-40 bg-zinc-800 rounded-md shadow-lg py-1 z-50 border border-zinc-700"
          onBlur={() => setIsOpen(false)}
        >
          <button
            className={`w-full text-left px-4 py-2 text-sm ${language === 'en' ? 'bg-zinc-700 text-white' : 'text-zinc-300 hover:bg-zinc-700'}`}
            onClick={() => changeLanguage('en')}
          >
            🇺🇸 {t('language.en')}
          </button>
          <button
            className={`w-full text-left px-4 py-2 text-sm ${language === 'vi' ? 'bg-zinc-700 text-white' : 'text-zinc-300 hover:bg-zinc-700'}`}
            onClick={() => changeLanguage('vi')}
          >
            🇻🇳 {t('language.vi')}
          </button>
        </div>
      )}
    </div>
  );
};