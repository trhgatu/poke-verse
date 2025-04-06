import axios from 'axios';
import { Pokemon, PokemonListResponse, PokemonSpecies, EvolutionChain } from '../types/pokemon';
import { Location, LocationArea, Region, RegionListResponse, LocationListResponse } from '../types/location';

const BASE_URL = 'https://pokeapi.co/api/v2';

// Fetch a list of Pokemon with pagination
export const getPokemonList = async (limit: number = 20, offset: number = 0): Promise<PokemonListResponse> => {
  const response = await axios.get(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  return response.data;
};

// Fetch a specific Pokemon by name or ID
export const getPokemonByName = async (name: string): Promise<Pokemon> => {
  const response = await axios.get(`${BASE_URL}/pokemon/${name.toLowerCase()}`);
  return response.data;
};

// Fetch a specific Pokemon by ID
export const getPokemonById = async (id: number): Promise<Pokemon> => {
  const response = await axios.get(`${BASE_URL}/pokemon/${id}`);
  return response.data;
};

// Fetch all Pokemon (used for filtering by type)
export const getAllPokemon = async (): Promise<Pokemon[]> => {
  // First, get the total count
  const initialResponse = await axios.get(`${BASE_URL}/pokemon?limit=1`);
  const count = initialResponse.data.count;

  // Then fetch all Pokemon in one request
  const response = await axios.get(`${BASE_URL}/pokemon?limit=${count}`);
  const results = response.data.results;

  // Fetch detailed information for each Pokemon
  const detailedPokemon = await Promise.all(
    results.map(async (pokemon: { name: string, url: string }) => {
      const detailResponse = await axios.get(pokemon.url);
      return detailResponse.data;
    })
  );

  return detailedPokemon;
};

// Fetch Pokemon species information
export const getPokemonSpecies = async (id: number): Promise<PokemonSpecies> => {
  const response = await axios.get(`${BASE_URL}/pokemon-species/${id}`);
  return response.data;
};

// Fetch evolution chain
export const getEvolutionChain = async (url: string): Promise<EvolutionChain> => {
  const response = await axios.get(url);
  return response.data;
};

// Fetch a list of all regions
export const getRegions = async (): Promise<RegionListResponse> => {
  const response = await axios.get(`${BASE_URL}/region`);
  return response.data;
};

// Fetch detailed region data
export const getRegionByName = async (name: string): Promise<Region> => {
  const response = await axios.get(`${BASE_URL}/region/${name}`);
  return response.data;
};

// Fetch a list of locations with pagination
export const getLocationList = async (limit: number = 20, offset: number = 0): Promise<LocationListResponse> => {
  const response = await axios.get(`${BASE_URL}/location?limit=${limit}&offset=${offset}`);
  return response.data;
};

// Fetch detailed location data
export const getLocationByName = async (name: string): Promise<Location> => {
  const response = await axios.get(`${BASE_URL}/location/${name}`);
  return response.data;
};

// Fetch location area data
export const getLocationArea = async (name: string): Promise<LocationArea> => {
  const response = await axios.get(`${BASE_URL}/location-area/${name}`);
  return response.data;
};