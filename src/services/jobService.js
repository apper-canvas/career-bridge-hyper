import { toast } from 'react-toastify';

export const getJobClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const fetchJobs = async (filters = {}, pagination = { limit: 20, offset: 0 }) => {
  try {
    const client = getJobClient();
    
    const params = {
      Fields: [
        { Field: { Name: "Id" } },
        { Field: { Name: "Name" } },
        { Field: { Name: "title" } },
        { Field: { Name: "location" } },
        { Field: { Name: "type" } },
        { Field: { Name: "description" } },
        { Field: { Name: "skills" } },
        { Field: { Name: "industry" } },
        { Field: { Name: "requiredEducation" } },
        { Field: { Name: "company" } }
      ],
      expands: [
        {
          name: "company",
          alias: "companyDetails"
        }
      ],
      pagingInfo: {
        limit: pagination.limit,
        offset: pagination.offset
      }
    };
    
    // Add filters if provided
    let whereConditions = [];
    
    if (filters.jobType) {
      whereConditions.push({
        fieldName: "type",
        operator: "ExactMatch",
        values: [filters.jobType]
      });
    }
    
    if (filters.location) {
      whereConditions.push({
        fieldName: "location",
        operator: "ExactMatch",
        values: [filters.location]
      });
    }
    
    if (filters.industry) {
      whereConditions.push({
        fieldName: "industry",
        operator: "ExactMatch",
        values: [filters.industry]
      });
    }
    
    if (filters.searchQuery) {
      whereConditions.push({
        operator: "OR",
        conditions: [
          {
            fieldName: "title",
            operator: "Contains",
            values: [filters.searchQuery]
          },
          {
            fieldName: "description",
            operator: "Contains",
            values: [filters.searchQuery]
          }
        ]
      });
    }
    
    if (whereConditions.length > 0) {
      params.where = whereConditions;
    }
    
    const response = await client.fetchRecords('job1', params);
    return {
      data: response.data || [],
      total: response.totalCount || 0
    };
  } catch (error) {
    console.error("Error fetching jobs:", error);
    toast.error("Failed to load jobs");
    throw error;
  }
};

export const getJobById = async (jobId) => {
  try {
    const client = getJobClient();
    const params = {
      expands: [
        {
          name: "company",
          alias: "companyDetails"
        }
      ]
    };
    const response = await client.getRecordById('job1', jobId, params);
    return response.data;
  } catch (error) {
    console.error(`Error fetching job with ID ${jobId}:`, error);
    toast.error("Failed to load job details");
    throw error;
  }
};

export const createJob = async (jobData) => {
  try {
    const client = getJobClient();
    const params = {
      records: [jobData]
    };
    const response = await client.createRecord('job1', params);
    return response.results[0].data;
  } catch (error) {
    console.error("Error creating job:", error);
    toast.error("Failed to create job posting");
    throw error;
  }
};