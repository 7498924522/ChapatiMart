import React, { useState } from 'react';
import { Lock, User, ArrowRight, ShoppingCart, Eye, EyeOff, Shield, Package } from "lucide-react";
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from "react-toastify";
import API_BASE_URL from "../../config/api";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();

const from = location.state?.from?.pathname || "/home";
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    // Your existing axios logic would go here
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, {
        username: loginData.username,
        password: loginData.password,
      });
      const token = res.data.token;

    if (token) {
      
console.log(token); // or your key name

      localStorage.setItem("jwtToken", token);
      localStorage.setItem("loggedInUser", loginData.username);

      toast.success("Login successful!");
      navigate(from, { replace: true });
    } else {
      toast.error("Login failed: No token received");
    }

  } catch (error) {
    console.error(error);
    toast.error("Login failed: " + (error.response?.data || error.message));
  }
};

  const handleAdminLogin = () => {
    // Navigate to admin login or set admin mode
    toast.success('Redirecting to Admin Login...');
   navigate('/admin');
  };

  const handleDeliveryLogin = () => {
    // Navigate to delivery login or set delivery mode
    toast.success('Redirecting to Delivery Partner Login...');
    navigate('/delivery_Login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-green-600 to-green-700 p-4 rounded-2xl shadow-xl">
              <ShoppingCart className="text-white" size={36} />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-800 mb-2">ChapatiMart</h1>
          <p className="text-gray-600 text-base">Fresh groceries delivered to your doorstep</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Admin Login Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-4">
                <Shield className="text-blue-600" size={32} />
              </div>
              <h2 className="text-white text-2xl font-bold">Admin Portal</h2>
              <p className="text-blue-100 text-sm mt-2">Manage your business</p>
            </div>
            <div className="p-8">
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-600">Full dashboard access</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-600">Manage inventory & orders</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-600">Analytics & reports</p>
                </div>
              </div>
              <button
                onClick={handleAdminLogin}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Login as Admin
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

          {/* Customer Login Card - Main */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-green-500">
            <div className="bg-gradient-to-br from-green-600 to-green-700 p-6 text-center relative">
              <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                PRIMARY
              </div>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-4">
                <ShoppingCart className="text-green-600" size={32} />
              </div>
              <h2 className="text-white text-2xl font-bold">Customer Login</h2>
              <p className="text-green-100 text-sm mt-2">Start shopping now</p>
            </div>
            
            <div className="p-8">
              <div className="space-y-5">
                {/* Username / Email */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Username or Email  
                    {/* <a href='/Phone_login' className='text-orange-400 underline font-bold'>Phone Number</a> */}
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" size={20} />
                    <input 
                      type="text" 
                      placeholder="Enter username or email" 
                      value={loginData.username}
                      onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-green-500 focus:bg-white outline-none transition-all text-sm" 
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" size={20} />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Enter your password" 
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-green-500 focus:bg-white outline-none transition-all text-sm" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-green-600" />
                    Remember me
                  </label>
                  <a href="#" className="text-green-600 hover:text-green-700 font-semibold">
                    Forgot?
                  </a>
                </div>

                {/* Login Button */}
                <button 
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-green-200 hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  Sign In
                  <ArrowRight size={20} />
                </button>

                <div className="text-center pt-2">
                  <p className="text-sm text-gray-600">
                    New here? <a href="/signup" className="text-green-600 font-bold hover:underline">Create Account</a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Partner Login Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-gradient-to-br from-orange-600 to-orange-700 p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-4">
                <Package className="text-orange-600" size={32} />
              </div>
              <h2 className="text-white text-2xl font-bold">Delivery Partner</h2>
              <p className="text-orange-100 text-sm mt-2">Manage deliveries</p>
            </div>
            <div className="p-8">
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-600">View assigned orders</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-600">Update delivery status</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-600">Track earnings</p>
                </div>
              </div>
              <button
                onClick={handleDeliveryLogin}
                className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Login as Delivery
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="text-center mt-10">
          <p className="text-sm text-gray-500">
            🔒 Secure login powered by industry-standard encryption
          </p>
        </div>
      </div>
    </div>
  );
}