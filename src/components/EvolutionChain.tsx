import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ChainLink, Pokemon, EvolutionDetail } from '../types/pokemon';
import { capitalizeFirstLetter } from '../lib/utils';
import { getPokemonByName } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

interface EvolutionChainProps {
  chain: ChainLink;
}

interface PokemonWithEvolution extends Pokemon {
  evolutionDetails?: {
    trigger: string;
    minLevel?: number | null;
    item?: string | null;
    happiness?: number | null;
    otherCondition?: string | null;
  };
}

export const EvolutionChain: React.FC<EvolutionChainProps> = ({ chain }) => {
  const { t } = useLanguage();
  const [evolutionData, setEvolutionData] = useState<PokemonWithEvolution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvolutionData = async () => {
      setIsLoading(true);
      try {
        // Process the chain recursively to build a flat list of all evolutions
        const evolutionList: PokemonWithEvolution[] = [];
        const processChain = async (chainLink: ChainLink, previousDetails: EvolutionDetail | null = null) => {
          // Fetch the Pokemon data for this link
          try {
            const pokemonData = await getPokemonByName(chainLink.species.name);

            // Add evolution details if this isn't the base form
            const evolutionDetails = previousDetails ? {
              trigger: previousDetails.trigger.name,
              minLevel: previousDetails.min_level,
              item: previousDetails.item?.name,
              happiness: previousDetails.min_happiness,
              otherCondition: getOtherCondition(previousDetails)
            } : undefined;

            // Add to our evolution list
            evolutionList.push({
              ...pokemonData,
              evolutionDetails
            });

            // Process each evolution of this Pokemon
            for (const evolution of chainLink.evolves_to) {
              await processChain(evolution, evolution.evolution_details?.[0] || null);
            }
          } catch (error) {
            console.error(`Error fetching Pokemon ${chainLink.species.name}:`, error);
          }
        };

        await processChain(chain);
        setEvolutionData(evolutionList);
      } catch (error) {
        console.error('Error processing evolution chain:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvolutionData();
  }, [chain]);

  // Helper function to extract other evolution conditions
  const getOtherCondition = (details: EvolutionDetail): string | null => {
    if (!details) return null;

    if (details.time_of_day) return `During ${details.time_of_day}`;
    if (details.known_move) return `Knows ${details.known_move.name}`;
    if (details.held_item) return `Holding ${details.held_item.name}`;
    if (details.needs_overworld_rain) return 'When raining';
    if (details.trade_species) return `Trade with ${details.trade_species.name}`;
    return null;
  };

  // Helper to format the evolution requirements for display
  const getEvolutionRequirement = (evolution: PokemonWithEvolution) => {
    if (!evolution.evolutionDetails) return null;

    const { trigger, minLevel, item, happiness, otherCondition } = evolution.evolutionDetails;

    switch (trigger) {
      case 'level-up':
        if (minLevel) return t('evolution.method.level', { level: minLevel });
        if (happiness) return t('evolution.method.happiness', { value: happiness });
        return otherCondition || t('evolution.method.default');
      case 'use-item':
        return item ? t('evolution.method.item', { item }) : t('evolution.method.default');
      case 'trade':
        return item ? `Trade with ${item}` : t('evolution.method.trade');
      default:
        return capitalizeFirstLetter(trigger.replace('-', ' '));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="w-8 h-8 border-4 border-zinc-700 border-t-red-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4">
        {evolutionData.map((pokemon, index) => (
          <React.Fragment key={pokemon.id}>
            {/* Add arrow between evolution stages */}
            {index > 0 && (
              <div className="flex flex-col items-center mx-2">
                <ArrowRight className="text-zinc-500" />
                {pokemon.evolutionDetails && (
                  <span className="text-xs text-zinc-400 mt-1 text-center max-w-[80px]">
                    {getEvolutionRequirement(pokemon)}
                  </span>
                )}
              </div>
            )}

            {/* Pokemon card */}
            <motion.div
              className="bg-zinc-700 p-4 rounded-xl cursor-pointer hover:bg-zinc-600 transition-colors"
              onClick={() => navigate(`/pokemon/${pokemon.name}`)}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="w-24 h-24 bg-zinc-800 rounded-full p-2 flex items-center justify-center mb-2">
                <img
                  src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                  alt={pokemon.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-center">
                <div className="text-white capitalize font-medium">
                  {capitalizeFirstLetter(pokemon.name)}
                </div>
                <div className="text-zinc-400 text-xs">#{pokemon.id}</div>
              </div>
            </motion.div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};