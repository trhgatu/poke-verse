import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Dices, Weight, Ruler } from 'lucide-react';
import { Button } from '../components/ui/button';
import { usePokemonStore } from '../store/pokemonStore';
import { getPokemonSpecies, getEvolutionChain } from '../services/api';
import { PokemonSpecies, EvolutionChain } from '../types/pokemon';
import { cn, formatPokemonId, capitalizeFirstLetter, getColorByType } from '../lib/utils';

export const PokemonDetailsPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const { selectedPokemon, fetchPokemonDetails, isLoading, error, favorites, addToFavorites, removeFromFavorites } = usePokemonStore();
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [evolutionChain, setEvolutionChain] = useState<EvolutionChain | null>(null);
  const [isLoadingExtra, setLoadingExtra] = useState(false);

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
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
        <p className="text-red-500">{error}</p>
        <Button variant="pokemon" className="mt-4" onClick={() => name && fetchPokemonDetails(name)}>
          Try Again
        </Button>
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
    <div className="pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4 md:mb-0 text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="mr-2" size={18} /> Back
        </Button>

        <Button
          variant={isFavorite ? "destructive" : "pokemon"}
          onClick={handleFavoriteClick}
          className="flex items-center gap-2"
        >
          <Heart size={18} fill={isFavorite ? "white" : "none"} />
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </Button>
      </div>

      <div className={cn("rounded-xl p-8 mb-8 shadow-lg relative overflow-hidden", getColorByType(mainType))}>
        {isLoadingExtra && (
          <div className="absolute top-2 right-2 z-10">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <div className="absolute inset-0 bg-pokeball opacity-10"></div>

        <div className="flex flex-col md:flex-row items-center relative z-10">
          <motion.div
            className="w-60 h-60 flex-shrink-0 mb-6 md:mb-0 md:mr-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={selectedPokemon.sprites.other["official-artwork"].front_default || selectedPokemon.sprites.front_default}
              alt={selectedPokemon.name}
              className="w-full h-full object-contain"
            />
          </motion.div>

          <div className="text-white">
            <div className="text-xl font-semibold mb-2">{formatPokemonId(selectedPokemon.id)}</div>
            <h1 className="text-4xl font-bold mb-4 capitalize">{capitalizeFirstLetter(selectedPokemon.name)}</h1>

            {genus && <div className="text-lg mb-4">{genus}</div>}

            <div className="flex flex-wrap gap-2 mb-6">
              {selectedPokemon.types.map((type) => (
                <span
                  key={type.type.name}
                  className="px-4 py-1 rounded-full bg-white/20 text-white font-medium"
                >
                  {capitalizeFirstLetter(type.type.name)}
                </span>
              ))}
            </div>

            <p className="text-white/90 mb-6">{description.replace(/[\n\f]/g, ' ')}</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <Weight className="mr-2" size={20} />
                <span>{selectedPokemon.weight / 10} kg</span>
              </div>
              <div className="flex items-center">
                <Ruler className="mr-2" size={20} />
                <span>{selectedPokemon.height / 10} m</span>
              </div>
              <div className="flex items-center">
                <Dices className="mr-2" size={20} />
                <span>Abilities: {selectedPokemon.abilities.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-zinc-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">Stats</h2>

          <div className="space-y-4">
            {selectedPokemon.stats.map(stat => {
              const statName = stat.stat.name.replace(/-/g, ' ');
              const percentage = (stat.base_stat / 255) * 100;

              return (
                <div key={stat.stat.name}>
                  <div className="flex justify-between text-white mb-1">
                    <span className="capitalize">{statName}</span>
                    <span>{stat.base_stat}</span>
                  </div>
                  <div className="w-full bg-zinc-700 rounded-full h-2.5">
                    <div
                      className={cn("h-2.5 rounded-full", getColorByType(mainType))}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-zinc-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">Abilities</h2>

          <ul className="space-y-2">
            {selectedPokemon.abilities.map(ability => (
              <li
                key={ability.ability.name}
                className="bg-zinc-700 rounded-lg p-3 text-white"
              >
                <span className="capitalize">{ability.ability.name.replace(/-/g, ' ')}</span>
                {ability.is_hidden && (
                  <span className="ml-2 text-xs px-2 py-0.5 bg-zinc-600 rounded-full">Hidden</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Evolution Chain */}
      {evolutionChain && evolutionChain.chain && (
        <div className="mt-8 bg-zinc-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-6">Evolution Chain</h2>

          <div className="flex flex-wrap justify-center items-center gap-4">
            {/* Too complex to implement fully here, but the basic structure */}
            <div className="text-center">
              <div className="w-24 h-24 mx-auto bg-zinc-700 rounded-full flex items-center justify-center mb-2">
                {/* Image of first evolution */}
              </div>
              <div className="text-white capitalize">{evolutionChain.chain.species.name}</div>
            </div>

            {evolutionChain.chain.evolves_to.map(evo => (
              <React.Fragment key={evo.species.name}>
                <div className="text-white">→</div>
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto bg-zinc-700 rounded-full flex items-center justify-center mb-2">
                    {/* Image of second evolution */}
                  </div>
                  <div className="text-white capitalize">{evo.species.name}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};