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
            onClick={handleClearFilters}
          >
            {t('ui.tryAgain')}
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
            {t('home.title')}
          </motion.h1>
          <motion.p
            className="text-zinc-400 text-center md:text-left mt-4 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            {t('home.description')}
          </motion.p>
        </div>
      </motion.div>

      {/* Filters section */}
      <div className="w-full mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>

      {/* Loading indicator when filtering by type or searching */}
      {(selectedType || searchFilter) && isLoading && (
        <div className="flex justify-center my-6">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
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
                <div key={isPokemonInstance(pokemon) ? pokemon.id : pokemon.name} className="h-full">
                  <PokemonCard
                    name={pokemon.name}
                    url={isPokemonResult(pokemon) ? pokemon.url : undefined}
                  />
                </div>
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-zinc-800/30 rounded-2xl border border-zinc-700/30 w-full">
              <div className="text-zinc-400 mb-4">
                {searchFilter
                  ? t('home.noResults')
                  : selectedType
                    ? t('home.noResults')
                    : t('home.noResults')}
              </div>
              <Button
                variant="outline"
                className="bg-zinc-800 text-white border-zinc-700"
                onClick={handleClearFilters}
              >
                {t('home.clearFilters')}
              </Button>
            </div>
          )}

          {/* Pagination */}
          {filteredPokemon.length > 0 && (
            <motion.div
              className="mt-10 flex flex-col sm:flex-row justify-between items-center gap-4 bg-zinc-800/50 p-4 rounded-2xl border border-zinc-700/50 w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-zinc-400">
                {t('home.pagination.page')} {currentPage} {t('home.pagination.of')} {maxPages}
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={18} />
                  {t('home.pagination.prev')}
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700"
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