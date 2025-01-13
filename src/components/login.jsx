'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFirebase } from "@/hooks/useFirebase";
import Swal from "sweetalert2";

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

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      Swal.fire("Invalid Input", "Please enter a valid email address.", "error");
      return;
    }

    // Validate password
    if (password.length <= 6) {
      Swal.fire("Invalid Input", "Password must be longer than 6 characters.", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await adminLogin(email, password);

      if (response.success) {
        router.push('/dashboard');
      } else {
        setErrorMessage(response.message);
        alert(response.message);
      }
    } catch (error) {
      setErrorMessage(error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-purple-400 overflow-x-hidden flex items-center justify-center h-screen">
      <div className="login-container container w-full lg:w-4/5 lg:bg-white h-screen lg:h-3/4 lg:border border-gray-300 rounded-lg flex flex-wrap lg:flex-nowrap flex-col lg:flex-row justify-between group">
        
        {/* Product Side */}
        <div className="relative group lg:bg-theme-yellow-dark flex-1">
          
          {/* Welcome Text */}
          <div className="text-center hidden lg:flex items-center justify-start h-full w-full select-none">
            <span className="transform block whitespace-nowrap h-full -rotate-90 text-[55px] 2xl:text-[70px] font-black uppercase text-[#006400] opacity-0 transition-all group-hover:opacity-100 ml-10 2xl:ml-12 group-hover:-ml-20 2xl:group-hover:ml-26 lg:group-hover:ml-20 duration-1000 lg:duration-700 ease-in-out">
              WELCOME BACK
            </span>
          </div>

          {/* Farmer Image */}
          <div className="product absolute right-0 bottom-0 flex items-center justify-center w-full bg-transparent opacity-50 lg:opacity-100">
            <img
              src="/images/farmer.png"
              alt="Product"
              className="h-[100px] sm:h-[200px] md:h-[300px] w-auto object-cover transform scale-x-[-1] group-hover:translate-x-4 transition-all duration-700 lg:duration-700 ease-in-out"
            />
            <div className="shadow w-full h-5 bg-black bg-opacity-25 filter blur absolute bottom-0 lg:bottom-14 left-0 lg:left-24 rounded-full transform skew-x-10"></div>
          </div>

          {/* White Divider (Desktop Only) */}
          <div className="hidden lg:block w-1/3 bg-white ml-auto"></div>
        </div>

        {/* Form Side */}
        <div className="w-full lg:w-1/2 order-1 lg:order-2 flex-1">
          <div className="form-wrapper flex items-center h-full px-5 sm:px-10 relative z-10 pt-16 lg:pt-0 mt-0 lg:mt-0">
            <form onSubmit={handleLogin} className="w-full space-y-5" noValidate>
              
              {/* Form Caption */}
              <div className="form-caption flex items-end justify-center text-center space-x-3 mb-10 lg:mb-20">
                <span className="text-2xl sm:text-3xl font-semibold text-gray-700">Login</span>
              </div>

              {/* Email Field */}
              <div className="form-element">
                <label className="space-y-2 w-full block mx-auto">
                  <span className="block text-lg text-gray-800 tracking-wide">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-yellow-100 lg:bg-white border lg:border-2 border-gray-400 lg:border-gray-200 w-full p-2 sm:p-2 focus:outline-none focus:border-gray-400"
                    placeholder="Enter your email"
                  />
                </label>
              </div>

              {/* Password Field */}
              <div className="form-element">
                <label className="space-y-2 w-full block mx-auto">
                  <span className="block text-lg text-gray-800 tracking-wide">Password</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-yellow-100 lg:bg-white border lg:border-2 border-gray-400 lg:border-gray-200 w-full p-2 sm:p-2 focus:outline-none focus:border-gray-400"
                    placeholder="Enter your password"
                  />
                </label>
              </div>

              {/* Show Password Checkbox */}
              <div className="form-element flex items-center justify-between w-full mx-auto">
                <label className="flex items-center space-x-2 select-none">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                  />
                  <span className="text-gray-800 tracking-wide">Show Password</span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="form-element w-full mx-auto">
                <button
                  type="submit"
                  className="cursor-pointer border-2 border-purple-700 w-full p-3 bg-purple-200 focus:outline-none hover:bg-theme-yellow transition-all"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
