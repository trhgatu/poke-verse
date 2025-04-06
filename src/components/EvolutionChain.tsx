import React, { useState, useEffect, useRef } from 'react';
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

// List of Pokémon that have Mega Evolutions
const POKEMON_WITH_MEGA: Record<string, string[]> = {
  'venusaur': ['venusaur-mega'],
  'charizard': ['charizard-mega-x', 'charizard-mega-y'],
  'blastoise': ['blastoise-mega'],
  'alakazam': ['alakazam-mega'],
  'gengar': ['gengar-mega'],
  'kangaskhan': ['kangaskhan-mega'],
  'pinsir': ['pinsir-mega'],
  'gyarados': ['gyarados-mega'],
  'aerodactyl': ['aerodactyl-mega'],
  'mewtwo': ['mewtwo-mega-x', 'mewtwo-mega-y'],
  'ampharos': ['ampharos-mega'],
  'scizor': ['scizor-mega'],
  'heracross': ['heracross-mega'],
  'houndoom': ['houndoom-mega'],
  'tyranitar': ['tyranitar-mega'],
  'blaziken': ['blaziken-mega'],
  'gardevoir': ['gardevoir-mega'],
  'mawile': ['mawile-mega'],
  'aggron': ['aggron-mega'],
  'medicham': ['medicham-mega'],
  'manectric': ['manectric-mega'],
  'banette': ['banette-mega'],
  'absol': ['absol-mega'],
  'garchomp': ['garchomp-mega'],
  'lucario': ['lucario-mega'],
  'abomasnow': ['abomasnow-mega'],
  'beedrill': ['beedrill-mega'],
  'pidgeot': ['pidgeot-mega'],
  'slowbro': ['slowbro-mega'],
  'steelix': ['steelix-mega'],
  'sceptile': ['sceptile-mega'],
  'swampert': ['swampert-mega'],
  'sableye': ['sableye-mega'],
  'sharpedo': ['sharpedo-mega'],
  'camerupt': ['camerupt-mega'],
  'altaria': ['altaria-mega'],
  'glalie': ['glalie-mega'],
  'salamence': ['salamence-mega'],
  'metagross': ['metagross-mega'],
  'latias': ['latias-mega'],
  'latios': ['latios-mega'],
  'rayquaza': ['rayquaza-mega'],
  'lopunny': ['lopunny-mega'],
  'gallade': ['gallade-mega'],
  'audino': ['audino-mega'],
  'diancie': ['diancie-mega']
};

