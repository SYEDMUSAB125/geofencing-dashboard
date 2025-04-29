"use client"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useFirebase } from "@/hooks/useFirebase";
import Header from "../components/Header";
import { LuUpload } from "react-icons/lu";
import { IoMdSettings } from "react-icons/io";
import UploadImg from "../components/UploadImg";
import { useRouter } from "next/navigation";
export default function Dashboard() {
  const [farmers, setFarmers] = useState([]);
  const [farmerDetails, setFarmerDetails] = useState({});
  const [expandedFarmers, setExpandedFarmers] = useState(false);
  const [expandedData, setExpandedData] = useState(false);
  const [expandedFarmersData, setExpandedFarmersData] = useState(false); // For Farmers Data
  const [openImgSelecter, setOpenImgSelecter] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    farmName: "",
    lat:  "",
    long: "",
  });
  const [farms, setFarms] = useState([]);
  const { saveFieldData, fetchFieldData, deleteFieldData, updateFieldData } =
    useFirebase();

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

 
  
  const validateLatLng = (lat, lng) => {
    const latArray = lat.split(",").map((value) => parseFloat(value.trim()));
    const lngArray = lng.split(",").map((value) => parseFloat(value.trim()));
  
    const invalidLat = latArray.some((value) => isNaN(value) || value < -90 || value > 90);
    const invalidLng = lngArray.some((value) => isNaN(value) || value < -180 || value > 180);
  
    return { isValid: !invalidLat && !invalidLng, invalidLat, invalidLng };
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { lat, long } = formData;
    const { isValid, invalidLat, invalidLng } = validateLatLng(lat, long);
  
    if (!isValid) {
      let errorMessage = "Please correct the following errors:\n";
      if (invalidLat) errorMessage += "- Latitude must be between -90 and 90.\n";
      if (invalidLng) errorMessage += "- Longitude must be between -180 and 180.\n";
  
      Swal.fire("Invalid Input", errorMessage, "error");
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
  
    Swal.fire("Success", "Data saved successfully!", "success");
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteFieldData(id);
        setFarms(farms.filter((farm) => farm.id !== id));
        Swal.fire("Deleted!", "The farm has been deleted.", "success");
      }
    });
  };

  const handleEdit = async (id, updatedData) => {
    const { value: newFarmName } = await Swal.fire({
      title: "Edit Farm Name",
      input: "text",
      inputValue: updatedData.farmName,
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
    });

    if (newFarmName) {
      await updateFieldData(id, { ...updatedData, farmName: newFarmName });
      setFarms(farms.map((farm) => (farm.id === id ? { id, ...updatedData, farmName: newFarmName } : farm)));
      Swal.fire("Updated!", "The farm name has been updated.", "success");
    }
  };

const handleKml = ()=>{
  setOpenImgSelecter(true);
}

const getLat = (latt)=>{
  setFormData((prev)=>({...prev,lat:latt}))

}

const getLong = (longg)=>{
  console.log(longg)
  setFormData((prev)=>({...prev,long:longg}))
 
}


