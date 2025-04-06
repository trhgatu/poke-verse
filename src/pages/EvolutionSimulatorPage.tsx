import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Dna, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getPokemonByName, getPokemonSpecies, getEvolutionChain } from '../services/api';
import { Pokemon, PokemonSpecies, EvolutionChain } from '../types/pokemon';
import { EvolutionSimulator } from '../components/EvolutionSimulator';
import { capitalizeFirstLetter } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

export const EvolutionSimulatorPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<{ name: string; id: number }[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [evolutionChain, setEvolutionChain] = useState<EvolutionChain | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Danh sách các Pokémon phổ biến để gợi ý
  const popularPokemon = [
    { name: 'bulbasaur', id: 1 },
    { name: 'charmander', id: 4 },
    { name: 'squirtle', id: 7 },
    { name: 'pikachu', id: 25 },
    { name: 'eevee', id: 133 },
    { name: 'dratini', id: 147 },
    { name: 'chikorita', id: 152 },
    { name: 'cyndaquil', id: 155 },
    { name: 'totodile', id: 158 },
    { name: 'treecko', id: 252 },
    { name: 'torchic', id: 255 },
    { name: 'mudkip', id: 258 },
  ];

  // Xử lý tìm kiếm
  useEffect(() => {
    if (searchTerm.length > 1) {
      // Lọc từ danh sách Pokémon phổ biến
      const filteredSuggestions = popularPokemon.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  // Hàm lấy thông tin Pokémon và chuỗi tiến hóa
  const fetchPokemonData = async (name: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Lấy thông tin Pokémon
      const pokemonData = await getPokemonByName(name);
      setSelectedPokemon(pokemonData);

      // Lấy thông tin species
      const speciesData: PokemonSpecies = await getPokemonSpecies(pokemonData.id);

      // Lấy chuỗi tiến hóa
      if (speciesData.evolution_chain?.url) {
        const evolutionData = await getEvolutionChain(speciesData.evolution_chain.url);
        setEvolutionChain(evolutionData);
      } else {
        setEvolutionChain(null);
      }
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu Pokémon:', err);
      setError(t('ui.loadingError'));
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý khi chọn Pokémon
  const handleSelectPokemon = (name: string) => {
    setSearchTerm('');
    setSuggestions([]);
    fetchPokemonData(name);
  };

  // Danh sách các Pokémon đề xuất
  const renderSuggestions = () => {
    if (suggestions.length === 0) return null;

    return (
      <div className="absolute z-50 mt-1 w-full bg-zinc-800 border border-zinc-700 rounded-md shadow-lg max-h-60 overflow-auto">
        {suggestions.map((pokemon) => (
          <div
            key={pokemon.id}
            className="px-4 py-2 hover:bg-zinc-700 cursor-pointer flex items-center"
            onClick={() => handleSelectPokemon(pokemon.name)}
          >
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
              alt={pokemon.name}
              className="w-8 h-8 mr-2"
            />
            <span className="capitalize">{capitalizeFirstLetter(pokemon.name)}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full py-8">
      <button
        className="flex items-center text-zinc-400 hover:text-white mb-6 transition-colors"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={18} className="mr-2" />
        {t('ui.back')}
      </button>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
          <Dna className="mr-2 text-red-500" size={32} />
          {t('evolution.title')}
        </h1>
        <p className="text-zinc-400">
          {t('evolution.description')}
        </p>
      </div>

      <div className="w-full max-w-xl mx-auto mb-8">
        <div className="relative">
          <div className="flex">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-zinc-400" />
              </div>
              <input
                type="text"
                placeholder={t('evolution.search')}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-l-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {renderSuggestions()}
            </div>
            <button
              onClick={() => searchTerm && handleSelectPokemon(searchTerm.toLowerCase())}
              className="bg-red-500 hover:bg-red-600 text-white px-4 rounded-r-lg"
            >
              {t('evolution.searchButton')}
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {popularPokemon.slice(0, 6).map(pokemon => (
            <button
              key={pokemon.id}
              onClick={() => handleSelectPokemon(pokemon.name)}
              className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-full text-sm transition-colors"
            >
              {capitalizeFirstLetter(pokemon.name)}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center p-12">
          <div className="w-16 h-16 border-4 border-zinc-700 border-t-red-500 rounded-full animate-spin"></div>
        </div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-zinc-800 rounded-xl border border-red-500/20 max-w-xl mx-auto"
        >
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
          >
            {t('ui.tryAgain')}
          </button>
        </motion.div>
      )}

      {!isLoading && !error && selectedPokemon && evolutionChain && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <EvolutionSimulator
            chain={evolutionChain.chain}
            onComplete={() => console.log("Evolution completed")}
          />
        </motion.div>
      )}

      {!isLoading && !error && !selectedPokemon && (
        <div className="text-center p-12 bg-zinc-800 rounded-xl max-w-2xl mx-auto">
          <Dna size={64} className="mx-auto mb-4 text-zinc-600" />
          <h2 className="text-2xl font-bold text-white mb-2">{t('evolution.selectPrompt')}</h2>
          <p className="text-zinc-400">
            {t('evolution.selectDescription')}
          </p>
        </div>
      )}
    </div>
  );
};