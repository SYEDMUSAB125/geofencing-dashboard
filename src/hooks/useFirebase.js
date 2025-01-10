import { database } from '@/firebase/firebase';
import { ref, set, get, remove, update } from 'firebase/database';

export const useFirebase = () => {
  const saveFieldData = async (userId, fieldData) => {
    try {
      // Reference to the user's farm name in Firebase
      const farmRef = ref(database, `farmer/${userId}/data/${fieldData.farmName}`);

      // Save lat and longitude under the farm name
      await set(farmRef, {
        lat: fieldData.lat,
        long: fieldData.long,
      });

      console.log('Field data saved successfully!');
    } catch (error) {
      console.error('Error saving field data:', error);
    }
  };

  const fetchFieldData = async () => {
    try {
      const refPath = ref(database, "farmer");
      const snapshot = await get(refPath);

      if (snapshot.exists()) {
        const data = snapshot.val();

        // Transform the nested data structure into an array format
        const farms = [];
        Object.keys(data).forEach((userId) => {
          const userFarms = data[userId].data || {};
          Object.keys(userFarms).forEach((farmName) => {
            farms.push({
              id: `${userId}-${farmName}`, // Create a unique ID combining userId and farmName
              userId,
              farmName,
              lat: userFarms[farmName].lat,
              long: userFarms[farmName].long,
            });
          });
        });

        return farms;
      }

      return [];
    } catch (error) {
      console.error('Error fetching field data:', error);
      return [];
    }
  };

  const deleteFieldData = async (id) => {
    try {
      const [userId, farmName] = id.split('-'); // Split the unique ID to get userId and farmName
      const refPath = ref(database, `farmer/${userId}/data/${farmName}`);
      await remove(refPath);
      console.log('Field data deleted successfully!');
    } catch (error) {
      console.error('Error deleting field data:', error);
    }
  };

  const updateFieldData = async (id, updatedData) => {
    try {
      const [userId, farmName] = id.split('-'); // Split the unique ID to get userId and farmName
      const refPath = ref(database, `farmer/${userId}/data/${farmName}`);
      await update(refPath, updatedData);
      console.log('Field data updated successfully!');
    } catch (error) {
      console.error('Error updating field data:', error);
    }
  };

  return { saveFieldData, fetchFieldData, deleteFieldData, updateFieldData };
};