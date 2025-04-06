import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, translations } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Lấy ngôn ngữ từ localStorage hoặc sử dụng tiếng Anh làm mặc định
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage === 'vi' || savedLanguage === 'en')
      ? savedLanguage
      : 'en';
  });

  // Lưu ngôn ngữ vào localStorage khi ngôn ngữ thay đổi
  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  // Hàm dịch
  const t = (key: string, params?: Record<string, string | number>): string => {
    // Lấy bản dịch
    const translation = translations[key]?.[language] || key;

    // Thay thế các tham số nếu có
    if (params) {
      return Object.entries(params).reduce((result, [param, value]) => {
        return result.replace(`\${${param}}`, String(value));
      }, translation);
    }

    return translation;
  };

  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook để sử dụng ngôn ngữ
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};