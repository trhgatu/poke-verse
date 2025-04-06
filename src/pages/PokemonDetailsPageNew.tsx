import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Dices, Weight, Ruler, Star, Shield, Zap } from 'lucide-react';
import { Button } from '../components/ui/button';
import { usePokemonStore } from '../store/pokemonStore';
import { getPokemonSpecies, getEvolutionChain } from '../services/api';
import { PokemonSpecies, EvolutionChain } from '../types/pokemon';
import { cn, formatPokemonId, capitalizeFirstLetter, getColorByType } from '../lib/utils';

export const PokemonDetailsPageNew: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const { selectedPokemon, fetchPokemonDetails, isLoading, error, favorites, addToFavorites, removeFromFavorites } = usePokemonStore();
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [evolutionChain, setEvolutionChain] = useState<EvolutionChain | null>(null);
  const [isLoadingExtra, setLoadingExtra] = useState(false);
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    if (name) {
      fetchPokemonDetails(name);
    }
  }, [name, fetchPokemonDetails]);

  useEffect(() => {
    const fetchExtraData = async () => {
      if (selectedPokemon) {
        setLoadingExtra(true);
        try {
          const speciesData = await getPokemonSpecies(selectedPokemon.id);
          setSpecies(speciesData);

          if (speciesData.evolution_chain?.url) {
            const evolutionData = await getEvolutionChain(speciesData.evolution_chain.url);
            setEvolutionChain(evolutionData);
          }
        } catch (error) {
          console.error('Error fetching extra data:', error);
        } finally {
          setLoadingExtra(false);
        }
      }
    };

    fetchExtraData();
  }, [selectedPokemon]);

  if (isLoading || !selectedPokemon) {
    return (
      <div className="w-full min-h-[calc(100vh-200px)] flex flex-col items-center justify-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full border-8 border-zinc-700 border-t-red-500 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-white rounded-full border-4 border-zinc-800"></div>
          </div>
        </div>
        <p className="text-zinc-400">Loading Pokémon...</p>
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
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Pokémon</h2>
          <p className="text-red-400 mb-6">{error}</p>
          <Button
            variant="pokemon"
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-none"
            onClick={() => name && fetchPokemonDetails(name)}
          >
            Try Again
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
          <ArrowLeft className="mr-2" size={18} /> Back
        </Button>

        <Button
          variant={isFavorite ? "destructive" : "pokemon"}
          onClick={handleFavoriteClick}
          className="flex items-center gap-2 transition-all duration-300"
        >
          <Heart size={18} fill={isFavorite ? "white" : "none"} className={isFavorite ? "animate-pulse" : ""} />
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
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
                <span>Abilities: {selectedPokemon.abilities.length}</span>
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
            Stats
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
            <Zap className="mr-2" size={18} />
            Abilities
          </div>
        </button>
        {evolutionChain && evolutionChain.chain && (
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
              <Shield className="mr-2" size={18} />
              Evolution
            </div>
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className="w-full min-h-[400px]">
        {isLoadingExtra && (
          <div className="absolute top-2 right-2">
            <div className="w-5 h-5 border-2 border-zinc-700 border-t-red-500 rounded-full animate-spin"></div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
              className="w-full bg-zinc-800 rounded-2xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-bold text-white mb-6">Base Stats</h2>

              <div className="space-y-5 w-full">
                {selectedPokemon.stats.map(stat => {
                  const statName = stat.stat.name.replace(/-/g, ' ');
                  const percentage = (stat.base_stat / 255) * 100;

                  return (
                    <div key={stat.stat.name}>
                      <div className="flex justify-between text-white mb-2">
                        <span className="capitalize font-medium">{statName}</span>
                        <span className="font-mono">{stat.base_stat}</span>
                      </div>
                      <div className="w-full bg-zinc-700 rounded-full h-3 overflow-hidden">
                        <motion.div
                          className={cn("h-3 rounded-full", getColorByType(mainType))}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: 0.1 }}
                        ></motion.div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'abilities' && (
            <motion.div
              key="abilities"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
              className="w-full bg-zinc-800 rounded-2xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-bold text-white mb-6">Abilities</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {selectedPokemon.abilities.map(ability => (
                  <motion.div
                    key={ability.ability.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "bg-zinc-700 rounded-xl p-4 text-white border-l-4",
                      ability.is_hidden ? "border-red-500" : "border-zinc-500"
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium capitalize">{ability.ability.name.replace(/-/g, ' ')}</h3>
                      {ability.is_hidden && (
                        <span className="text-xs px-2 py-1 bg-zinc-600 rounded-full">Hidden</span>
                      )}
                    </div>
                    <p className="mt-2 text-zinc-300 text-sm">
                      {ability.is_hidden
                        ? "This is a hidden ability that Pokémon can have."
                        : "This is a standard ability for this Pokémon."}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'evolution' && evolutionChain && evolutionChain.chain && (
            <motion.div
              key="evolution"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
              className="w-full bg-zinc-800 rounded-2xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-bold text-white mb-6">Evolution Chain</h2>

              <div className="flex flex-wrap justify-center items-center gap-4 w-full">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto bg-zinc-700 rounded-full flex items-center justify-center mb-2">
                    {/* Image of first evolution would go here */}
                  </div>
                  <div className="text-white capitalize">{evolutionChain.chain.species.name}</div>
                </div>

                {evolutionChain.chain.evolves_to.map(evo => (
                  <React.Fragment key={evo.species.name}>
                    <div className="text-white">→</div>
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto bg-zinc-700 rounded-full flex items-center justify-center mb-2">
                        {/* Image of second evolution would go here */}
                      </div>
                      <div className="text-white capitalize">{evo.species.name}</div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};