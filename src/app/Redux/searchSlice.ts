// redux/searchSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  rawInput: string;
  debouncedInput: string;
}

const initialState: SearchState = {
  rawInput: "",
  debouncedInput: "",
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setRawInput(state, action: PayloadAction<string>) {
      state.rawInput = action.payload;
    },
    setDebouncedInput(state, action: PayloadAction<string>) {
      state.debouncedInput = action.payload;
    },
    clearSearch(state) {
      state.rawInput = "";
      state.debouncedInput = "";
    },
  },
});

export const { setRawInput, setDebouncedInput, clearSearch } = searchSlice.actions;

export default searchSlice.reducer;
