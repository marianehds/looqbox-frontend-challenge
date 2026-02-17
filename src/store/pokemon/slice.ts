import { createSlice } from "@reduxjs/toolkit";
import { fetchPokemonList, searchPokemonByName } from "./thunks";
import type { Pokemon, PokemonListItem } from "./types";

type State = {
  // lista
  list: PokemonListItem[];
  total: number;
  pageSize: number;
  page: number;

  // busca
  searchValue: string;
  searchType: string;
  searchedPokemon: Pokemon | null;
  isSearching: boolean;

  // ui
  loading: boolean;
  error: string | null;
};

const initialState: State = {
  list: [],
  total: 0,
  pageSize: 20,
  page: 1,

  searchValue: "",
  searchType: "Name",
  searchedPokemon: null,
  isSearching: false,

  loading: false,
  error: null,
};

const slice = createSlice({
  name: "pokemon",
  initialState,
  reducers: {
    setSearchValue(state, action) {
      state.searchValue = action.payload;
    },
    setSearchType(state, action) {
      state.searchType = action.payload;
    },
    clearSearch(state) {
      state.isSearching = false;
      state.searchedPokemon = null;
      state.error = null;
      state.searchValue = "";
    },
    setPage(state, action) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // LISTA
      .addCase(fetchPokemonList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPokemonList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.results;
        state.total = action.payload.count;
      })
      .addCase(fetchPokemonList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "error";
      })

      // BUSCA
      .addCase(searchPokemonByName.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isSearching = true;
      })
      .addCase(searchPokemonByName.fulfilled, (state, action) => {
        state.loading = false;
        state.searchedPokemon = action.payload;
      })
      .addCase(searchPokemonByName.rejected, (state, action) => {
        state.loading = false;
        state.searchedPokemon = null;
        state.error = action.error.message ?? "error";
      });
  },
});

export const { setSearchValue, setSearchType, clearSearch, setPage } = slice.actions;
export default slice.reducer;
