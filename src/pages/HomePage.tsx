import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PokemonCard } from '../components/PokemonCard';
import { SearchFilter } from '../components/SearchFilter';
import { TypeFilter } from '../components/TypeFilter';
import { Button } from '../components/ui/button';
import { usePokemonStore } from '../store/pokemonStore';
import { Pokemon } from '../types/pokemon';
import { useLanguage } from '../contexts/LanguageContext';

interface PokemonResult {
  name: string;
  url?: string;
}

export const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const {
    pokemonList,
    isLoading,
    error,
    fetchPokemonList,
    fetchAllPokemon,
    searchPokemon,
    searchResults
  } = usePokemonStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [typeFilteredPokemon, setTypeFilteredPokemon] = useState<Pokemon[]>([]);
  const [isFilteringByType, setIsFilteringByType] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const itemsPerPage = 20;

  // Xử lý thay đổi tìm kiếm
  const handleSearchChange = (value: string) => {
    setSearchFilter(value);

    // Nếu giá trị tìm kiếm không trống, thực hiện tìm kiếm
    if (value.trim()) {
      setIsSearching(true);
      // Sử dụng chức năng tìm kiếm mới
      searchPokemon(value);
    } else {
      setIsSearching(false);

      // Nếu đang lọc theo loại, fetch lại dữ liệu theo loại
      if (selectedType) {
        fetchAllPokemon();
      } else {
        // Nếu không, quay lại chế độ phân trang thông thường
        fetchPokemonList(itemsPerPage, (currentPage - 1) * itemsPerPage);
      }
    }
  };

  // Fetch paginated pokemon without type filter
  useEffect(() => {
    if (!selectedType && !isSearching) {
      setIsFilteringByType(false);
      fetchPokemonList(itemsPerPage, (currentPage - 1) * itemsPerPage);
    }
  }, [currentPage, fetchPokemonList, selectedType, isSearching]);

  // Fetch all pokemon when filtering by type
  useEffect(() => {
    if (selectedType && !isSearching) {
      setIsFilteringByType(true);
      const fetchPokemonByType = async () => {
        await fetchAllPokemon();
      };

      fetchPokemonByType();
    }
  }, [selectedType, fetchAllPokemon, isSearching]);

  // Filter by type once we have the complete list
  useEffect(() => {
    if (selectedType && pokemonList?.allPokemon && !isSearching) {
      const filtered = pokemonList.allPokemon.filter(pokemon =>
        pokemon.types.some(type => type.type.name === selectedType)
      );
      setTypeFilteredPokemon(filtered);
      // Reset to page 1 when changing type filter
      setCurrentPage(1);
    }
  }, [selectedType, pokemonList?.allPokemon, isSearching]);

  const handleNextPage = () => {
    if (!isFilteringByType && !isSearching && pokemonList?.next) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (isFilteringByType || isSearching) {
      const displayedPokemon = isSearching ? searchResults : typeFilteredPokemon;
      const maxPage = Math.ceil(displayedPokemon.length / itemsPerPage);
      if (currentPage < maxPage) {
        setCurrentPage(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Get the Pokemon to display based on current state
  const getDisplayedPokemon = (): (Pokemon | PokemonResult)[] => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    if (isSearching) {
      // Nếu đang tìm kiếm, sử dụng kết quả tìm kiếm
      return searchResults.slice(startIndex, endIndex);
    } else if (isFilteringByType) {
      // Nếu đang lọc theo loại, sử dụng danh sách đã lọc
      return typeFilteredPokemon.slice(startIndex, endIndex);
    } else {
      // Ngược lại, sử dụng danh sách phân trang thông thường
      return pokemonList?.results || [];
    }
  };

  const getMaxPages = (): number => {
    if (isSearching) {
      return Math.ceil(searchResults.length / itemsPerPage);
    } else if (isFilteringByType) {
      return Math.ceil(typeFilteredPokemon.length / itemsPerPage);
    } else {
      return Math.ceil((pokemonList?.count || 0) / itemsPerPage);
    }
  };

  const filteredPokemon = getDisplayedPokemon();
  const maxPages = getMaxPages();

  // Lấy tổng số Pokemon phù hợp
  const getTotalMatchingPokemon = (): number => {
    if (isSearching) {
      return searchResults.length;
    } else if (isFilteringByType) {
      return typeFilteredPokemon.length;
    } else {
      return pokemonList?.count || 0;
    }
  };

  // Xử lý xóa bộ lọc
  const handleClearFilters = () => {
    setSearchFilter('');
    setSelectedType(null);
    setIsSearching(false);
    setIsFilteringByType(false);
    setCurrentPage(1);
    fetchPokemonList(itemsPerPage, 0);
  };

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
      <div className="w-full min-h-[calc(100vh-200px)] flex flex-col items-center justify-center">
        <div className="relative mb-8">
          <div className="w-28 h-28 rounded-full border-8 border-zinc-700/40 border-t-red-500 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 bg-pokeball bg-center bg-contain bg-no-repeat animate-pulse"></div>
          </div>
        </div>
        <p className="text-lg text-zinc-400 font-medium">{t('ui.loadingPokemon')}</p>
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
          className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-8 rounded-2xl shadow-xl max-w-md mx-auto text-center border border-red-500/20"
        >
          <div className="w-16 h-16 mx-auto mb-6 bg-red-500/10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">{t('ui.loadingPokemonError')}</h2>
          <p className="text-red-400 mb-6">{error}</p>
          <Button
            variant="pokemon"
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-none px-6 py-3"
            onClick={handleClearFilters}
          >
            {t('ui.tryAgain')}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero section */}
      <motion.div
        className="mb-12 relative overflow-hidden rounded-3xl shadow-2xl border border-zinc-700 w-full"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black"></div>
        <div className="absolute inset-0 bg-pokeball bg-no-repeat bg-right opacity-10 scale-150 transform translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>

        {/* Animated decoration */}
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-gradient-to-br from-red-500/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-teal-500/20 rounded-full blur-3xl"></div>

        {/* Content */}
        <div className="relative z-10 w-full py-16 px-8 md:px-12">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="flex flex-col items-center md:items-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              <div className="inline-block mb-2 px-4 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                PokeVerse Pokédex
              </div>
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400 text-center md:text-left mb-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {t('home.title')}
              </motion.h1>
              <motion.div
                className="w-32 h-1 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full my-4 hidden md:block"
                initial={{ width: 0 }}
                animate={{ width: 128 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              />
              <motion.p
                className="text-zinc-300 text-center md:text-left text-lg max-w-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.7 }}
              >
                {t('home.description')}
              </motion.p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Filters section */}
      <motion.div
        className="w-full mb-10 grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Search filter */}
        <div className="w-full">
          <SearchFilter
            value={searchFilter}
            onChange={handleSearchChange}
            placeholder={t('home.search.placeholder')}
            resultsCount={getTotalMatchingPokemon()}
          />
        </div>

        {/* Type filter */}
        <div className="w-full">
          <TypeFilter
            selectedType={selectedType}
            onChange={setSelectedType}
            disabled={isSearching}
          />
        </div>
      </motion.div>
      {(selectedType || searchFilter) && isLoading && (
        <motion.div
          className="flex justify-center my-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-zinc-700/30 border-t-red-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-pokeball bg-center bg-contain bg-no-repeat"></div>
            </div>
          </div>
        </motion.div>
      )}

      {pokemonList && (
        <>
          {filteredPokemon.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8 w-full"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {filteredPokemon.map((pokemon) => (
                <div key={isPokemonInstance(pokemon) ? pokemon.id : pokemon.name} className="h-full transform transition duration-300 hover:translate-y-[-8px]">
                  <PokemonCard
                    name={pokemon.name}
                    url={isPokemonResult(pokemon) ? pokemon.url : undefined}
                  />
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-zinc-800/40 to-zinc-900/40 backdrop-blur-sm rounded-2xl border border-zinc-700/30 w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-24 h-24 mb-6 opacity-30 bg-pokeball bg-center bg-contain bg-no-repeat"></div>
              <div className="text-zinc-300 text-lg mb-4 font-medium">
                {searchFilter
                  ? t('home.noResults')
                  : selectedType
                    ? t('home.noResults')
                    : t('home.noResults')}
              </div>
              <Button
                variant="outline"
                className="bg-zinc-800/80 backdrop-blur-sm hover:bg-zinc-700 text-white border-zinc-700 px-6 py-2.5"
                onClick={handleClearFilters}
              >
                {t('home.clearFilters')}
              </Button>
            </motion.div>
          )}

          {/* Pagination */}
          {filteredPokemon.length > 0 && (
            <motion.div
              className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gradient-to-r from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm p-4 md:p-5 rounded-2xl border border-zinc-700/50 w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-zinc-300 font-medium">
                <span className="px-3 py-1 bg-zinc-800 rounded-lg inline-block">
                  {t('home.pagination.page')} {currentPage} {t('home.pagination.of')} {maxPages}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700 hover:border-zinc-600 shadow-sm"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={18} />
                  {t('home.pagination.prev')}
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700 hover:border-zinc-600 shadow-sm"
                  onClick={handleNextPage}
                  disabled={isFilteringByType || isSearching
                    ? currentPage >= maxPages
                    : !pokemonList.next
                  }
                >
                  {t('home.pagination.next')}
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

// Type guards
function isPokemonInstance(pokemon: Pokemon | PokemonResult): pokemon is Pokemon {
  return 'id' in pokemon;
}

function isPokemonResult(pokemon: Pokemon | PokemonResult): pokemon is PokemonResult {
  return 'url' in pokemon;
}