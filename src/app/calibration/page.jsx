"use client";

import { useEffect, useState } from "react";
import { FiPlus, FiFilter, FiX, FiSave, FiRefreshCw, FiTrash2 } from "react-icons/fi";
import { submitCalibrationData } from "../context/SubmitCalibrationdata";
import { fetchSoilData } from "../context/fetchSoilData";
import updateCalibrationData from "../context/updateCalbration";
import Swal from "sweetalert2";
import deleteSoilData from "../context/deleteSoilData";

export default function CalibrationPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [soilData, setSoilData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("add"); // 'add' or 'edit'
  const [filter, setFilter] = useState({
    device_id: "",
    username: "",
  });

  const [formData, setFormData] = useState({
    id: "",
    device_id: "",
    username: "",
    ph_level: 1,
    ec:1,
    moisture: 1,
    nitrogen: 1,
    phosphorous: 1,
    potassium: 1,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Reset form to empty state
  const resetForm = () => {
    setFormData({
      id: "",
      device_id: "",
      username: "",
      ph_level: "",
      ec: "",
      moisture: "",
      nitrogen: "",
      phosphorous: "",
      potassium: "",
    });
    setError(null);
    setSuccess(false);
  };

  const openAddModal = () => {
    setMode("add");
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (data) => {
    setMode("edit");
    setFormData({
      id: data.id,
      device_id: data.device_id,
      username: data.username,
      ph_level: data.ph_level,
      ec: data.ec,
      moisture: data.moisture,
      nitrogen: data.nitrogen,
      phosphorous: data.phosphorous,
      potassium: data.potassium,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const dataToSend = {
        ...formData,
        ph_level: parseFloat(formData.ph_level),
        ec: parseFloat(formData.ec),
        moisture: parseFloat(formData.moisture),
        nitrogen: parseFloat(formData.nitrogen),
        phosphorous: parseFloat(formData.phosphorous),
        potassium: parseFloat(formData.potassium),
      };

      if (mode === "add") {
        await submitCalibrationData(dataToSend);
        setSuccess(true);
        resetForm();
      } else {
        await updateCalibrationData(dataToSend);
        setSuccess(true);
      }

      // Refresh data
      const data = await fetchSoilData();
      setSoilData(data);
      applyFilters(data, filter);

      // Close modal after 2 seconds on success
      setTimeout(() => {
        if (success) {
          setIsModalOpen(false);
        }
      }, 1000);
    } catch (err) {
      setError(err.message || `Failed to ${mode} calibration data`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyFilters = (data, filters) => {
    let result = [...data];
    if (filters.device_id) {
      result = result.filter((item) =>
        item.device_id.toLowerCase().includes(filters.device_id.toLowerCase())
      );
    }
    if (filters.username) {
      result = result.filter((item) =>
        item.username.toLowerCase().includes(filters.username.toLowerCase())
      );
    }
    setFilteredData(result);
  };

  const resetFilters = () => {
    setFilter({
      device_id: "",
      username: "",
    });
    setFilteredData(soilData);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchSoilData();
        setSoilData(data);
        setFilteredData(data);
      } catch (error) {
        console.error("Failed to load soil data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    applyFilters(soilData, filter);
  }, [filter, soilData]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      allowOutsideClick: false,
    });

    if (result.isConfirmed) {
      try {
        setIsLoading(true);

        // Show loading alert
        Swal.fire({
          title: "Deleting...",
          html: "Please wait while we delete the soil data",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        await deleteSoilData(id);

        // Refresh the data after deletion
        const data = await fetchSoilData();
        setSoilData(data);
        applyFilters(data, filter);

        // Show success alert
        Swal.fire({
          title: "Deleted!",
          text: "Soil data has been deleted.",
          icon: "success",
          confirmButtonColor: "#3085d6",
          timer: 2000,
          timerProgressBar: true,
        });
      } catch (err) {
        // Show error alert
        Swal.fire({
          title: "Error!",
          text: err.message || "Failed to delete soil data",
          icon: "error",
          confirmButtonColor: "#3085d6",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Calibration Management
        </h1>
        <div className="flex space-x-3">
          <button
            onClick={openAddModal}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            <FiPlus className="mr-2" />
            Add New
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="filter-device-id"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Device ID
            </label>
            <input
              id="filter-device-id"
              name="device_id"
              value={filter.device_id}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Filter by device ID"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <FiRefreshCw className="mr-2" />
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      {!loading ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Device ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Calibrated
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((data) => (
                <tr
                  key={data.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {data.device_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {data.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(data.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openEditModal(data)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(data.id)}
                      className="text-red-600 hover:text-red-900 "
                      title="Delete"
                    >
                     
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-xl text-gray-500 animate-pulse text-center">
          Loading data...
        </div>
      )}

      {/* Table footer */}
      <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">1</span> to{" "}
          <span className="font-medium">{filteredData.length}</span> of{" "}
          <span className="font-medium">{soilData.length}</span> results
        </div>
      </div>

      {/* Single Modal for both Add and Edit */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-white p-6 rounded-xl w-full max-w-2xl relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 id="modal-title" className="text-2xl font-bold text-gray-800">
                {mode === "add" ? "New Calibration" : "Edit Calibration"}
              </h2>
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
              >
                Calibration data {mode === "add" ? "submitted" : "updated"}{" "}
                successfully!
              </div>
            )}
            {error && (
              <div
                className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg"
                role="alert"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Device ID */}
                <div>
                  <label
                    htmlFor="device_id"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
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
                  />
                </div>

                {/* Username */}
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
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
                  />
                </div>

                {/* pH Level */}
                <div>
                  <label
                    htmlFor="ph_level"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
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
                  />
                </div>

                {/* Moisture Value */}
                <div>
                  <label
                    htmlFor="moisture"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
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
                  />
                </div>

                {/* EC Value */}
                <div>
                  <label
                    htmlFor="ec"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
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
                  />
                </div>

                {/* Phosphorous Value */}
                <div>
                  <label
                    htmlFor="phosphorous"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
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
                  />
                </div>

                {/* Nitrogen Value */}
                <div>
                  <label
                    htmlFor="nitrogen"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
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
                  />
                </div>

                {/* Potassium Value */}
                <div>
                  <label
                    htmlFor="potassium"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
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
                      {mode === "add" ? "Saving..." : "Updating..."}
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2" />
                      {mode === "add"
                        ? "Save Calibration"
                        : "Update Calibration"}
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
