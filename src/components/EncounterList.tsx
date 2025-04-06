import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { PokemonEncounter } from '../types/location';
import { capitalizeFirstLetter } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

interface EncounterListProps {
  encounters: PokemonEncounter[];
  locationName: string;
}

export const EncounterList: React.FC<EncounterListProps> = ({ encounters, locationName }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedPokemon, setExpandedPokemon] = useState<string | null>(null);
  const navigate = useNavigate();

  // Filter encounters based on search term
  const filteredEncounters = encounters.filter(encounter =>
    encounter.pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle expanded state for a Pokémon
  const toggleExpand = (pokemonName: string) => {
    if (expandedPokemon === pokemonName) {
      setExpandedPokemon(null);
    } else {
      setExpandedPokemon(pokemonName);
    }
  };

  // Get Pokémon image URL
  const getPokemonImageUrl = (pokemonUrl: string) => {
    const id = pokemonUrl.split('/').filter(Boolean).pop();
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  };

  return (
    <div className="bg-zinc-800 rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">
        Pokémon Encounters in {capitalizeFirstLetter(locationName.replace(/-/g, ' '))}
      </h2>

      {/* Search input */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-zinc-400" />
        </div>
        <input
          type="text"
          placeholder="Search Pokémon..."
          className="w-full bg-zinc-700 border border-zinc-600 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* No results message */}
      {filteredEncounters.length === 0 && (
        <div className="text-center py-8 text-zinc-400">
          No Pokémon found matching "{searchTerm}"
        </div>
      )}

      {/* Encounter list */}
      <div className="space-y-3">
        {filteredEncounters.map((encounter) => (
          <motion.div
            key={encounter.pokemon.name}
            className="bg-zinc-700 rounded-lg overflow-hidden border border-zinc-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Pokémon header */}
            <div
              className="p-4 flex items-center justify-between cursor-pointer"
              onClick={() => toggleExpand(encounter.pokemon.name)}
            >
              <div className="flex items-center">
                <img
                  src={getPokemonImageUrl(encounter.pokemon.url)}
                  alt={encounter.pokemon.name}
                  className="w-12 h-12 mr-4 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
                  }}
                />
                <div>
                  <h3 className="text-white font-medium capitalize">
                    {capitalizeFirstLetter(encounter.pokemon.name.replace(/-/g, ' '))}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {encounter.version_details.length} version{encounter.version_details.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/pokemon/${encounter.pokemon.name}`);
                  }}
                  className="text-blue-400 text-sm mr-4 hover:underline"
                >
                  Details
                </button>
                {expandedPokemon === encounter.pokemon.name ? (
                  <ChevronUp size={20} className="text-zinc-400" />
                ) : (
                  <ChevronDown size={20} className="text-zinc-400" />
                )}
              </div>
            </div>

            {/* Expanded details */}
            <AnimatePresence>
              {expandedPokemon === encounter.pokemon.name && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 pt-0 border-t border-zinc-600">
                    <h4 className="text-sm font-medium text-zinc-300 mb-2">Encounter Details:</h4>

                    <div className="space-y-3">
                      {encounter.version_details.map((versionDetail, index) => (
                        <div key={index} className="bg-zinc-800 p-3 rounded-md">
                          <div className="text-sm text-white mb-2">
                            Version: <span className="text-blue-400 capitalize">{versionDetail.version.name.replace(/-/g, ' ')}</span>
                          </div>

                          {versionDetail.encounter_details.map((detail, detailIndex) => (
                            <div key={detailIndex} className="ml-3 text-xs text-zinc-400 mb-1">
                              <div className="flex flex-wrap gap-x-4 gap-y-1">
                                <span>Level: {detail.min_level}-{detail.max_level}</span>
                                <span>Chance: {detail.chance}%</span>
                                <span className="capitalize">Method: {detail.method.name.replace(/-/g, ' ')}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};