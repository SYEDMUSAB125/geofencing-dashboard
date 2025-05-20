"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import { submitCalibrationData } from '../context/SubmitCalibrationdata';
import Swal from 'sweetalert2';

const ThresholdForm = () => {
  const router = useRouter();
  
  const [hovered, setHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    // Basic info fields
    device_id: "",
    username: "",
    fieldname: "",
    
    // Least Threshold values
    ph_level_min: 1,
    ec_min: 1,
    moisture_min: 20,
    nitrogen_min: 1,
    phosphorous_min: 1,
    potassium_min: 1,
    
    // Greater Threshold values
    ph_level_max: 1,
    ec_max: 1,
    moisture_max: 1,
    nitrogen_max: 1,
    phosphorous_max: 1,
    potassium_max: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('_min') || name.includes('_max') ? parseFloat(value) || 0 : value
    }));
  };

  const handleBack = () => {
    router.push('/calibration'); // Adjust the path as needed
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
  
    try {
      // Prepare the data to send
      const dataToSend = {
        device_id: formData.device_id,
        username: formData.username.split("@")[0],
        fieldname: formData.fieldname,
        ph_level_min: formData.ph_level_min,
        ec_min: formData.ec_min,
        moisture_min: formData.moisture_min,
        nitrogen_min: formData.nitrogen_min,
        phosphorous_min: formData.phosphorous_min,
        potassium_min: formData.potassium_min,
        ph_level_max: formData.ph_level_max,
        ec_max: formData.ec_max,
        moisture_max: formData.moisture_max,
        nitrogen_max: formData.nitrogen_max,
        phosphorous_max: formData.phosphorous_max,
        potassium_max: formData.potassium_max
      };
  
      await submitCalibrationData(dataToSend);
  
      // Show success alert
      await Swal.fire({
        title: 'Success!',
        text: 'Calibration data saved successfully',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#4f46e5' // indigo-600
      });
  
      // Reset form after successful submission
      setFormData({
        device_id: "",
        username: "",
        fieldname: "",
        ph_level_min: 1,
        ec_min: 1,
        moisture_min: 20,
        nitrogen_min: 1,
        phosphorous_min: 1,
        potassium_min: 1,
        ph_level_max: 1,
        ec_max: 1,
        moisture_max: 1,
        nitrogen_max: 1,
        phosphorous_max: 1,
        potassium_max: 1
      });
  
    } catch (err) {
      setError(err.message || 'Failed to save calibration data');
      
      // Show error alert
      await Swal.fire({
        title: 'Error!',
        text: err.message || 'Failed to save calibration data',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444' // red-500
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Set Threshold Values</h2>
            <p className="text-blue-100">Configure your device monitoring parameters</p>
          </div>
         
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 bg-white">
        {/* Basic Information Section */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Device Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">Device ID</label>
              <input
                type="text"
                name="device_id"
                value={formData.device_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter device ID"
              />
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="text"
                name="username"
                value={formData.username }
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter the same email that you registered. "
              />
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">Field Name</label>
              <input
                type="text"
                name="fieldname"
                value={formData.fieldname}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter the same field name that you registered."
              />
            </div>
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">Set Your Moisture Condition</label>
              <input
                type="text"
                name="moisture_min"
                value={formData.moisture_min}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter field name"
              />
            </div>
           
          </div>
        </div>

        {/* Threshold Sections */}
        <div className="flex flex-col xl:flex-row gap-8 mb-6">
          {/* Least Threshold Section */}
          <div className="flex-1 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold mb-4 text-blue-800 border-b pb-2 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
              Minimum Thresholds
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "pH Level (Min)", name: "ph_level_min", min: 0,  step: 1 },
                { label: "EC (Min)", name: "ec_min", min: 0, step: 1 },
                { label: "Nitrogen (Min ppm)", name: "nitrogen_min", min: 0, step: 1 },
                { label: "Phosphorous (Min ppm)", name: "phosphorous_min", min: 0, step: 1 },
                { label: "Potassium (Min ppm)", name: "potassium_min", min: 0, step: 1 },
              ].map((field) => (
                <div key={field.name} className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                  <input
                    type="number"
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min={field.min}
                    max={field.max}
                    step={field.step}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Greater Threshold Section */}
          <div className="flex-1 p-6 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold mb-4 text-green-800 border-b pb-2 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Maximum Thresholds
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "pH Level (Max)", name: "ph_level_max", min: 0,  step: 1 },
                { label: "EC (Max)", name: "ec_max", min: 0, step: 1 },
                { label: "Nitrogen (Max ppm)", name: "nitrogen_max", min: 0, step: 1 },
                { label: "Phosphorous (Max ppm)", name: "phosphorous_max", min: 0, step: 1 },
                { label: "Potassium (Max ppm)", name: "potassium_max", min: 0, step: 1 },
              ].map((field) => (
                <div key={field.name} className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                  <input
                    type="number"
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min={field.min}
                    max={field.max}
                    step={field.step}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-8 border-t pt-6">
        <button
      type="button"
      onClick={handleBack}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="px-6 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors flex items-center gap-2"
    >
      {hovered && <FaArrowLeft size={16} />}
     
        Back
     
    </button>
          <button
          onClick={handleSubmit}
            type="submit"
            className="px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Save Calibration
          </button>
        </div>
      </form>
    </div>
  );
};

export default ThresholdForm;