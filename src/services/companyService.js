import { toast } from 'react-toastify';

export const getCompanyClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const fetchCompanies = async (filters = {}) => {
  try {
    const client = getCompanyClient();
    
    const params = {
      Fields: [
        { Field: { Name: "Id" } },
        { Field: { Name: "Name" } },
        { Field: { Name: "companyName" } },
        { Field: { Name: "industry" } },
        { Field: { Name: "website" } },
        { Field: { Name: "email" } },
        { Field: { Name: "phone" } },
        { Field: { Name: "address" } },
        { Field: { Name: "description" } },
        { Field: { Name: "location" } }
      ]
    };
    
    // Add filters if provided
    if (filters.industry) {
      params.where = [
        {
          fieldName: "industry",
          operator: "ExactMatch",
          values: [filters.industry]
        }
      ];
    }
    
    // Add location filter if provided
    if (filters.location) {
      if (!params.where) params.where = [];
      params.where.push({
        fieldName: "location",
        operator: "ExactMatch",
        values: [filters.location]
      });
    }
    
    // Add search query if provided
    if (filters.searchQuery) {
      if (!params.where) params.where = [];
      params.where.push({
        fieldName: "companyName",
        operator: "Contains",
        values: [filters.searchQuery]
      });
    }
    
    const response = await client.fetchRecords('company', params);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching companies:", error);
    toast.error("Failed to load companies");
    throw error;
  }
};

export const getCompanyById = async (companyId) => {
  try {
    const client = getCompanyClient();
    const response = await client.getRecordById('company', companyId);
    return response.data;
  } catch (error) {
    console.error(`Error fetching company with ID ${companyId}:`, error);
    toast.error("Failed to load company details");
    throw error;
  }
};

export const createCompany = async (companyData) => {
  try {
    const client = getCompanyClient();
    const params = {
      records: [
        companyData
      ]
    };
    const response = await client.createRecord('company', params);
    return response.results[0].data;
  } catch (error) {
    console.error("Error creating company:", error);
    toast.error("Failed to create company");
    throw error;
  }
};