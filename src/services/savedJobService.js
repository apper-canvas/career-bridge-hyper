import { toast } from 'react-toastify';

export const getSavedJobClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const fetchSavedJobs = async (userId) => {
  try {
    const client = getSavedJobClient();
    
    const params = {
      Fields: [
        { Field: { Name: "Id" } },
        { Field: { Name: "Name" } },
        { Field: { Name: "job" } },
        { Field: { Name: "Owner" } }
      ],
      expands: [
        {
          name: "job",
          alias: "jobDetails"
        }
      ],
      where: [
        {
          fieldName: "Owner",
          operator: "ExactMatch",
          values: [userId]
        }
      ]
    };
    
    const response = await client.fetchRecords('saved_job1', params);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    toast.error("Failed to load saved jobs");
    throw error;
  }
};

export const saveJob = async (jobId, userId) => {
  try {
    const client = getSavedJobClient();
    
    // Check if already saved
    const checkParams = {
      where: [
        {
          fieldName: "job",
          operator: "ExactMatch",
          values: [jobId]
        },
        {
          fieldName: "Owner",
          operator: "ExactMatch",
          values: [userId]
        }
      ]
    };
    
    const checkResponse = await client.fetchRecords('saved_job1', checkParams);
    
    if (checkResponse.data && checkResponse.data.length > 0) {
      return { alreadySaved: true, data: checkResponse.data[0] };
    }
    
    // Save the job if not already saved
    const params = {
      records: [{ 
        job: jobId,
        Name: `Saved Job ${jobId}`
      }]
    };
    const response = await client.createRecord('saved_job1', params);
    return { alreadySaved: false, data: response.results[0].data };
  } catch (error) {
    console.error("Error saving job:", error);
    toast.error("Failed to save job");
    throw error;
  }
};

export const unsaveJob = async (savedJobId) => {
  try {
    const client = getSavedJobClient();
    const params = {
      RecordIds: [savedJobId]
    };
    await client.deleteRecord('saved_job1', params);
    return true;
  } catch (error) {
    console.error("Error removing saved job:", error);
    toast.error("Failed to remove saved job");
    throw error;
  }
};