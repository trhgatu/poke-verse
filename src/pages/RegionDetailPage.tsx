import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowLeft, Layers } from 'lucide-react';
import { useLocationStore } from '../store/locationStore';
import { LocationCard } from '../components/LocationCard';
import { capitalizeFirstLetter } from '../lib/utils';

export const RegionDetailPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const { selectedRegion, locationList, fetchRegionByName, fetchLocationsByRegion, isLoading, error } = useLocationStore();

  useEffect(() => {
    if (name) {
      fetchRegionByName(name);
      fetchLocationsByRegion(name);
    }
  }, [name, fetchRegionByName, fetchLocationsByRegion]);

  if (isLoading || !selectedRegion) {
    return (
      <div className="w-full min-h-[calc(100vh-200px)] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-zinc-700 border-t-red-500 rounded-full animate-spin mb-6"></div>
        <p className="text-zinc-400">Loading region details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[calc(100vh-200px)] flex flex-col items-center justify-center">
        <div className="bg-zinc-800 p-8 rounded-xl shadow-lg text-center max-w-md border border-red-500/20">
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Region</h2>
          <p className="text-red-400 mb-6">{error}</p>
          <button
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors mr-3"
            onClick={() => name && fetchRegionByName(name)}
          >
            Try Again
          </button>
          <button
            className="px-4 py-2 bg-zinc-600 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            onClick={() => navigate('/regions')}
          >
            Back to Regions
          </button>
        </div>
      </div>
    );
  }

  const regionName = capitalizeFirstLetter(selectedRegion.name);
  const generationName = selectedRegion.main_generation.name
    .replace('generation-', 'Gen ')
    .toUpperCase();

  return (
    <div className="w-full py-8">
      <button
        className="flex items-center text-zinc-400 hover:text-white mb-6 transition-colors"
        onClick={() => navigate('/regions')}
      >
        <ArrowLeft size={18} className="mr-2" />
        Back to Regions
      </button>

      <div className="bg-zinc-800 rounded-xl p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-5">
          <MapPin size={180} />
        </div>

        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-2">{regionName} Region</h1>
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="bg-red-500 px-3 py-1 text-sm text-white rounded-full">
              {generationName}
            </span>
            <span className="bg-zinc-700 px-3 py-1 text-sm text-white rounded-full flex items-center">
              <Layers size={14} className="mr-1" />
              {selectedRegion.locations.length} Locations
            </span>
          </div>

          <div className="text-zinc-400 max-w-2xl">
            <p>
              The {regionName} region is a land of adventure and discovery.
              Trainers from all over come to explore its varied environments and challenge its Gym Leaders.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Locations in {regionName}</h2>

        {locationList && locationList.results.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.05 }}
          >
            {locationList.results.map((location) => (
              <LocationCard
                key={location.name}
                name={location.name}
                region={selectedRegion.name}
                areaCount={1} // Placeholder until we fetch the actual location details
              />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12 text-zinc-400 bg-zinc-800 rounded-xl">
            No locations found in this region.
          </div>
        )}
      </div>
    </div>
  );
};