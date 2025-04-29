import axios from "axios";

export const submitCalibrationData = async (calibrationData) => {
    try {
      const response = await axios.post('/api/setcalibration', calibrationData);
      return response.data; // Typically you want to return the data, not the whole response
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error submitting calibration data:', {
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