import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Map, Globe } from 'lucide-react';
import { useLocationStore } from '../store/locationStore';
import { RegionCard } from '../components/RegionCard';
import { useLanguage } from '../contexts/LanguageContext';

export const RegionsPage: React.FC = () => {
  const { regionList, fetchRegions, isLoading, error } = useLocationStore();
  const { t } = useLanguage();

  useEffect(() => {
    fetchRegions();
  }, [fetchRegions]);

  // Loading state with skeleton cards
  if (isLoading && !regionList) {
    return (
      <div className="w-full py-8">
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div>
            <div className="h-10 w-64 bg-zinc-800 rounded-lg mb-2 animate-pulse"></div>
            <div className="h-6 w-96 bg-zinc-800 rounded-lg animate-pulse"></div>
          </div>
          <div className="bg-zinc-800 p-3 rounded-full animate-pulse">
            <Map className="text-zinc-700" size={24} />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-zinc-800 h-80 rounded-2xl animate-pulse">
              <div className="h-44 bg-zinc-700 rounded-t-2xl"></div>
              <div className="p-5">
                <div className="h-4 w-full bg-zinc-700 rounded mb-4"></div>
                <div className="h-4 w-3/4 bg-zinc-700 rounded mb-6"></div>
                <div className="flex justify-between">
                  <div className="h-8 w-24 bg-zinc-700 rounded"></div>
                  <div className="h-8 w-20 bg-zinc-700 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[calc(100vh-200px)] flex flex-col items-center justify-center">
        <div className="bg-zinc-800 p-8 rounded-xl shadow-lg text-center max-w-md border border-red-500/20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">{t('regions.loadingError')}</h2>
          <p className="text-red-400 mb-6">{error}</p>
          <motion.button
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fetchRegions()}
          >
            {t('ui.tryAgain')}
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      {/* Hero section */}
      <motion.div
        className="relative rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 mb-10 overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-pokeball-pattern opacity-10"></div>
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 backdrop-blur-xl rounded-full"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="text-white" size={24} />
            <h1 className="text-3xl font-bold text-white">{t('regions.title')}</h1>
          </div>
          <p className="text-white/80 text-lg">
            {t('regions.description')}
          </p>
          <div className="flex items-center mt-6">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
              <span className="text-white/90 text-sm">{regionList?.count || 0} {t('regions.knownRegions')}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {regionList && regionList.results.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {regionList.results.map((region) => (
            <RegionCard
              key={region.name}
              name={region.name}
            />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-700/50 mb-4">
            <Map className="text-zinc-500" size={24} />
          </div>
          <h3 className="text-xl font-medium text-zinc-400 mb-2">{t('regions.noRegions')}</h3>
          <p className="text-zinc-500 max-w-md mx-auto">{t('regions.noRegionsDescription')}</p>
        </div>
      )}
    </div>
  );
};