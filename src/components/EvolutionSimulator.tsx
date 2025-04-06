import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChainLink, Pokemon } from '../types/pokemon';
import { getPokemonByName } from '../services/api';
import { capitalizeFirstLetter, formatPokemonId, getColorByType } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { Zap, RefreshCw, ChevronDown, ChevronRight } from 'lucide-react';

// Interface for evolution method display
interface EvolutionViewerProps {
  evolutionSequence: Pokemon[];
  currentStage: number;
  evolutionInProgress: boolean;
  evolutionMethod: string;
  mainType: string;
  nextType: string;
}

// Interface for control buttons
interface EvolutionControlsProps {
  currentStage: number;
  evolutionSequence: Pokemon[];
  evolutionInProgress: boolean;
  mainType: string;
  triggerEvolution: () => void;
  resetEvolution: () => void;
}

// Main component props
interface EvolutionSimulatorProps {
  chain: ChainLink;
  onComplete?: () => void;
}

// Evolution viewer component - displays the evolution visualization
const EvolutionViewer: React.FC<EvolutionViewerProps> = ({
  evolutionSequence,
  currentStage,
  evolutionInProgress,
  evolutionMethod,
  mainType,
  nextType
}) => {
  const { t } = useLanguage();
  const currentPokemon = evolutionSequence[currentStage];
  const nextPokemon = currentStage < evolutionSequence.length - 1
    ? evolutionSequence[currentStage + 1]
    : null;

  return (
    <div className="relative p-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col md:flex-row items-center justify-between"
        >
          {/* Current Pokémon */}
          <div className="w-full md:w-5/12 flex flex-col items-center mb-8 md:mb-0">
            <div className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center">
              {/* Decorative background */}
              <div className={`absolute inset-0 rounded-full ${getColorByType(mainType)}/20 backdrop-blur-sm`}></div>

              {/* Pokeball background */}
              <div className="absolute inset-0 bg-pokeball-detail bg-no-repeat bg-center bg-contain opacity-30 animate-spin-slow"></div>

              {evolutionInProgress ? (
                <>
                  {/* Evolution effect */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{
                      filter: ["brightness(1)", "brightness(3)", "brightness(1)"],
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                      duration: 3,
                      times: [0, 0.5, 1],
                      ease: "easeInOut"
                    }}
                  >
                    <img
                      src={currentPokemon.sprites.other["official-artwork"].front_default || currentPokemon.sprites.front_default}
                      alt={currentPokemon.name}
                      className="max-w-full max-h-full z-10 transition-all duration-500"
                    />
                  </motion.div>

                  {/* Energy particles */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 3, repeat: 1 }}
                  >
                    {[...Array(15)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-white"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          scale: [0, 1.5, 0],
                          opacity: [0, 0.8, 0],
                          y: [0, -Math.random() * 60],
                          x: [0, (Math.random() - 0.5) * 60]
                        }}
                        transition={{
                          duration: 1.5 + Math.random(),
                          repeat: 2,
                          delay: Math.random() * 1
                        }}
                      />
                    ))}
                  </motion.div>

                  {/* Glow effect */}
                  <motion.div
                    className={`absolute inset-0 rounded-full ${getColorByType(mainType)}/50 backdrop-blur`}
                    animate={{
                      opacity: [0, 0.7, 0],
                      scale: [0.8, 1.5, 2],
                    }}
                    transition={{
                      duration: 3,
                      times: [0, 0.5, 1]
                    }}
                  ></motion.div>
                </>
              ) : (
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                >
                  <img
                    src={currentPokemon.sprites.other["official-artwork"].front_default || currentPokemon.sprites.front_default}
                    alt={currentPokemon.name}
                    className="max-w-full max-h-full drop-shadow-2xl"
                  />
                </motion.div>
              )}
            </div>

            <div className="mt-4 flex flex-col items-center">
              <div className="bg-zinc-800 px-3 py-1 rounded-full text-sm text-zinc-400 mb-2">
                {formatPokemonId(currentPokemon.id)}
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white capitalize mb-1">
                {capitalizeFirstLetter(currentPokemon.name)}
              </h3>
              <div className="flex gap-2 mt-1">
                {currentPokemon.types.map(type => (
                  <span
                    key={type.type.name}
                    className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getColorByType(type.type.name)}`}
                  >
                    {capitalizeFirstLetter(type.type.name)}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Evolution arrow and info - Center column */}
          {nextPokemon && (
            <div className="w-full md:w-2/12 flex flex-col md:flex-row justify-center items-center mb-6 md:mb-0">
              <div className="md:rotate-0 rotate-90 w-12 h-12 md:w-full flex flex-row md:flex-col items-center justify-center">
                {/* Horizontal arrow on mobile, vertical on desktop */}
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-zinc-400 hidden md:block"
                >
                  <ChevronRight size={32} />
                </motion.div>
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-zinc-400 md:hidden"
                >
                  <ChevronDown size={32} />
                </motion.div>

                {/* Evolution method with better position */}
                <div className={`${evolutionMethod.length > 15 ? 'w-[150px]' : 'w-auto'} px-3 py-1.5 bg-zinc-800/80 rounded-lg backdrop-blur-sm text-center mt-3 md:mt-4`}>
                  <span className="text-zinc-300 text-sm whitespace-normal">{evolutionMethod}</span>
                </div>
              </div>
            </div>
          )}

          {/* Next Pokémon in the evolution chain */}
          {nextPokemon && (
            <motion.div
              className="w-full md:w-5/12 flex flex-col items-center"
              initial={{ opacity: 0.6 }}
              animate={{
                opacity: evolutionInProgress ? 1 : 0.6,
                filter: evolutionInProgress ? "grayscale(0)" : "grayscale(0.8)"
              }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center">
                {/* Background for next evolution */}
                <div className={`absolute inset-0 rounded-full ${getColorByType(nextType)}/10 backdrop-blur-sm opacity-60`}></div>

                <motion.div
                  animate={evolutionInProgress ?
                    { scale: [0.8, 1], opacity: [0.5, 1], y: [10, 0] } :
                    { scale: 0.9, opacity: 0.8, y: 0 }
                  }
                  transition={{ duration: 0.8 }}
                >
                  <img
                    src={nextPokemon.sprites.other["official-artwork"].front_default || nextPokemon.sprites.front_default}
                    alt={nextPokemon.name}
                    className="max-w-full max-h-full"
                  />
                </motion.div>
              </div>
              <div className="mt-3 flex flex-col items-center">
                <h3 className="text-lg md:text-xl font-medium text-zinc-400 capitalize">
                  {capitalizeFirstLetter(nextPokemon.name)}
                </h3>
                <div className="mt-1 opacity-80 flex flex-wrap justify-center">
                  {nextPokemon.types.map(type => (
                    <span
                      key={type.type.name}
                      className={`px-2 py-0.5 rounded-full text-xs text-white ${getColorByType(type.type.name)} opacity-70 mx-1 mb-1`}
                    >
                      {capitalizeFirstLetter(type.type.name)}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* If there's no next Pokemon, show a done message */}
          {!nextPokemon && (
            <div className="w-full md:w-7/12 flex flex-col items-center justify-center bg-zinc-800/50 py-8 px-4 rounded-xl border border-zinc-700/50">
              <motion.div
                className="w-16 h-16 mb-4 text-green-500 bg-green-500/10 rounded-full flex items-center justify-center"
                animate={{ scale: 1 }}
                initial={{ scale: 0.8 }}
                transition={{
                  type: "spring",
                  bounce: 0.5,
                  duration: 1
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h3 className="text-lg font-bold text-white mb-2">{t('evolution.fullyEvolved')}</h3>
              <p className="text-zinc-400 text-center text-sm">{t('evolution.fullyEvolvedDesc')}</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Evolution controls component - bottom buttons
const EvolutionControls: React.FC<EvolutionControlsProps> = ({
  currentStage,
  evolutionSequence,
  evolutionInProgress,
  mainType,
  triggerEvolution,
  resetEvolution
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-zinc-900/80 border-t border-zinc-800 p-4 flex justify-center gap-4">
      {currentStage < evolutionSequence.length - 1 ? (
        <motion.button
          onClick={triggerEvolution}
          disabled={evolutionInProgress}
          className={`px-6 py-3 rounded-lg font-bold text-white shadow-lg flex items-center ${
            evolutionInProgress
              ? 'bg-zinc-700 cursor-not-allowed'
              : `${getColorByType(mainType)} hover:scale-105`
          } transition-all duration-300`}
          whileHover={{ scale: evolutionInProgress ? 1 : 1.05 }}
          whileTap={{ scale: evolutionInProgress ? 1 : 0.95 }}
        >
          <Zap className="mr-2" size={18} />
          {evolutionInProgress ? t('evolution.evolving') : t('evolution.button')}
        </motion.button>
      ) : (
        <motion.button
          onClick={resetEvolution}
          className={`px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg flex items-center transition-all duration-300`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className="mr-2" size={18} />
          {t('evolution.restart')}
        </motion.button>
      )}
    </div>
  );
};

// Main Evolution Simulator Component
export const EvolutionSimulator: React.FC<EvolutionSimulatorProps> = ({ chain, onComplete }) => {
  const { t } = useLanguage();
  const [evolutionSequence, setEvolutionSequence] = useState<Pokemon[]>([]);
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [evolutionInProgress, setEvolutionInProgress] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lấy dữ liệu chuỗi tiến hóa
  useEffect(() => {
    const fetchEvolutionData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Xử lý đệ quy chuỗi tiến hóa để tạo mảng phẳng các Pokémon
        const sequence: Pokemon[] = [];
        const processChain = async (chainLink: ChainLink) => {
          try {
            const pokemonData = await getPokemonByName(chainLink.species.name);
            sequence.push(pokemonData);

            // Nếu Pokémon này còn tiến hóa tiếp, xử lý tiếp
            if (chainLink.evolves_to.length > 0) {
              // Chỉ lấy đường tiến hóa đầu tiên để đơn giản hóa demo
              await processChain(chainLink.evolves_to[0]);
            }
          } catch (err) {
            console.error(`Error fetching Pokémon ${chainLink.species.name}:`, err);
            setError(t('ui.loadingError'));
          }
        };

        await processChain(chain);
        setEvolutionSequence(sequence);
      } catch (err) {
        console.error('Error processing evolution chain:', err);
        setError(t('ui.loadingError'));
      } finally {
        setLoading(false);
      }
    };

    fetchEvolutionData();
  }, [chain, t]);

  // Hàm kích hoạt tiến hóa
  const triggerEvolution = () => {
    if (currentStage < evolutionSequence.length - 1 && !evolutionInProgress) {
      setEvolutionInProgress(true);

      // Sau khi hoàn thành hiệu ứng, tăng stage lên
      setTimeout(() => {
        setCurrentStage(prev => prev + 1);
        setEvolutionInProgress(false);

        // Nếu đã tiến hóa đến giai đoạn cuối cùng, gọi callback
        if (currentStage === evolutionSequence.length - 2 && onComplete) {
          onComplete();
        }
      }, 3500); // Thời gian cho hiệu ứng tiến hóa
    }
  };

  // Hàm bắt đầu lại quá trình tiến hóa
  const resetEvolution = () => {
    setCurrentStage(0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12 h-96">
        <div className="relative">
          <div className="w-16 h-16 border-8 border-zinc-700 border-t-red-500 rounded-full animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-pokeball bg-center bg-contain bg-no-repeat"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-zinc-800/80 backdrop-blur-sm rounded-xl border border-red-500/30">
        <div className="text-red-400 mb-4 flex items-center justify-center">
          <svg className="w-8 h-8 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-lg font-medium">{error}</span>
        </div>
        <button
          className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-bold transition-all shadow-lg hover:shadow-red-500/25"
          onClick={() => window.location.reload()}
        >
          {t('ui.tryAgain')}
        </button>
      </div>
    );
  }

  if (evolutionSequence.length < 2) {
    return (
      <div className="text-center p-8 bg-zinc-800/80 backdrop-blur-sm rounded-xl border border-zinc-700">
        <div className="w-20 h-20 mx-auto mb-4 bg-pokeball bg-center bg-contain bg-no-repeat opacity-30"></div>
        <p className="text-xl font-medium text-zinc-300">{t('evolution.noEvolution')}</p>
        <p className="text-zinc-500 mt-2">{t('evolution.noEvolutionDesc')}</p>
      </div>
    );
  }

  const currentPokemon = evolutionSequence[currentStage];
  const mainType = currentPokemon.types[0]?.type.name || 'normal';
  const nextType = currentStage < evolutionSequence.length - 1
    ? evolutionSequence[currentStage + 1].types[0]?.type.name || 'normal'
    : 'normal';

  // Lấy thông tin về phương thức tiến hóa
  const getEvolutionMethod = () => {
    if (currentStage < evolutionSequence.length - 1) {
      const evoDetails = chain.evolves_to[0]?.evolution_details?.[0];
      if (evoDetails) {
        if (evoDetails.min_level) {
          return t('evolution.method.level', { level: evoDetails.min_level });
        } else if (evoDetails.min_happiness) {
          return t('evolution.method.happiness', { value: evoDetails.min_happiness });
        } else if (evoDetails.item) {
          return t('evolution.method.item', { item: evoDetails.item.name });
        } else if (evoDetails.trigger?.name === 'trade') {
          return t('evolution.method.trade');
        }
      }
      return t('evolution.method.default');
    }
    return '';
  };

  const evolutionMethod = getEvolutionMethod();

  return (
    <div className="w-full bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl shadow-xl overflow-hidden border border-zinc-700">
      {/* Header with progress indicator */}
      <div className={`p-4 ${getColorByType(mainType)} border-b border-zinc-700 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-pokeball bg-no-repeat bg-right bg-contain opacity-10"></div>
        <div className="relative z-10 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Zap className="mr-2" size={20} />
            {t('evolution.simulator')}
          </h2>

          <div className="flex items-center bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
            <div className="flex space-x-1">
              {evolutionSequence.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index <= currentStage ? 'bg-white' : 'bg-white/30'
                  }`}
                ></div>
              ))}
            </div>
            <span className="ml-2 text-xs text-white/80">
              {currentStage + 1}/{evolutionSequence.length}
            </span>
          </div>
        </div>
      </div>

      {/* Split components */}
      <EvolutionViewer
        evolutionSequence={evolutionSequence}
        currentStage={currentStage}
        evolutionInProgress={evolutionInProgress}
        evolutionMethod={evolutionMethod}
        mainType={mainType}
        nextType={nextType}
      />

      <EvolutionControls
        currentStage={currentStage}
        evolutionSequence={evolutionSequence}
        evolutionInProgress={evolutionInProgress}
        mainType={mainType}
        triggerEvolution={triggerEvolution}
        resetEvolution={resetEvolution}
      />
    </div>
  );
};