import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

const NotFound = () => {
  // Import icons
  const AlertTriangleIcon = getIcon('AlertTriangle');
  const HomeIcon = getIcon('Home');

  return (
    <div className="container mx-auto px-4 py-16 min-h-[70vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md w-full"
      >
        <div className="bg-surface-100 dark:bg-surface-800 p-2 rounded-full inline-flex items-center justify-center mb-6">
          <AlertTriangleIcon className="h-12 w-12 text-secondary" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-surface-800 dark:text-surface-100">
          404
        </h1>
        
        <p className="text-xl md:text-2xl font-semibold mb-2 text-surface-700 dark:text-surface-200">
          Page Not Found
        </p>
        
        <p className="text-surface-600 dark:text-surface-300 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white py-2 px-6 rounded-lg transition-colors font-medium shadow-lg shadow-primary/20"
        >
          <HomeIcon className="h-5 w-5" />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;