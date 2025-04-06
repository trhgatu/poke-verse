import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { capitalizeFirstLetter } from '../lib/utils';

interface LocationCardProps {
  name: string;
  region: string;
  areaCount: number;
}

export const LocationCard: React.FC<LocationCardProps> = ({ name, region, areaCount }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="p-4 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 transition-colors duration-300 cursor-pointer"
      whileHover={{ y: -5 }}
      onClick={() => navigate(`/locations/${name}`)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start">
        <div className="bg-zinc-700 p-3 rounded-lg mr-3">
          <MapPin className="text-red-500" size={24} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-1 capitalize">
            {capitalizeFirstLetter(name.replace(/-/g, ' '))}
          </h3>
          <p className="text-sm text-zinc-400 capitalize">
            {capitalizeFirstLetter(region)} Region
          </p>
          <div className="mt-2 flex items-center">
            <span className="text-xs bg-zinc-700 px-2 py-1 rounded text-zinc-300">
              {areaCount} {areaCount === 1 ? 'Area' : 'Areas'}
            </span>
            <span className="ml-auto text-blue-400 text-sm">View Details</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};