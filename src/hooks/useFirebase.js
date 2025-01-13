import { database } from '@/firebase/firebase';
import { ref, set, get, remove, update } from 'firebase/database';

export const useFirebase = () => {
  const saveFieldData = async (userId, fieldData) => {
    try {
      const farmRef = ref(database, `farmer/${userId}/data/${fieldData.farmName}`);
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
        const farms = [];
        Object.keys(data).forEach((userId) => {
          const userFarms = data[userId].data || {};
          Object.keys(userFarms).forEach((farmName) => {
            farms.push({
              id: `${userId}-${farmName}`,
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
      const [userId, farmName] = id.split('-');
      const refPath = ref(database, `farmer/${userId}/data/${farmName}`);
      await remove(refPath);
      console.log('Field data deleted successfully!');
    } catch (error) {
      console.error('Error deleting field data:', error);
    }
  };

  const updateFieldData = async (id, updatedData) => {
    try {
      const [userId, farmName] = id.split('-');
      const refPath = ref(database, `farmer/${userId}/data/${farmName}`);
      await update(refPath, updatedData);
      console.log('Field data updated successfully!');
    } catch (error) {
      console.error('Error updating field data:', error);
    }
  };

  const adminLogin = async (email, password) => {
    try {
      // Reference to the admins data node in Firebase
      const adminsRef = ref(database, `admins`);

      // Fetch all admins
      const snapshot = await get(adminsRef);

      if (snapshot.exists()) {
        const adminsData = snapshot.val();

        // Search for a matching email and password in the admins data
        for (const userId in adminsData) {
          const admin = adminsData[userId];

          if (admin.email === email && admin.password === password) {
            console.log("Admin logged in successfully");
            return { success: true, message: "Login successful" };
          }
        }

        console.warn("Incorrect email or password.");
        return { success: false, message: "Incorrect email or password" };
      } else {
        console.error("Admins node doesn't exist in the database");
        return { success: false, message: "No admin data found" };
      }
    } catch (error) {
      console.error("Error during admin login:", error);
      return { success: false, message: error.message };
    }
  };

  return { saveFieldData, fetchFieldData, deleteFieldData, updateFieldData, adminLogin };
};
