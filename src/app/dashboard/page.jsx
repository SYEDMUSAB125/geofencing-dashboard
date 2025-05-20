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
   const [isClient, setIsClient] = useState(false);
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
    setIsClient(true);
  }, []);
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
          className="bg-white   text-black shadow-lg rounded-lg p-6"
        >
         <div className="" >
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
              className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-green-500 focus:ring focus:ring-indigo-200"
            >
              Save to Cloud
            </button>
          </form>
         </div>
        </motion.div>

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
      className="w-full px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
    >
      {expandedFarmers ? 'Hide Saved Farms' : 'Show Saved Farms'}
    </button>
  </div>

  {/* Farms List - Single implementation with responsive behavior */}
  {(expandedFarmers || (isClient && window.innerWidth >= 1024)) && (
    <ul className="space-y-4 h-[60vh] overflow-y-auto pr-2">
      {farms.map((farm) => (
        <motion.li
          key={farm.id}
          whileHover={{ scale: 1.01 }}
          className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between gap-4 bg-gray-50 hover:shadow-md transition-all"
        >
          <div className="flex-1 min-w-0"> {/* Allows text to break properly */}
            <p className="text-lg font-bold break-words">{farm.farmName}</p>
            <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
              <p className="break-all">
                <span className="font-medium">Lat:</span> {farm.lat}
              </p>
              <p className="break-all">
                <span className="font-medium">Long:</span> {farm.long}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-end min-w-fit">
            <button
              onClick={() => handleEdit(farm.id, farm)}
              className="px-3 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Edit</span>
            </button>
            <button
              onClick={() => handleDelete(farm.id)}
              className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center justify-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Delete</span>
            </button>
          </div>
        </motion.li>
      ))}
    </ul>
  )}
</motion.div>

        {/* Farmers Data Section */}
        <div className="lg:col-span-3">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold">Total Farmers: {farmers.length}</h2>
            <button
              onClick={() => setExpandedFarmersData(!expandedFarmersData)}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg rounded-lg"
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
