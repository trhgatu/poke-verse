import React from 'react';
import { cn, getColorByType } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

const pokemonTypes = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic',
  'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

interface TypeFilterProps {
  selectedType: string | null;
  onChange: (type: string | null) => void;
  disabled?: boolean;
}

export const TypeFilter: React.FC<TypeFilterProps> = ({
  selectedType,
  onChange,
  disabled = false
}) => {
  const { t } = useLanguage();

  return (
    <div className="w-full">
      <h3 className="text-white font-medium mb-3">Filter by Type</h3>
      <div className="flex flex-wrap gap-2">
        {/* All types option */}
        <button
          onClick={() => onChange(null)}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
            !selectedType
              ? "bg-zinc-100 text-zinc-900 ring-2 ring-offset-2 ring-offset-zinc-900 ring-white"
              : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          disabled={disabled}
        >
          {t('home.filter.all')}
        </button>

        {/* Individual type buttons */}
        {pokemonTypes.map(type => (
          <button
            key={type}
            onClick={() => onChange(type)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium text-white capitalize transition-all",
              selectedType === type
                ? `${getColorByType(type)} ring-2 ring-white ring-offset-2 ring-offset-zinc-900`
                : `bg-zinc-700 hover:bg-zinc-600 hover:text-white`,
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};