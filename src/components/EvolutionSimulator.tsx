import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChainLink, Pokemon } from '../types/pokemon';
import { getPokemonByName } from '../services/api';
import { capitalizeFirstLetter } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

interface EvolutionSimulatorProps {
  chain: ChainLink;
  onComplete?: () => void;
}

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
      }, 3000); // Thời gian cho hiệu ứng tiến hóa
    }
  };

  // Hàm bắt đầu lại quá trình tiến hóa
  const resetEvolution = () => {
    setCurrentStage(0);
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="w-8 h-8 border-4 border-zinc-700 border-t-red-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-400">
        <p>{error}</p>
        <button
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md"
          onClick={() => window.location.reload()}
        >
          {t('ui.tryAgain')}
        </button>
      </div>
    );
  }

  if (evolutionSequence.length < 2) {
    return (
      <div className="text-center p-4 text-zinc-400">
        {t('evolution.noEvolution')}
      </div>
    );
  }

  const currentPokemon = evolutionSequence[currentStage];
  const nextPokemon = currentStage < evolutionSequence.length - 1
    ? evolutionSequence[currentStage + 1]
    : null;

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
        } else if (evoDetails.trigger.name === 'trade') {
          return t('evolution.method.trade');
        }
      }
      return t('evolution.method.default');
    }
    return '';
  };

  const evolutionMethod = getEvolutionMethod();

  return (
    <div className="w-full p-6 bg-zinc-800 rounded-xl">
      <h2 className="text-xl font-bold text-white mb-6 text-center">{t('evolution.simulator')}</h2>

      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            {/* Pokémon hiện tại */}
            <div className="w-full flex flex-col items-center mb-6">
              <div className="relative w-48 h-48 flex items-center justify-center">
                {evolutionInProgress ? (
                  <>
                    {/* Hiệu ứng tiến hóa */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      animate={{
                        filter: ["brightness(1)", "brightness(2)", "brightness(1)"],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      <img
                        src={currentPokemon.sprites.other["official-artwork"].front_default || currentPokemon.sprites.front_default}
                        alt={currentPokemon.name}
                        className="max-w-full max-h-full z-10 transition-all duration-500"
                      />
                    </motion.div>
                    <div className="absolute inset-0 bg-white opacity-20 animate-pulse rounded-full"></div>
                  </>
                ) : (
                  <img
                    src={currentPokemon.sprites.other["official-artwork"].front_default || currentPokemon.sprites.front_default}
                    alt={currentPokemon.name}
                    className="max-w-full max-h-full"
                  />
                )}
              </div>
              <h3 className="text-xl font-semibold text-white mt-2 capitalize">
                {capitalizeFirstLetter(currentPokemon.name)}
              </h3>
              <p className="text-zinc-400 text-sm mt-1">#{currentPokemon.id}</p>
            </div>

            {/* Mũi tên và thông tin tiến hóa */}
            {nextPokemon && (
              <div className="w-full flex flex-col items-center mb-6">
                <div className="flex flex-col items-center">
                  <svg className="w-10 h-10 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                  </svg>
                  <span className="text-zinc-400 text-sm mt-1">{evolutionMethod}</span>
                </div>
              </div>
            )}

            {/* Pokémon tiếp theo trong chuỗi tiến hóa */}
            {nextPokemon && (
              <div className="w-full flex flex-col items-center mb-6 opacity-70">
                <div className="w-36 h-36 flex items-center justify-center grayscale">
                  <img
                    src={nextPokemon.sprites.other["official-artwork"].front_default || nextPokemon.sprites.front_default}
                    alt={nextPokemon.name}
                    className="max-w-full max-h-full"
                  />
                </div>
                <h3 className="text-lg font-medium text-zinc-400 mt-2 capitalize">
                  {capitalizeFirstLetter(nextPokemon.name)}
                </h3>
                <p className="text-zinc-500 text-sm mt-1">#{nextPokemon.id}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Các nút điều khiển */}
      <div className="flex justify-center gap-4 mt-6">
        {currentStage < evolutionSequence.length - 1 ? (
          <button
            onClick={triggerEvolution}
            disabled={evolutionInProgress}
            className={`px-4 py-2 rounded-lg ${
              evolutionInProgress
                ? 'bg-zinc-600 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600'
            } text-white transition-colors`}
          >
            {evolutionInProgress ? t('evolution.evolving') : t('evolution.button')}
          </button>
        ) : (
          <button
            onClick={resetEvolution}
            className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
          >
            {t('evolution.restart')}
          </button>
        )}
      </div>
    </div>
  );
};