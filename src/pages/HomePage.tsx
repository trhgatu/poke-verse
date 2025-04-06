import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PokemonCard } from '../components/PokemonCard';
import { Button } from '../components/ui/button';
import { usePokemonStore } from '../store/pokemonStore';

export const HomePage: React.FC = () => {
  const { pokemonList, isLoading, error, fetchPokemonList } = usePokemonStore();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchPokemonList(itemsPerPage, (currentPage - 1) * itemsPerPage);
  }, [currentPage, fetchPokemonList]);

  const handleNextPage = () => {
    if (pokemonList?.next) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

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

  if (isLoading && !pokemonList) {
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
        <Button
          variant="pokemon"
          className="mt-4"
          onClick={() => fetchPokemonList(itemsPerPage, (currentPage - 1) * itemsPerPage)}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="mb-8">
        <motion.h1
          className="text-4xl font-bold text-white text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Explore Pokémon
        </motion.h1>
        <motion.p
          className="text-zinc-400 text-center mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Discover and learn about all Pokémon in the Pokédex
        </motion.p>
      </div>

      {pokemonList && (
        <>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {pokemonList.results.map((pokemon) => (
              <motion.div key={pokemon.name} variants={item}>
                <PokemonCard name={pokemon.name} url={pokemon.url} />
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-8 flex justify-center gap-4">
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={18} />
              Previous
            </Button>
            <span className="flex items-center text-white">Page {currentPage}</span>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700"
              onClick={handleNextPage}
              disabled={!pokemonList.next}
            >
              Next
              <ChevronRight size={18} />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};