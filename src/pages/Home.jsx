import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

// Icons
const BriefcaseIcon = getIcon('Briefcase');
const UserSearchIcon = getIcon('UserSearch');
const BuildingIcon = getIcon('Building');

const Home = () => {
  const [selectedTab, setSelectedTab] = useState('jobs');
  
  const tabs = [
    { id: 'jobs', label: 'Job Listings', icon: BriefcaseIcon },
    { id: 'talent', label: 'Find Talent', icon: UserSearchIcon },
    { id: 'companies', label: 'Companies', icon: BuildingIcon },
  ];
  
  const handleTabChange = (tabId) => {
    setSelectedTab(tabId);
    toast.info(`Switched to ${tabs.find(tab => tab.id === tabId).label}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-800 dark:text-surface-50 mb-4">
            Your Bridge to <span className="text-primary">Career Success</span>
          </h1>
          <p className="text-lg md:text-xl text-surface-600 dark:text-surface-300 mb-8">
            Connect with the best job and internship opportunities tailored for students
          </p>
          
          <div className="bg-white dark:bg-surface-800 p-4 rounded-xl shadow-soft border border-surface-200 dark:border-surface-700">
            <div className="flex flex-wrap gap-2 mb-4 border-b border-surface-200 dark:border-surface-700">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm md:text-base font-medium transition-colors relative
                    ${selectedTab === tab.id 
                      ? 'text-primary bg-primary/5 dark:bg-primary/10' 
                      : 'text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200'
                    }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                  {selectedTab === tab.id && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    />
                  )}
                </button>
              ))}
            </div>
            
            <div className="py-2">
              <MainFeature activeTab={selectedTab} />
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;