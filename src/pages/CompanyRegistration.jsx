import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';
import { createCompany } from '../services/companyService';

const CompanyRegistration = () => {
  const navigate = useNavigate();
  const ArrowLeftIcon = getIcon('ArrowLeft');
  const BuildingIcon = getIcon('Building');
  const user = useSelector(state => state.user.user);
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    description: '',
  });
  const industries = ["Software Development", "Data Science", "Design", "Marketing", "Engineering", "Business"];
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    
    if (!formData.industry.trim()) {
      newErrors.industry = 'Industry is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.website.trim()) {
      newErrors.website = 'Website is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setIsSubmitting(true);
        
        // Prepare company data for API
        const companyData = {
          companyName: formData.companyName,
          industry: formData.industry,
          website: formData.website,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          description: formData.description,
          location: formData.location || 'Remote', // Default to Remote if not specified
          // Apper requires a Name field
          Name: formData.companyName,
          // Set owner if user is logged in
          Owner: user ? user.emailAddress : null
        };
        
        // Create company record
        const createdCompany = await createCompany(companyData);
        
        toast.success('Company registered successfully!');
        navigate('/dashboard');
      } catch (error) {
        toast.error('Failed to register company. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error('Please fix the errors in the form');
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
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-primary mb-6 hover:underline"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Home
        </button>
        
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <span className="p-2 bg-primary/10 rounded-full text-primary">
              <BuildingIcon className="h-6 w-6" />
            </span>
            <h1 className="text-2xl font-bold">Company Registration</h1>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Company Name*</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className={`input-field ${errors.companyName ? 'border-secondary focus:ring-secondary' : ''}`}
                />
                {errors.companyName && <p className="text-secondary text-sm mt-1">{errors.companyName}</p>}
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
                    <option key={index} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
                {errors.industry && <p className="text-secondary text-sm mt-1">{errors.industry}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Website*</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  className={`input-field ${errors.website ? 'border-secondary focus:ring-secondary' : ''}`}
                />
                {errors.website && <p className="text-secondary text-sm mt-1">{errors.website}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email*</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`input-field ${errors.email ? 'border-secondary focus:ring-secondary' : ''}`}
                />
                {errors.email && <p className="text-secondary text-sm mt-1">{errors.email}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="">Select Location</option>
                  <option value="San Francisco, CA">San Francisco, CA</option>
                  <option value="New York, NY">New York, NY</option>
                  <option value="Remote">Remote</option>
                  <option value="Chicago, IL">Chicago, IL</option>
                  <option value="Boston, MA">Boston, MA</option>
                  <option value="Austin, TX">Austin, TX</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="4"
                  className="input-field"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Company Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="input-field"
                ></textarea>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
              >
                {isSubmitting ? 'Registering...' : 'Register Company'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CompanyRegistration;