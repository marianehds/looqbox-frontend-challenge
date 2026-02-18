import { createSlice } from "@reduxjs/toolkit";
import { fetchPokemonList, fetchPokemonByType, searchPokemonByName } from "./thunks";
import type { Pokemon, PokemonListItem } from "./types";

type State = {
  // lista
  list: PokemonListItem[];
  total: number;
  pageSize: number;
  page: number;

  selectedType: string | null;
  typeList: PokemonListItem[];

  // busca
  searchValue: string;
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

  selectedType: null,
  typeList: [],

  searchValue: "",
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
    clearTypeFilter(state) {
      state.selectedType = null;
      state.typeList = [];
    },
    clearError(state) {
      state.error = null;
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

      // FILTRO POR TIPO
      .addCase(fetchPokemonByType.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.selectedType = action.meta.arg;
        state.typeList = [];
      })
      .addCase(fetchPokemonByType.fulfilled, (state, action) => {
        state.loading = false;
        state.typeList = action.payload;
      })
      .addCase(fetchPokemonByType.rejected, (state, action) => {
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
        state.error = action.payload ?? action.error.message ?? "Erro ao buscar Pokémon.";
      });
  },
});

export const { setSearchValue, clearTypeFilter, clearError, setPage } = slice.actions;
export default slice.reducer;
