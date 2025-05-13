import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

// Services
import { createJob } from '../services/jobService';

const PostJob = () => {
  const navigate = useNavigate();
  const user = useSelector(state => state.user.user);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Icons
  const BriefcaseIcon = getIcon('Briefcase');
  const ArrowLeftIcon = getIcon('ArrowLeft');
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: '',
    description: '',
    skills: '',
    industry: '',
    requiredEducation: ''
  });
  
  // Form validation state
  const [errors, setErrors] = useState({});
  
  // Job types
  const jobTypes = ["Full-time", "Part-time", "Internship", "Contract"];
  
  // Locations
  const locations = ["San Francisco, CA", "New York, NY", "Remote", "Chicago, IL", "Boston, MA", "Austin, TX"];
  
  // Industries
  const industries = ["Software Development", "Data Science", "Design", "Marketing", "Engineering", "Business"];
  
  // Education levels
  const educationLevels = ["Bachelor's Degree", "Master's Degree", "PhD", "High School Diploma", "Associate Degree"];
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.type.trim()) newErrors.type = 'Job type is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.industry.trim()) newErrors.industry = 'Industry is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setIsSubmitting(true);
        
        // Prepare data for API
        const jobData = {
          title: formData.title,
          company: formData.company, // This should be the company ID from the company table
          location: formData.location,
          type: formData.type,
          description: formData.description,
          skills: formData.skills.split(',').map(skill => skill.trim()),
          industry: formData.industry,
          requiredEducation: formData.requiredEducation,
          Name: formData.title // The Name field is required for the job1 table
        };
        
        // Create job posting
        const createdJob = await createJob(jobData);
        
        toast.success("Job posted successfully!");
        navigate('/jobs');
      } catch (error) {
        console.error("Error posting job:", error);
        toast.error("Failed to post job");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error("Please fix the errors in the form");
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <button 
          onClick={() => navigate('/jobs')}
          className="flex items-center gap-1 text-primary mb-6 hover:underline"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Jobs
        </button>
        
        <div className="bg-white dark:bg-surface-800 rounded-lg p-6 shadow-md border border-surface-200 dark:border-surface-700">
          <div className="flex items-center gap-3 mb-6">
            <span className="p-2 bg-primary/10 rounded-full text-primary">
              <BriefcaseIcon className="h-6 w-6" />
            </span>
            <h1 className="text-2xl font-bold">Post a Job</h1>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Job Title*</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`input-field ${errors.title ? 'border-secondary focus:ring-secondary' : ''}`}
                  placeholder="e.g. Frontend Developer"
                />
                {errors.title && <p className="text-secondary text-sm mt-1">{errors.title}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Company*</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className={`input-field ${errors.company ? 'border-secondary focus:ring-secondary' : ''}`}
                  placeholder="e.g. TechSolutions Inc."
                />
                {errors.company && <p className="text-secondary text-sm mt-1">{errors.company}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Location*</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`input-field ${errors.location ? 'border-secondary focus:ring-secondary' : ''}`}
                >
                  <option value="">Select Location</option>
                  {locations.map((location, index) => (
                    <option key={index} value={location}>{location}</option>
                  ))}
                </select>
                {errors.location && <p className="text-secondary text-sm mt-1">{errors.location}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Job Type*</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className={`input-field ${errors.type ? 'border-secondary focus:ring-secondary' : ''}`}
                >
                  <option value="">Select Job Type</option>
                  {jobTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
                {errors.type && <p className="text-secondary text-sm mt-1">{errors.type}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Industry*</label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  className={`input-field ${errors.industry ? 'border-secondary focus:ring-secondary' : ''}`}
                >
                  <option value="">Select Industry</option>
                  {industries.map((industry, index) => (
                    <option key={index} value={industry}>{industry}</option>
                  ))}
                </select>
                {errors.industry && <p className="text-secondary text-sm mt-1">{errors.industry}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Required Education</label>
                <select
                  name="requiredEducation"
                  value={formData.requiredEducation}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="">Select Education Level</option>
                  {educationLevels.map((level, index) => (
                    <option key={index} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="e.g. React, JavaScript, CSS"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Job Description*</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="6"
                  className={`input-field ${errors.description ? 'border-secondary focus:ring-secondary' : ''}`}
                  placeholder="Describe the job responsibilities, requirements, and any other relevant details..."
                ></textarea>
                {errors.description && <p className="text-secondary text-sm mt-1">{errors.description}</p>}
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
              >
                {isSubmitting ? 'Posting...' : 'Post Job'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default PostJob;