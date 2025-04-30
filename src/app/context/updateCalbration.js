export default async function updateCalibrationData(data) {
    try {
      const response = await fetch('/api/updatecalibration', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update calibration data');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Update error:', error);
      throw error;
    }
  }