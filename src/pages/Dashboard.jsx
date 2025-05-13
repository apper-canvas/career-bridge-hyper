import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

// Services
import { fetchJobs } from '../services/jobService';
import { fetchSavedJobs } from '../services/savedJobService';
import { fetchTalentRequests } from '../services/talentRequestService';

const Dashboard = () => {
  const user = useSelector(state => state.user.user);
  const [recentJobs, setRecentJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [talentRequests, setTalentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const BriefcaseIcon = getIcon('Briefcase');
  const BookmarkIcon = getIcon('Bookmark');
  const UserSearchIcon = getIcon('UserSearch');
  const BuildingIcon = getIcon('Building');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch recent jobs
        const jobsResponse = await fetchJobs({}, { limit: 5, offset: 0 });
        setRecentJobs(jobsResponse.data);
        
        // Fetch saved jobs
        if (user) {
          const savedJobsData = await fetchSavedJobs(user.emailAddress);
          setSavedJobs(savedJobsData);
          
          // Fetch talent requests
          const talentRequestsData = await fetchTalentRequests(user.emailAddress);
          setTalentRequests(talentRequestsData);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        {/* Welcome Card */}
        <div className="bg-white dark:bg-surface-800 rounded-lg p-6 shadow-md mb-8 border border-surface-200 dark:border-surface-700">
          <h2 className="text-xl font-semibold mb-2">Welcome, {user?.firstName || 'User'}!</h2>
          <p className="text-surface-600 dark:text-surface-400 mb-4">
            Manage your job search, saved positions, and talent requests all in one place.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/jobs" className="btn btn-primary flex items-center gap-2">
              <BriefcaseIcon className="h-4 w-4" />
              Browse Jobs
            </Link>
            <Link to="/saved-jobs" className="btn btn-secondary flex items-center gap-2">
              <BookmarkIcon className="h-4 w-4" />
              Saved Jobs
            </Link>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-surface-800 rounded-lg p-5 shadow-md border border-surface-200 dark:border-surface-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-full text-primary">
                <BriefcaseIcon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">Recent Jobs</h3>
            </div>
            <p className="text-2xl font-bold">{recentJobs.length}</p>
          </div>
          
          <div className="bg-white dark:bg-surface-800 rounded-lg p-5 shadow-md border border-surface-200 dark:border-surface-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-secondary/10 dark:bg-secondary/20 rounded-full text-secondary">
                <BookmarkIcon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">Saved Jobs</h3>
            </div>
            <p className="text-2xl font-bold">{savedJobs.length}</p>
          </div>
          
          <div className="bg-white dark:bg-surface-800 rounded-lg p-5 shadow-md border border-surface-200 dark:border-surface-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-accent/10 dark:bg-accent/20 rounded-full text-accent-dark">
                <UserSearchIcon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">Talent Requests</h3>
            </div>
            <p className="text-2xl font-bold">{talentRequests.length}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;