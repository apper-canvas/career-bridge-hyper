import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  talentRequests: [],
  loading: false,
  error: null,
};

export const talentRequestsSlice = createSlice({
  name: 'talentRequests',
  initialState,
  reducers: {
    setTalentRequests: (state, action) => {
      state.talentRequests = action.payload;
      state.loading = false;
      state.error = null;
    },
    addTalentRequest: (state, action) => {
      state.talentRequests.push(action.payload);
    },
    removeTalentRequest: (state, action) => {
      state.talentRequests = state.talentRequests.filter(request => request.Id !== action.payload);
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

export const { setTalentRequests, addTalentRequest, removeTalentRequest, setLoading, setError } = talentRequestsSlice.actions;
export default talentRequestsSlice.reducer;