import React from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { Button } from './ui/button';
import { getColorByType, capitalizeFirstLetter } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

interface TypeFilterProps {
  selectedType: string | null;
  onChange: (type: string | null) => void;
  disabled?: boolean;
}

const pokemonTypes = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic',
  'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

export const TypeFilter: React.FC<TypeFilterProps> = ({ selectedType, onChange, disabled = false }) => {
  const { t } = useLanguage();

  const handleTypeClick = (type: string) => {
    if (disabled) return;
    onChange(selectedType === type ? null : type);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl overflow-hidden shadow-xl border border-zinc-700/50 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="p-5 pb-4 relative">
        <h3 className="text-lg font-bold text-white mb-3 flex items-center">
          <Filter className="mr-2 text-teal-400" size={18} />
          {t('home.filter.all')}
        </h3>

        {/* Background decoration */}
        <div className="absolute -right-4 -top-4 w-36 h-36 bg-pokeball opacity-5 bg-contain bg-no-repeat bg-center pointer-events-none"></div>

        {/* All types button */}
        <div className="mb-2">
          <motion.button
            onClick={() => onChange(null)}
            disabled={disabled}
            className={`w-full py-2.5 rounded-lg text-center transition-colors mb-2 ${
              selectedType === null
                ? 'bg-gradient-to-r from-zinc-600 to-zinc-700 text-white shadow-md font-medium'
                : 'bg-zinc-800/60 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
          >
            {t('home.filter.all')}
          </motion.button>
        </div>

        {/* Type grid */}
        <motion.div
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-6 gap-2"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {pokemonTypes.map((type) => (
            <motion.div
              key={type}
              className="relative"
              variants={item}
              whileHover={!disabled ? { y: -2, scale: 1.03 } : {}}
              whileTap={!disabled ? { scale: 0.97 } : {}}
            >
              <button
                className={`w-full py-1.5 px-2 rounded-lg text-center text-xs font-bold cursor-pointer transition-all ${getColorByType(type)} ${
                  selectedType === type
                    ? 'ring-2 ring-white/30 shadow-lg scale-105'
                    : 'opacity-70 hover:opacity-100'
                } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                onClick={() => handleTypeClick(type)}
                disabled={disabled}
              >
                {capitalizeFirstLetter(type)}
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* Clear filter button */}
        {selectedType && !disabled && (
          <motion.div
            className="mt-3 text-center"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              variant="ghost"
              onClick={() => onChange(null)}
              className="text-xs text-zinc-400 hover:text-white"
            >
              {t('home.clearFilters')}
            </Button>
          </motion.div>
        )}

        {/* Disabled message */}
        {disabled && (
          <motion.div
            className="mt-3 text-xs text-center text-zinc-500 bg-zinc-800/60 py-2 px-3 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {t('home.search.filterDisabled')}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};