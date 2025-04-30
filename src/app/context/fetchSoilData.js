import axios from "axios";

export const fetchSoilData = async () => {
  try {
    const response = await axios.get('/api/soildata');

    return response.data; // Returns the array of soil data objects
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching soil data:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
    } else {
      console.error('Unexpected error:', error);
    }
    throw error; 
  }
};