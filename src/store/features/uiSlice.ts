import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  filters: {
    category: string;
    minPrice: number;
    maxPrice: number;
    minRating: number;
    city: string;
    sort: string;
  };
  sidebarOpen: boolean;
}

const initialState: UiState = {
  filters: {
    category: '',
    minPrice: 0,
    maxPrice: 10000,
    minRating: 0,
    city: '',
    sort: 'newest',
  },
  sidebarOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<UiState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
  },
});

export const { setFilters, resetFilters, toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;
