import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Dna, ArrowLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getPokemonByName, getPokemonSpecies, getEvolutionChain, getAllPokemon } from '../services/api';
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
    const fetchAllPokemon = async () => {
      if (searchTerm.length > 1) {
        const allPokemon = await getAllPokemon();
        const filteredSuggestions = allPokemon.filter(pokemon =>
          pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSuggestions(filteredSuggestions);
      } else {
        setSuggestions([]);
      }
    };

    fetchAllPokemon();
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
      <div className="absolute z-50 mt-1 w-full bg-zinc-800/90 backdrop-blur-sm border border-zinc-700 rounded-lg shadow-xl max-h-60 overflow-auto">
        {suggestions.map((pokemon) => (
          <motion.div
            key={pokemon.id}
            className="px-4 py-2.5 border-b border-zinc-700 last:border-none hover:bg-zinc-700/60 cursor-pointer flex items-center"
            onClick={() => handleSelectPokemon(pokemon.name)}
            whileHover={{ x: 4 }}
          >
            <div className="w-10 h-10 rounded-full bg-zinc-700/60 mr-3 flex items-center justify-center overflow-hidden">
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                alt={pokemon.name}
                className="w-8 h-8"
              />
            </div>
            <span className="capitalize font-medium text-white">{capitalizeFirstLetter(pokemon.name)}</span>
            <ChevronRight size={16} className="ml-auto text-zinc-500" />
          </motion.div>
        ))}
      </div>
    );
  };

  // Hiển thị phần search
  const renderSearchPanel = () => (
    <div className="w-full">
      <div className="bg-zinc-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-xl border border-zinc-700/50">
        <div className="relative">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-zinc-400" />
              </div>
              <input
                type="text"
                placeholder={t('evolution.search')}
                className="w-full bg-zinc-900/80 border border-zinc-700 rounded-lg sm:rounded-r-none py-3 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {renderSuggestions()}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="text-zinc-400 text-sm mb-2">{t('evolution.popular')}:</div>
          <div className="flex flex-wrap gap-2">
            {popularPokemon.map(pokemon => (
              <motion.button
                key={pokemon.id}
                onClick={() => handleSelectPokemon(pokemon.name)}
                className="px-3 py-1.5 bg-zinc-900/80 hover:bg-zinc-700 text-zinc-300 rounded-full text-sm transition-colors border border-zinc-700/50 flex items-center"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                  alt={pokemon.name}
                  className="w-5 h-5 mr-1"
                />
                <span className="sm:inline hidden">{capitalizeFirstLetter(pokemon.name)}</span>
                <span className="sm:hidden inline">{capitalizeFirstLetter(pokemon.name.substring(0, 4))}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Initial state message */}
        {!selectedPokemon && !isLoading && !error && (
          <motion.div
            className="mt-6 text-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 relative">
              <div className="w-full h-full bg-pokeball bg-center bg-contain bg-no-repeat opacity-20 animate-spin-slow"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl sm:text-4xl">🔍</span>
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-zinc-300 mb-2">{t('evolution.selectPrompt')}</h3>
            <p className="text-zinc-500 text-sm">{t('evolution.selectDescription')}</p>
          </motion.div>
        )}
      </div>
    </div>
  );

  // Hiển thị phần evolution simulator
  const renderEvolutionPanel = () => {
    if (isLoading) {
      return (
        <motion.div
          className="flex justify-center items-center p-8 bg-zinc-800/80 backdrop-blur-sm rounded-2xl min-h-[300px] sm:min-h-[400px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-8 border-zinc-700/30 border-t-pink-500 rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-pokeball bg-center bg-contain bg-no-repeat"></div>
          </div>
        </motion.div>
      );
    }

    if (error) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-6 sm:p-10 bg-zinc-800/80 backdrop-blur-sm rounded-2xl border border-red-500/30 min-h-[300px] sm:min-h-[400px] flex flex-col items-center justify-center"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-red-400 mb-4 font-medium text-base sm:text-lg">{error}</p>
          <motion.button
            onClick={() => window.location.reload()}
            className="px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-medium shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('ui.tryAgain')}
          </motion.button>
        </motion.div>
      );
    }

    if (selectedPokemon && evolutionChain) {
      return (
        <motion.div
          key={selectedPokemon.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <EvolutionSimulator chain={evolutionChain.chain} />
        </motion.div>
      );
    }

    return (
      <motion.div
        className="flex flex-col items-center justify-center p-6 bg-zinc-800/50 backdrop-blur-sm rounded-2xl min-h-[300px] sm:min-h-[400px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="w-20 h-20 sm:w-32 sm:h-32 mb-6 relative">
          <div className="absolute inset-0 bg-pokeball bg-center bg-contain bg-no-repeat opacity-20 animate-spin-slow"></div>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-zinc-400 mb-2 text-center">{t('evolution.startPrompt')}</h3>
        <p className="text-zinc-500 text-center max-w-md">{t('evolution.instructions')}</p>
      </motion.div>
    );
  };

  return (
    <div className="w-full py-8 px-4 relative overflow-hidden min-h-screen">
      {/* Background pattern */}
      <div className="fixed inset-0 w-full h-full -z-10 opacity-10">
        <div className="absolute inset-0 bg-pokeball bg-repeat opacity-10" style={{ backgroundSize: '80px 80px' }}></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/20 via-transparent to-red-500/20"></div>
      </div>

      {/* Back button */}
      <motion.button
        className="flex items-center text-zinc-400 hover:text-white mb-6 transition-colors px-3 py-1.5 bg-zinc-800/60 backdrop-blur-sm rounded-lg hover:bg-zinc-700/80"
        whileHover={{ x: -5 }}
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={18} className="mr-2" />
        {t('ui.back')}
      </motion.button>

      {/* Header */}
      <motion.div
        className="text-center mb-6 sm:mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative inline-block">
          <motion.div
            className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg blur opacity-30"
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 3, repeat: Infinity }}
          ></motion.div>
          <h1 className="relative px-4 sm:px-6 py-2 bg-zinc-900/80 backdrop-blur-md rounded-lg text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 inline-flex items-center">
            <span className="hidden sm:inline-block mr-2 sm:mr-3">
              <Dna className="text-pink-500" size={24} />
            </span>
            {t('evolution.title')}
            <span className="hidden sm:inline-block ml-2 sm:ml-3">
              <Sparkles className="text-purple-500" size={18} />
            </span>
          </h1>
        </div>
        <p className="text-zinc-400 mt-2 sm:mt-3 max-w-2xl mx-auto text-sm sm:text-base px-2">
          {t('evolution.description')}
        </p>
      </motion.div>

      {/* Two-column layout */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left column - Search panel */}
          <motion.div
            className="w-full lg:w-1/3 mb-6 lg:mb-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {renderSearchPanel()}
          </motion.div>

          {/* Right column - Evolution simulator */}
          <motion.div
            className="w-full lg:w-2/3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {renderEvolutionPanel()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};