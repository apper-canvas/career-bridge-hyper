import { toast } from 'react-toastify';

export const getTalentRequestClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const fetchTalentRequests = async (userId) => {
  try {
    const client = getTalentRequestClient();
    
    const params = {
      Fields: [
        { Field: { Name: "Id" } },
        { Field: { Name: "Name" } },
        { Field: { Name: "positionTitle" } },
        { Field: { Name: "employmentType" } },
        { Field: { Name: "requiredSkills" } },
        { Field: { Name: "educationLevel" } },
        { Field: { Name: "description" } },
        { Field: { Name: "Owner" } }
      ],
      where: userId ? [
        {
          fieldName: "Owner",
          operator: "ExactMatch",
          values: [userId]
        }
      ] : []
    };
    
    const response = await client.fetchRecords('talent_request', params);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching talent requests:", error);
    toast.error("Failed to load talent requests");
    throw error;
  }
};

export const createTalentRequest = async (requestData) => {
  try {
    const client = getTalentRequestClient();
    const response = await client.createRecord('talent_request', { records: [requestData] });
    return response.results[0].data;
  } catch (error) {
    console.error("Error creating talent request:", error);
    toast.error("Failed to submit talent request");
    throw error;
  }
};