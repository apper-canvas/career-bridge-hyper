import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

// Services
import { getCompanyById } from '../services/companyService';
import { fetchJobs } from '../services/jobService';

const CompanyDetails = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [companyJobs, setCompanyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Icons
  const BuildingIcon = getIcon('Building');
  const MapPinIcon = getIcon('MapPin');
  const GlobeIcon = getIcon('Globe');
  const MailIcon = getIcon('Mail');
  const PhoneIcon = getIcon('Phone');
  const ArrowLeftIcon = getIcon('ArrowLeft');
  const BriefcaseIcon = getIcon('Briefcase');

  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        setLoading(true);
        
        // Fetch company details
        const companyData = await getCompanyById(id);
        setCompany(companyData);
        
        // Fetch jobs for this company
        const jobsResponse = await fetchJobs({ companyId: id });
        setCompanyJobs(jobsResponse.data);
      } catch (error) {
        console.error("Error loading company data:", error);
        toast.error("Failed to load company details");
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      loadCompanyData();
    }
  }, [id]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }
  
  if (!company) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-surface-800 rounded-lg p-8 text-center border border-dashed border-surface-300 dark:border-surface-600">
          <h2 className="text-xl font-medium mb-2">Company not found</h2>
          <p className="text-surface-500 dark:text-surface-400 mb-4">
            The company you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/jobs" className="btn btn-primary">
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/jobs" className="flex items-center gap-1 text-primary mb-6 hover:underline">
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Jobs
      </Link>
      
      <div className="bg-white dark:bg-surface-800 rounded-lg shadow-md border border-surface-200 dark:border-surface-700 mb-8">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
              <BuildingIcon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">{company.companyName}</h1>
              <div className="flex items-center gap-1 text-surface-600 dark:text-surface-400">
                <MapPinIcon className="h-4 w-4" />
                <span>{company.location}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-3">About</h2>
              <p className="text-surface-700 dark:text-surface-300">
                {company.description || 'No company description available.'}
              </p>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-3">Details</h2>
              <div className="space-y-2 text-surface-700 dark:text-surface-300">
                <div className="flex items-center gap-2">
                  <span className="text-surface-500 dark:text-surface-400 w-24">Industry:</span>
                  <span>{company.industry}</span>
                </div>
                {company.website && (
                  <div className="flex items-center gap-2">
                    <span className="text-surface-500 dark:text-surface-400 w-24">Website:</span>
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                      {company.website} <GlobeIcon className="h-3 w-3" />
                    </a>
                  </div>
                )}
                {company.email && (
                  <div className="flex items-center gap-2">
                    <span className="text-surface-500 dark:text-surface-400 w-24">Email:</span>
                    <a href={`mailto:${company.email}`} className="text-primary hover:underline flex items-center gap-1">
                      {company.email} <MailIcon className="h-3 w-3" />
                    </a>
                  </div>
                )}
                {company.phone && (
                  <div className="flex items-center gap-2">
                    <span className="text-surface-500 dark:text-surface-400 w-24">Phone:</span>
                    <a href={`tel:${company.phone}`} className="text-primary hover:underline flex items-center gap-1">
                      {company.phone} <PhoneIcon className="h-3 w-3" />
                    </a>
                  </div>
                )}
                {company.address && (
                  <div className="flex items-center gap-2">
                    <span className="text-surface-500 dark:text-surface-400 w-24">Address:</span>
                    <span>{company.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <BriefcaseIcon className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Open Positions</h2>
        </div>
        
        {companyJobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {companyJobs.map(job => (
              <motion.div
                key={job.Id}
                whileHover={{ y: -2 }}
                className="bg-white dark:bg-surface-800 p-4 rounded-lg shadow-md border border-surface-200 dark:border-surface-700"
              >
                <h3 className="font-semibold mb-2">{job.title}</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`badge ${job.type === 'Internship' ? 'badge-blue' : 'badge-yellow'}`}>
                    {job.type}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-surface-600 dark:text-surface-400">
                    <MapPinIcon className="h-3 w-3" />
                    <span>{job.location}</span>
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <button className="btn btn-primary btn-sm">View Job</button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-surface-50 dark:bg-surface-800 p-6 rounded-lg text-center border border-dashed border-surface-300 dark:border-surface-600">
            <p className="text-surface-500 dark:text-surface-400">
              This company doesn't have any open positions at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDetails;