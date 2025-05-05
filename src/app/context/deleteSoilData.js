export default async function deleteSoilData(id) {
    const response = await fetch(`/api/deletecalibration/${id}`, {
      method: 'DELETE',
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete soil data');
    }
  
    return response.json();
  }