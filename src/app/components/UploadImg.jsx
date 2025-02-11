import React, { useState } from "react";
import { FaFile, FaTimes, FaTrash } from "react-icons/fa";
import * as toGeoJSON from "togeojson";

const UploadImg = ({ setOpenImgSelecter,getLat ,getLong }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [cleanedLat, setCleanedLat] = useState(null);
  const [cleanedLong, setCleanedLong] = useState(null);
  const [placemarks, setPlacemarks] = useState([]);
  const [selectedPlacemark, setSelectedPlacemark] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (!file || (!file.name.endsWith(".kml") && !file.name.endsWith(".kmz"))) {
      setError("Invalid file type. Please upload a .kml or .kmz file.");
      return;
    }
    setSelectedFile(file);
    parseKMLFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError(null);
    setPlacemarks([]);
    setSelectedPlacemark(null);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const parseKMLFile = (file) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        const kmlText = event.target.result;
        const parser = new DOMParser();
        const kml = parser.parseFromString(kmlText, "application/xml");

        if (kml.getElementsByTagName("parsererror").length > 0) {
          setError("Failed to parse KML file. Invalid file structure.");
          return;
        }

        const placemarkElements = kml.getElementsByTagName("Placemark");
        const extractedPlacemarks = [];
       
        for (let i = 0; i < placemarkElements.length; i++) {
          const placemark = placemarkElements[i];
          const id = placemark.getAttribute("id") || `placemark-${i}`;
          const name = placemark.getElementsByTagName("name")[0]?.textContent || `Placemark ${i + 1}`;
          const coordinatesText = placemark.getElementsByTagName("coordinates")[0]?.textContent;

          if (coordinatesText) {
            const coordinates = coordinatesText.trim().split(" ").map(coord => coord.split(",").map(Number));
            extractedPlacemarks.push({ id, name, coordinates });
          }
        }

        if (extractedPlacemarks.length > 0) {
       
          setPlacemarks(extractedPlacemarks);
        
        } else {
          const geoJson = toGeoJSON.kml(kml);
          const coordinates = geoJson.features[0]?.geometry?.coordinates;
          
          if (coordinates) {
            const latitudes = coordinates.map(coord => coord[1]);
            const longitudes = coordinates.map(coord => coord[0]);
            setCleanedLat(latitudes.join(","));
            setCleanedLong(longitudes.join(","));
          } else {
            setError("Could not find coordinates in the KML file.");
          }
        }
      } catch (err) {
        console.error("File Read Error:", err);
        setError("Error reading the file. Please try again.");
      }
    };
    reader.readAsText(file);
  
  };

  const handleProcessbtn = () => {
    if (selectedPlacemark) {
      const selectedPlacemarkData = placemarks.find(p => p.id === selectedPlacemark);
      if (selectedPlacemarkData) {
        const latitudes = selectedPlacemarkData.coordinates.map(coord => coord[1]);
        const longitudes = selectedPlacemarkData.coordinates.map(coord => coord[0]);
        getLat(latitudes.join(","));
        getLong(longitudes.join(","));
      }
    } else {
      getLat(cleanedLat);
      getLong(cleanedLong);
    }
    setOpenImgSelecter(false);
  };
  return (
    <div className="absolute w-full h-screen bg-black bg-opacity-50 top-0 left-0 right-0 z-[10000] flex items-center justify-center">
      <div className="relative w-[90%] md:w-[80%] lg:w-[70%] min-h-[400px] bg-white flex flex-col items-center justify-start p-4 rounded-xl">
        <span
          className="absolute right-2 top-2 text-xl cursor-pointer hover:scale-105 duration-300 bg-gray-300 rounded-full p-2"
          onClick={() => setOpenImgSelecter(false)}
        >
          <FaTimes />
        </span>
        <div className="mt-5 w-[70%]">
          <p className="text-2xl font-semibold">
            Add files with field boundaries
          </p>
          <p className="text-sm mt-1 font-medium text-gray-500">
            We support .kmz or .kml files. If you have a .shp file, you must
            upload it with auxiliary files. All the files must have the same
            name.
          </p>
        </div>
        <div className="bg-gray-200 p-3 w-[70%] mt-4 rounded-xl">
          <div
            className="min-h-[200px] border-dashed border-2 border-gray-400 rounded-md p-4 flex items-center justify-center flex-col"
            onDrop={handleFileDrop}
            onDragOver={handleDragOver}
          >
            <div className="flex flex-col items-center justify-center">
              <p className="font-semibold text-gray-600">
                Drag and drop files here
              </p>
              <p className="text-sm font-medium text-gray-500">1.0 GB max</p>
              <FaFile className="text-2xl text-gray-400 mt-4" />
              <input
                type="file"
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="fileInput"
                accept=".kmz,.kml"
              />
              <label
                htmlFor="fileInput"
                className="bg-green-500 rounded-md px-4 py-2 font-medium cursor-pointer hover:bg-green-600 duration-300 text-white mt-4"
              >
                Select files
              </label>
            </div>
          </div>
      
          {selectedFile && (
            <div className="flex mt-4 w-full justify-between items-center">
              <div className="flex justify-between items-center">
                <FaFile className="text-2xl text-gray-400 mr-2" />
                <div>
                  <p className="text-sm">{selectedFile.name}</p>
                  <p className="text-[12px] text-gray-400">
                    {selectedFile.size} B
                  </p>
                </div>
              </div>
              <span
                onClick={handleRemoveFile}
                className="p-4 bg-gray-300 rounded-md cursor-pointer text-black hover:text-red-500 duration-300"
              >
                <FaTrash />
              </span>
            </div>
          )}
        </div>
        {placemarks.length > 0 && (
          <select className="mt-4 p-2 border" value={selectedPlacemark || ""} onChange={(e) => setSelectedPlacemark(e.target.value)}>
            <option value="">Select a Placemark</option>
            {placemarks.map((placemark) => (
              <option key={placemark.id} value={placemark.id}>{placemark.name}</option>
            ))}
          </select>
        )}
        {selectedFile ? (
          <>
            <div className="flex items-center justify-between w-[50%] mt-4 bg-[#333] p-2 rounded-md gap-2">
              <button
                onClick={() => setSelectedFile(null)}
                className="w-1/2 py-3 rounded bg-[#474747] text-white border-none outline-none cursor-pointer hover:bg-red-600 duration-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessbtn}
                className="w-1/2 py-3 rounded bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none outline-none cursor-pointer hover:bg-green-600 duration-300 hover:text-white"
              >
                Done
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500 mt-4">No file selected.</p>
        )}
        {error && <p className="text-red-500 mt-2">{error}</p>}{" "}
        {/* Display error */}
      </div>
    </div>
  );
};

export default UploadImg;
