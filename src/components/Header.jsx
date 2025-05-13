import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { AuthContext } from '../App';
import getIcon from '../utils/iconUtils';

const Header = ({ darkMode, toggleDarkMode }) => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const user = useSelector(state => state.user?.user);
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const BriefcaseIcon = getIcon('Briefcase');
  const UserIcon = getIcon('User');
  const SunIcon = getIcon('Sun');
  const MoonIcon = getIcon('Moon');
  const LogOutIcon = getIcon('LogOut');
  const BookmarkIcon = getIcon('Bookmark');
  const BuildingIcon = getIcon('Building');

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-surface-800/90 backdrop-blur-sm border-b border-surface-200 dark:border-surface-700">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <motion.div 
            initial={{ rotate: -15 }} 
            animate={{ rotate: 0 }} 
            transition={{ duration: 0.5 }}
            className="text-primary"
          >
            <BriefcaseIcon className="h-7 w-7" />
          </motion.div>
          <h1 className="text-xl font-bold flex items-center gap-1">
            CareerBridge
          </h1>
        </Link>
        
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <div className="relative">
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 p-2 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
              >
                <UserIcon className="h-5 w-5" />
                <span className="hidden md:inline text-sm font-medium">{user?.firstName || 'User'}</span>
              </button>
              
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-surface-800 rounded-lg shadow-lg border border-surface-200 dark:border-surface-700">
                  <Link to="/saved-jobs" className="block px-4 py-2 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors flex items-center gap-2"><BookmarkIcon className="h-4 w-4" /> Saved Jobs</Link>
                  <Link to="/dashboard" className="block px-4 py-2 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors flex items-center gap-2"><BuildingIcon className="h-4 w-4" /> Dashboard</Link>
                  <button onClick={logout} className="w-full text-left px-4 py-2 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors flex items-center gap-2 text-secondary"><LogOutIcon className="h-4 w-4" /> Logout</button>
                </div>
              )}
            </div>
          )}
          <button onClick={toggleDarkMode} className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors" aria-label="Toggle dark mode">
            {darkMode ? <SunIcon className="h-5 w-5 text-amber-400" /> : <MoonIcon className="h-5 w-5 text-primary" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;