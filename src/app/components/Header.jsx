"use client"

import { useState } from "react";
import RegistrationModal from "./RegistrationModal";
import { TbPasswordUser } from "react-icons/tb";
import { IoMdSettings } from "react-icons/io";
import { LuKeyRound } from "react-icons/lu";
import { useRouter } from "next/navigation";
import UserManagementModal from "./UserManagement";

export default function Header({ toggleDrawer }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
 const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);

  const router = useRouter();

  const handleSetting = () => {
    router.push("/calibration");
  };

  return (
    <header className="flex justify-between p-4 pl-6 bg-gradient-to-r  from-blue-500 to-indigo-600 shadow-md text-white">
      <h1 className="text-2xl font-bold">Geofencing-Dashboard</h1>
      <div className="flex justify-end space-x-2">
        {/* Settings Icon with Tooltip */}
        <div 
          onClick={handleSetting} 
          className="bg-gray-200 hover:bg-gray-300 h-12 w-12 flex items-center justify-center rounded-full hover:cursor-pointer relative group"
          title="Settings"
        >
          <IoMdSettings size={22} color="black" />
          {/* Custom Tooltip (alternative to native title) */}
          <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Settings
          </span>
        </div>
        
        {/* Key Icon with Tooltip */}
        <div 
          onClick={() => setIsModalOpen(true)} 
          className="bg-gray-200 h-12 w-12 flex items-center justify-center hover:bg-gray-300 rounded-full hover:cursor-pointer relative group"
          title="Registration"
        >
          <LuKeyRound size={22} color="black" />
          {/* Custom Tooltip (alternative to native title) */}
          <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Registration
          </span>
        </div>
          <div 
          
          className="bg-gray-200 h-12 w-12 flex items-center justify-center hover:bg-gray-300 rounded-full hover:cursor-pointer relative group"
           onClick={() => setIsUserManagementOpen(true)
            
           } 
        >
          <TbPasswordUser  size={22} color="black" />
          {/* Custom Tooltip (alternative to native title) */}
          <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Forget Password
          </span>
        </div>
      </div>
      
      <RegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <UserManagementModal
        isOpen={isUserManagementOpen}
        onClose={() => setIsUserManagementOpen(false)}
      />
    </header>
  );
}