const handleSetting = () => {
 router.push("/calibration")
}

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">

      <Header />

      <main className="flex-1 p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white text-black shadow-lg rounded-lg p-6"
        >
         <div className="flex justify-between">
         <h2 className="text-2xl font-bold mb-6">Add New Farm</h2>
        <div className="flex justify-end space-x-2" >
        <div onClick={handleKml} className= "bg-gray-200 h-12 w-12 flex items-center justify-center  rounded-full">
         <LuUpload size={22} />
         </div>
         <div onClick={handleSetting} className= "bg-gray-200 h-12 w-12 flex items-center justify-center  rounded-full">
         <IoMdSettings size={22} />
         </div>
        
        </div>
         </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-400"
                required
              />
            </div>

            <div>
              <label htmlFor="farmName" className="block text-sm font-medium">
                Farm Name
              </label>
              <input
                id="farmName"
                type="text"
                value={formData.farmName}
                onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                placeholder="Enter farm name"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-400"
                required
              />
            </div>

            <div>
              <label htmlFor="lat" className="block text-sm font-medium">
                Latitude(s)
              </label>
              <input
                id="lat"
                type="text"
                value={formData.lat}
                onChange={(e) => setFormData({ ...formData, lat: e.target.value   })}
                placeholder="Enter latitudes separated by commas"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-400"
                required
              />
            </div>

            <div>
              <label htmlFor="long" className="block text-sm font-medium">
                Longitude(s)
              </label>
              <input
                id="long"
                type="text"
                value={formData.long}
                onChange={(e) => setFormData({ ...formData, long: e.target.value   })}
                placeholder="Enter longitudes separated by commas"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-400"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-green-500 focus:ring focus:ring-indigo-200"
            >
              Save to Cloud
            </button>
          </form>
        </motion.div>

        {/* Data Section */}
       {/* Saved Farms Section */}
     {/* Data Section */}
     <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white text-black shadow-lg rounded-lg p-6"
        >
          <h2 className="text-2xl font-bold mb-4">Saved Farms</h2>
          {/* Dropdown Button for Mobile */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setExpandedFarmers(!expandedFarmers)}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg rounded-lg"
            >
              {expandedFarmers ? 'Hide Saved Farms' : 'Show Saved Farms'}
            </button>
          </div>
          {/* Farms List (Conditional Rendering for Mobile) */}
          {expandedFarmers && (
            <ul className="space-y-4 max-h-96 overflow-y-auto">
              {farms.map((farm) => (
                <li
                  key={farm.id}
                  className="border rounded-md p-4 flex justify-between items-center bg-gray-50 hover:shadow-lg transition-shadow"
                >
                  <div>
                    <p className="text-lg font-bold">{farm.farmName}</p>
                    <p className="text-sm text-gray-600">
                      Lat(s): {farm.lat}
                    </p>
                    <p className="text-sm text-gray-600">
                      Long(s): {farm.long}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(farm.id, farm)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(farm.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {/* Desktop View Farms List */}
          <div className="hidden lg:block">
            <ul className="space-y-4 max-h-96 overflow-y-auto">
              {farms.map((farm) => (
                <li
                  key={farm.id}
                  className="border rounded-md p-4 flex justify-between items-center bg-gray-50 hover:shadow-lg transition-shadow"
                >
                  <div>
                    <p className="text-lg font-bold">{farm.farmName}</p>
                    <p className="text-sm text-gray-600">
                      Lat(s): {farm.lat}
                    </p>
                    <p className="text-sm text-gray-600">
                      Long(s): {farm.long}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(farm.id, farm)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(farm.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Farmers Data Section */}
        <div className="lg:col-span-3">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold">Total Farmers: {farmers.length}</h2>
            <button
              onClick={() => setExpandedFarmersData(!expandedFarmersData)}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg rounded-lg"
            >
              {expandedFarmersData ? "Hide Farmers Data" : "Show Farmers Data"}
            </button>
            {expandedFarmersData && (
              <ul className="mt-4 max-h-80 overflow-y-auto border border-gray-300 rounded-lg">
                {farmers.map((farmerId) => (
                  <li key={farmerId} className="border-b py-4 px-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">Farmer ID: {farmerId}</p>
                        <p className="text-gray-600">
                          Email: {farmerDetails[farmerId]?.email}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setExpandedData((prevState) =>
                            prevState === farmerId ? null : farmerId
                          )
                        }
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        {expandedData === farmerId ? "Hide Details" : "View Details"}
                      </button>
                    </div>
                    {expandedData === farmerId && (
                      <ul className="mt-4 ml-4 border-t pt-4">
                        {farmerDetails[farmerId]?.data.map((field, index) => (
                          <li key={index} className="text-gray-700 mb-2">
                            <strong>Farm Name:</strong> {field.farmName},{" "}
                            <strong>Lat:</strong> {field.lat}, <strong>Long:</strong>{" "}
                            {field.long}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className={`${openImgSelecter ? "block" : "hidden"}`}>
    <UploadImg getLat={getLat} getLong={getLong}  setOpenImgSelecter={setOpenImgSelecter}/>

  </div>

 
        </div>
      </main>
    </div>
  );
}
