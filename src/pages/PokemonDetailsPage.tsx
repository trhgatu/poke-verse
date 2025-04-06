import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Dices, Weight, Ruler, Star, Shield, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { usePokemonStore } from '../store/pokemonStore';
import { EvolutionChain as EvolutionChainComponent } from '../components/EvolutionChain';
import { cn, formatPokemonId, capitalizeFirstLetter, getColorByType } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { Pokemon } from '../types/pokemon';

export const PokemonDetailsPage: React.FC = () => {
  const { t } = useLanguage();
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const {
    selectedPokemon,
    fetchPokemonDetails,
    fetchSpeciesAndEvolutionChain,
    isLoading,
    isLoadingExtra,
    error,
    favorites,
    addToFavorites,
    removeFromFavorites,
    species,
    evolutionChain,
    pokemonList,
    fetchAllPokemon
  } = usePokemonStore();
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [name]);

  useEffect(() => {
    if (name) {
      fetchPokemonDetails(name);
    }
  }, [name, fetchPokemonDetails]);

  useEffect(() => {
    if (selectedPokemon) {
      fetchSpeciesAndEvolutionChain(selectedPokemon.id);
    }
  }, [selectedPokemon, fetchSpeciesAndEvolutionChain]);

  // Fetch all Pokemon data to enable navigation if not already loaded
  useEffect(() => {
    if (!pokemonList?.allPokemon) {
      fetchAllPokemon();
    }
  }, [pokemonList, fetchAllPokemon]);

  if (isLoading || !selectedPokemon) {
    return (
      <div className="w-full min-h-[calc(100vh-200px)]">
        {/* Navigation skeleton */}
        <div className="w-full flex flex-col md:flex-row justify-between items-start mb-8">
          <div className="h-10 w-24 bg-zinc-800 rounded-md animate-pulse mb-4 md:mb-0"></div>
          <div className="h-10 w-40 bg-zinc-800 rounded-md animate-pulse"></div>
        </div>

        {/* Main card skeleton */}
        <div className="w-full rounded-3xl p-8 md:p-10 mb-8 bg-gradient-to-br from-zinc-800 to-zinc-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-pokeball opacity-10 bg-no-repeat bg-right-top scale-150"></div>

          <div className="w-full flex flex-col md:flex-row items-center relative z-10">
            {/* Pokemon image skeleton */}
            <div className="w-64 h-64 flex-shrink-0 mb-6 md:mb-0 md:mr-8 relative">
              <div className="w-full h-full rounded-full bg-zinc-700 animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-8 border-zinc-600 border-t-red-500 animate-spin"></div>
              </div>
            </div>

            {/* Pokemon info skeleton */}
            <div className="flex-1">
              <div className="h-6 w-16 bg-zinc-700 rounded-md animate-pulse mb-2"></div>
              <div className="h-12 w-3/4 bg-zinc-700 rounded-md animate-pulse mb-4"></div>
              <div className="h-6 w-1/2 bg-zinc-700 rounded-md animate-pulse mb-4"></div>

              {/* Types skeleton */}
              <div className="flex flex-wrap gap-2 mb-6">
                <div className="h-8 w-24 bg-zinc-700 rounded-full animate-pulse"></div>
                <div className="h-8 w-24 bg-zinc-700 rounded-full animate-pulse"></div>
              </div>

              {/* Description skeleton */}
              <div className="space-y-2 mb-6">
                <div className="h-4 w-full bg-zinc-700 rounded-md animate-pulse"></div>
                <div className="h-4 w-11/12 bg-zinc-700 rounded-md animate-pulse"></div>
                <div className="h-4 w-3/4 bg-zinc-700 rounded-md animate-pulse"></div>
              </div>

              {/* Stats boxes skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="h-12 bg-zinc-700/50 rounded-xl animate-pulse"></div>
                <div className="h-12 bg-zinc-700/50 rounded-xl animate-pulse"></div>
                <div className="h-12 bg-zinc-700/50 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs skeleton */}
        <div className="w-full flex border-b border-zinc-700 mb-6">
          <div className="h-10 w-20 bg-zinc-800 rounded-t-md animate-pulse mr-2"></div>
          <div className="h-10 w-20 bg-zinc-800 rounded-t-md animate-pulse mr-2"></div>
          <div className="h-10 w-20 bg-zinc-800 rounded-t-md animate-pulse"></div>
        </div>

        {/* Tab content skeleton */}
        <div className="w-full bg-zinc-800 rounded-xl p-6 border border-zinc-700">
          <div className="h-8 w-40 bg-zinc-700 rounded-md animate-pulse mb-6"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-full">
                <div className="flex justify-between mb-1">
                  <div className="h-4 w-24 bg-zinc-700 rounded-md animate-pulse"></div>
                  <div className="h-4 w-8 bg-zinc-700 rounded-md animate-pulse"></div>
                </div>
                <div className="w-full bg-zinc-700 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full bg-gradient-to-r from-red-500 to-red-600 animate-pulse"
                    style={{ width: `${Math.random() * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[calc(100vh-200px)] flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="bg-zinc-800/90 backdrop-blur-md p-8 rounded-2xl shadow-lg max-w-md mx-auto text-center border border-red-500/30"
        >
          <h2 className="text-2xl font-bold text-white mb-4">{t('ui.loadingPokemonError')}</h2>
          <p className="text-red-400 mb-6">{error}</p>
          <Button
            variant="pokemon"
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-none font-bold px-6 py-3"
            onClick={() => name && fetchPokemonDetails(name)}
          >
            {t('ui.tryAgain')}
          </Button>
        </motion.div>
      </div>
    );
  }

  const isFavorite = favorites.includes(selectedPokemon.id);
  const mainType = selectedPokemon.types[0]?.type.name || 'normal';
  const secondaryType = selectedPokemon.types[1]?.type.name;

  const handleFavoriteClick = () => {
    if (isFavorite) {
      removeFromFavorites(selectedPokemon.id);
    } else {
      addToFavorites(selectedPokemon.id);
    }
  };

  const description = species?.flavor_text_entries.find(entry => entry.language.name === 'en')?.flavor_text || 'No description available.';
  const genus = species?.genera.find(g => g.language.name === 'en')?.genus || '';

  // Find current Pokemon index to enable prev/next navigation
  const allPokemonList = pokemonList?.allPokemon || [];
  const currentIndex = allPokemonList.findIndex((p: Pokemon) => p.name === selectedPokemon.name);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allPokemonList.length - 1 && currentIndex !== -1;

  const navigateToPokemon = (direction: 'prev' | 'next') => {
    if (!allPokemonList.length) return;

    if (direction === 'prev' && hasPrevious) {
      navigate(`/pokemon/${allPokemonList[currentIndex - 1].name}`);
    } else if (direction === 'next' && hasNext) {
      navigate(`/pokemon/${allPokemonList[currentIndex + 1].name}`);
    }
  };

  const getStatColor = (_statName: string, value: number) => {
    if (value >= 150) return "bg-gradient-to-r from-purple-500 to-purple-600";
    if (value >= 100) return "bg-gradient-to-r from-blue-500 to-blue-600";
    if (value >= 70) return "bg-gradient-to-r from-green-500 to-green-600";
    if (value >= 50) return "bg-gradient-to-r from-yellow-500 to-yellow-600";
    return "bg-gradient-to-r from-red-500 to-red-600";
  };

  return (
    <div className="w-full pb-8 relative">
      {/* Background decorator based on Pokemon type */}
      <div
        className="fixed inset-0 w-full h-full -z-10 opacity-10"
        style={{
          backgroundImage: `
            url('/pokeball-bg.svg'),
            radial-gradient(circle at 20% 20%, var(--${mainType}-color) 0%, transparent 70%),
            radial-gradient(circle at 80% 80%, var(--${secondaryType || mainType}-color) 0%, transparent 70%)
          `,
          backgroundRepeat: 'repeat, no-repeat, no-repeat',
          backgroundPosition: 'center, top left, bottom right',
          backgroundSize: '15%, 100%, 100%'
        }}
      ></div>

      {/* Navigation bar with Pokemon type color background */}
      <motion.div
        className={cn(
          "w-full flex flex-col md:flex-row justify-between items-center px-4 py-3 mb-8 rounded-xl",
          "bg-gradient-to-r shadow-lg border border-white/10",
          getColorByType(mainType)
        )}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white/20 transition-all duration-300"
          >
            <ArrowLeft className="mr-1" size={18} /> {t('ui.back')}
          </Button>

          {/* Pokemon Nav */}
          <div className="flex items-center gap-1 ml-2">
            <Button
              variant="ghost"
              onClick={() => navigateToPokemon('prev')}
              disabled={!hasPrevious}
              className={cn(
                "p-1 rounded-full text-white",
                hasPrevious ? "hover:bg-white/20" : "opacity-50 cursor-not-allowed"
              )}
            >
              <ChevronLeft size={20} />
            </Button>
            <div className="font-mono text-sm text-white/80 px-2">
              {formatPokemonId(selectedPokemon.id)}
            </div>
            <Button
              variant="ghost"
              onClick={() => navigateToPokemon('next')}
              disabled={!hasNext}
              className={cn(
                "p-1 rounded-full text-white",
                hasNext ? "hover:bg-white/20" : "opacity-50 cursor-not-allowed"
              )}
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>

        <Button
          variant={isFavorite ? "destructive" : "ghost"}
          onClick={handleFavoriteClick}
          className={cn(
            "flex items-center gap-2 transition-all duration-300 mt-3 md:mt-0",
            isFavorite ? "bg-red-500 hover:bg-red-600" : "bg-white/20 hover:bg-white/30 text-white"
          )}
        >
          <Heart
            size={18}
            fill={isFavorite ? "white" : "none"}
            className={isFavorite ? "animate-pulse" : ""}
          />
          {isFavorite ? t('pokemon.removeFromFavorites') : t('pokemon.addToFavorites')}
        </Button>
      </motion.div>

      {/* Main Pokemon Card */}
      <motion.div
        className="w-full rounded-3xl shadow-2xl relative overflow-hidden border border-white/10"
        style={{
          background: `linear-gradient(to bottom right, ${
            secondaryType
              ? `var(--${mainType}-color) 60%, var(--${secondaryType}-color)`
              : `var(--${mainType}-color), var(--${mainType}-dark-color)`
          })`
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Decorative patterns */}
        <div className="absolute inset-0 bg-pokeball opacity-10 bg-no-repeat bg-center bg-contain"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/30 to-transparent"></div>

        {/* Content wrapper */}
        <div className="w-full flex flex-col md:flex-row items-center p-8 md:p-10 relative z-10">
          {/* Pokemon Image Section */}
          <div className="md:w-1/3 flex-shrink-0 mb-6 md:mb-0 md:mr-8 relative">
            <div className="relative">
              {/* Image backdrop glow */}
              <div className="absolute -inset-4 rounded-full bg-white/30 filter blur-xl opacity-70"></div>

              {/* Pokeball backdrop design */}
              <div className="absolute -inset-8 bg-pokeball-detail bg-no-repeat bg-center bg-contain opacity-60 animate-spin-slow"></div>


              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="relative z-10 flex justify-center"
              >
                <motion.img
                  src={selectedPokemon.sprites.other["official-artwork"].front_default || selectedPokemon.sprites.front_default}
                  alt={selectedPokemon.name}
                  className="w-64 h-64 object-contain drop-shadow-2xl"
                  animate={{
                    y: [0, -15, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 4,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>

              {/* Decorative elements */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-48 h-10 bg-black/30 filter blur-xl rounded-full"></div>

              {/* Sparkle effects */}
              <div className="absolute top-0 left-0 w-full h-full">
                <motion.div
                  className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full"
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.5, 0.5]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    repeatType: "reverse"
                  }}
                />
                <motion.div
                  className="absolute top-1/3 right-1/4 w-1 h-1 bg-white rounded-full"
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.5, 0.5]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    delay: 0.5,
                    repeatType: "reverse"
                  }}
                />
                <motion.div
                  className="absolute bottom-1/3 right-1/3 w-1.5 h-1.5 bg-white rounded-full"
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.5, 0.5]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 4,
                    delay: 1,
                    repeatType: "reverse"
                  }}
                />
              </div>
            </div>
          </div>

          {/* Pokemon Info Section */}
          <div className="md:w-2/3 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-xl text-white/90 font-mono font-bold bg-black/20 px-3 py-1 rounded-lg backdrop-blur-sm">
                {formatPokemonId(selectedPokemon.id)}
              </div>
              {genus && (
                <div className="text-sm text-white/80 bg-black/10 px-3 py-1 rounded-lg backdrop-blur-sm">
                  {genus}
                </div>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 capitalize drop-shadow-md">
              {capitalizeFirstLetter(selectedPokemon.name)}
            </h1>

            <div className="flex flex-wrap gap-2 mb-5">
              {selectedPokemon.types.map((type) => (
                <span
                  key={type.type.name}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-white font-bold shadow-lg",
                    "bg-white/20 backdrop-blur-sm border border-white/30"
                  )}
                >
                  {capitalizeFirstLetter(type.type.name)}
                </span>
              ))}
            </div>

            <motion.div
              className="text-white/90 mb-6 max-w-2xl bg-black/10 p-4 rounded-xl backdrop-blur-sm border border-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="italic">{description.replace(/[\n\f]/g, ' ')}</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <motion.div
                className="flex items-center bg-black/20 p-3 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-black/30 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <Weight className="mr-2" size={20} />
                <span className="font-medium">{selectedPokemon.weight / 10} kg</span>
              </motion.div>
              <motion.div
                className="flex items-center bg-black/20 p-3 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-black/30 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <Ruler className="mr-2" size={20} />
                <span className="font-medium">{selectedPokemon.height / 10} m</span>
              </motion.div>
              <motion.div
                className="flex items-center bg-black/20 p-3 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-black/30 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <Dices className="mr-2" size={20} />
                <span className="font-medium">{t('pokemon.abilities')}: {selectedPokemon.abilities.length}</span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs Navigation - Styled with Pokemon colors */}
      <div className="w-full flex border-b-2 border-zinc-700 mb-6 mt-8 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('stats')}
          className={cn(
            "px-6 py-3 font-bold transition-all rounded-t-lg mr-1 flex items-center whitespace-nowrap",
            activeTab === 'stats'
              ? `text-white bg-gradient-to-br ${getColorByType(mainType)} border-b-2 border-white`
              : "text-zinc-400 hover:text-white hover:bg-zinc-800"
          )}
        >
          <Star className="mr-2" size={18} />
          {t('pokemon.stats')}
        </button>
        <button
          onClick={() => setActiveTab('abilities')}
          className={cn(
            "px-6 py-3 font-bold transition-all rounded-t-lg mr-1 flex items-center whitespace-nowrap",
            activeTab === 'abilities'
              ? `text-white bg-gradient-to-br ${getColorByType(mainType)} border-b-2 border-white`
              : "text-zinc-400 hover:text-white hover:bg-zinc-800"
          )}
        >
          <Shield className="mr-2" size={18} />
          {t('pokemon.abilities')}
        </button>
        <button
          onClick={() => setActiveTab('evolution')}
          className={cn(
            "px-6 py-3 font-bold transition-all rounded-t-lg flex items-center whitespace-nowrap",
            activeTab === 'evolution'
              ? `text-white bg-gradient-to-br ${getColorByType(mainType)} border-b-2 border-white`
              : "text-zinc-400 hover:text-white hover:bg-zinc-800"
          )}
        >
          <Zap className="mr-2" size={18} />
          {t('pokemon.evolution')}
        </button>
      </div>

      {/* Tab Content - Enhanced with Pokemon styling */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="w-full"
        >
          {activeTab === 'stats' && (
            <div className="w-full bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl p-6 border border-zinc-700 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Star className="mr-2 text-yellow-400" size={20} />
                {t('pokemon.baseStats')}
              </h3>
              <div className="grid gap-5">
                {selectedPokemon.stats.map((stat) => (
                  <div key={stat.stat.name} className="w-full">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-zinc-300 font-bold uppercase tracking-wider">
                        {stat.stat.name.replace('-', ' ')}
                      </span>
                      <span className={cn(
                        "text-sm font-bold px-2 py-0.5 rounded-md",
                        Number(stat.base_stat) > 100 ? "bg-green-500/20 text-green-400" :
                        Number(stat.base_stat) > 70 ? "bg-blue-500/20 text-blue-400" :
                        Number(stat.base_stat) > 50 ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-red-500/20 text-red-400"
                      )}>
                        {stat.base_stat}
                      </span>
                    </div>
                    <div className="w-full bg-zinc-700/50 rounded-full h-3 p-0.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (stat.base_stat / 255) * 100)}%` }}
                        transition={{ duration: 1, delay: 0.1 }}
                        className={cn(
                          "h-full rounded-full",
                          getStatColor(stat.stat.name, stat.base_stat)
                        )}
                      ></motion.div>
                    </div>
                  </div>
                ))}

                {/* Total stats calculation */}
                <div className="w-full mt-2 pt-4 border-t border-zinc-700">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-white font-bold uppercase tracking-wider">
                      {t('pokemon.total')}
                    </span>
                    <span className="text-sm font-bold px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-400">
                      {selectedPokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'abilities' && (
            <div className="w-full bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl p-6 border border-zinc-700 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Shield className="mr-2 text-blue-400" size={20} />
                {t('pokemon.abilities')}
              </h3>
              <div className="grid gap-4">
                {selectedPokemon.abilities.map((ability, index) => (
                  <motion.div
                    key={ability.ability.name}
                    className={cn(
                      "p-5 rounded-lg border transition-colors",
                      ability.is_hidden
                        ? "bg-purple-900/30 border-purple-700/50 hover:bg-purple-900/40"
                        : `${getColorByType(mainType)}/20 border-white/10 hover:bg-black/20`
                    )}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center mb-2">
                      <h4 className="text-lg font-bold text-white capitalize">
                        {ability.ability.name.replace('-', ' ')}
                      </h4>
                      {ability.is_hidden && (
                        <span className="ml-2 px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full font-bold">
                          {t('pokemon.hiddenAbility')}
                        </span>
                      )}
                    </div>
                    <p className="text-zinc-300 text-sm leading-relaxed">
                      {ability.is_hidden
                        ? t('pokemon.hiddenAbilityDesc')
                        : t('pokemon.standardAbility')}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'evolution' && (
            <div className="w-full bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl p-6 border border-zinc-700 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Zap className="mr-2 text-yellow-400" size={20} />
                {t('pokemon.evolutionChain')}
              </h3>
              {isLoadingExtra ? (
                <div className="flex justify-center py-10">
                  <div className="w-12 h-12 border-4 border-zinc-600 border-t-red-500 rounded-full animate-spin"></div>
                </div>
              ) : evolutionChain ? (
                <EvolutionChainComponent chain={evolutionChain.chain} />
              ) : (
                <div className="text-zinc-400 text-center py-8 bg-black/20 rounded-xl border border-zinc-700/50">
                  <p className="text-lg font-medium">{t('evolution.noEvolution')}</p>
                  <p className="text-sm mt-2 text-zinc-500">{t('evolution.noEvolutionDesc')}</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};