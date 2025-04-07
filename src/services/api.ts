import axios from 'axios';
import { Pokemon, PokemonListResponse, PokemonSpecies, EvolutionChain } from '../types/pokemon';
import { Location, LocationArea, Region, RegionListResponse, LocationListResponse } from '../types/location';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const getPokemonList = async (limit: number = 20, offset: number = 0): Promise<PokemonListResponse> => {
  const response = await axios.get(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  return response.data;
};

export const getPokemonByName = async (name: string): Promise<Pokemon> => {
  const response = await axios.get(`${BASE_URL}/pokemon/${name.toLowerCase()}`);
  return response.data;
};

export const getPokemonById = async (id: number): Promise<Pokemon> => {
  const response = await axios.get(`${BASE_URL}/pokemon/${id}`);
  return response.data;
};

export const searchPokemonByName = async (searchTerm: string): Promise<Pokemon[]> => {
  try {
    const limit = 1302;
    const response = await axios.get(`${BASE_URL}/pokemon?limit=${limit}`);
    const results = response.data.results;

    const filteredResults = results.filter((pokemon: { name: string }) =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const detailedPokemon = await Promise.all(
      filteredResults.map(async (pokemon: { name: string, url: string }) => {
        const detailResponse = await axios.get(pokemon.url);
        return detailResponse.data;
      })
    );

    return detailedPokemon;
  } catch (error) {
    console.error('Error searching Pokemon:', error);
    throw new Error('Failed to search Pokemon');
  }
};

export const getAllPokemon = async (): Promise<Pokemon[]> => {
  try {
    const limit = 1302;
    const response = await axios.get(`${BASE_URL}/pokemon?limit=${limit}`);
    const results = response.data.results;

    const detailedPokemon = await Promise.all(
      results.map(async (pokemon: { name: string, url: string }) => {
        try {
          const detailResponse = await axios.get(pokemon.url);
          return detailResponse.data;
        } catch (err) {
          console.error(`Error fetching details for ${pokemon.name}:`, err);
          return null;
        }
      })
    );

    return detailedPokemon.filter(pokemon => pokemon !== null);
  } catch (error) {
    console.error('Error fetching all Pokemon:', error);
    throw new Error('Failed to fetch all Pokemon');
  }
};

export const getPokemonSpecies = async (id: number): Promise<PokemonSpecies> => {
  const response = await axios.get(`${BASE_URL}/pokemon-species/${id}`);
  return response.data;
};

export const getEvolutionChain = async (url: string): Promise<EvolutionChain> => {
  const response = await axios.get(url);
  return response.data;
};

export const getRegions = async (): Promise<RegionListResponse> => {
  const response = await axios.get(`${BASE_URL}/region`);
  return response.data;
};


export const getRegionByName = async (name: string): Promise<Region> => {
  const response = await axios.get(`${BASE_URL}/region/${name}`);
  return response.data;
};

export const getLocationList = async (limit: number = 20, offset: number = 0): Promise<LocationListResponse> => {
  const response = await axios.get(`${BASE_URL}/location?limit=${limit}&offset=${offset}`);
  return response.data;
};

export const getLocationByName = async (name: string): Promise<Location> => {
  const response = await axios.get(`${BASE_URL}/location/${name}`);
  return response.data;
};

export const getLocationArea = async (name: string): Promise<LocationArea> => {
  const response = await axios.get(`${BASE_URL}/location-area/${name}`);
  return response.data;
};