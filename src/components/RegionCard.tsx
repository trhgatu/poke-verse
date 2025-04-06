import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Map, MapPin, Globe } from 'lucide-react';
import { capitalizeFirstLetter } from '../lib/utils';
import { regionData } from '../store/locationStore';
import { useLocationStore } from '../store/locationStore';
import { useLanguage } from '../contexts/LanguageContext';

interface RegionCardProps {
  name: string;
}

export const RegionCard: React.FC<RegionCardProps> = ({ name }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { regionDetails } = useLocationStore();

  const region = regionDetails[name];
  const regionInfo = regionData[name] || {
    generation: 0,
    image: '',
    description: '',
    colorClass: 'bg-zinc-500'
  };

  // Format generation as roman numeral for display
  const formatGeneration = (num: number) => {
    const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
    return roman[num - 1] || num.toString();
  };

  const generationDisplay = region?.main_generation?.name
    ? region.main_generation.name.replace('generation-', '').toUpperCase()
    : `Gen ${formatGeneration(regionInfo.generation)}`;

  const locationCount = region?.locations?.length || 0;
  const hasDetails = region !== undefined;

  return (
    <motion.div
      className={`rounded-2xl shadow-xl overflow-hidden transition-all duration-300 cursor-pointer h-full bg-zinc-800`}
      whileHover={{ y: -5 }}
      onClick={() => navigate(`/regions/${name}`)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Top image section */}
      <div className="relative h-44 overflow-hidden">
        {/* Gradient overlay */}
        <div
          className={`absolute inset-0 ${regionInfo.colorClass} mix-blend-multiply opacity-75 z-10`}
        ></div>

        {/* Image */}
        <div className="absolute inset-0 z-0">
          {regionInfo.image ? (
            <img
              src={regionInfo.image}
              alt={`${name} region`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full ${regionInfo.colorClass} opacity-50 flex items-center justify-center`}>
              <Map size={60} className="text-white opacity-25" />
            </div>
          )}
        </div>

        {/* Region Name */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent z-20">
          <div className="flex justify-between items-end">
            <h3 className="text-2xl font-bold text-white capitalize drop-shadow-md">
              {capitalizeFirstLetter(name)}
            </h3>
            <div className="bg-black/40 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-semibold text-white flex items-center">
              <Globe size={12} className="mr-1" />
              {generationDisplay}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom content section */}
      <div className="p-5">
        <p className="text-zinc-300 mb-4 text-sm line-clamp-2">{regionInfo.description}</p>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <div className={`${regionInfo.colorClass} p-2 rounded-lg`}>
              <MapPin size={16} className="text-white" />
            </div>
            <span className="text-zinc-300 text-sm">
              {hasDetails ? (
                <>{locationCount} {t('regions.locations')}</>
              ) : (
                <>{t('regions.loading')}</>
              )}
            </span>
          </div>

          <span className={`${regionInfo.colorClass} px-3 py-1.5 rounded-full text-xs font-medium text-white`}>
            {t('regions.explore')}
          </span>
        </div>
      </div>
    </motion.div>
  );
};