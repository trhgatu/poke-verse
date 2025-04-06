import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getPokemonById } from '../services/api';
import { Pokemon } from '../types/pokemon';
import { usePokemonStore } from '../store/pokemonStore';
import { PokemonCard } from '../components/PokemonCard';

export const FavoritesPage: React.FC = () => {
  const { favorites } = usePokemonStore();
  const [favoritePokemon, setFavoritePokemon] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
      try {
        const promises = favorites.map(id => getPokemonById(id));
        const results = await Promise.all(promises);
        setFavoritePokemon(results);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [favorites]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (isLoading && favorites.length > 0) {
    return (
      <div className="w-full min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="w-full py-4">
      <div className="w-full mb-8">
        <motion.h1
          className="text-4xl font-bold text-white text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Your Favorite Pokémon
        </motion.h1>
        <motion.p
          className="text-zinc-400 text-center mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Manage your collection of favorite Pokémon
        </motion.p>
      </div>

      {favoritePokemon.length > 0 ? (
        <motion.div
          className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {favoritePokemon.map((pokemon) => (
            <motion.div key={pokemon.id} variants={item}>
              <PokemonCard name={pokemon.name} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="w-full min-h-[calc(100vh-350px)] flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-white mb-4">No Favorites Yet</h2>
          <p className="text-zinc-400 text-center max-w-md mb-6">
            Explore Pokémon and click the heart icon to add them to your favorites.
          </p>
        </div>
      )}
    </div>
  );
};