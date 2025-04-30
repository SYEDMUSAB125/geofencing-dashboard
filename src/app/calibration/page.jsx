'use client';

import { useState } from 'react';
import { FiPlus, FiFilter, FiX, FiSave, FiRefreshCw } from 'react-icons/fi';
import { submitCalibrationData } from '../context/SubmitCalibrationdata';

export default function CalibrationPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    device_id: '',
    username: '',
    ph_level: '',
    ec: '',
    moisture: '',
    nitrogen: '',
    phosphorous: '',
    potassium: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Convert numeric fields to numbers before sending
      const dataToSend = {
        ...formData,
        ph_level: parseFloat(formData.ph_level),
        ec: parseFloat(formData.ec),
        moisture: parseFloat(formData.moisture),
        nitrogen: parseFloat(formData.nitrogen),
        phosphorous: parseFloat(formData.phosphorous),
        potassium: parseFloat(formData.potassium),
      };

      await submitCalibrationData(dataToSend);
      setSuccess(true);
      // Reset form after successful submission
      setFormData({
        device_id: '',
        username: '',
        ph_level: '',
        ec: '',
        moisture: '',
        nitrogen: '',
        phosphorous: '',
        potassium: '',
      });
      // Close modal after 2 seconds
      setTimeout(() => setIsModalOpen(false), 2000);
    } catch (err) {
      setError(err.message || 'Failed to submit calibration data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Calibration Management</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            <FiPlus className="mr-2" />
            Add New
          </button>
          <button className="flex items-center bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm">
            <FiFilter className="mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Calibrated</th>
   
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Example rows */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">DEV-12345</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">john.doe@example.com</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-06-15</td>
                
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">DEV-67890</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">jane.smith@example.com</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-06-10</td>
                
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">DEV-54321</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">mike.johnson@example.com</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-05-28</td>
                
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Table footer */}
        <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">1</span> to <span className="font-medium">3</span> of <span className="font-medium">24</span> results
          </div>
         
        </div>
      </div>

     {/* Modal */}
{isModalOpen && (
  <div 
    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
  >
    <div className="bg-white p-6 rounded-xl w-full max-w-2xl relative shadow-2xl max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 id="modal-title" className="text-2xl font-bold text-gray-800">New Calibration</h2>
        <button 
          onClick={() => setIsModalOpen(false)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          disabled={isLoading}
          aria-label="Close modal"
        >
          <FiX size={24} />
        </button>
      </div>
      
      {/* Success/Error Messages */}
      {success && (
        <div 
          className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg"
          role="alert"
          aria-live="polite"
        >
          Calibration data submitted successfully!
        </div>
      )}
      {error && (
        <div 
          className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Device ID */}
          <div>
            <label htmlFor="device_id" className="block text-sm font-medium text-gray-700 mb-1">
              Device ID
            </label>
            <input 
              id="device_id"
              name="device_id"
              value={formData.device_id}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
              placeholder="Enter device ID" 
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input 
              id="username"
              name="username"
              value={formData.username}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
              placeholder="Enter username" 
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>

          {/* pH Level */}
          <div>
            <label htmlFor="ph_level" className="block text-sm font-medium text-gray-700 mb-1">
              pH Level
            </label>
            <input 
              id="ph_level"
              name="ph_level"
              value={formData.ph_level}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
              placeholder="Enter pH value" 
              type="number"
           
              min="1"
       
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>

          {/* Moisture Value */}
          <div>
            <label htmlFor="moisture" className="block text-sm font-medium text-gray-700 mb-1">
              Moisture Value
            </label>
            <input 
              id="moisture"
              name="moisture"
              value={formData.moisture}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
              placeholder="Enter Moisture value" 
              type="number"
            
              min="1"
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>

          {/* EC Value */}
          <div>
            <label htmlFor="ec" className="block text-sm font-medium text-gray-700 mb-1">
              EC Value
            </label>
            <input 
              id="ec"
              name="ec"
              value={formData.ec}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
              placeholder="Enter EC value" 
              type="number"
        
              min="1"
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>

          {/* Phosphorous Value */}
          <div>
            <label htmlFor="phosphorous" className="block text-sm font-medium text-gray-700 mb-1">
              Phosphorous Value
            </label>
            <input 
              id="phosphorous"
              name="phosphorous"
              value={formData.phosphorous}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
              placeholder="Enter Phosphorous value" 
              type="number"
          
              min="1"
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>

          {/* Nitrogen Value */}
          <div>
            <label htmlFor="nitrogen" className="block text-sm font-medium text-gray-700 mb-1">
              Nitrogen Value
            </label>
            <input 
              id="nitrogen"
              name="nitrogen"
              value={formData.nitrogen}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
              placeholder="Enter Nitrogen value" 
              type="number"
              min="1"
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>

          {/* Potassium Value */}
          <div>
            <label htmlFor="potassium" className="block text-sm font-medium text-gray-700 mb-1">
              Potassium Value
            </label>
            <input 
              id="potassium"
              name="potassium"
              value={formData.potassium}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
              placeholder="Enter Potassium value" 
              type="number"
       
              min="1"
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>
        </div>
        
        <div className="pt-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
            disabled={isLoading}
          >
            <FiX className="mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-md disabled:bg-blue-400"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FiRefreshCw className="mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <FiSave className="mr-2" />
                Save Calibration
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
}