export const EvolutionChain: React.FC<EvolutionChainProps> = ({ chain }) => {
  const { t } = useLanguage();
  const [evolutionData, setEvolutionData] = useState<PokemonWithEvolution[]>([]);
  const [megaForms, setMegaForms] = useState<PokemonWithEvolution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMegaForms, setShowMegaForms] = useState(false);
  const [lastFinalPokemonId, setLastFinalPokemonId] = useState<number | null>(null);
  const isMountedRef = useRef(true);
  const navigate = useNavigate();

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (isMountedRef.current) {
      setMegaForms([]);
      setShowMegaForms(false);
      setEvolutionData([]);
    }

    return () => {
      if (isMountedRef.current) {
        setMegaForms([]);
        setShowMegaForms(false);
        setEvolutionData([]);
        setIsLoading(true);
      }
    };
  }, [chain]);

  useEffect(() => {
    const fetchEvolutionData = async () => {
      if (isMountedRef.current) setIsLoading(true);
      try {
        const evolutionList: PokemonWithEvolution[] = [];
        const processChain = async (chainLink: ChainLink, previousDetails: EvolutionDetail | null = null) => {
          try {
            const pokemonData = await getPokemonByName(chainLink.species.name);

            const evolutionDetails = previousDetails ? {
              trigger: previousDetails.trigger.name,
              minLevel: previousDetails.min_level,
              item: previousDetails.item?.name,
              happiness: previousDetails.min_happiness,
              otherCondition: getOtherCondition(previousDetails)
            } : undefined;

            evolutionList.push({
              ...pokemonData,
              evolutionDetails
            });

            for (const evolution of chainLink.evolves_to) {
              await processChain(evolution, evolution.evolution_details?.[0] || null);
            }
          } catch (error) {
            console.error(`Error fetching Pokemon ${chainLink.species.name}:`, error);
          }
        };

        if (chain && chain.species && chain.species.name) {
          await processChain(chain);
          if (evolutionList.length > 0 && isMountedRef.current) {
            setEvolutionData(evolutionList);

            const chainKey = evolutionList.map(p => p.name).join('-');
            console.log('Current chain key:', chainKey);

            const finalPokemon = evolutionList[evolutionList.length - 1];

            if (lastFinalPokemonId !== finalPokemon.id && isMountedRef.current) {
              setMegaForms([]);
              setLastFinalPokemonId(finalPokemon.id);
            }

            if (finalPokemon && POKEMON_WITH_MEGA[finalPokemon.name]) {
              try {
                const megaFormNames = POKEMON_WITH_MEGA[finalPokemon.name];
                const megaFormsList: PokemonWithEvolution[] = [];

                for (const megaName of megaFormNames) {
                  try {
                    const megaData = await getPokemonByName(megaName);
                    megaFormsList.push({
                      ...megaData,
                      evolutionDetails: {
                        trigger: 'mega-evolution',
                        otherCondition: 'Mega Stone'
                      }
                    });
                  } catch (megaError) {
                    console.error(`Error fetching Mega Pokemon ${megaName}:`, megaError);
                  }
                }

                if (megaFormsList.length > 0 && isMountedRef.current) {
                  setMegaForms(megaFormsList);
                } else if (isMountedRef.current) {
                  setMegaForms([]);
                }
              } catch (megaSearchError) {
                console.error('Error searching for mega forms:', megaSearchError);
                if (isMountedRef.current) setMegaForms([]);
              }
            } else if (isMountedRef.current) {
              setMegaForms([]);
            }
          } else {
            console.error('No valid Pokémon found in evolution chain');
            if (isMountedRef.current) setMegaForms([]);
          }
        } else {
          console.error('Invalid evolution chain structure:', chain);
          if (isMountedRef.current) setMegaForms([]);
        }
      } catch (error) {
        console.error('Error processing evolution chain:', error);
        if (isMountedRef.current) {
          setEvolutionData([]);
          setMegaForms([]);
        }
      } finally {
        if (isMountedRef.current) setIsLoading(false);
      }
    };

    fetchEvolutionData();
  }, [chain, chain?.species?.name, lastFinalPokemonId]);

  const getOtherCondition = (details: EvolutionDetail): string | null => {
    if (!details) return null;

    if (details.time_of_day) return `During ${details.time_of_day}`;
    if (details.known_move) return `Knows ${details.known_move.name}`;
    if (details.held_item) return `Holding ${details.held_item.name}`;
    if (details.needs_overworld_rain) return 'When raining';
    if (details.trade_species) return `Trade with ${details.trade_species.name}`;
    return null;
  };

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
      case 'mega-evolution':
        return t('evolution.megaEvolution');
      default:
        return capitalizeFirstLetter(trigger.replace('-', ' '));
    }
  };

  const handlePokemonClick = (pokemonName: string) => {
    navigate(`/pokemon/${pokemonName}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4">
          {[...Array(3)].map((_, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <div className="flex flex-col items-center mx-2">
                  <ArrowRight className="text-zinc-500" />
                  <div className="text-xs text-zinc-400 mt-1 text-center max-w-[80px]">
                    <div className="h-3 w-16 bg-zinc-700 rounded-md animate-pulse"></div>
                  </div>
                </div>
              )}

              <div className="bg-zinc-700 p-4 rounded-xl">
                <div className="w-24 h-24 bg-zinc-800 rounded-full p-2 flex items-center justify-center mb-2 relative">
                  <div className="w-16 h-16 bg-zinc-700 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-zinc-600 border-t-red-500 animate-spin"></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="h-5 w-16 bg-zinc-800 rounded-md animate-pulse mx-auto mb-1"></div>
                  <div className="h-3 w-10 bg-zinc-800 rounded-md animate-pulse mx-auto"></div>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4">
        {evolutionData.map((pokemon, index) => (
          <React.Fragment key={pokemon.id}>
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

            <motion.div
              className="bg-zinc-700 p-4 rounded-xl cursor-pointer hover:bg-zinc-600 transition-colors"
              onClick={() => handlePokemonClick(pokemon.name)}
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

      {megaForms.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setShowMegaForms(!showMegaForms)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
            >
              {showMegaForms ? t('evolution.hideMega') : t('evolution.showMega')}
            </button>
          </div>

          {showMegaForms && (
            <div className="flex flex-col items-center mt-4">
              <div className="bg-gradient-to-r from-purple-900/50 to-pink-600/50 p-4 rounded-xl mb-6 w-full text-center">
                <h4 className="text-white font-medium mb-2">{t('evolution.megaEvolution')}</h4>
                <p className="text-zinc-300 text-sm">{t('evolution.megaEvolutionDesc')}</p>
              </div>

              <div className="flex flex-wrap justify-center items-center gap-6">
                {megaForms.map((megaPokemon) => (
                  <motion.div
                    key={megaPokemon.id}
                    className="bg-gradient-to-br from-purple-800 to-zinc-700 p-4 rounded-xl cursor-pointer hover:from-purple-700 hover:to-zinc-600 transition-colors"
                    onClick={() => handlePokemonClick(megaPokemon.name)}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="relative">
                      <div className="w-28 h-28 bg-zinc-800/50 rounded-full p-2 flex items-center justify-center mb-2">
                        <img
                          src={megaPokemon.sprites.other['official-artwork'].front_default || megaPokemon.sprites.front_default}
                          alt={megaPokemon.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        MEGA
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-white capitalize font-medium">
                        {capitalizeFirstLetter(megaPokemon.name.replace(/-mega/g, '').replace(/-x|y/g, ' $&').toUpperCase())}
                      </div>
                      <div className="text-zinc-400 text-xs">#{megaPokemon.id}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};