"use client";
import React, { useState, useEffect } from "react";
import { getAuth, updatePassword } from "firebase/auth";
import { app } from "../../firebase/firebase";
import Swal from "sweetalert2";

const UserManagementModal = ({ isOpen, onClose }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [passwordUpdates, setPasswordUpdates] = useState({});
  const [passwordVisibility, setPasswordVisibility] = useState({});
  const [updating, setUpdating] = useState({});

  const auth = getAuth(app);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/userpassword");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data.users);
      
      // Initialize states
      const initialUpdates = {};
      const initialVisibility = {};
      data.users.forEach(user => {
        initialUpdates[user.uid] = "";
        initialVisibility[user.uid] = false;
      });
      setPasswordUpdates(initialUpdates);
      setPasswordVisibility(initialVisibility);
    } catch (error) {
      console.error("Error fetching users:", error);
      Swal.fire("Error", "Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (user) => {
    const newPassword = passwordUpdates[user.uid];
    
    if (!newPassword || newPassword.length < 6) {
      Swal.fire("Error", "Password must be at least 6 characters", "error");
      return;
    }

    try {
      setUpdating(prev => ({ ...prev, [user.uid]: true }));
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user.uid,
          newPassword: newPassword
        }),
      });

      if (!response.ok) throw new Error('Failed to reset password');
      
      Swal.fire("Success", `Password updated for ${user.email}`, "success");
      setPasswordUpdates(prev => ({ ...prev, [user.uid]: "" }));
    } catch (error) {
      console.error("Error updating password:", error);
      Swal.fire("Error", getErrorMessage(error.code), "error");
    } finally {
      setUpdating(prev => ({ ...prev, [user.uid]: false }));
    }
  };

  const getErrorMessage = (code) => {
    switch (code) {
      case "auth/requires-recent-login":
        return "Requires recent authentication. Please log in again.";
      case "auth/weak-password":
        return "Password is too weak";
      default:
        return "Failed to update password";
    }
  };

  const handlePasswordInputChange = (uid, value) => {
    setPasswordUpdates(prev => ({ ...prev, [uid]: value }));
  };

  const togglePasswordVisibility = (uid) => {
    setPasswordVisibility(prev => ({
      ...prev,
      [uid]: !prev[uid]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6  max-h-[80vh] overflow-y-auto shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
          <button
            onClick={onClose}
            className="text-gray-500 text-2xl hover:text-red-500 h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-4 text-left font-medium text-gray-700">Email</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-700">UID</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-700">New Password</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.uid} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-800">{user.email}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{user.uid}</td>
                      <td className="py-3 px-4">
                        <div className="relative">
                          <input
                            type={passwordVisibility[user.uid] ? "text" : "password"}
                            value={passwordUpdates[user.uid] || ""}
                            onChange={(e) => handlePasswordInputChange(user.uid, e.target.value)}
                            placeholder="Enter new password"
                            className="w-full p-2 text-black border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                            minLength={6}
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(user.uid)}
                            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                            aria-label={passwordVisibility[user.uid] ? "Hide password" : "Show password"}
                          >
                            {passwordVisibility[user.uid] ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handlePasswordChange(user)}
                          disabled={!passwordUpdates[user.uid] || passwordUpdates[user.uid].length < 6 || updating[user.uid]}
                          className={`px-4 py-2 rounded text-sm transition-colors ${
                            passwordUpdates[user.uid] && passwordUpdates[user.uid].length >= 6 && !updating[user.uid]
                              ? "bg-green-500 hover:bg-green-600 text-white"
                              : "bg-gray-200 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          {updating[user.uid] ? (
                            <span className="flex items-center justify-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Updating...
                            </span>
                          ) : 'Update'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagementModal;