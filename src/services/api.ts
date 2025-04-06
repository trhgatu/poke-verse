import axios from 'axios';
import { Pokemon, PokemonListResponse, PokemonSpecies, EvolutionChain } from '../types/pokemon';

const API_URL = 'https://pokeapi.co/api/v2';

const api = axios.create({
  baseURL: API_URL,
});

export const getPokemonList = async (limit: number = 20, offset: number = 0): Promise<PokemonListResponse> => {
  const response = await api.get<PokemonListResponse>(`/pokemon?limit=${limit}&offset=${offset}`);
  return response.data;
};

export const getPokemonByName = async (name: string): Promise<Pokemon> => {
  const response = await api.get<Pokemon>(`/pokemon/${name}`);
  return response.data;
};

export const getPokemonById = async (id: number): Promise<Pokemon> => {
  const response = await api.get<Pokemon>(`/pokemon/${id}`);
  return response.data;
};

export const getPokemonSpecies = async (id: number): Promise<PokemonSpecies> => {
  const response = await api.get<PokemonSpecies>(`/pokemon-species/${id}`);
  return response.data;
};

export const getEvolutionChain = async (url: string): Promise<EvolutionChain> => {
  // The URL is a full URL, so we use axios directly rather than the instance
  const response = await axios.get<EvolutionChain>(url);
  return response.data;
};

export default api;