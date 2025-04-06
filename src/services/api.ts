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

// Tối ưu: Tìm Pokemon bằng tên - dùng cho chức năng tìm kiếm
export const searchPokemonByName = async (searchTerm: string): Promise<Pokemon[]> => {
  try {
    // Lấy danh sách 151 Pokemon đầu tiên (Gen 1) - đủ để tìm kiếm cơ bản
    const limit = 1302;
    const response = await axios.get(`${BASE_URL}/pokemon?limit=${limit}`);
    const results = response.data.results;

    // Lọc các Pokemon khớp với từ khóa tìm kiếm
    const filteredResults = results.filter((pokemon: { name: string }) =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Chỉ lấy thông tin chi tiết của các Pokemon đã lọc (thay vì tất cả)
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

// Fetch all Pokemon (used for filtering by type)
export const getAllPokemon = async (): Promise<Pokemon[]> => {
  try {
    // Lấy tất cả Pokémon thay vì chỉ Gen 1
    const limit = 1302; // Tăng lên để bao gồm tất cả Pokémon có sẵn

    // Lấy danh sách Pokemon với giới hạn mới
    const response = await axios.get(`${BASE_URL}/pokemon?limit=${limit}`);
    const results = response.data.results;

    // Lấy thông tin chi tiết cho mỗi Pokemon
    const detailedPokemon = await Promise.all(
      results.map(async (pokemon: { name: string, url: string }) => {
        try {
          const detailResponse = await axios.get(pokemon.url);
          return detailResponse.data;
        } catch (err) {
          console.error(`Error fetching details for ${pokemon.name}:`, err);
          // Trả về null nếu không lấy được thông tin chi tiết
          return null;
        }
      })
    );

    // Lọc bỏ các null values
    return detailedPokemon.filter(pokemon => pokemon !== null);
  } catch (error) {
    console.error('Error fetching all Pokemon:', error);
    throw new Error('Failed to fetch all Pokemon');
  }
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