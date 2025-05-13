import { createContext, useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import { setUser, clearUser } from './store/userSlice';
import getIcon from './utils/iconUtils';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Callback from './pages/Callback';
import ErrorPage from './pages/ErrorPage';
import NotFound from './pages/NotFound';
import CompanyRegistration from './pages/CompanyRegistration';
import Dashboard from './pages/Dashboard';
import JobListings from './pages/JobListings';
import CompanyDetails from './pages/CompanyDetails';
import SavedJobs from './pages/SavedJobs';
import PostJob from './pages/PostJob';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Create auth context
export const AuthContext = createContext(null);

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [darkMode, setDarkMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Get authentication status with proper error handling
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;

  useEffect(() => {
    // Check user preference
    const isDark = localStorage.getItem('darkMode') === 'true' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
  }, []);

  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        // CRITICAL: This exact currentPath logic must be preserved in all implementations
        // DO NOT simplify or modify this pattern as it ensures proper redirection flow
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath === '/login' || currentPath === '/signup';
        if (user) {
          // User is authenticated - store user details in Redux
          dispatch(setUser(JSON.parse(JSON.stringify(user))));
          // User is authenticated
          if (redirectPath) {
            navigate(redirectPath);
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath);
            } else {
              navigate('/');
            }
          } else {
            navigate('/');
          }
        } else {
          dispatch(clearUser());
          // User is not authenticated
          if (!isAuthPage) {
            navigate(
              currentPath.includes('/signup')
                ? `/signup?redirect=${currentPath}`
                : currentPath.includes('/login')
                  ? `/login?redirect=${currentPath}`
                  : '/login'
            );
          } else if (redirectPath) {
            navigate(`/login?redirect=${redirectPath}`);
          } else if (isAuthPage) {
            navigate(currentPath);
          } else {
            navigate('/login');
          }
        }
      },
      onError: function (error) {
        console.error("Authentication failed:", error);
        navigate('/error?message=' + encodeURIComponent(error.message || "Authentication failed"));
      }
    });

    setIsInitialized(true);
  }, [dispatch, navigate]);

  useEffect(() => {
    // Apply dark mode class to html element
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    isAuthenticated,
    toggleDarkMode: () => setDarkMode(!darkMode),
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

  return (
    <AuthContext.Provider value={authMethods}>
      <div className="min-h-screen flex flex-col">
        <Header darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />

        <main className="flex-grow">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/callback" element={<Callback />} />
            <Route path="/error" element={<ErrorPage />} />
            
            {/* Home route */}
            <Route path="/" element={<Home />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/jobs" element={<ProtectedRoute><JobListings /></ProtectedRoute>} />
            <Route path="/companies/:id" element={<ProtectedRoute><CompanyDetails /></ProtectedRoute>} />
            <Route path="/saved-jobs" element={<ProtectedRoute><SavedJobs /></ProtectedRoute>} />
            <Route path="/post-job" element={<ProtectedRoute><PostJob /></ProtectedRoute>} />
            <Route path="/register/company" element={<ProtectedRoute><CompanyRegistration /></ProtectedRoute>} />
            
            {/* Not found route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
      
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
      />
    </AuthContext.Provider>
  );
}

export default App;