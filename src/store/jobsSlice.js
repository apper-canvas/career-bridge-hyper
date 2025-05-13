import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  jobs: [],
  loading: false,
  error: null,
  filters: {
    jobType: '',
    location: '',
    industry: '',
    searchQuery: '',
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    limit: 20,
  },
};

export const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setJobs: (state, action) => {
      state.jobs = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
});

export const { setJobs, setLoading, setError, setFilters, setPagination } = 
  jobsSlice.actions;
export default jobsSlice.reducer;