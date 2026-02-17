import { httpGet } from "../api/http";
import type { Pokemon, PokemonListResponse } from "../store/pokemon/types";

const BASE_URL = "https://pokeapi.co/api/v2";

export function getPokemonList(limit: number, offset: number) {
  return httpGet<PokemonListResponse>(
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
  );
}

export function getPokemonByName(name: string) {
  const normalized = name.trim().toLowerCase();
  return httpGet<Pokemon>(`${BASE_URL}/pokemon/${normalized}`);
}