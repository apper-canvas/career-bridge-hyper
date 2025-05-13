import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

// Services
import { fetchSavedJobs, unsaveJob } from '../services/savedJobService';

// Redux actions
import { setSavedJobs, setLoading, setError, removeSavedJob } from '../store/savedJobsSlice';

const SavedJobs = () => {
  const dispatch = useDispatch();
  const savedJobs = useSelector(state => state.savedJobs.savedJobs);
  const loading = useSelector(state => state.savedJobs.loading);
  const user = useSelector(state => state.user.user);
  
  // Icons
  const BookmarkIcon = getIcon('Bookmark');
  const XIcon = getIcon('X');
  const MapPinIcon = getIcon('MapPin');
  const BuildingIcon = getIcon('Building');
  const CalendarIcon = getIcon('Calendar');
  
  useEffect(() => {
    const loadSavedJobs = async () => {
      if (!user) return;
      
      try {
        dispatch(setLoading(true));
        const savedJobsData = await fetchSavedJobs(user.emailAddress);
        dispatch(setSavedJobs(savedJobsData));
      } catch (error) {
        dispatch(setError(error.message));
        toast.error("Failed to load saved jobs");
      } finally {
        dispatch(setLoading(false));
      }
    };
    
    loadSavedJobs();
  }, [dispatch, user]);
  
  const handleRemoveSavedJob = async (savedJobId) => {
    try {
      await unsaveJob(savedJobId);
      dispatch(removeSavedJob(savedJobId));
      toast.success("Job removed from saved jobs");
    } catch (error) {
      console.error("Error removing saved job:", error);
      toast.error("Failed to remove job from saved jobs");
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-full bg-primary/10 text-primary">
          <BookmarkIcon className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold">Saved Jobs</h1>
      </div>
      
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      )}
      
      {/* No saved jobs */}
      {!loading && savedJobs.length === 0 && (
        <div className="bg-white dark:bg-surface-800 rounded-lg p-8 text-center border border-dashed border-surface-300 dark:border-surface-600">
          <BookmarkIcon className="h-12 w-12 mx-auto text-surface-400 mb-4" />
          <h2 className="text-xl font-medium mb-2">No saved jobs yet</h2>
          <p className="text-surface-500 dark:text-surface-400 mb-4">
            Browse jobs and save the ones you're interested in to see them here.
          </p>
          <button 
            onClick={() => window.location.href = "/jobs"}
            className="btn btn-primary"
          >
            Browse Jobs
          </button>
        </div>
      )}
      
      {/* Saved job listings */}
      {!loading && savedJobs.length > 0 && (
        <div className="space-y-4">
          {savedJobs.map(savedJob => (
            <motion.div
              key={savedJob.Id}
              whileHover={{ y: -2 }}
              className="bg-white dark:bg-surface-800 p-4 md:p-6 rounded-lg shadow-md border border-surface-200 dark:border-surface-700"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{savedJob.jobDetails?.title || 'Job Title'}</h3>
                  <div className="flex items-center gap-1 text-sm text-surface-600 dark:text-surface-400">
                    <BuildingIcon className="h-4 w-4" />
                    <span>{savedJob.jobDetails?.companyDetails?.companyName || 'Company Name'}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleRemoveSavedJob(savedJob.Id)}
                  className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 text-surface-500 dark:text-surface-400"
                  aria-label="Remove saved job"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-4 mt-2">
                {savedJob.jobDetails?.location && (
                  <div className="flex items-center gap-1 text-sm text-surface-600 dark:text-surface-400">
                    <MapPinIcon className="h-4 w-4" />
                    <span>{savedJob.jobDetails.location}</span>
                  </div>
                )}
                {savedJob.jobDetails?.type && (
                  <div className="text-sm">
                    <span className={`badge ${savedJob.jobDetails.type === 'Internship' ? 'badge-blue' : 'badge-yellow'}`}>
                      {savedJob.jobDetails.type}
                    </span>
                  </div>
                )}
                {savedJob.CreatedOn && (
                  <div className="flex items-center gap-1 text-sm text-surface-600 dark:text-surface-400">
                    <CalendarIcon className="h-4 w-4" />
                    <span>Saved on {new Date(savedJob.CreatedOn).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700 flex justify-end">
                <button className="btn btn-primary">
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;