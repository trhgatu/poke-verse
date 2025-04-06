import React, { ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SearchFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  resultsCount?: number;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  value,
  onChange,
  placeholder,
  resultsCount
}) => {
  const { t } = useLanguage();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl overflow-hidden shadow-xl border border-zinc-700/50 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="p-5 relative">
        <h3 className="text-lg font-bold text-white mb-3 flex items-center">
          <Search className="mr-2 text-pink-400" size={18} />
          {t('home.search.button')}
        </h3>

        <div className="relative">
          {/* Background decoration */}
          <div className="absolute -right-4 -top-4 w-36 h-36 bg-pokeball opacity-5 bg-contain bg-no-repeat bg-center pointer-events-none"></div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-zinc-400" />
              </div>
              <motion.input
                type="text"
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className="bg-zinc-900/80 border border-zinc-700 rounded-lg w-full py-3 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/30 transition-all shadow-sm"
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              />
              {value && (
                <motion.button
                  onClick={handleClear}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <span className="text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-full w-5 h-5 flex items-center justify-center transition-colors">
                    ×
                  </span>
                </motion.button>
              )}
            </div>
          </div>

          {/* Results count indicator */}
          {value && typeof resultsCount === 'number' && (
            <motion.div
              className="mt-3 text-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-zinc-400">
                {resultsCount > 0 ? (
                  <>
                    <span className="font-medium text-white">{resultsCount}</span> Pokémon {t('home.search.found')}
                  </>
                ) : (
                  t('home.search.noResults')
                )}
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};