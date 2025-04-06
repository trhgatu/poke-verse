import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Dices, Weight, Ruler, Star, Shield, Zap } from 'lucide-react';
import { Button } from '../components/ui/button';
import { usePokemonStore } from '../store/pokemonStore';
import { EvolutionChain as EvolutionChainComponent } from '../components/EvolutionChain';
import { cn, formatPokemonId, capitalizeFirstLetter, getColorByType } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

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
    evolutionChain
  } = usePokemonStore();
  const [activeTab, setActiveTab] = useState('stats');

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

  if (isLoading || !selectedPokemon) {
    return (
      <div className="w-full min-h-[calc(100vh-200px)] flex flex-col items-center justify-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full border-8 border-zinc-700 border-t-red-500 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-white rounded-full border-4 border-zinc-800"></div>
          </div>
        </div>
        <p className="text-zinc-400">{t('ui.loadingPokemon')}</p>
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
          className="bg-zinc-800 p-8 rounded-2xl shadow-lg max-w-md mx-auto text-center border border-red-500/20"
        >
          <h2 className="text-2xl font-bold text-white mb-4">{t('ui.loadingPokemonError')}</h2>
          <p className="text-red-400 mb-6">{error}</p>
          <Button
            variant="pokemon"
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-none"
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

  const handleFavoriteClick = () => {
    if (isFavorite) {
      removeFromFavorites(selectedPokemon.id);
    } else {
      addToFavorites(selectedPokemon.id);
    }
  };

  const description = species?.flavor_text_entries.find(entry => entry.language.name === 'en')?.flavor_text || 'No description available.';
  const genus = species?.genera.find(g => g.language.name === 'en')?.genus || '';

  return (
    <div className="w-full pb-8">
      <div className="w-full flex flex-col md:flex-row justify-between items-start mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4 md:mb-0 text-white hover:bg-zinc-800 transition-all duration-300"
        >
          <ArrowLeft className="mr-2" size={18} /> {t('ui.back')}
        </Button>

        <Button
          variant={isFavorite ? "destructive" : "pokemon"}
          onClick={handleFavoriteClick}
          className="flex items-center gap-2 transition-all duration-300"
        >
          <Heart size={18} fill={isFavorite ? "white" : "none"} className={isFavorite ? "animate-pulse" : ""} />
          {isFavorite ? t('pokemon.removeFromFavorites') : t('pokemon.addToFavorites')}
        </Button>
      </div>

      <motion.div
        className={cn("w-full rounded-3xl p-8 md:p-10 mb-8 shadow-xl relative overflow-hidden", getColorByType(mainType))}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-pokeball opacity-10 bg-no-repeat bg-right-top scale-150"></div>

        <div className="w-full flex flex-col md:flex-row items-center relative z-10">
          <motion.div
            className="w-64 h-64 flex-shrink-0 mb-6 md:mb-0 md:mr-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.img
              src={selectedPokemon.sprites.other["official-artwork"].front_default || selectedPokemon.sprites.front_default}
              alt={selectedPokemon.name}
              className="w-full h-full object-contain drop-shadow-2xl"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          <div className="text-white flex-1">
            <div className="text-xl font-semibold mb-2">{formatPokemonId(selectedPokemon.id)}</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 capitalize">{capitalizeFirstLetter(selectedPokemon.name)}</h1>

            {genus && <div className="text-lg mb-4 text-white/80">{genus}</div>}

            <div className="flex flex-wrap gap-2 mb-6">
              {selectedPokemon.types.map((type) => (
                <span
                  key={type.type.name}
                  className="px-4 py-1 rounded-full bg-white/20 text-white font-medium backdrop-blur-sm"
                >
                  {capitalizeFirstLetter(type.type.name)}
                </span>
              ))}
            </div>

            <p className="text-white/90 mb-6 max-w-2xl">{description.replace(/[\n\f]/g, ' ')}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center bg-black/20 p-3 rounded-xl backdrop-blur-sm">
                <Weight className="mr-2" size={20} />
                <span>{selectedPokemon.weight / 10} kg</span>
              </div>
              <div className="flex items-center bg-black/20 p-3 rounded-xl backdrop-blur-sm">
                <Ruler className="mr-2" size={20} />
                <span>{selectedPokemon.height / 10} m</span>
              </div>
              <div className="flex items-center bg-black/20 p-3 rounded-xl backdrop-blur-sm">
                <Dices className="mr-2" size={20} />
                <span>{t('pokemon.abilities')}: {selectedPokemon.abilities.length}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs Navigation */}
      <div className="w-full flex border-b border-zinc-700 mb-6">
        <button
          onClick={() => setActiveTab('stats')}
          className={cn(
            "px-4 py-3 font-medium transition-colors",
            activeTab === 'stats'
              ? "text-white border-b-2 border-red-500"
              : "text-zinc-400 hover:text-white"
          )}
        >
          <div className="flex items-center">
            <Star className="mr-2" size={18} />
            {t('pokemon.stats')}
          </div>
        </button>
        <button
          onClick={() => setActiveTab('abilities')}
          className={cn(
            "px-4 py-3 font-medium transition-colors",
            activeTab === 'abilities'
              ? "text-white border-b-2 border-red-500"
              : "text-zinc-400 hover:text-white"
          )}
        >
          <div className="flex items-center">
            <Shield className="mr-2" size={18} />
            {t('pokemon.abilities')}
          </div>
        </button>
        <button
          onClick={() => setActiveTab('evolution')}
          className={cn(
            "px-4 py-3 font-medium transition-colors",
            activeTab === 'evolution'
              ? "text-white border-b-2 border-red-500"
              : "text-zinc-400 hover:text-white"
          )}
        >
          <div className="flex items-center">
            <Zap className="mr-2" size={18} />
            {t('pokemon.evolution')}
          </div>
        </button>
      </div>

      {/* Tab Content */}
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
            <div className="w-full bg-zinc-800 rounded-xl p-6 border border-zinc-700">
              <h3 className="text-xl font-bold text-white mb-4">{t('pokemon.baseStats')}</h3>
              <div className="grid gap-4">
                {selectedPokemon.stats.map((stat) => (
                  <div key={stat.stat.name} className="w-full">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-zinc-300 capitalize">
                        {stat.stat.name.replace('-', ' ')}
                      </span>
                      <span className="text-sm font-medium text-white">{stat.base_stat}</span>
                    </div>
                    <div className="w-full bg-zinc-700 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full bg-gradient-to-r from-red-500 to-red-600"
                        style={{ width: `${Math.min(100, (stat.base_stat / 255) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'abilities' && (
            <div className="w-full bg-zinc-800 rounded-xl p-6 border border-zinc-700">
              <h3 className="text-xl font-bold text-white mb-4">{t('pokemon.abilities')}</h3>
              <div className="grid gap-4">
                {selectedPokemon.abilities.map((ability) => (
                  <div key={ability.ability.name} className="p-4 bg-zinc-700 rounded-lg">
                    <div className="flex items-center mb-2">
                      <h4 className="text-lg font-medium text-white capitalize">
                        {ability.ability.name.replace('-', ' ')}
                      </h4>
                      {ability.is_hidden && (
                        <span className="ml-2 px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full">
                          {t('pokemon.hiddenAbility')}
                        </span>
                      )}
                    </div>
                    <p className="text-zinc-300 text-sm">
                      {ability.is_hidden
                        ? t('pokemon.hiddenAbilityDesc')
                        : t('pokemon.standardAbility')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'evolution' && (
            <div className="w-full bg-zinc-800 rounded-xl p-6 border border-zinc-700">
              <h3 className="text-xl font-bold text-white mb-6">{t('pokemon.evolutionChain')}</h3>
              {isLoadingExtra ? (
                <div className="flex justify-center py-10">
                  <div className="w-10 h-10 border-4 border-zinc-600 border-t-red-500 rounded-full animate-spin"></div>
                </div>
              ) : evolutionChain ? (
                <EvolutionChainComponent chain={evolutionChain.chain} />
              ) : (
                <p className="text-zinc-400 text-center py-6">{t('evolution.noEvolution')}</p>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};