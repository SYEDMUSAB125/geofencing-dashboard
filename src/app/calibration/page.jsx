"use client";

import { useEffect, useState } from "react";
import { FiPlus, FiFilter, FiX, FiSave, FiRefreshCw, FiTrash2 } from "react-icons/fi";
import { submitCalibrationData } from "../context/SubmitCalibrationdata";
import { fetchSoilData } from "../context/fetchSoilData";
import Swal from "sweetalert2";
import deleteSoilData from "../context/deleteSoilData";
import { useRouter } from "next/navigation";

export default function CalibrationPage() {
  const [soilData, setSoilData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    device_id: "",
    username: "",
  });
  const router = useRouter();



  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  
  
  const handleEdit = (data) => {
    // Save data to localStorage before redirecting
    localStorage.setItem('editCalibrationData', JSON.stringify(data));
    router.push('/editdevice');
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
            onClick={()=> router.push("/adddevice")}
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
            <thead className="bg-gradient-to-r from-blue-500 to-indigo-600  text-white">
              <tr  >
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Device ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Last Calibrated
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {data.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(data.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(data)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(data.id)}
                      className="text-red-600 hover:text-red-900"
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
        <div className="text-xl text-white animate-pulse text-center">
          Loading data...
        </div>
      )}

      {/* Table footer */}
      <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
        <div className="text-sm text-white">
          Showing
          <span className="font-medium"> {filteredData.length}</span> of{" "}
          <span className="font-medium">{soilData.length}</span> results
        </div>
      </div>

      
    </div>
  );
}










