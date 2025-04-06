import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChainLink, Pokemon } from '../types/pokemon';
import { getPokemonByName } from '../services/api';
import { capitalizeFirstLetter, formatPokemonId, getColorByType } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { Zap, RefreshCw, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';

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
  evolutionSequence: Pokemon[];
  currentStage: number;
  handleEvolve: () => void;
  handleReset: () => void;
  canEvolve: boolean;
  isLoading: boolean;
  mainType: string;
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
    <div className="relative p-3 sm:p-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col md:flex-row items-center justify-between"
        >
          {/* Current Pokémon */}
          <div className="w-full md:w-5/12 flex flex-col items-center mb-6 md:mb-0">
            <div className="relative w-32 h-32 sm:w-48 sm:h-48 md:w-56 md:h-56 flex items-center justify-center">
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

                  {/* Energy particles and effects - simplified on mobile */}
                  <div className="hidden sm:block">
                    <motion.div
                      className="absolute inset-0"
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 3, repeat: 1 }}
                    >
                      {[...Array(10)].map((_, i) => (
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
                            y: [0, -Math.random() * 40],
                            x: [0, (Math.random() - 0.5) * 40]
                          }}
                          transition={{
                            duration: 1.5 + Math.random(),
                            repeat: 2,
                            delay: Math.random() * 1
                          }}
                        />
                      ))}
                    </motion.div>
                  </div>

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
                  animate={{ y: [0, -5, 0] }}
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

            <div className="mt-3 sm:mt-4 flex flex-col items-center">
              <div className="bg-zinc-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-zinc-400 mb-1 sm:mb-2">
                {formatPokemonId(currentPokemon.id)}
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white capitalize mb-1">
                {capitalizeFirstLetter(currentPokemon.name)}
              </h3>
              <div className="flex gap-1 sm:gap-2 mt-1">
                {currentPokemon.types.map(type => (
                  <span
                    key={type.type.name}
                    className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold text-white ${getColorByType(type.type.name)}`}
                  >
                    {capitalizeFirstLetter(type.type.name)}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Evolution arrow and info - Center column */}
          {nextPokemon && (
            <div className="w-full md:w-2/12 flex flex-col md:flex-row justify-center items-center mb-4 md:mb-0">
              <div className="md:rotate-0 rotate-90 w-12 h-12 md:w-full flex flex-row md:flex-col items-center justify-center">
                {/* Horizontal arrow on mobile, vertical on desktop */}
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-zinc-400 hidden md:block"
                >
                  <ChevronRight size={28} />
                </motion.div>
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-zinc-400 md:hidden"
                >
                  <ChevronDown size={24} />
                </motion.div>

                {/* Evolution method with better position */}
                <div className={`${evolutionMethod.length > 15 ? 'w-[150px]' : 'w-auto'} px-2 sm:px-3 py-1 sm:py-1.5 bg-zinc-800/80 rounded-lg backdrop-blur-sm text-center mt-2 sm:mt-3 md:mt-4`}>
                  <span className="text-zinc-300 text-xs sm:text-sm whitespace-normal">{evolutionMethod}</span>
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
              <div className="relative w-28 h-28 sm:w-40 sm:h-40 md:w-48 md:h-48 flex items-center justify-center">
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
              <div className="mt-2 sm:mt-3 flex flex-col items-center">
                <h3 className="text-base sm:text-lg md:text-xl font-medium text-zinc-400 capitalize">
                  {capitalizeFirstLetter(nextPokemon.name)}
                </h3>
                <div className="mt-1 opacity-80 flex flex-wrap justify-center gap-1">
                  {nextPokemon.types.map(type => (
                    <span
                      key={type.type.name}
                      className={`px-1.5 sm:px-2 py-0.5 rounded-full text-xs text-white ${getColorByType(type.type.name)} opacity-70`}
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
            <div className="w-full md:w-7/12 flex flex-col items-center justify-center bg-zinc-800/50 py-6 sm:py-8 px-3 sm:px-4 rounded-xl border border-zinc-700/50">
              <motion.div
                className="w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4 text-green-500 bg-green-500/10 rounded-full flex items-center justify-center"
                animate={{ scale: 1 }}
                initial={{ scale: 0.8 }}
                transition={{
                  type: "spring",
                  bounce: 0.5,
                  duration: 1
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2">{t('evolution.fullyEvolved')}</h3>
              <p className="text-zinc-400 text-center text-xs sm:text-sm">{t('evolution.fullyEvolvedDesc')}</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Evolution controls component - handles navigation through evolution chain
const EvolutionControls: React.FC<EvolutionControlsProps> = ({
  evolutionSequence,
  currentStage,
  handleEvolve,
  handleReset,
  canEvolve,
  isLoading,
  mainType
}) => {
  const { t } = useLanguage();

  if (evolutionSequence.length <= 1) return null;

  return (
    <div className="p-3 sm:p-4 border-t border-zinc-800">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        {/* Evolution stages */}
        <div className="flex items-center mb-3 sm:mb-0 space-x-1 sm:space-x-2">
          <div className="bg-zinc-800/70 px-2 sm:px-3 py-0.5 rounded-full text-xs text-zinc-400">
            {t('evolution.stage')} {currentStage + 1}/{evolutionSequence.length}
          </div>

          <div className="flex items-center space-x-1 sm:space-x-1.5">
            {evolutionSequence.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full transition-colors duration-300 ${
                  index === currentStage
                    ? getColorByType(mainType)
                    : index < currentStage
                    ? "bg-zinc-400"
                    : "bg-zinc-700"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={handleReset}
            disabled={currentStage === 0 || isLoading}
            className={`flex items-center justify-center py-1 sm:py-1.5 px-2 sm:px-3 rounded-md border border-zinc-700
                      ${currentStage === 0 || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-800 active:bg-zinc-700'}
                      transition-colors duration-200 text-xs sm:text-sm`}
          >
            <RefreshCw size={14} className="mr-1 sm:mr-1.5" />
            {t('evolution.reset')}
          </button>

          <button
            onClick={handleEvolve}
            disabled={!canEvolve || isLoading}
            className={`flex items-center justify-center py-1 sm:py-1.5 px-3 sm:px-4 rounded-md
                      ${canEvolve && !isLoading
                        ? `${getColorByType(mainType)} hover:brightness-110 active:brightness-90`
                        : 'bg-zinc-800 opacity-50 cursor-not-allowed'}
                      transition-all duration-200 text-white font-medium text-xs sm:text-sm
                      relative overflow-hidden`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <Loader2 size={14} className="animate-spin mr-1.5" />
                {t('evolution.evolving')}
              </span>
            ) : (
              <span className="flex items-center">
                <Zap size={14} className="mr-1 sm:mr-1.5" />
                {t('evolution.evolve')}
              </span>
            )}

            {/* Pokeball background for the button */}
            <div className="absolute inset-0 bg-pokeball-detail bg-no-repeat bg-center bg-contain opacity-10"></div>
          </button>
        </div>
      </div>
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
      <div className={`p-3 sm:p-4 ${getColorByType(mainType)} border-b border-zinc-700 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-pokeball bg-no-repeat bg-right bg-contain opacity-10"></div>
        <div className="relative z-10 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center">
            <Zap className="mr-2" size={18} />
            {t('evolution.simulator')}
          </h2>

          <div className="flex items-center bg-black/30 px-2 sm:px-3 py-1 rounded-full backdrop-blur-sm">
            <div className="flex space-x-1">
              {evolutionSequence.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full ${
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
        evolutionSequence={evolutionSequence}
        currentStage={currentStage}
        handleEvolve={triggerEvolution}
        handleReset={resetEvolution}
        canEvolve={currentStage < evolutionSequence.length - 1}
        isLoading={evolutionInProgress}
        mainType={mainType}
      />
    </div>
  );
};