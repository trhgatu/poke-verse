import { create } from 'zustand';
import { getRegions, getRegionByName, getLocationList, getLocationByName, getLocationArea } from '../services/api';
import { Region, Location, LocationArea, RegionListResponse, LocationListResponse } from '../types/location';

interface LocationState {
  regionList: RegionListResponse | null;
  selectedRegion: Region | null;
  locationList: LocationListResponse | null;
  selectedLocation: Location | null;
  selectedLocationArea: LocationArea | null;
  isLoading: boolean;
  error: string | null;

  fetchRegions: () => Promise<void>;
  fetchRegionByName: (name: string) => Promise<void>;
  fetchLocationsByRegion: (regionName: string) => Promise<void>;
  fetchLocationList: (limit?: number, offset?: number) => Promise<void>;
  fetchLocationByName: (name: string) => Promise<void>;
  fetchLocationArea: (name: string) => Promise<void>;
}

export const useLocationStore = create<LocationState>((set) => ({
  regionList: null,
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
    } catch (error) {
      set({ error: 'Failed to fetch regions', isLoading: false });
      console.error('Error fetching regions:', error);
    }
  },

  fetchRegionByName: async (name: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await getRegionByName(name);
      set({ selectedRegion: data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch region details', isLoading: false });
      console.error('Error fetching region details:', error);
    }
  },

  fetchLocationsByRegion: async (regionName: string) => {
    set({ isLoading: true, error: null });
    try {
      // First, get the region data
      const regionData = await getRegionByName(regionName);
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