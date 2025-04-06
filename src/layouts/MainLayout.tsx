import React from 'react';
import { Outlet } from 'react-router-dom';
import { NavBar } from '../components/NavBar';

export const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-900">
      <NavBar />
      <main className="flex-1 w-full mx-auto px-4 py-8 max-w-full">
        <Outlet />
      </main>
      <footer className="bg-zinc-900 text-zinc-400 py-8 border-t border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold text-white">PokeVerse</h2>
              <p className="mt-2">Explore the world of Pokemon</p>
            </div>
            <div className="text-sm">
              <p>Data provided by <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">PokeAPI</a></p>
              <p className="mt-1">© {new Date().getFullYear()} PokeVerse. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};