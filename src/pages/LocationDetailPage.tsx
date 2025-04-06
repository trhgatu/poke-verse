import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowLeft, Map, FileText } from 'lucide-react';
import { useLocationStore } from '../store/locationStore';
import { EncounterList } from '../components/EncounterList';
import { LocationArea } from '../types/location';
import { getLocationArea } from '../services/api';
import { capitalizeFirstLetter } from '../lib/utils';

export const LocationDetailPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const { selectedLocation, fetchLocationByName, isLoading, error } = useLocationStore();

  const [selectedArea, setSelectedArea] = useState<LocationArea | null>(null);
  const [isLoadingArea, setIsLoadingArea] = useState(false);
  const [areaError, setAreaError] = useState<string | null>(null);

  useEffect(() => {
    if (name) {
      fetchLocationByName(name);
    }
  }, [name, fetchLocationByName]);

  // Fetch location area data when location changes or when area is selected
  useEffect(() => {
    const loadFirstArea = async () => {
      if (selectedLocation && selectedLocation.areas.length > 0) {
        setIsLoadingArea(true);
        setAreaError(null);
        try {
          const areaData = await getLocationArea(selectedLocation.areas[0].name);
          setSelectedArea(areaData);
        } catch (error) {
          console.error('Error loading area:', error);
          setAreaError('Failed to load area details');
        } finally {
          setIsLoadingArea(false);
        }
      }
    };

    loadFirstArea();
  }, [selectedLocation]);

  const handleAreaSelect = async (areaName: string) => {
    setIsLoadingArea(true);
    setAreaError(null);
    try {
      const areaData = await getLocationArea(areaName);
      setSelectedArea(areaData);
    } catch (error) {
      console.error('Error loading area:', error);
      setAreaError('Failed to load area details');
    } finally {
      setIsLoadingArea(false);
    }
  };

  if (isLoading || !selectedLocation) {
    return (
      <div className="w-full min-h-[calc(100vh-200px)] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-zinc-700 border-t-red-500 rounded-full animate-spin mb-6"></div>
        <p className="text-zinc-400">Loading location details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[calc(100vh-200px)] flex flex-col items-center justify-center">
        <div className="bg-zinc-800 p-8 rounded-xl shadow-lg text-center max-w-md border border-red-500/20">
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Location</h2>
          <p className="text-red-400 mb-6">{error}</p>
          <button
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors mr-3"
            onClick={() => name && fetchLocationByName(name)}
          >
            Try Again
          </button>
          <button
            className="px-4 py-2 bg-zinc-600 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const locationName = capitalizeFirstLetter(selectedLocation.name.replace(/-/g, ' '));
  const regionName = capitalizeFirstLetter(selectedLocation.region.name);

  return (
    <div className="w-full py-8">
      <button
        className="flex items-center text-zinc-400 hover:text-white mb-6 transition-colors"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={18} className="mr-2" />
        Back
      </button>

      <div className="bg-zinc-800 rounded-xl p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-5">
          <MapPin size={180} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center mb-2">
            <h1 className="text-3xl font-bold text-white">{locationName}</h1>
            <span
              className="ml-4 text-zinc-400 text-sm flex items-center cursor-pointer hover:text-red-400 transition-colors"
              onClick={() => navigate(`/regions/${selectedLocation.region.name}`)}
            >
              <Map size={14} className="mr-1" />
              {regionName} Region
            </span>
          </div>

          <div className="flex flex-wrap gap-3 mb-4">
            {selectedLocation.game_indices.map((gameIndex, i) => (
              <span key={i} className="bg-zinc-700 px-3 py-1 text-xs text-white rounded-full">
                {gameIndex.generation.name.replace('generation-', 'Gen ').toUpperCase()}
              </span>
            ))}
          </div>

          <div className="text-zinc-400 max-w-2xl mb-6">
            <p>
              {locationName} is a location in the {regionName} region.
              It features various areas where Pokémon can be encountered.
            </p>
          </div>

          {selectedLocation.areas.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedLocation.areas.map((area) => (
                <button
                  key={area.name}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    selectedArea && area.name === selectedArea.name
                      ? 'bg-red-500 text-white'
                      : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                  }`}
                  onClick={() => handleAreaSelect(area.name)}
                >
                  {capitalizeFirstLetter(area.name.replace(`${selectedLocation.name}-`, '').replace(/-/g, ' '))}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {isLoadingArea && (
        <div className="flex justify-center items-center py-12">
          <div className="w-12 h-12 border-4 border-zinc-700 border-t-red-500 rounded-full animate-spin"></div>
        </div>
      )}

      {areaError && (
        <div className="bg-zinc-800 p-6 rounded-xl text-center border border-red-500/20">
          <p className="text-red-400 mb-4">{areaError}</p>
          <button
            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            onClick={() => selectedArea && handleAreaSelect(selectedArea.name)}
          >
            Try Again
          </button>
        </div>
      )}

      {!isLoadingArea && selectedArea && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {selectedArea.pokemon_encounters.length > 0 ? (
            <EncounterList
              encounters={selectedArea.pokemon_encounters}
              locationName={selectedArea.name}
            />
          ) : (
            <div className="bg-zinc-800 p-8 rounded-xl text-center">
              <FileText size={48} className="mx-auto mb-4 text-zinc-600" />
              <h3 className="text-xl font-bold text-white mb-2">No Encounters Found</h3>
              <p className="text-zinc-400">
                No Pokémon encounters are recorded for this location area.
              </p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};