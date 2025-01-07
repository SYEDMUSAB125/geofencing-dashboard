import { database } from '@/firebase/firebase';
import { getDatabase, ref, set, get, remove, update} from 'firebase/database';

export const useFirebase = () => {
  const saveFieldData = async (userId, fieldData) => {
    try {
      // Reference to the user's farm name in Firebase
      const farmRef = ref(database, `farmers/${userId}/data/${fieldData.farmName}`);

      // Save latitude and longitude under the farm name
      await set(farmRef, {
        latitude: fieldData.latitude,
        longitude: fieldData.longitude,
      });

      console.log('Field data saved successfully!');
    } catch (error) {
      console.error('Error saving field data:', error);
    }
  };
  const fetchFieldData = async () => {
    const refPath = ref(database, "farms");
    const snapshot = await get(refPath);
    if (snapshot.exists()) {
      const data = snapshot.val();
      // Transform the data into an array format
      return Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
    }
    return [];
  };

  const deleteFieldData = async (id) => {
    const refPath = ref(database, `farms/${id}`);
    await remove(refPath);
  };

  const updateFieldData = async (id, updatedData) => {
    const refPath = ref(database, `farms/${id}`);
    await update(refPath, updatedData);
  };

  return { saveFieldData, fetchFieldData, deleteFieldData, updateFieldData };
};
