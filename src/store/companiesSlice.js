import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  companies: [],
  selectedCompany: null,
  loading: false,
  error: null,
  searchQuery: '',
};

export const companiesSlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    setCompanies: (state, action) => {
      state.companies = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedCompany: (state, action) => {
      state.selectedCompany = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { setCompanies, setSelectedCompany, setLoading, setError, setSearchQuery } = companiesSlice.actions;
export default companiesSlice.reducer;