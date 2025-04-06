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
      <div className="relative bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-2xl p-4 w-full h-[280px] flex flex-col items-center justify-between overflow-hidden border border-zinc-700 shadow-lg">
        {/* Pokemon card skeleton with Pokemon theme */}
        <div className="absolute inset-0 bg-pokeball opacity-10 bg-no-repeat bg-center bg-contain"></div>

        {/* Top section with ID and type */}
        <div className="w-full flex justify-between items-center relative z-10 mb-2">
          <div className="h-5 w-16 bg-zinc-700 rounded-full animate-pulse"></div>
          <div className="h-9 w-9 rounded-full bg-zinc-700 animate-pulse"></div>
        </div>

        {/* Pokemon image skeleton */}
        <div className="flex-1 relative w-full flex items-center justify-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-zinc-700/50 backdrop-blur-sm animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full border-4 border-zinc-600 border-t-red-500 animate-spin"></div>
            </div>
          </div>
        </div>

        {/* Bottom info section */}
        <div className="w-full">
          {/* Pokemon name */}
          <div className="h-6 w-3/4 bg-zinc-700 rounded-full mx-auto mb-3 animate-pulse"></div>

          {/* Pokemon types */}
          <div className="flex justify-center gap-2 mb-3">
            <div className="h-5 w-16 bg-zinc-700 rounded-full animate-pulse"></div>
            <div className="h-5 w-16 bg-zinc-700 rounded-full animate-pulse"></div>
          </div>

          {/* Stats section */}
          <div className="pt-2 border-t border-zinc-700/50 grid grid-cols-3 gap-1 text-center">
            <div className="flex flex-col items-center">
              <div className="h-4 w-8 bg-zinc-700 rounded-full animate-pulse mb-1"></div>
              <div className="h-3 w-6 bg-zinc-700 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-4 w-8 bg-zinc-700 rounded-full animate-pulse mb-1"></div>
              <div className="h-3 w-6 bg-zinc-700 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-4 w-8 bg-zinc-700 rounded-full animate-pulse mb-1"></div>
              <div className="h-3 w-6 bg-zinc-700 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isFavorite = favorites.includes(pokemon.id);
  const mainType = pokemon.types[0]?.type.name || 'normal';
  const secondaryType = pokemon.types[1]?.type.name;

  const handleCardClick = () => {
    navigate(`/pokemon/${pokemon.name}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        y: -8,
        rotateZ: 1,
      }}
      whileTap={{ scale: 0.95 }}
      onClick={handleCardClick}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative h-full bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-zinc-700 transition-all duration-300 hover:shadow-xl hover:border-zinc-500 hover:border-opacity-50">
        {/* Decorative Pokeball design in background */}
        <div className="absolute top-2 right-2 w-24 h-24 bg-pokeball opacity-5 bg-no-repeat bg-center bg-contain z-0"></div>

        {/* Background gradient based on Pokemon type */}
        <div
          className={cn(
            "absolute top-0 left-0 right-0 h-32 opacity-40 transition-all duration-300",
            getColorByType(mainType)
          )}
        ></div>

        {/* Secondary type accent (if exists) */}
        {secondaryType && (
          <div
            className={cn(
              "absolute top-0 right-0 w-1/3 h-32 opacity-30 transition-all duration-300",
              getColorByType(secondaryType)
            )}
          ></div>
        )}

        {/* Pokeball pattern divider */}
        <div className="absolute left-0 right-0 top-28 h-6 flex items-center justify-center z-10">
          <div className="w-16 h-1 bg-zinc-600 rounded-full"></div>
        </div>

        {/* Pokemon ID */}
        <div className="p-4 pt-3 text-sm text-white relative z-10">
          <span className={cn(
            "font-bold px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm",
            getColorByType(mainType)
          )}>
            {formatPokemonId(pokemon.id)}
          </span>

          {/* Favorite button with improved animation */}
          <motion.button
            onClick={handleFavoriteClick}
            className={cn(
              "absolute top-3 right-3 text-white p-2.5 rounded-full z-20 shadow-lg",
              isFavorite
                ? "bg-red-500/80 backdrop-blur-sm"
                : "bg-zinc-700/70 backdrop-blur-sm hover:bg-zinc-600"
            )}
            whileHover={{ scale: 1.2, rotate: isFavorite ? [0, 15, -15, 0] : 0 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0.8 }}
            animate={{
              opacity: isHovering || isFavorite ? 1 : 0.8,
              y: isHovering && !isFavorite ? -3 : 0,
              scale: isFavorite ? [1, 1.2, 1] : 1,
              transition: {
                scale: isFavorite ? {
                  repeat: 1,
                  repeatType: "reverse",
                  duration: 0.3
                } : {}
              }
            }}
            aria-label={isFavorite ? t('pokemon.removeFromFavorites') : t('pokemon.addToFavorites')}
            title={isFavorite ? t('pokemon.removeFromFavorites') : t('pokemon.addToFavorites')}
          >
            <Heart
              size={18}
              fill={isFavorite ? "#ffffff" : "none"}
              className={isFavorite ? "text-white" : "text-white"}
            />
          </motion.button>
        </div>

        {/* Pokemon Image with enhanced effects */}
        <div className="pokemon-image-container relative -mt-2 mb-2 z-10 flex items-center justify-center">
          <motion.div
            className="relative w-36 h-36 mx-auto"
            animate={{
              y: [0, -6, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut"
            }}
          >
            {/* Glow effect matching type color */}
            <div className={cn(
              "absolute -inset-1 rounded-full filter blur-xl opacity-30",
              getColorByType(mainType)
            )}></div>

            {/* Subtle shadow under Pokemon */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-3 bg-black/20 rounded-full filter blur-md"></div>

            <img
              src={pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default}
              alt={pokemon.name}
              className="w-full h-full object-contain drop-shadow-xl transition-all duration-300"
            />
          </motion.div>
        </div>

        {/* Pokemon Info */}
        <div className="px-4 pb-4 flex flex-col items-center z-10 relative">
          <h2 className="text-xl font-extrabold text-white capitalize mb-2 drop-shadow-md text-center">
            {capitalizeFirstLetter(pokemon.name)}
          </h2>

          <div className="flex gap-2 mb-3 w-full justify-center">
            {pokemon.types.map((type) => (
              <span
                key={type.type.name}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg",
                  getColorByType(type.type.name)
                )}
              >
                {capitalizeFirstLetter(type.type.name)}
              </span>
            ))}
          </div>

          {/* Stats teaser with improved styling */}
          <div className="w-full pt-3 border-t border-zinc-700/50 mt-1 grid grid-cols-3 gap-2 text-center">
            <div className="bg-zinc-800/80 rounded-lg p-1.5">
              <div className={cn(
                "text-white font-bold text-sm",
                Number(pokemon.stats[0].base_stat) > 80 ? "text-green-400" : "text-white"
              )}>
                {pokemon.stats[0].base_stat}
              </div>
              <div className="text-xs text-zinc-400 font-medium">HP</div>
            </div>
            <div className="bg-zinc-800/80 rounded-lg p-1.5">
              <div className={cn(
                "text-white font-bold text-sm",
                Number(pokemon.stats[1].base_stat) > 80 ? "text-green-400" : "text-white"
              )}>
                {pokemon.stats[1].base_stat}
              </div>
              <div className="text-xs text-zinc-400 font-medium">ATK</div>
            </div>
            <div className="bg-zinc-800/80 rounded-lg p-1.5">
              <div className={cn(
                "text-white font-bold text-sm",
                Number(pokemon.stats[2].base_stat) > 80 ? "text-green-400" : "text-white"
              )}>
                {pokemon.stats[2].base_stat}
              </div>
              <div className="text-xs text-zinc-400 font-medium">DEF</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};