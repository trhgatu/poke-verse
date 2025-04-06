import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Map } from 'lucide-react';
import { useLocationStore } from '../store/locationStore';
import { RegionCard } from '../components/RegionCard';

export const RegionsPage: React.FC = () => {
  const { regionList, fetchRegions, isLoading, error } = useLocationStore();

  useEffect(() => {
    fetchRegions();
  }, [fetchRegions]);

  if (isLoading) {
    return (
      <div className="w-full min-h-[calc(100vh-200px)] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-zinc-700 border-t-red-500 rounded-full animate-spin mb-6"></div>
        <p className="text-zinc-400">Loading regions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[calc(100vh-200px)] flex flex-col items-center justify-center">
        <div className="bg-zinc-800 p-8 rounded-xl shadow-lg text-center max-w-md border border-red-500/20">
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Regions</h2>
          <p className="text-red-400 mb-6">{error}</p>
          <button
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            onClick={() => fetchRegions()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Pokémon Regions</h1>
          <p className="text-zinc-400">Explore the various regions in the Pokémon world</p>
        </div>
        <div className="bg-zinc-800 p-3 rounded-full">
          <Map className="text-red-500" size={24} />
        </div>
      </div>

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
              // These are placeholder values until we fetch the actual region details
              mainGeneration="generation-i"
              locationCount={10}
            />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12 text-zinc-400">
          No regions found. Please try again later.
        </div>
      )}
    </div>
  );
};