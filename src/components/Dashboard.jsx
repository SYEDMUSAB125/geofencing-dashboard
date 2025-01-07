"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useFirebase } from "@/hooks/useFirebase";
import Drawer from "./Drawer";
import Header from "./Header";

export default function Dashboard() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    farmName: "",
    latitude: "",
    longitude: "",
  });
  const [farms, setFarms] = useState([]);
  const { saveFieldData, fetchFieldData, deleteFieldData, updateFieldData } = useFirebase();

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchFieldData();
      setFarms(data);
    };
    fetchData();
  }, []);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const uniqueId = formData.email.split("@")[0];

    // Save data to Firebase
    await saveFieldData(uniqueId, {
      farmName: formData.farmName,
      latitude: formData.latitude,
      longitude: formData.longitude,
    });

    // Update local state
    setFarms([...farms, { id: uniqueId, ...formData }]);

    // Reset form
    setFormData({ email: "", farmName: "", latitude: "", longitude: "" });
    alert("Data saved successfully!");
  };

  const handleDelete = async (id) => {
    await deleteFieldData(id);
    setFarms(farms.filter((farm) => farm.id !== id));
  };

  const handleEdit = async (id, updatedData) => {
    await updateFieldData(id, updatedData);
    setFarms(
      farms.map((farm) => (farm.id === id ? { id, ...updatedData } : farm))
    );
  };

  return (
    <div className="flex-1 flex flex-col">
      <Drawer isOpen={drawerOpen} closeDrawer={() => setDrawerOpen(false)} />
      <Header toggleDrawer={() => setDrawerOpen(!drawerOpen)} />
    
      <main className="flex-1 p-8 grid grid-cols-2 gap-8">
        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-lg rounded-lg p-8"
        >
          <h2 className="text-xl font-bold mb-6">Add New Farm</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email"
                className="mt-1 block w-full px-4 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label htmlFor="farmName" className="block text-sm font-medium text-gray-700">
                Farm Name
              </label>
              <input
                id="farmName"
                type="text"
                value={formData.farmName}
                onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                placeholder="Enter farm name"
                className="mt-1 block w-full px-4 py-2 border rounded-md"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
                  Latitude
                </label>
                <input
                  id="latitude"
                  type="text"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  placeholder="Enter latitude"
                  className="mt-1 block w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
                  Longitude
                </label>
                <input
                  id="longitude"
                  type="text"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  placeholder="Enter longitude"
                  className="mt-1 block w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600"
            >
              Save to Firebase
            </button>
          </form>
        </motion.div>

        {/* Data Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-lg rounded-lg p-8"
        >
          <h2 className="text-xl font-bold mb-6">Saved Farms</h2>
          <ul className="space-y-4">
            {farms.map((farm) => (
              <li
                key={farm.id}
                className="border rounded-md p-4 flex justify-between items-center"
              >
                <div>
                  <p className="text-sm font-bold">{farm.farmName}</p>
                  <p className="text-xs text-gray-500">
                    {farm.latitude}, {farm.longitude}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      handleEdit(farm.id, {
                        ...farm,
                        farmName: prompt("Enter new farm name:", farm.farmName) || farm.farmName,
                      })
                    }
                    className="bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(farm.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </main>
    </div>
  );
}
