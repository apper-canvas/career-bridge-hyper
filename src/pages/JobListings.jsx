import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

// Services
import { fetchJobs } from '../services/jobService';
import { saveJob, unsaveJob, fetchSavedJobs } from '../services/savedJobService';

// Redux actions
import { setJobs, setLoading, setError, setFilters, setPagination } from '../store/jobsSlice';
import { setSavedJobs, addSavedJob, removeSavedJob } from '../store/savedJobsSlice';

const JobListings = () => {
  const dispatch = useDispatch();
  const jobs = useSelector(state => state.jobs.jobs);
  const loading = useSelector(state => state.jobs.loading);
  const filters = useSelector(state => state.jobs.filters);
  const pagination = useSelector(state => state.jobs.pagination);
  const savedJobIds = useSelector(state => state.savedJobs.savedJobs.map(job => job.job));
  const user = useSelector(state => state.user.user);
  
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({ ...filters });
  
  // Icons
  const SearchIcon = getIcon('Search');
  const FilterIcon = getIcon('SlidersHorizontal');
  const MapPinIcon = getIcon('MapPin');
  const BriefcaseIcon = getIcon('Briefcase');
  const CalendarIcon = getIcon('Calendar');
  const BuildingIcon = getIcon('Building');
  const BookmarkIcon = getIcon('Bookmark');
  const BookmarkPlusIcon = getIcon('BookmarkPlus');
  
  // Sample data for filter options
  const jobTypes = ["Full-time", "Part-time", "Internship", "Contract"];
  const locations = ["San Francisco, CA", "New York, NY", "Remote", "Chicago, IL", "Boston, MA", "Austin, TX"];
  const industries = ["Software Development", "Data Science", "Design", "Marketing", "Engineering", "Business"];
  
  // Load jobs and saved jobs on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        dispatch(setLoading(true));
        
        // Fetch jobs
        const response = await fetchJobs(filters, {
          limit: pagination.limit,
          offset: (pagination.currentPage - 1) * pagination.limit
        });
        
        dispatch(setJobs(response.data));
        dispatch(setPagination({
          totalPages: Math.ceil(response.total / pagination.limit)
        }));
        
        // Fetch saved jobs for the current user
        if (user) {
          const savedJobsData = await fetchSavedJobs(user.emailAddress);
          dispatch(setSavedJobs(savedJobsData));
        }
      } catch (error) {
        dispatch(setError(error.message));
      } finally {
        dispatch(setLoading(false));
      }
    };
    
    loadData();
  }, [dispatch, filters, pagination.currentPage, pagination.limit, user]);
  
  // Apply filters
  const applyFilters = () => {
    dispatch(setFilters(selectedFilters));
    dispatch(setPagination({ currentPage: 1 }));
    setShowFilters(false);
    toast.success("Filters applied successfully");
  };
  
  // Reset filters
  const resetFilters = () => {
    const defaultFilters = {
      jobType: '',
      location: '',
      industry: '',
      searchQuery: ''
    };
    setSelectedFilters(defaultFilters);
    dispatch(setFilters(defaultFilters));
    dispatch(setPagination({ currentPage: 1 }));
    toast.info("Filters have been reset");
  };
  
  // Toggle save job
  const toggleSaveJob = async (jobId) => {
    if (!user) {
      toast.error("Please login to save jobs");
      return;
    }
    
    try {
      if (savedJobIds.includes(jobId)) {
        // Find the saved job record to get its ID
        const savedJob = useSelector(state => 
          state.savedJobs.savedJobs.find(job => job.job === jobId)
        );
        
        if (savedJob) {
          await unsaveJob(savedJob.Id);
          dispatch(removeSavedJob(savedJob.Id));
          toast.info("Job removed from saved jobs");
        }
      } else {
        const result = await saveJob(jobId, user.emailAddress);
        if (!result.alreadySaved) {
          dispatch(addSavedJob(result.data));
          toast.success("Job saved successfully");
        } else {
          toast.info("Job was already saved");
        }
      }
    } catch (error) {
      console.error("Error toggling saved job:", error);
      toast.error("Failed to update saved jobs");
    }
  };
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSelectedFilters({
      ...selectedFilters,
      searchQuery: e.target.value
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Job Listings</h1>
      
      {/* Search and Filter Bar */}
      <div className="mb-6">
        <div className="relative flex flex-col md:flex-row gap-3">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search for jobs, companies, or keywords..."
              value={selectedFilters.searchQuery}
              onChange={handleSearchChange}
              className="input-field pl-10 pr-4 py-3 w-full"
            />
            <SearchIcon className="absolute left-3 top-3.5 h-5 w-5 text-surface-400" />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:w-auto w-full flex items-center justify-center gap-2 px-4 py-3 bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 rounded-lg transition-colors"
          >
            <FilterIcon className="h-5 w-5" />
            <span>Filters</span>
            {Object.values(filters).some(filter => filter) && (
              <span className="bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {Object.values(filters).filter(filter => filter).length}
              </span>
            )}
          </button>
        </div>
        
        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 p-4 bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 shadow-md"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Job Type</label>
                <select
                  value={selectedFilters.jobType}
                  onChange={(e) => setSelectedFilters({...selectedFilters, jobType: e.target.value})}
                  className="input-field"
                >
                  <option value="">All Job Types</option>
                  {jobTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <select
                  value={selectedFilters.location}
                  onChange={(e) => setSelectedFilters({...selectedFilters, location: e.target.value})}
                  className="input-field"
                >
                  <option value="">All Locations</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Industry</label>
                <select
                  value={selectedFilters.industry}
                  onChange={(e) => setSelectedFilters({...selectedFilters, industry: e.target.value})}
                  className="input-field"
                >
                  <option value="">All Industries</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
              >
                Reset
              </button>
              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      )}
      
      {/* Job listings */}
      {!loading && jobs.length === 0 && (
        <div className="text-center py-12 bg-surface-50 dark:bg-surface-800 rounded-lg border border-dashed border-surface-300 dark:border-surface-600">
          <div className="text-surface-400 mb-2">
            <SearchIcon className="h-10 w-10 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-surface-700 dark:text-surface-300 mb-1">
            No results found
          </h3>
          <p className="text-surface-500 dark:text-surface-400">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      )}
      
      {!loading && jobs.length > 0 && (
        <div className="space-y-4">
          {jobs.map(job => (
            <JobCard 
              key={job.Id} 
              job={job} 
              isSaved={savedJobIds.includes(job.Id)}
              onSaveToggle={() => toggleSaveJob(job.Id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Job Card Component
const JobCard = ({ job, isSaved, onSaveToggle }) => {
  const MapPinIcon = getIcon('MapPin');
  const BuildingIcon = getIcon('Building');
  const CalendarIcon = getIcon('Calendar');
  const BookmarkIcon = getIcon('Bookmark');
  const BookmarkPlusIcon = getIcon('BookmarkPlus');
  
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-surface-800 p-4 md:p-6 rounded-lg shadow-md border border-surface-200 dark:border-surface-700"
    >
      <div className="flex flex-col md:flex-row md:items-center">
        <div className="flex-grow">
          <div className="flex flex-col md:flex-row md:items-center mb-2 gap-2">
            <h3 className="font-semibold text-lg">{job.title}</h3>
            <div className="md:ml-2">
              <span className={`badge ${job.type === 'Internship' ? 'badge-blue' : 'badge-yellow'}`}>
                {job.type}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col gap-1 text-sm text-surface-600 dark:text-surface-400 mb-4">
            <div className="flex items-center gap-1">
              <BuildingIcon className="h-4 w-4" />
              <span>{job.companyDetails?.companyName || 'Company Name'}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPinIcon className="h-4 w-4" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              <span>Posted {new Date(job.CreatedOn).toLocaleDateString()}</span>
            </div>
          </div>
          
          <p className="text-surface-700 dark:text-surface-300 text-sm mb-3">
            {job.description}
          </p>
        </div>
        
        <div className="flex md:flex-col gap-2 mt-4 md:mt-0 md:ml-4">
          <button
            onClick={onSaveToggle}
            className={`p-2 rounded-full ${
              isSaved 
                ? 'bg-primary/10 text-primary dark:bg-primary/20'
                : 'bg-surface-100 dark:bg-surface-700 text-surface-500 dark:text-surface-400'
            }`}
            aria-label={isSaved ? "Unsave job" : "Save job"}
          >
            {isSaved ? <BookmarkIcon className="h-5 w-5" /> : <BookmarkPlusIcon className="h-5 w-5" />}
          </button>
          
          <button
            onClick={() => toast.success(`Applied to ${job.title}`)}
            className="btn btn-primary flex-grow md:mt-2"
          >
            Apply Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default JobListings;