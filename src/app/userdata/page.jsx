"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { useFirebase } from "@/hooks/useFirebase";
import Header from "../components/Header";
import { motion } from "framer-motion";

function UserData() {
  const [devices, setDevices] = useState([]);
  const [users, setUsers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [expandedUsers, setExpandedUsers] = useState({});
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const { fetchDeviceData } = useFirebase();

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const deviceData = await fetchDeviceData();
      console.log("device data", deviceData);

      // Group devices by user - handle the actual nested structure
      const userMap = {};
      
      // deviceData is an array of user objects
      deviceData.forEach((userObj) => {
        const userId = userObj.id || 'Unknown User';
        
        if (!userMap[userId]) {
          userMap[userId] = {
            userName: userId, // Use ID as name for now
            devices: []
          };
        }
        
        // Extract devices from user object (skip the 'id' field)
        Object.keys(userObj).forEach(key => {
          if (key !== 'id' && typeof userObj[key] === 'object') {
            // This is a device with sensor data
            const deviceId = key;
            const sensorData = userObj[key];
            
            const cleanDevice = {
              id: deviceId,
              userName: userId,
              userId: userId,
              sensorData: sensorData
            };
            
            userMap[userId].devices.push(cleanDevice);
          }
        });
      });

      setDevices(deviceData);
      setUsers(userMap);
      
      // Initialize expanded state
      const initialExpanded = {};
      Object.keys(userMap).forEach(userId => {
        initialExpanded[userId] = false;
      });
      setExpandedUsers(initialExpanded);
    } catch (error) {
      console.error('Error fetching device data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchDeviceData]);

  // Function to extract sensor data from device object - updated for new structure
  const extractSensorData = (device) => {
    // In the new structure, device IS the sensor data object
    // Just return it directly since it already contains timestamp-based data
    return device;
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleUserExpand = (userId) => {
    setExpandedUsers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const openDeviceModal = (device) => {
    setSelectedDevice(device);
  };

  const openFarmModal = (farmData, farmName, device) => {
    setSelectedFarm({ data: farmData, name: farmName });
    openDeviceModal(device);
  };

  const closeModal = () => {
    setSelectedDevice(null);
    setSelectedFarm(null);
  };

  const renderSensorDataTable = (farmData, timestamp) => {
  if (!farmData || !selectedFarm?.name) return null;

  // ✅ Only take the selected farm’s data
  const specificFarmData = farmData[selectedFarm.name];
  if (!specificFarmData) return null;

  // Convert object to array and sort by timestamp
  const sortedData = Object.entries(specificFarmData)
    .sort(([timestampA], [timestampB]) => {
      try {
        const dateA = new Date(timestampA);
        const dateB = new Date(timestampB);
        return dateB - dateA;
      } catch {
        return 0;
      }
    });

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <tr>
            <th className="py-3 px-4 border-b border-gray-200 text-left font-semibold">Farm Name</th>
            <th className="py-3 px-4 border-b border-gray-200 text-left font-semibold">Timestamp</th>
            <th className="py-3 px-4 border-b border-gray-200 text-left font-semibold">pH</th>
            <th className="py-3 px-4 border-b border-gray-200 text-left font-semibold">Conductivity (μS/cm)</th>
            <th className="py-3 px-4 border-b border-gray-200 text-left font-semibold">Moisture (%)</th>
            <th className="py-3 px-4 border-b border-gray-200 text-left font-semibold">Nitrogen (mg/kg)</th>
            <th className="py-3 px-4 border-b border-gray-200 text-left font-semibold">Phosphorus (mg/kg)</th>
            <th className="py-3 px-4 border-b border-gray-200 text-left font-semibold">Potassium (mg/kg)</th>
            <th className="py-3 px-4 border-b border-gray-200 text-left font-semibold">Temperature (°C)</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map(([timestamp, data], index) => (
            <tr
              key={timestamp}
              className={`hover:bg-blue-50 transition-colors ${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              }`}
            >
              <td className="py-3 px-4 border-b border-gray-200">
                {selectedFarm.name}
              </td>
              <td className="py-3 px-4 border-b border-gray-200 font-mono text-sm">
                {formatTimestamp(timestamp)}
              </td>
              <td className="py-3 px-4 border-b border-gray-200">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getPHColor(
                    data.pH
                  )}`}
                >
                  {data.pH?.toFixed(2) || "N/A"}
                </span>
              </td>
              <td className="py-3 px-4 border-b border-gray-200">
                {data.conductivity
                  ? `${data.conductivity.toLocaleString()}`
                  : "N/A"}
              </td>
              <td className="py-3 px-4 border-b border-gray-200">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getMoistureColor(
                    data.moisture
                  )}`}
                >
                  {data.moisture?.toFixed(1) || "N/A"}%
                </span>
              </td>
              <td className="py-3 px-4 border-b border-gray-200">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getNutrientColor(
                    data.nitrogen,
                    "nitrogen"
                  )}`}
                >
                  {data.nitrogen || "N/A"}
                </span>
              </td>
              <td className="py-3 px-4 border-b border-gray-200">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getNutrientColor(
                    data.phosphorus,
                    "phosphorus"
                  )}`}
                >
                  {data.phosphorus || "N/A"}
                </span>
              </td>
              <td className="py-3 px-4 border-b border-gray-200">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getNutrientColor(
                    data.potassium,
                    "potassium"
                  )}`}
                >
                  {data.potassium || "N/A"}
                </span>
              </td>
              <td className="py-3 px-4 border-b border-gray-200">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getTemperatureColor(
                    data.temperature
                  )}`}
                >
                  {data.temperature?.toFixed(1) || "N/A"}°C
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
  const getPHColor = (pH) => {
    if (!pH) return 'bg-gray-200 text-gray-700';
    if (pH < 6.0) return 'bg-red-100 text-red-800';
    if (pH < 6.5) return 'bg-orange-100 text-orange-800';
    if (pH < 7.5) return 'bg-green-100 text-green-800';
    if (pH < 8.5) return 'bg-blue-100 text-blue-800';
    return 'bg-purple-100 text-purple-800';
  };

  const getMoistureColor = (moisture) => {
    if (!moisture) return 'bg-gray-200 text-gray-700';
    if (moisture < 15) return 'bg-red-100 text-red-800';
    if (moisture < 25) return 'bg-orange-100 text-orange-800';
    if (moisture < 35) return 'bg-green-100 text-green-800';
    return 'bg-blue-100 text-blue-800';
  };

  const getNutrientColor = (value, nutrient) => {
    if (!value) return 'bg-gray-200 text-gray-700';
    
    const thresholds = {
      nitrogen: { low: 50, medium: 100, high: 150 },
      phosphorus: { low: 30, medium: 60, high: 90 },
      potassium: { low: 150, medium: 250, high: 350 }
    };
    
    const threshold = thresholds[nutrient];
    if (value < threshold.low) return 'bg-red-100 text-red-800';
    if (value < threshold.medium) return 'bg-orange-100 text-orange-800';
    if (value < threshold.high) return 'bg-green-100 text-green-800';
    return 'bg-blue-100 text-blue-800';
  };

  const getTemperatureColor = (temp) => {
    if (!temp) return 'bg-gray-200 text-gray-700';
    if (temp < 20) return 'bg-blue-100 text-blue-800';
    if (temp < 30) return 'bg-green-100 text-green-800';
    if (temp < 35) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const formatTimestamp = (timestamp) => {
    try {
      // Convert format from "2025-07-31-12:52:16" to "2025/07/31 12:52:16"
      const dateStr = timestamp.replace(/-/g, '/').replace('-', ' ');
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return timestamp;
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return timestamp;
    }
  };



  const renderDeviceModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-7xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Device Details</h3>
            <p className="text-gray-600 mt-1">Device ID: {selectedDevice.id}</p>
            {selectedDevice.userName && (
              <p className="text-gray-600">Assigned to: {selectedDevice.userName}</p>
            )}
          </div>
          <button 
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {selectedDevice.sensorData && Object.keys(selectedDevice.sensorData).length > 0 ? (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-blue-800 mb-2">Sensor Data Summary</h4>
              <p className="text-blue-700">
                This device has recorded {Object.keys(selectedDevice.sensorData).length} data points across different timestamps.
              </p>
            </div>
            
            {/* Show all sensor data in one comprehensive table */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">All Sensor Readings</h4>
              {renderSensorDataTable(selectedDevice.sensorData)}
            </div>
            
            {/* Individual timestamp breakdown */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Data by Timestamp</h4>
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(selectedDevice.sensorData).map(([timestamp, data]) => (
                  <div key={timestamp} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h5 className="font-semibold text-lg mb-3 text-gray-800">
                      📅 {formatTimestamp(timestamp)}
                    </h5>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="font-medium">pH:</span> {data.pH?.toFixed(2) || 'N/A'}</div>
                      <div><span className="font-medium">Conductivity:</span> {data.conductivity || 'N/A'}</div>
                      <div><span className="font-medium">Moisture:</span> {data.moisture?.toFixed(1) || 'N/A'}%</div>
                      <div><span className="font-medium">Nitrogen:</span> {data.nitrogen || 'N/A'}</div>
                      <div><span className="font-medium">Phosphorus:</span> {data.phosphorus || 'N/A'}</div>
                      <div><span className="font-medium">Potassium:</span> {data.potassium || 'N/A'}</div>
                      <div><span className="font-medium">Temperature:</span> {data.temperature?.toFixed(1) || 'N/A'}°C</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No sensor data available for this device</p>
          </div>
        )}
      </motion.div>
    </div>
  );




  const renderFarmModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-7xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Sensor Data</h3>
            <p className="text-gray-600 mt-1">Device: {selectedDevice?.id || 'Unknown'}</p>
            <p className="text-gray-600">Farm: {selectedFarm.name}</p>
          </div>
          <button 
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {renderSensorDataTable(selectedFarm.data)
        }
      </motion.div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading user data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Soil Sensor Data Dashboard</h1>
        
        <div className="grid gap-6">
          {Object.keys(users).map((userId) => (
            <motion.div
              key={userId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-lg p-6 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-2 text-blue-600">
                    👨‍🌾 {users[userId].userName}
                  </h2>
                  <p className="text-gray-600">
                    Total Devices: {users[userId].devices.length}
                  </p>
                </div>
                <button 
                  onClick={() => toggleUserExpand(userId)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    expandedUsers[userId] 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {expandedUsers[userId] ? 'Hide Devices' : 'Show Devices'}
                </button>
              </div>

              {expandedUsers[userId] && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {users[userId].devices.map((device) => (
                    <div
                      key={device.id}
                      className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-gray-50 to-white hover:shadow-lg transition-all duration-200 hover:scale-105"
                    >
                      <div 
                        className="cursor-pointer"
                        
                      >
                        <h3 className="font-semibold text-lg mb-3 text-gray-800 hover:text-blue-600 transition-colors">
                          📱 Device: {device.id}
                        </h3>
                        
                        {device.sensorData && Object.keys(device.sensorData).length > 0 ? (
                          <div className="space-y-3">
                            <div className="bg-blue-50 rounded-lg p-3">
                              <p className="text-sm font-medium text-blue-800">
                                📊 {Object.keys(device.sensorData).length} Data Points
                              </p>
                            </div>
                            
                            {/* Show sample of latest data */}
                            {Object.entries(device.sensorData)
                              .slice(0, 3) // Show first 3 timestamps
                              .map(([timestamp, data]) => (
                                <div 
                                  key={timestamp} 
                                  className="p-3 bg-white rounded border border-gray-200 cursor-pointer hover:bg-blue-50 transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openFarmModal(device.sensorData, timestamp,device);
                                  }}
                                >
                                  <p className="font-medium text-sm text-gray-700 mb-1">
                                    📅 {formatTimestamp(timestamp)}
                                  </p>
                                  
                                </div>
                              ))}
                            
                            {Object.keys(device.sensorData).length > 3 && (
                              <div className="text-center py-2">
                                <p className="text-xs text-gray-500">
                                  +{Object.keys(device.sensorData).length - 3} more readings
                                </p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-gray-500 text-sm">No sensor data available</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {Object.keys(users).length === 0 && (
          <div className="text-center py-8">
            <p className="text-xl text-gray-500">No user data found</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedDevice && !selectedFarm && renderDeviceModal()}
      {selectedFarm && renderFarmModal()}
    </div>
  );
}

export default UserData;