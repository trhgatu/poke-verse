import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PokemonCard } from '../components/PokemonCard';
import { SearchFilter } from '../components/SearchFilter';
import { Button } from '../components/ui/button';
import { usePokemonStore } from '../store/pokemonStore';

export const HomePageNew: React.FC = () => {
  const { pokemonList, isLoading, error, fetchPokemonList } = usePokemonStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFilter, setSearchFilter] = useState('');
  const itemsPerPage = 20;

  useEffect(() => {
    fetchPokemonList(itemsPerPage, (currentPage - 1) * itemsPerPage);
  }, [currentPage, fetchPokemonList]);

  const handleNextPage = () => {
    if (pokemonList?.next) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const filteredPokemon = pokemonList?.results.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchFilter.toLowerCase())
  ) || [];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  if (isLoading && !pokemonList) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center w-full">
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
      <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center w-full">
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
            onClick={() => fetchPokemonList(itemsPerPage, (currentPage - 1) * itemsPerPage)}
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full py-6">
      {/* Hero section */}
      <motion.div
        className="mb-10 relative overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl p-8 shadow-lg border border-zinc-700 w-full"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-pokeball bg-no-repeat bg-right-top opacity-5 scale-150"></div>
        <div className="relative z-10 w-full">
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 text-center md:text-left"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Explore the World of Pokémon
          </motion.h1>
          <motion.p
            className="text-zinc-400 text-center md:text-left mt-4 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            Discover and learn about all Pokémon in the Pokédex. Click on any Pokémon to see detailed stats, evolutions, and more!
          </motion.p>
        </div>
      </motion.div>

      {/* Search section */}
      {pokemonList && (
        <div className="mb-8 max-w-md mx-auto">
          <SearchFilter
            value={searchFilter}
            onChange={setSearchFilter}
            placeholder="Filter Pokémon by name..."
            resultsCount={filteredPokemon.length}
          />
        </div>
      )}

      {/* Pokemon grid */}
      {pokemonList && (
        <>
          {filteredPokemon.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {filteredPokemon.map((pokemon) => (
                <div key={pokemon.name} className="h-full">
                  <PokemonCard name={pokemon.name} url={pokemon.url} />
                </div>
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-zinc-800/30 rounded-2xl border border-zinc-700/30 w-full">
              <div className="text-zinc-400 mb-4">No Pokémon found matching "{searchFilter}"</div>
              <Button
                variant="outline"
                className="bg-zinc-800 text-white border-zinc-700"
                onClick={() => setSearchFilter('')}
              >
                Clear filter
              </Button>
            </div>
          )}

          {/* Pagination */}
          {filteredPokemon.length > 0 && searchFilter === '' && (
            <motion.div
              className="mt-10 flex flex-col sm:flex-row justify-between items-center gap-4 bg-zinc-800/50 p-4 rounded-2xl border border-zinc-700/50 w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-zinc-400">
                Page {currentPage} of {Math.ceil((pokemonList.count || 0) / itemsPerPage)}
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={18} />
                  Previous
                </Button>

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
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};