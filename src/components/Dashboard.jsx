"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useFirebase } from "@/hooks/useFirebase";
import Drawer from "./Drawer";
import Header from "./Header";

export default function Dashboard() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [farmers, setFarmers] = useState([]);
  const [farmerDetails, setFarmerDetails] = useState({});
  const [expandedFarmers, setExpandedFarmers] = useState(false);
  const [expandedData, setExpandedData] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    farmName: "",
    lat: "",
    long: "",
  });
  const [farms, setFarms] = useState([]);
  const { saveFieldData, fetchFieldData, deleteFieldData, updateFieldData } = useFirebase();

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchFieldData();

      const farmerMap = {};
      data.forEach((item) => {
        if (!farmerMap[item.userId]) {
          farmerMap[item.userId] = { email: `${item.userId}@example.com`, data: [] };
        }
        farmerMap[item.userId].data.push(item);
      });

      setFarmers(Object.keys(farmerMap));
      setFarmerDetails(farmerMap);
      setFarms(data);
    };
    fetchData();
  }, [fetchFieldData]);

  const validateLatLng = (value) => /^(-?\d+(\.\d+)?)(,-?\d+(\.\d+)?)*$/.test(value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateLatLng(formData.lat) || !validateLatLng(formData.long)) {
      alert("Please enter valid lat and long values, separated by commas.");
      return;
    }

    const uniqueId = formData.email.split("@")[0];

    await saveFieldData(uniqueId, {
      farmName: formData.farmName,
      lat: formData.lat,
      long: formData.long,
    });

    setFarms([...farms, { id: uniqueId, ...formData }]);
    setFormData({ email: "", farmName: "", lat: "", long: "" });
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

            <div>
              <label htmlFor="lat" className="block text-sm font-medium text-gray-700">
                Lat(s)
              </label>
              <input
                id="lat"
                type="text"
                value={formData.lat}
                onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                placeholder="Enter lats separated by commas, e.g., 24.935207,24.931043,67.109395,67.112077"
                className="mt-1 block w-full px-4 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label htmlFor="long" className="block text-sm font-medium text-gray-700">
                Long(s)
              </label>
              <input
                id="long"
                type="text"
                value={formData.long}
                onChange={(e) => setFormData({ ...formData, long: e.target.value })}
                placeholder="Enter longs separated by commas, e.g., 67.109395,67.112077,67.109395,67.112077"
                className="mt-1 block w-full px-4 py-2 border rounded-md"
                required
              />
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
                    Lat(s): {farm.lat}
                  </p>
                  <p className="text-xs text-gray-500">
                    Long(s): {farm.long}
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
        <div className="p-6">
      {/* Farmers Section */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-xl font-bold">Farmers</h2>
        <p className="text-gray-600">Total Farmers: {farmers.length}</p>
        <button
          onClick={() => setExpandedFarmers(!expandedFarmers)}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {expandedFarmers ? 'Hide Farmers' : 'Show Farmers'}
        </button>
        {expandedFarmers && (
          <ul
            className="mt-4 max-h-32 overflow-y-auto border border-gray-300 rounded-lg"
          >
            {farmers.map((farmerId) => (
              <li key={farmerId} className="border-b py-2">
                Farmer ID: {farmerId} <br />
                Email: {farmerDetails[farmerId]?.email}
              </li>
            ))}
          </ul>
        )}

      </div>

      {/* Data Entries Section */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-bold">Data Entries</h2>
        <p className="text-gray-600">
          Total Data Entries: {farmers.reduce((total, farmerId) => total + farmerDetails[farmerId].data.length, 0)}
        </p>
        <button
          onClick={() => setExpandedData(!expandedData)}
          className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {expandedData ? 'Hide Data Entries' : 'Show Data Entries'}
        </button>
        {expandedData && (
          <ul
            className="mt-4 max-h-32 overflow-y-auto border border-gray-300 rounded-lg"
          >
            {farmers.map((farmerId) => (
              <li key={farmerId} className="border-b py-2">
                <strong>Farmer ID:</strong> {farmerId} <br />
                <strong>Data:</strong>
                <ul className="ml-4 mt-2">
                  {farmerDetails[farmerId].data.map((field, index) => (
                    <li key={index} className="text-gray-700">
                      Farm Name: {field.farmName}, Lat: {field.lat}, Long: {field.long}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}

      </div>
    </div>
      </main>
    </div>
  );
}
