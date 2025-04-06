export interface Location {
  id: number;
  name: string;
  region: {
    name: string;
    url: string;
  };
  names: {
    name: string;
    language: {
      name: string;
      url: string;
    };
  }[];
  game_indices: {
    game_index: number;
    generation: {
      name: string;
      url: string;
    };
  }[];
  areas: {
    name: string;
    url: string;
  }[];
}

export interface LocationArea {
  id: number;
  name: string;
  game_index: number;
  encounter_method_rates: {
    encounter_method: {
      name: string;
      url: string;
    };
    version_details: {
      rate: number;
      version: {
        name: string;
        url: string;
      };
    }[];
  }[];
  location: {
    name: string;
    url: string;
  };
  names: {
    name: string;
    language: {
      name: string;
      url: string;
    };
  }[];
  pokemon_encounters: PokemonEncounter[];
}

export interface PokemonEncounter {
  pokemon: {
    name: string;
    url: string;
  };
  version_details: {
    version: {
      name: string;
      url: string;
    };
    max_chance: number;
    encounter_details: {
      min_level: number;
      max_level: number;
      condition_values: {
        name: string;
        url: string;
      }[];
      chance: number;
      method: {
        name: string;
        url: string;
      };
    }[];
  }[];
}

export interface Region {
  id: number;
  name: string;
  locations: {
    name: string;
    url: string;
  }[];
  main_generation: {
    name: string;
    url: string;
  };
  names: {
    name: string;
    language: {
      name: string;
      url: string;
    };
  }[];
  pokedexes: {
    name: string;
    url: string;
  }[];
  version_groups: {
    name: string;
    url: string;
  }[];
}

export interface RegionListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
}

export interface LocationListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
}