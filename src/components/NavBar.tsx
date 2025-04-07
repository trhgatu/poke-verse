import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Map, Dna } from 'lucide-react';
import { Button } from './ui/button';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';

export const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <header className="w-full bg-zinc-900 border-b border-zinc-800 text-white sticky top-0 z-50 shadow-lg backdrop-blur-sm bg-opacity-90">
      <div className="w-full max-w-[2000px] mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative w-8 h-8 rounded-full bg-red-500 border-2 border-white overflow-hidden transition-all duration-300 group-hover:rotate-12">
            <div className="absolute top-1/2 left-0 w-full h-[3px] bg-white"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-zinc-900"></div>
          </div>
          <div className="text-2xl font-bold tracking-tight">
            <span className="text-white">Poke</span>
            <span className="text-red-500">Verse</span>
          </div>
        </Link>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/regions')}
            className="flex items-center gap-2 transition-all duration-300"
          >
            <Map size={20} className="text-blue-500" />
            <span className="hidden md:inline">{t('nav.regions')}</span>
          </Button>

          <Button
            variant="ghost"
            onClick={() => navigate('/evolution-simulator')}
            className="flex items-center gap-2 transition-all duration-300"
          >
            <Dna size={20} className="text-green-500" />
            <span className="hidden md:inline">{t('nav.evolution')}</span>
          </Button>

          <Button
            variant="ghost"
            onClick={() => navigate('/favorites')}
            className="flex items-center gap-2 transition-all duration-300"
          >
            <Heart size={20} className="text-red-500" />
            <span className="hidden md:inline">{t('nav.favorites')}</span>
          </Button>

          <Button
            variant="pokemon"
            onClick={() => navigate('/')}
            className="hidden md:flex items-center gap-2 bg-gradient-to-r from-zinc-800 to-zinc-900 hover:from-zinc-700 hover:to-zinc-800 border-zinc-700 transition-all duration-300"
          >
            {t('nav.allPokemon')}
          </Button>

          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};