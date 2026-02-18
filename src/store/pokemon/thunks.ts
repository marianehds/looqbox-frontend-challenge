import { createAsyncThunk } from "@reduxjs/toolkit";
import { HttpError } from "../../api/http";
import { getPokemonByName, getPokemonByType, getPokemonList } from "../../services/pokeapi";
import type { Pokemon, PokemonListItem, PokemonListResponse } from "./types";

export const fetchPokemonList = createAsyncThunk<
  PokemonListResponse,
  { limit: number; offset: number }
>("pokemon/fetchList", async ({ limit, offset }) => {
  return getPokemonList(limit, offset);
});

export const searchPokemonByName = createAsyncThunk<Pokemon, string, { rejectValue: string }>(
  "pokemon/searchByName",
  async (name, { rejectWithValue }) => {
    try {
      return await getPokemonByName(name);
    } catch (err) {
      if (err instanceof HttpError && err.status === 404) {
        return rejectWithValue("Pokémon não encontrado");
      }
      return rejectWithValue("Erro ao buscar Pokémon. Tente novamente.");
    }
  }
);

export const fetchPokemonByType = createAsyncThunk<PokemonListItem[], string>(
  "pokemon/fetchByType",
  async (type) => {
    const data = await getPokemonByType(type);
    return data.pokemon.map((p) => p.pokemon);
  }
);
