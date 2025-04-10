import { create } from 'zustand';
import { getAllPokemon, getPokemonByName, getPokemonList, getPokemonSpecies, getEvolutionChain, searchPokemonByName } from '../services/api';
import { Pokemon, PokemonListResponse, PokemonSpecies, EvolutionChain } from '../types/pokemon';

// Extended interface for PokemonListResponse that includes allPokemon
interface ExtendedPokemonListResponse extends PokemonListResponse {
  allPokemon?: Pokemon[];
}

interface PokemonState {
  pokemonList: ExtendedPokemonListResponse | null;
  selectedPokemon: Pokemon | null;
  isLoading: boolean;
  isLoadingExtra: boolean;
  error: string | null;
  favorites: number[];
  species: PokemonSpecies | null;
  evolutionChain: EvolutionChain | null;
  searchResults: Pokemon[];
  fetchPokemonList: (limit: number, offset: number) => Promise<void>;
  fetchPokemonDetails: (name: string) => Promise<void>;
  fetchAllPokemon: () => Promise<void>;
  searchPokemon: (term: string) => Promise<void>;
  fetchSpeciesAndEvolutionChain: (id: number) => Promise<void>;
  addToFavorites: (id: number) => void;
  removeFromFavorites: (id: number) => void;
}

export const usePokemonStore = create<PokemonState>((set, get) => ({
  pokemonList: null,
  selectedPokemon: null,
  isLoading: false,
  isLoadingExtra: false,
  error: null,
  species: null,
  evolutionChain: null,
  searchResults: [],
  favorites: JSON.parse(localStorage.getItem('pokemonFavorites') || '[]'),

  fetchPokemonList: async (limit: number, offset: number) => {
    set({ isLoading: true, error: null });
    try {
      const data = await getPokemonList(limit, offset);
      set({ pokemonList: data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch Pokemon list', isLoading: false });
      console.error('Error fetching Pokemon list:', error);
    }
  },

  fetchPokemonDetails: async (name: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await getPokemonByName(name);
      set({ selectedPokemon: data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch Pokemon details', isLoading: false });
      console.error('Error fetching Pokemon details:', error);
    }
  },

  fetchAllPokemon: async () => {
    const { pokemonList } = get();

    // Return early if we already have all Pokemon
    if (pokemonList?.allPokemon) {
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const allPokemon = await getAllPokemon();
      set((state) => ({
        pokemonList: {
          ...state.pokemonList as ExtendedPokemonListResponse,
          allPokemon
        },
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to fetch all Pokemon', isLoading: false });
      console.error('Error fetching all Pokemon:', error);
    }
  },

  searchPokemon: async (term: string) => {
    if (!term.trim()) {
      set({ searchResults: [] });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const results = await searchPokemonByName(term);
      set({
        searchResults: results,
        isLoading: false
      });

      if (results.length > 0) {
        set((state) => ({
          pokemonList: {
            ...state.pokemonList as ExtendedPokemonListResponse,
            allPokemon: results
          }
        }));
      }
    } catch (error) {
      set({ error: 'Failed to search Pokemon', isLoading: false });
      console.error('Error searching Pokemon:', error);
    }
  },

  fetchSpeciesAndEvolutionChain: async (id: number) => {
    // Reset all related state before fetching new data
    set({
      isLoadingExtra: true,
      error: null,
      species: null,
      evolutionChain: null
    });

    try {
      // First attempt: try to fetch species data directly
      let speciesData;
      try {
        speciesData = await getPokemonSpecies(id);
      } catch (speciesError) {
        // If failed, this might be a special form
        // Get the current selected Pokemon name
        const currentPokemon = get().selectedPokemon;

        if (currentPokemon) {
          // Extract base form name by removing anything after a hyphen (e.g., "charizard-mega-x" -> "charizard")
          const basePokemonName = currentPokemon.name.split('-')[0];

          // Try to get the species data for the base form
          try {
            // Get the base Pokemon first to get its ID
            const basePokemon = await getPokemonByName(basePokemonName);
            speciesData = await getPokemonSpecies(basePokemon.id);
          } catch {
            throw new Error('Failed to fetch species data for both forms');
          }
        } else {
          throw speciesError;
        }
      }

      set({ species: speciesData });

      if (speciesData.evolution_chain?.url) {
        try {
          const evolutionData = await getEvolutionChain(speciesData.evolution_chain.url);
          set({ evolutionChain: evolutionData, isLoadingExtra: false });
        } catch (evolutionError) {
          console.error('Error fetching evolution chain:', evolutionError);
          // If evolution chain fetch fails, still set a default chain object
          set({
            evolutionChain: {
              id: 0,
              baby_trigger_item: null,
              chain: {
                is_baby: false,
                species: {
                  name: '',
                  url: ''
                },
                evolution_details: null,
                evolves_to: []
              }
            },
            isLoadingExtra: false
          });
        }
      } else {
        // If no evolution chain URL, set evolutionChain to empty structure
        set({
          evolutionChain: {
            id: 0,
            baby_trigger_item: null,
            chain: {
              is_baby: false,
              species: {
                name: '',
                url: ''
              },
              evolution_details: null,
              evolves_to: []
            }
          },
          isLoadingExtra: false
        });
      }
    } catch (error) {
      set({
        error: 'Failed to fetch evolution data',
        isLoadingExtra: false,
        // Set empty default values even in error case
        evolutionChain: {
          id: 0,
          baby_trigger_item: null,
          chain: {
            is_baby: false,
            species: {
              name: '',
              url: ''
            },
            evolution_details: null,
            evolves_to: []
          }
        }
      });
      console.error('Error fetching evolution data:', error);
    } finally {
      set({ isLoadingExtra: false });
    }
  },

  addToFavorites: (id: number) => {
    set(state => {
      const newFavorites = [...state.favorites, id];
      localStorage.setItem('pokemonFavorites', JSON.stringify(newFavorites));
      return { favorites: newFavorites };
    });
  },

  removeFromFavorites: (id: number) => {
    set(state => {
      const newFavorites = state.favorites.filter(favId => favId !== id);
      localStorage.setItem('pokemonFavorites', JSON.stringify(newFavorites));
      return { favorites: newFavorites };
    });
  }
}));