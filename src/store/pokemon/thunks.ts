import { createAsyncThunk } from "@reduxjs/toolkit";
import { getPokemonByName, getPokemonList } from "../../services/pokeapi";
import type { Pokemon, PokemonListResponse } from "./types";

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