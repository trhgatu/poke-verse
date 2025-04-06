import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { getPokemonByName } from '../services/api';
import { Pokemon } from '../types/pokemon';
import { cn, formatPokemonId, capitalizeFirstLetter, getColorByType } from '../lib/utils';
import { usePokemonStore } from '../store/pokemonStore';
import { useLanguage } from '../contexts/LanguageContext';

interface PokemonCardProps {
  name: string;
  url?: string;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ name }) => {
  const { t } = useLanguage();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();
  const { favorites, addToFavorites, removeFromFavorites } = usePokemonStore();

  const fetchPokemonData = async () => {
    try {
      const data = await getPokemonByName(name);
      setPokemon(data);
    } catch (error) {
      console.error('Error fetching Pokemon:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemonData();
  }, [name]);

  if (isLoading || !pokemon) {
    return (
      <div className="relative bg-zinc-800 rounded-2xl p-4 w-full h-[250px] flex items-center justify-center overflow-hidden border border-zinc-700 shadow-lg">
        <div className="absolute inset-0 opacity-20 bg-pokeball bg-no-repeat bg-center"></div>
        <div className="relative z-10 animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  const isFavorite = favorites.includes(pokemon.id);
  const mainType = pokemon.types[0]?.type.name || 'normal';

  const handleCardClick = () => {
    navigate(`/pokemon/${pokemon.name}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFromFavorites(pokemon.id);
    } else {
      addToFavorites(pokemon.id);
    }
  };

  return (
    <motion.div
      className="cursor-pointer h-full"
      whileHover={{
        scale: 1.05,
        y: -5,
      }}
      whileTap={{ scale: 0.95 }}
      onClick={handleCardClick}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative h-full bg-zinc-800 rounded-2xl shadow-lg overflow-hidden border border-zinc-700 transition-all duration-300 hover:shadow-xl hover:border-zinc-600">
        {/* Background gradient based on Pokemon type */}
        <div
          className={cn(
            "absolute top-0 left-0 right-0 h-24 opacity-30 transition-all duration-300",
            getColorByType(mainType)
          )}
        ></div>

        {/* Pokemon ID */}
        <div className="p-4 pt-3 text-sm text-white relative z-10">
          <span className="font-semibold">{formatPokemonId(pokemon.id)}</span>

          {/* Favorite button */}
          <motion.button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 text-white bg-zinc-700 bg-opacity-50 backdrop-blur-sm p-2 rounded-full transition-colors hover:bg-zinc-600 z-20"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0.8 }}
            animate={{
              opacity: isHovering || isFavorite ? 1 : 0.8,
              y: isHovering && !isFavorite ? -3 : 0
            }}
            aria-label={isFavorite ? t('pokemon.removeFromFavorites') : t('pokemon.addToFavorites')}
            title={isFavorite ? t('pokemon.removeFromFavorites') : t('pokemon.addToFavorites')}
          >
            <Heart
              size={18}
              fill={isFavorite ? "#ef4444" : "none"}
              className={isFavorite ? "text-red-500" : "text-white"}
            />
          </motion.button>
        </div>

        {/* Pokemon Image */}
        <div className="pokemon-image-container relative -mt-3 mb-2 z-10 flex items-center justify-center">
          <motion.div
            className="w-28 h-28 mx-auto"
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut"
            }}
          >
            <img
              src={pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default}
              alt={pokemon.name}
              className="w-full h-full object-contain drop-shadow-lg transition-all duration-300"
            />
          </motion.div>
        </div>

        {/* Pokemon Info */}
        <div className="px-4 pb-4 bg-zinc-800 flex flex-col items-center z-10 relative">
          <h2 className="text-lg font-bold text-white capitalize mb-2">
            {capitalizeFirstLetter(pokemon.name)}
          </h2>

          <div className="flex gap-2 mb-2 w-full justify-center">
            {pokemon.types.map((type) => (
              <span
                key={type.type.name}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium text-white",
                  getColorByType(type.type.name)
                )}
              >
                {capitalizeFirstLetter(type.type.name)}
              </span>
            ))}
          </div>

          {/* Stats teaser */}
          <div className="w-full pt-2 border-t border-zinc-700 mt-1 grid grid-cols-3 gap-1 text-center text-xs text-zinc-400">
            <div>
              <div className="text-white font-medium">{pokemon.stats[0].base_stat}</div>
              <div>HP</div>
            </div>
            <div>
              <div className="text-white font-medium">{pokemon.stats[1].base_stat}</div>
              <div>ATK</div>
            </div>
            <div>
              <div className="text-white font-medium">{pokemon.stats[2].base_stat}</div>
              <div>DEF</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};