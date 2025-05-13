import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import jobsReducer from './jobsSlice';
import companiesReducer from './companiesSlice';
import savedJobsReducer from './savedJobsSlice';
import talentRequestsReducer from './talentRequestsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    jobs: jobsReducer,
    companies: companiesReducer,
    savedJobs: savedJobsReducer,
    talentRequests: talentRequestsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});