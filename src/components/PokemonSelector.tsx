import React, { useState, useEffect } from 'react';
import { getPokemonList, getPokemonByName } from '../services/api';
import { Pokemon } from '../types/pokemon';
import { useLanguage } from '../contexts/LanguageContext';

interface PokemonSelectorProps {
  onSelectPokemon: (pokemon: Pokemon) => void;
  label: string;
}

export const PokemonSelector: React.FC<PokemonSelectorProps> = ({ onSelectPokemon, label }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [pokemonOptions, setPokemonOptions] = useState<{ name: string; url: string }[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<{ name: string; url: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        setIsLoading(true);
        const response = await getPokemonList(151);
        setPokemonOptions(response.results);
        setFilteredOptions(response.results);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching Pokemon list:', error);
        setIsLoading(false);
      }
    };

    fetchPokemonList();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredOptions(pokemonOptions);
    } else {
      const filtered = pokemonOptions.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [searchTerm, pokemonOptions]);

  const handleSelectPokemon = async (name: string) => {
    try {
      setIsLoading(true);
      const pokemon = await getPokemonByName(name);
      onSelectPokemon(pokemon);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching Pokemon details:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 text-zinc-200">{label}</h2>
      <div className="mb-4 relative">
        <div className="relative">
          <input
            type="text"
            placeholder={t('compare.searchPlaceholder')}
            className="w-full px-4 py-3 pl-10 bg-zinc-900/80 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-zinc-500 text-zinc-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="h-64 overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-900/50 backdrop-blur-sm scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-800/50">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mb-2"></div>
              <p className="text-zinc-400 text-sm">{t('compare.loading')}</p>
            </div>
          </div>
        ) : filteredOptions.length > 0 ? (
          <ul className="divide-y divide-zinc-800">
            {filteredOptions.map((pokemon) => (
              <li
                key={pokemon.name}
                className="px-4 py-3 hover:bg-zinc-800 cursor-pointer flex items-center transition-colors duration-200"
                onClick={() => handleSelectPokemon(pokemon.name)}
              >
                <div className="w-12 h-12 mr-3 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-[url('/pokeball-bg.png')] bg-contain bg-center opacity-20"></div>
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.url.split('/').slice(-2, -1)}.png`}
                    alt={pokemon.name}
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <span className="capitalize text-zinc-300">{pokemon.name.replace('-', ' ')}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-zinc-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{t('compare.noResults')}</p>
          </div>
        )}
      </div>
    </div>
  );
};