import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from "../../firebase/firebase";
import Swal from 'sweetalert2';

const RegistrationModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password should be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const auth = getAuth(app);
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      // Show success alert
      Swal.fire({
        title: 'Success!',
        text: 'Registration successful!',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      // Reset form and close modal
      setFormData({
        email: '',
        password: '',
        confirmPassword: ''
      });
      onClose();
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (code) => {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Email already in use';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/weak-password':
        return 'Password is too weak';
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled';
      default:
        return 'Registration failed. Please try again.';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-black">Register</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-red-400"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
              placeholder='Enter your email'
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 text-black border rounded"
              required
              placeholder='Enter your password'
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full text-black p-2 border rounded"
              required
              placeholder='Confirm your password'
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </span>
            ) : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationModal;