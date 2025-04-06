import { create } from 'zustand';
import { getRegions, getRegionByName, getLocationList, getLocationByName, getLocationArea } from '../services/api';
import { Region, Location, LocationArea, RegionListResponse, LocationListResponse } from '../types/location';

// Define mapping of region names to generation data and image paths
export const regionData: Record<string, {
  generation: number,
  image: string,
  description: string,
  colorClass: string
}> = {
  kanto: {
    generation: 1,
    image: 'https://archives.bulbagarden.net/media/upload/2/25/LGPE_Kanto_Map.png',
    description: 'The Kanto region was the first region to be introduced in the Pokémon franchise, home to the original 151 Pokémon species.',
    colorClass: 'bg-red-500'
  },
  johto: {
    generation: 2,
    image: 'https://archives.bulbagarden.net/media/upload/6/64/JohtoMap.png',
    description: 'Johto is located west of Kanto, and the two regions share the same Elite Four in Gold, Silver, and Crystal versions.',
    colorClass: 'bg-green-500'
  },
  hoenn: {
    generation: 3,
    image: 'https://archives.bulbagarden.net/media/upload/8/85/Hoenn_ORAS.png',
    description: 'Hoenn is a region with a tropical climate featuring many water routes and natural environments.',
    colorClass: 'bg-blue-500'
  },
  sinnoh: {
    generation: 4,
    image: 'https://archives.bulbagarden.net/media/upload/0/08/Sinnoh_BDSP_artwork.png',
    description: 'Sinnoh is characterized by its many mountains, the tallest of which is Mt. Coronet which divides the region.',
    colorClass: 'bg-purple-500'
  },
  unova: {
    generation: 5,
    image: 'https://archives.bulbagarden.net/media/upload/f/fc/Unova_B2W2_alt.png',
    description: 'Unova is a region distant from the previous regions, representing New York City and surrounding areas.',
    colorClass: 'bg-yellow-500'
  },
  kalos: {
    generation: 6,
    image: 'https://archives.bulbagarden.net/media/upload/8/8a/Kalos_alt.png',
    description: 'Kalos is inspired by France and introduced Mega Evolution, showcasing European aesthetic and elements.',
    colorClass: 'bg-pink-500'
  },
  alola: {
    generation: 7,
    image: 'https://archives.bulbagarden.net/media/upload/0/0b/Alola_USUM_artwork.png',
    description: 'Alola consists of four natural islands and one artificial island, inspired by Hawaii. It introduced regional variants.',
    colorClass: 'bg-cyan-500'
  },
  galar: {
    generation: 8,
    image: 'https://archives.bulbagarden.net/media/upload/c/ce/Galar_artwork.png',
    description: 'Galar is based on Great Britain and features the Dynamax phenomenon unique to the region.',
    colorClass: 'bg-indigo-500'
  },
  hisui: {
    generation: 8,
    image: 'https://archives.bulbagarden.net/media/upload/f/ff/Legends_Arceus_Hisui.png',
    description: 'Hisui is an ancient version of the Sinnoh region, showcasing the earliest documented era of the Pokémon world.',
    colorClass: 'bg-amber-500'
  },
  paldea: {
    generation: 9,
    image: 'https://archives.bulbagarden.net/media/upload/d/dc/Paldea_artwork.png',
    description: 'Paldea features an open-world design with three main story paths and introduced the Terastal phenomenon.',
    colorClass: 'bg-emerald-500'
  }
};

interface LocationState {
  regionList: RegionListResponse | null;
  regionDetails: Record<string, Region>; // Store detailed data for multiple regions
  selectedRegion: Region | null;
  locationList: LocationListResponse | null;
  selectedLocation: Location | null;
  selectedLocationArea: LocationArea | null;
  isLoading: boolean;
  error: string | null;

  fetchRegions: () => Promise<void>;
  fetchRegionDetails: (name: string) => Promise<Region | null>;
  fetchRegionByName: (name: string) => Promise<void>;
  fetchLocationsByRegion: (regionName: string) => Promise<void>;
  fetchLocationList: (limit?: number, offset?: number) => Promise<void>;
  fetchLocationByName: (name: string) => Promise<void>;
  fetchLocationArea: (name: string) => Promise<void>;
}

export const useLocationStore = create<LocationState>((set, get) => ({
  regionList: null,
  regionDetails: {},
  selectedRegion: null,
  locationList: null,
  selectedLocation: null,
  selectedLocationArea: null,
  isLoading: false,
  error: null,

  fetchRegions: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getRegions();
      set({ regionList: data, isLoading: false });

      // Fetch details for each region in the background
      data.results.forEach(region => {
        get().fetchRegionDetails(region.name);
      });
    } catch (error) {
      set({ error: 'Failed to fetch regions', isLoading: false });
      console.error('Error fetching regions:', error);
    }
  },

  fetchRegionDetails: async (name: string) => {
    try {
      const data = await getRegionByName(name);
      set(state => ({
        regionDetails: { ...state.regionDetails, [name]: data }
      }));
      return data;
    } catch (error) {
      console.error(`Error fetching details for region ${name}:`, error);
      return null;
    }
  },

  fetchRegionByName: async (name: string) => {
    set({ isLoading: true, error: null });
    try {
      // Check if we already have this region's details
      const existingRegion = get().regionDetails[name];
      if (existingRegion) {
        set({ selectedRegion: existingRegion, isLoading: false });
        return;
      }

      // Otherwise fetch from API
      const data = await getRegionByName(name);
      set(state => ({
        selectedRegion: data,
        regionDetails: { ...state.regionDetails, [name]: data },
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to fetch region details', isLoading: false });
      console.error('Error fetching region details:', error);
    }
  },

  fetchLocationsByRegion: async (regionName: string) => {
    set({ isLoading: true, error: null });
    try {
      // First check if region data exists, if not fetch it
      let regionData = get().regionDetails[regionName];
      if (!regionData) {
        regionData = await get().fetchRegionDetails(regionName) as Region;
        if (!regionData) throw new Error('Could not fetch region data');
      }

      set({ selectedRegion: regionData });

      // Then create a location list response from the region's locations
      const locationList: LocationListResponse = {
        count: regionData.locations.length,
        next: null,
        previous: null,
        results: regionData.locations
      };

      set({ locationList, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch locations for region', isLoading: false });
      console.error('Error fetching locations for region:', error);
    }
  },

  fetchLocationList: async (limit = 20, offset = 0) => {
    set({ isLoading: true, error: null });
    try {
      const data = await getLocationList(limit, offset);
      set({ locationList: data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch location list', isLoading: false });
      console.error('Error fetching location list:', error);
    }
  },

  fetchLocationByName: async (name: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await getLocationByName(name);
      set({ selectedLocation: data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch location details', isLoading: false });
      console.error('Error fetching location details:', error);
    }
  },

  fetchLocationArea: async (name: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await getLocationArea(name);
      set({ selectedLocationArea: data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch location area details', isLoading: false });
      console.error('Error fetching location area details:', error);
    }
  }
}));