"use client"
import { useState } from 'react';
import { useFirebase } from "@/hooks/useFirebase";
import Swal from "sweetalert2";
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { adminLogin } = useFirebase();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const staticEmail = "crop2x@gmail.com";
    const staticPassword = "crop2x";

    if (email !== staticEmail || password !== staticPassword) {
      Swal.fire("Invalid Credentials", "The email or password is incorrect.", "error");
      return;
    }

    setLoading(true);

    try {
      router.push('/dashboard');
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
      Swal.fire("Error", "Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-2xl rounded-lg p-8 w-full max-w-lg transform transition duration-500 hover:scale-105">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Welcome Back!</h2>
        <p className="text-gray-600 text-center mb-8">Please enter your credentials to login.</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                placeholder="Enter your password"
              />
              <span
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full bg-indigo-600 text-white py-3 rounded-lg shadow-md hover:bg-indigo-700 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Login'}
          </button>

          {errorMessage && (
            <p className="text-red-500 text-center mt-4">{errorMessage}</p>
          )}
        </form>

        
      </div>
    </div>
  );
}
