export type PokemonListItem = {
    name: string;
    url: string;
  };
  
  export type PokemonListResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: PokemonListItem[];
  };
  
  export type Pokemon = {
    id: number;
    name: string;
    sprites: {
      front_default: string | null;
      other?: {
        ["official-artwork"]?: { front_default: string | null };
      };
    };
    types: Array<{ type: { name: string } }>;
  };