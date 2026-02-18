import { createAsyncThunk } from "@reduxjs/toolkit";
import { getPokemonByName, getPokemonByType, getPokemonList } from "../../services/pokeapi";
import type { Pokemon, PokemonListItem, PokemonListResponse } from "./types";

export const fetchPokemonList = createAsyncThunk<
  PokemonListResponse,
  { limit: number; offset: number }
>("pokemon/fetchList", async ({ limit, offset }) => {
  return getPokemonList(limit, offset);
});

export const searchPokemonByName = createAsyncThunk<Pokemon, string>(
  "pokemon/searchByName",
  async (name) => {
    return getPokemonByName(name);
  }
);

export const fetchPokemonByType = createAsyncThunk<PokemonListItem[], string>(
  "pokemon/fetchByType",
  async (type) => {
    const data = await getPokemonByType(type);
    return data.pokemon.map((p) => p.pokemon);
  }
);
