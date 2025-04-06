import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Map } from 'lucide-react';
import { capitalizeFirstLetter } from '../lib/utils';

interface RegionCardProps {
  name: string;
  mainGeneration: string;
  locationCount: number;
}

export const RegionCard: React.FC<RegionCardProps> = ({ name, mainGeneration, locationCount }) => {
  const navigate = useNavigate();

  // Define background colors based on region
  const getRegionColor = (regionName: string) => {
    const colors: Record<string, string> = {
      kanto: 'bg-red-500',
      johto: 'bg-green-500',
      hoenn: 'bg-blue-500',
      sinnoh: 'bg-purple-500',
      unova: 'bg-yellow-500',
      kalos: 'bg-pink-500',
      alola: 'bg-cyan-500',
      galar: 'bg-indigo-500',
      hisui: 'bg-amber-500',
      paldea: 'bg-emerald-500'
    };

    return colors[regionName] || 'bg-zinc-500';
  };

  return (
    <motion.div
      className={`p-5 rounded-xl shadow-lg ${getRegionColor(name)} hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden`}
      whileHover={{ y: -5 }}
      onClick={() => navigate(`/regions/${name}`)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute top-0 right-0 opacity-10 p-6">
        <Map size={80} />
      </div>

      <div className="text-white">
        <h3 className="text-2xl font-bold mb-1 capitalize">{capitalizeFirstLetter(name)}</h3>
        <div className="flex flex-col gap-1 text-white/80">
          <p>Generation: {mainGeneration.replace('-', ' ').toUpperCase()}</p>
          <p>{locationCount} Locations</p>
        </div>
      </div>

      <div className="mt-4 text-right">
        <span className="bg-white/20 px-3 py-1 rounded-full text-sm text-white backdrop-blur-md">
          Explore Region
        </span>
      </div>
    </motion.div>
  );
};