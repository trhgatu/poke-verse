import { create } from 'zustand';
import { Pokemon, PokemonListResponse } from '../types/pokemon';
import { getPokemonByName, getPokemonList } from '../services/api';

interface PokemonState {
  pokemonList: PokemonListResponse | null;
  selectedPokemon: Pokemon | null;
  favorites: number[];
  isLoading: boolean;
  error: string | null;
  fetchPokemonList: (limit?: number, offset?: number) => Promise<void>;
  fetchPokemonDetails: (nameOrId: string | number) => Promise<void>;
  addToFavorites: (id: number) => void;
  removeFromFavorites: (id: number) => void;
}

export const usePokemonStore = create<PokemonState>((set, get) => ({
  pokemonList: null,
  selectedPokemon: null,
  favorites: JSON.parse(localStorage.getItem('pokemonFavorites') || '[]'),
  isLoading: false,
  error: null,

  fetchPokemonList: async (limit = 20, offset = 0) => {
    set({ isLoading: true, error: null });
    try {
      const data = await getPokemonList(limit, offset);
      set({ pokemonList: data, isLoading: false });
    } catch (error) {
      console.error('Error fetching Pokemon list:', error);
      set({ error: 'Failed to fetch Pokemon list', isLoading: false });
    }
  },

  fetchPokemonDetails: async (nameOrId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await getPokemonByName(nameOrId.toString());
      set({ selectedPokemon: data, isLoading: false });
    } catch (error) {
      console.error('Error fetching Pokemon details:', error);
      set({ error: 'Failed to fetch Pokemon details', isLoading: false });
    }
  },

  addToFavorites: (id) => {
    const currentFavorites = get().favorites;
    if (!currentFavorites.includes(id)) {
      const newFavorites = [...currentFavorites, id];
      localStorage.setItem('pokemonFavorites', JSON.stringify(newFavorites));
      set({ favorites: newFavorites });
    }
  },

  removeFromFavorites: (id) => {
    const currentFavorites = get().favorites;
    const newFavorites = currentFavorites.filter(favoriteId => favoriteId !== id);
    localStorage.setItem('pokemonFavorites', JSON.stringify(newFavorites));
    set({ favorites: newFavorites });
  }
}));