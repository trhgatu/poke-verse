import React, { useState } from "react";
import { Pokemon } from "../types/pokemon";
import { PokemonSelector } from "../components/PokemonSelector";
import { StatsComparisonChart } from "../components/StatsComparisonChart";
import { useLanguage } from "../contexts/LanguageContext";
import { motion } from "framer-motion";
export const ComparePage: React.FC = () => {
    const [pokemon1, setPokemon1] = useState<Pokemon | null>(null);
    const [pokemon2, setPokemon2] = useState<Pokemon | null>(null);
    const { t } = useLanguage();

    const handleSelectPokemon1 = (pokemon: Pokemon) => {
        setPokemon1(pokemon);
    };

    const handleSelectPokemon2 = (pokemon: Pokemon) => {
        setPokemon2(pokemon);
    };
    const mainType = pokemon1?.types[0]?.type.name || 'normal';
    return (
        <main className="min-h-screen text-white py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 mb-4">
                        {t('compare.title')} ⚔️
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        {t('compare.description') || 'Select two Pokémon to compare their stats and see which one has the advantage.'}
                    </p>
                </div>

                {/* Selector Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <div className="bg-zinc-800/60 backdrop-blur-sm rounded-2xl border border-zinc-700 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-indigo-500/10">
                        <PokemonSelector onSelectPokemon={handleSelectPokemon1} label={t('compare.selectPokemon1')} />
                    </div>
                    <div className="bg-zinc-800/60 backdrop-blur-sm rounded-2xl border border-zinc-700 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-indigo-500/10">
                        <PokemonSelector onSelectPokemon={handleSelectPokemon2} label={t('compare.selectPokemon2')} />
                    </div>
                </div>

                {/* Pokemon Cards Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 backdrop-blur-sm p-6 rounded-2xl border border-zinc-700 shadow-xl transition-all duration-300 hover:shadow-red-500/10">
                        {pokemon1 ? (
                            <div className="flex flex-col items-center">
                                <div
                                    className="fixed inset-0 w-full h-full -z-10 opacity-10"
                                    style={{
                                        backgroundImage: `
                                            url('/pokeball-bg.svg'),
                                            radial-gradient(circle at 20% 20%, var(--${mainType}-color) 0%, transparent 70%),
                                        `,
                                        backgroundRepeat: 'repeat, no-repeat, no-repeat',
                                        backgroundPosition: 'center, top left, bottom right',
                                        backgroundSize: '15%, 100%, 100%'
                                    }}
                                >
                                </div>
                                <motion.div
                                    className="relative w-40 h-40 mb-4"
                                    animate={{
                                        y: [0, -6, 0],
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 3,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-red-700/20 rounded-full blur-xl"></div>
                                    <img
                                        src={pokemon1.sprites.other["official-artwork"].front_default || pokemon1.sprites.front_default}
                                        alt={pokemon1.name}
                                        className="w-40 h-40 object-contain relative z-10"
                                    />
                                </motion.div>
                                <h3 className="text-2xl font-bold mt-2 capitalize">{pokemon1.name.replace('-', ' ')}</h3>
                                <p className="text-zinc-400 mb-3">#{pokemon1.id.toString().padStart(3, '0')}</p>
                                <div className="flex gap-2 mt-1">
                                    {pokemon1.types.map((type) => (
                                        <span
                                            key={type.type.name}
                                            className="px-3 py-1 rounded-full text-sm font-medium bg-red-500/20 text-red-100 border border-red-500/30 capitalize"
                                        >
                                            {type.type.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="h-60 flex flex-col items-center justify-center">
                                <div className="w-20 h-20 rounded-full bg-zinc-700/50 mb-4 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                                <p className="text-zinc-400 text-lg text-center">{t('compare.selectPokemon1')}</p>
                            </div>
                        )}
                    </div>
                    <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 backdrop-blur-sm p-6 rounded-2xl border border-zinc-700 shadow-xl transition-all duration-300 hover:shadow-blue-500/10">
                        {pokemon2 ? (
                            <div className="flex flex-col items-center">
                                <div
                                    className="fixed inset-0 w-full h-full -z-10 opacity-10"
                                    style={{
                                        backgroundImage: `
                                            url('/pokeball-bg.svg'),
                                            radial-gradient(circle at 20% 20%, var(--${mainType}-color) 0%, transparent 70%),
                                        `,
                                        backgroundRepeat: 'repeat, no-repeat, no-repeat',
                                        backgroundPosition: 'center, top left, bottom right',
                                        backgroundSize: '15%, 100%, 100%'
                                    }}
                                ></div>
                                <motion.div
                                    className="relative w-40 h-40 mb-4"
                                    animate={{
                                        y: [0, -6, 0],
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 3,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-700/20 rounded-full blur-xl"></div>
                                    <img
                                        src={pokemon2.sprites.other["official-artwork"].front_default || pokemon2.sprites.front_default}
                                        alt={pokemon2.name}
                                        className="w-40 h-40 object-contain relative z-10"
                                    />
                                </motion.div>
                                <h3 className="text-2xl font-bold mt-2 capitalize">{pokemon2.name.replace('-', ' ')}</h3>
                                <p className="text-zinc-400 mb-3">#{pokemon2.id.toString().padStart(3, '0')}</p>
                                <div className="flex gap-2 mt-1">
                                    {pokemon2.types.map((type) => (
                                        <span
                                            key={type.type.name}
                                            className="px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-100 border border-blue-500/30 capitalize"
                                        >
                                            {type.type.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="h-60 flex flex-col items-center justify-center">
                                <div className="w-20 h-20 rounded-full bg-zinc-700/50 mb-4 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                                <p className="text-zinc-400 text-lg text-center">{t('compare.selectPokemon2')}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Comparison Chart */}
                <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 backdrop-blur-sm p-6 rounded-2xl border border-zinc-700 shadow-xl transition-all duration-300">
                    <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                        {t('compare.chartTitle')}
                    </h2>
                    <div className="stats-chart">
                        <StatsComparisonChart pokemon1={pokemon1} pokemon2={pokemon2} />
                    </div>
                </div>

                {/* Battle Outcome Prediction (Optional) */}
                {pokemon1 && pokemon2 && (
                    <div className="mt-8 bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 backdrop-blur-sm p-6 rounded-2xl border border-zinc-700 shadow-xl text-center">
                        <h3 className="text-xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500">
                            {t('compare.battlePrediction') || 'Battle Prediction'}
                        </h3>
                        <p className="text-zinc-300">
                            {pokemon1.stats.reduce((sum, stat) => sum + stat.base_stat, 0) > pokemon2.stats.reduce((sum, stat) => sum + stat.base_stat, 0)
                                ? `${pokemon1.name.toUpperCase()} ${t('compare.mightHaveAdvantage')}`
                                : `${pokemon2.name.toUpperCase()} ${t('compare.mightHaveAdvantage')}`}
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
};
