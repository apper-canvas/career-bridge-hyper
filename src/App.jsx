import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import getIcon from './utils/iconUtils';

// Pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  

  useEffect(() => {
    // Check user preference
    const isDark = localStorage.getItem('darkMode') === 'true' || 
                  window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
  }, []);

  useEffect(() => {
    // Apply dark mode class to html element
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <>
      <div className="min-h-screen flex flex-col">
        {/* Header/Navbar */}
        <header className="sticky top-0 z-40 bg-white/90 dark:bg-surface-800/90 backdrop-blur-sm border-b border-surface-200 dark:border-surface-700">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div 
                initial={{ rotate: -15 }} 
                animate={{ rotate: 0 }} 
                transition={{ duration: 0.5 }}
                className="text-primary"
              >
                {React.createElement(getIcon('Briefcase'), { className: "h-7 w-7" })}
              </motion.div>
              <h1 className="text-xl font-bold flex items-center gap-1">
                CareerBridge
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? React.createElement(getIcon('Sun'), { className: "h-5 w-5 text-amber-400" }) : React.createElement(getIcon('Moon'), { className: "h-5 w-5 text-primary" })}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700 py-6 mt-8">
          <div className="container mx-auto px-4 text-center text-surface-500 dark:text-surface-400 text-sm">
            © {new Date().getFullYear()} CareerBridge. All rights reserved.
          </div>
        </footer>
      </div>
      
      {/* Toast Notifications Container */}
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
    </>
  );
}

export default App;