import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

  const navigate = useNavigate();
  
// Icons
const SearchIcon = getIcon('Search');
const FilterIcon = getIcon('SlidersHorizontal');
const MapPinIcon = getIcon('MapPin');
const BriefcaseIcon = getIcon('Briefcase');
const CalendarIcon = getIcon('Calendar');
const BuildingIcon = getIcon('Building');
const GraduationCapIcon = getIcon('GraduationCap');
const BookmarkIcon = getIcon('Bookmark');
const BookmarkPlusIcon = getIcon('BookmarkPlus');
const XIcon = getIcon('X');
const CheckIcon = getIcon('Check');
const BookOpenIcon = getIcon('BookOpen');
const CodeIcon = getIcon('Code');
const PaintBrushIcon = getIcon('Paintbrush');
const MicIcon = getIcon('Mic');
const UsersIcon = getIcon('Users');

const MainFeature = ({ activeTab }) => {
  // Jobs/Listings state and data
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    jobType: '',
    location: '',
    industry: ''
  });
  const [appliedFilters, setAppliedFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);

  // Sample job data
  const jobListings = [
    {
      id: 1,
      title: "Frontend Developer Intern",
      company: "TechSolutions Inc.",
      location: "San Francisco, CA",
      type: "Internship",
      posted: "2 days ago",
      description: "Exciting opportunity for a Frontend Developer Intern to work on React-based web applications.",
      skills: ["React", "JavaScript", "CSS"],
      industry: "Software Development"
    },
    {
      id: 2,
      title: "UX/UI Design Internship",
      company: "Creative Minds Studio",
      location: "New York, NY",
      type: "Internship",
      posted: "5 days ago",
      description: "Join our design team to create beautiful user experiences for mobile and web applications.",
      skills: ["Figma", "UI Design", "Prototyping"],
      industry: "Design"
    },
    {
      id: 3,
      title: "Data Science Graduate Position",
      company: "Analytics Pro",
      location: "Remote",
      type: "Full-time",
      posted: "1 week ago",
      description: "Looking for a recent graduate with strong analytical skills to join our data science team.",
      skills: ["Python", "Machine Learning", "SQL"],
      industry: "Data Science"
    },
    {
      id: 4,
      title: "Marketing Coordinator",
      company: "Brand Builders",
      location: "Chicago, IL",
      type: "Full-time",
      posted: "3 days ago",
      description: "Help coordinate marketing campaigns and social media strategies for our clients.",
      skills: ["Social Media", "Content Creation", "Analytics"],
      industry: "Marketing"
    }
  ];

  // Education level options for talent search
  const educationLevels = [
    "Bachelor's Degree",
    "Master's Degree",
    "PhD",
    "High School Diploma",
    "Associate Degree"
  ];

  // Sample industries for filter
  const industries = [
    "Software Development",
    "Data Science",
    "Design",
    "Marketing",
    "Engineering",
    "Business"
  ];

  // Job types
  const jobTypes = ["Full-time", "Part-time", "Internship", "Contract"];

  // Locations
  const locations = [
    "San Francisco, CA",
    "New York, NY",
    "Remote",
    "Chicago, IL",
    "Boston, MA"
  ];

  // Get icon based on industry
  const getIndustryIcon = (industry) => {
    switch (industry) {
      case "Software Development":
        return CodeIcon;
      case "Design":
        return PaintBrushIcon;
      case "Marketing":
        return MicIcon;
      case "Data Science":
        return BookOpenIcon;
      case "Business":
        return UsersIcon;
      default:
        return BriefcaseIcon;
    }
  };

  // Filter jobs based on search and filters
  const filteredJobs = jobListings.filter(job => {
    // Search query filter
    const matchesSearch = 
      searchQuery === '' || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Applied filters
    const matchesJobType = !appliedFilters.jobType || job.type === appliedFilters.jobType;
    const matchesLocation = !appliedFilters.location || job.location === appliedFilters.location;
    const matchesIndustry = !appliedFilters.industry || job.industry === appliedFilters.industry;
    
    return matchesSearch && matchesJobType && matchesLocation && matchesIndustry;
  });

  // Apply filters
  const applyFilters = () => {
    setAppliedFilters({...selectedFilters});
    setShowFilters(false);
    toast.success("Filters applied successfully");
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedFilters({
      jobType: '',
      location: '',
      industry: ''
    });
    setAppliedFilters({});
    toast.info("Filters have been reset");
  };

  // Toggle save job
  const toggleSaveJob = (jobId) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter(id => id !== jobId));
      toast.info("Job removed from saved jobs");
    } else {
      setSavedJobs([...savedJobs, jobId]);
      toast.success("Job saved successfully");
    }
  };

  return (
    <div className="w-full">
      {/* Tabs Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
              <button 
                className="btn btn-primary" 
                onClick={() => navigate('/register/company')}
              >Register Now</button>
          {activeTab === 'jobs' && (
            <div>
              {/* Search and Filter Bar */}
              <div className="mb-6">
                <div className="relative flex flex-col md:flex-row gap-3">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      placeholder="Search for jobs, companies, or keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
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
                    {Object.values(appliedFilters).some(filter => filter) && (
                      <span className="bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {Object.values(appliedFilters).filter(filter => filter).length}
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
              
              {/* Results Count */}
              <div className="mb-4 text-surface-500 dark:text-surface-400 text-sm">
                Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'result' : 'results'}
              </div>
              
              {/* Job Listings */}
              {filteredJobs.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {filteredJobs.map(job => {
                    const IndustryIcon = getIndustryIcon(job.industry);
                    const isSaved = savedJobs.includes(job.id);
                    
                    return (
                      <motion.div
                        key={job.id}
                        whileHover={{ y: -2 }}
                        className="job-card flex flex-col md:flex-row md:items-center"
                      >
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
                              <span>{job.company}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPinIcon className="h-4 w-4" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="h-4 w-4" />
                              <span>Posted {job.posted}</span>
                            </div>
                          </div>
                          
                          <p className="text-surface-700 dark:text-surface-300 text-sm mb-3">
                            {job.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-1 mb-4">
                            {job.skills.map(skill => (
                              <span key={skill} className="text-xs bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 px-2 py-1 rounded-full">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex md:flex-col gap-2 mt-4 md:mt-0 md:ml-4">
                          <button
                            onClick={() => toggleSaveJob(job.id)}
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
                            onClick={() => toast.success(`Applied to ${job.title} at ${job.company}`)}
                            className="btn btn-primary flex-grow md:mt-2"
                          >
                            Apply Now
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
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
            </div>
          )}

          {/* Find Talent Tab */}
          {activeTab === 'talent' && (
            <div>
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 p-6 rounded-lg mb-6">
                <h2 className="text-2xl font-bold mb-3">Find Top Student Talent</h2>
                <p className="text-surface-600 dark:text-surface-300 mb-4">
                  Post a job and reach thousands of qualified students and recent graduates.
                </p>
                <button 
                  onClick={() => toast.success("Your job posting form is now ready!")}
                  className="btn btn-primary"
                >
                  Post a Job
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <GraduationCapIcon className="h-5 w-5 text-primary" />
                    Browse by Education
                  </h3>
                  <div className="space-y-2">
                    {educationLevels.map((level, index) => (
                      <div 
                        key={index}
                        onClick={() => toast.info(`Browsing candidates with ${level}`)}
                        className="p-3 bg-surface-50 dark:bg-surface-800 rounded-lg cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors flex justify-between items-center"
                      >
                        <span>{level}</span>
                        <span className="text-xs bg-surface-200 dark:bg-surface-600 px-2 py-1 rounded-full">
                          {Math.floor(Math.random() * 500) + 100}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <CodeIcon className="h-5 w-5 text-primary" />
                    Browse by Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {["React", "JavaScript", "Python", "UI Design", "Data Analysis", "Java", "SQL", "Machine Learning", "Project Management", "Digital Marketing"].map((skill, index) => (
                      <div 
                        key={index}
                        onClick={() => toast.info(`Browsing candidates with ${skill} skills`)}
                        className="px-3 py-2 bg-surface-50 dark:bg-surface-800 rounded-lg cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors text-sm"
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Talent Request Form</h3>
                </div>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  toast.success("Talent request submitted successfully!");
                }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Position Title</label>
                      <input type="text" className="input-field" placeholder="e.g. Frontend Developer" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Employment Type</label>
                      <select className="input-field">
                        <option value="">Select Type</option>
                        {jobTypes.map((type, index) => (
                          <option key={index} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Required Skills</label>
                      <input type="text" className="input-field" placeholder="e.g. React, JavaScript, CSS" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Education Level</label>
                      <select className="input-field">
                        <option value="">Select Education Level</option>
                        {educationLevels.map((level, index) => (
                          <option key={index} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Position Description</label>
                    <textarea className="input-field min-h-[100px]" placeholder="Describe the position and requirements..."></textarea>
                  </div>
                  
                  <div className="flex justify-end">
                    <button type="submit" className="btn btn-primary">
                      Submit Request
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Companies Tab */}
          {activeTab === 'companies' && (
            <div>
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for companies..."
                    className="input-field pl-10 pr-4 py-3 w-full"
                    onChange={() => toast.info("Searching companies...")}
                  />
                  <SearchIcon className="absolute left-3 top-3.5 h-5 w-5 text-surface-400" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {[
                  { name: "TechSolutions Inc.", industry: "Software Development", location: "San Francisco, CA", openings: 12 },
                  { name: "Creative Minds Studio", industry: "Design", location: "New York, NY", openings: 5 },
                  { name: "Analytics Pro", industry: "Data Science", location: "Remote", openings: 8 },
                  { name: "Brand Builders", industry: "Marketing", location: "Chicago, IL", openings: 3 },
                  { name: "Global Engineering", industry: "Engineering", location: "Boston, MA", openings: 7 },
                  { name: "Business Champions", industry: "Business", location: "Austin, TX", openings: 4 }
                ].map((company, index) => {
                  const CompanyIcon = getIndustryIcon(company.industry);
                  
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className="card cursor-pointer"
                      onClick={() => toast.info(`Viewing details for ${company.name}`)}
                    >
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mr-3">
                          <CompanyIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{company.name}</h3>
                          <p className="text-sm text-surface-500 dark:text-surface-400">{company.industry}</p>
                        </div>
                      </div>
                      
                      <div className="text-sm text-surface-600 dark:text-surface-400 mb-3">
                        <div className="flex items-center gap-1 mb-1">
                          <MapPinIcon className="h-4 w-4" />
                          <span>{company.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BriefcaseIcon className="h-4 w-4" />
                          <span>{company.openings} open positions</span>
                        </div>
                      </div>
                      
                      <button className="w-full py-2 text-sm text-primary hover:bg-primary/5 dark:hover:bg-primary/10 rounded-lg transition-colors">
                        View Company
                      </button>
                    </motion.div>
                  );
                })}
              </div>
              
              <div className="card bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 border border-primary/20">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold mb-2">Add Your Company</h3>
                    <p className="text-surface-600 dark:text-surface-300">
                      Register your company to post jobs and connect with student talent.
                    </p>
                  </div>
                  <button 
                    onClick={() => toast.success("Company registration form opened!")}
                    className="btn btn-primary whitespace-nowrap"
                  >
                    Register Now
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MainFeature;