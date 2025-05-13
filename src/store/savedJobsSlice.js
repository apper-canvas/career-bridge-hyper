import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  savedJobs: [],
  loading: false,
  error: null,
};

export const savedJobsSlice = createSlice({
  name: 'savedJobs',
  initialState,
  reducers: {
    setSavedJobs: (state, action) => {
      state.savedJobs = action.payload;
      state.loading = false;
      state.error = null;
    },
    addSavedJob: (state, action) => {
      state.savedJobs.push(action.payload);
    },
    removeSavedJob: (state, action) => {
      state.savedJobs = state.savedJobs.filter(job => job.Id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setSavedJobs, addSavedJob, removeSavedJob, setLoading, setError } = savedJobsSlice.actions;
export default savedJobsSlice.reducer;