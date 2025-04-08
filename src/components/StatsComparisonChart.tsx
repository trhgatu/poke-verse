import React from 'react';
import { Pokemon } from '../types/pokemon';
import { useLanguage } from '../contexts/LanguageContext';

interface StatsComparisonChartProps {
  pokemon1: Pokemon | null;
  pokemon2: Pokemon | null;
}

export const StatsComparisonChart: React.FC<StatsComparisonChartProps> = ({ pokemon1, pokemon2 }) => {
  const { t } = useLanguage();

  if (!pokemon1 && !pokemon2) {
    return (
      <div className="h-[400px] bg-zinc-800/40 rounded-xl border border-zinc-700 flex items-center justify-center text-zinc-400 italic">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-lg">{t('compare.selectAtLeastOne')}</p>
        </div>
      </div>
    );
  }

  // Map stat names to translation keys
  const statNamesMap: Record<string, string> = {
    'hp': 'compare.stats.hp',
    'attack': 'compare.stats.attack',
    'defense': 'compare.stats.defense',
    'special-attack': 'compare.stats.specialAttack',
    'special-defense': 'compare.stats.specialDefense',
    'speed': 'compare.stats.speed'
  };

  // Get max stat value to normalize chart (assuming max base stat is 255)
  const maxStatValue = 255;

  // Generate an array of all stat names from both Pokemon
  const statNames = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];

  // Helper function to get stat value
  const getStatValue = (pokemon: Pokemon | null, statName: string): number => {
    if (!pokemon) return 0;
    const stat = pokemon.stats.find(s => s.stat.name === statName);
    return stat ? stat.base_stat : 0;
  };

  // Helper function to get stat color
  const getColorClass = (_index: number, isPokemon1: boolean): string => {
    if (isPokemon1) {
      return 'bg-gradient-to-r from-red-500 to-red-600';
    } else {
      return 'bg-gradient-to-r from-blue-500 to-blue-600';
    }
  };

  // Helper function to calculate width percentage
  const calculateWidth = (value: number): string => {
    const percentage = (value / maxStatValue) * 100;
    return `${Math.min(percentage, 100)}%`;
  };

  // Function to determine which Pokémon has the higher stat
  const getHigherStat = (statName: string): 'pokemon1' | 'pokemon2' | 'equal' => {
    const value1 = getStatValue(pokemon1, statName);
    const value2 = getStatValue(pokemon2, statName);

    if (!pokemon1 || !pokemon2) return 'equal';
    if (value1 > value2) return 'pokemon1';
    if (value2 > value1) return 'pokemon2';
    return 'equal';
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between mb-6">
        <div className="flex items-center">
          {pokemon1 && (
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 mr-2 ring-2 ring-red-500/30"></div>
              <span className="font-semibold capitalize text-zinc-200">{pokemon1.name.replace('-', ' ')}</span>
            </div>
          )}
        </div>
        <div className="flex items-center">
          {pokemon2 && (
            <div className="flex items-center">
              <span className="font-semibold capitalize text-zinc-200">{pokemon2.name.replace('-', ' ')}</span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 ml-2 ring-2 ring-blue-500/30"></div>
            </div>
          )}
        </div>
      </div>

      {statNames.map((statName, index) => {
        const higherStat = getHigherStat(statName);

        return (
          <div key={statName} className="mb-6">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-zinc-300">{t(statNamesMap[statName])}</span>
              <div className="space-x-6">
                {pokemon1 && (
                  <span className={`text-sm font-medium ${higherStat === 'pokemon1' ? 'text-red-400 font-bold' : 'text-zinc-400'}`}>
                    {getStatValue(pokemon1, statName)}
                  </span>
                )}
                {pokemon2 && (
                  <span className={`text-sm font-medium ${higherStat === 'pokemon2' ? 'text-blue-400 font-bold' : 'text-zinc-400'}`}>
                    {getStatValue(pokemon2, statName)}
                  </span>
                )}
              </div>
            </div>
            <div className="w-full bg-zinc-800/80 rounded-full h-5 relative overflow-hidden border border-zinc-700">
              {/* Background glow effects */}
              <div className="absolute inset-0 w-full h-full opacity-10">
                <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-red-500/20 to-transparent"></div>
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/20 to-transparent"></div>
              </div>

              {/* Chart bars */}
              <div className="flex h-full w-full absolute">
                {/* Pokemon 1 stats */}
                {pokemon1 && (
                  <div
                    className={`h-full ${getColorClass(index, true)} rounded-l-full relative group transition-all duration-500 backdrop-blur-sm shadow-lg`}
                    style={{ width: calculateWidth(getStatValue(pokemon1, statName)) }}
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity rounded-l-full"></div>
                  </div>
                )}
              </div>
              <div className="flex h-full w-full justify-end absolute">
                {/* Pokemon 2 stats */}
                {pokemon2 && (
                  <div
                    className={`h-full ${getColorClass(index, false)} rounded-r-full relative group transition-all duration-500 backdrop-blur-sm shadow-lg`}
                    style={{ width: calculateWidth(getStatValue(pokemon2, statName)) }}
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity rounded-r-full"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Total stats comparison */}
      <div className="mt-10 pt-6 border-t border-zinc-700/50 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            {t('compare.stats.total')}:
          </h3>
          <div className="space-x-8">
            {pokemon1 && (
              <span className="font-bold text-lg text-red-400">
                {pokemon1.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
              </span>
            )}
            {pokemon2 && (
              <span className="font-bold text-lg text-blue-400">
                {pokemon2.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
              </span>
            )}
          </div>
        </div>

        {/* Total stat bar */}
        {pokemon1 && pokemon2 && (
          <div className="w-full bg-zinc-800/80 rounded-full h-6 relative overflow-hidden border border-zinc-700 mt-2">
            <div className="absolute inset-0 w-full h-full opacity-10">
              <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-purple-500/20 to-transparent"></div>
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-pink-500/20 to-transparent"></div>
            </div>

            <div className="relative h-full w-full flex">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-l-full"
                style={{
                  width: `${(pokemon1.stats.reduce((sum, stat) => sum + stat.base_stat, 0) /
                    (pokemon1.stats.reduce((sum, stat) => sum + stat.base_stat, 0) +
                    pokemon2.stats.reduce((sum, stat) => sum + stat.base_stat, 0))) * 100}%`
                }}
              ></div>
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-r-full"
                style={{
                  width: `${(pokemon2.stats.reduce((sum, stat) => sum + stat.base_stat, 0) /
                    (pokemon1.stats.reduce((sum, stat) => sum + stat.base_stat, 0) +
                    pokemon2.stats.reduce((sum, stat) => sum + stat.base_stat, 0))) * 100}%`
                }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Comparison table for other attributes */}
      {(pokemon1 || pokemon2) && (
        <div className="mt-10 pt-6 border-t border-zinc-700/50">
          <h3 className="font-bold text-xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">
            {t('compare.otherInfo')}
          </h3>
          <div className="overflow-hidden rounded-xl border border-zinc-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-800/80">
                  <th className="text-left py-3 px-4 text-zinc-400 font-medium">{t('compare.attributes.type')}</th>
                  {pokemon1 && <th className="py-3 px-4 text-center text-red-400 font-medium">Pokémon 1</th>}
                  {pokemon2 && <th className="py-3 px-4 text-center text-blue-400 font-medium">Pokémon 2</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-700/50">
                <tr className="bg-zinc-800/40 hover:bg-zinc-800/60 transition-colors">
                  <td className="py-3 px-4 text-zinc-300">{t('compare.attributes.type')}</td>
                  {pokemon1 && (
                    <td className="py-3 px-4 text-center capitalize text-zinc-300">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {pokemon1.types.map(t => (
                          <span key={t.type.name} className="px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-100 border border-red-500/30">
                            {t.type.name}
                          </span>
                        ))}
                      </div>
                    </td>
                  )}
                  {pokemon2 && (
                    <td className="py-3 px-4 text-center capitalize text-zinc-300">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {pokemon2.types.map(t => (
                          <span key={t.type.name} className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-100 border border-blue-500/30">
                            {t.type.name}
                          </span>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
                <tr className="bg-zinc-800/20 hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3 px-4 text-zinc-300">{t('compare.attributes.height')}</td>
                  {pokemon1 && <td className="py-3 px-4 text-center text-zinc-300">{pokemon1.height / 10} m</td>}
                  {pokemon2 && <td className="py-3 px-4 text-center text-zinc-300">{pokemon2.height / 10} m</td>}
                </tr>
                <tr className="bg-zinc-800/40 hover:bg-zinc-800/60 transition-colors">
                  <td className="py-3 px-4 text-zinc-300">{t('compare.attributes.weight')}</td>
                  {pokemon1 && <td className="py-3 px-4 text-center text-zinc-300">{pokemon1.weight / 10} kg</td>}
                  {pokemon2 && <td className="py-3 px-4 text-center text-zinc-300">{pokemon2.weight / 10} kg</td>}
                </tr>
                <tr className="bg-zinc-800/20 hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3 px-4 text-zinc-300">{t('compare.attributes.abilities')}</td>
                  {pokemon1 && (
                    <td className="py-3 px-4 text-center capitalize text-zinc-300">
                      <div className="flex flex-col gap-1 items-center">
                        {pokemon1.abilities.map(a => (
                          <span key={a.ability.name} className={`text-sm ${a.is_hidden ? 'text-red-400 italic' : ''}`}>
                            {a.ability.name.replace('-', ' ')}
                            {a.is_hidden && <span className="text-xs ml-1">({t('pokemon.hiddenAbility')})</span>}
                          </span>
                        ))}
                      </div>
                    </td>
                  )}
                  {pokemon2 && (
                    <td className="py-3 px-4 text-center capitalize text-zinc-300">
                      <div className="flex flex-col gap-1 items-center">
                        {pokemon2.abilities.map(a => (
                          <span key={a.ability.name} className={`text-sm ${a.is_hidden ? 'text-blue-400 italic' : ''}`}>
                            {a.ability.name.replace('-', ' ')}
                            {a.is_hidden && <span className="text-xs ml-1">({t('pokemon.hiddenAbility')})</span>}
                          </span>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};