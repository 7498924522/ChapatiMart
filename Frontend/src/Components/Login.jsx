import React, { useState } from 'react';
import { Lock, User, ArrowRight, ShoppingCart, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    username: "", // email or username
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/auth/login", {
        username: loginData.username,
        password: loginData.password,
      });
      alert(res.data);

      if (res.data === "Login successful!") {
        // Save user as logged in
        localStorage.setItem("loggedInUser", loginData.username);
        // redirect to home page
        navigate("/home");
      }
    } catch (error) {
      console.error(error);
      alert("Login failed: " + (error.response?.data || error.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-0 md:p-6 overflow-x-hidden">
      <div className="w-full h-screen md:h-auto md:max-w-xl md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Form Section */}
        <div className="flex-1 bg-white px-6 sm:px-8 pt-8 pb-6 md:p-12 rounded-t-[2.5rem] md:rounded-t-none -mt-8 md:mt-0 relative z-10 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            
            <div className="mt-2 md:mt-4">
              <div className="flex items-center gap-2 mb-3">
                <ShoppingCart className="bg-white text-green-700 p-1 rounded-lg" size={24} />
                <span className="text-xl md:text-2xl font-bold tracking-tight">ChapatiMart</span>
              </div>
              
              <h1 className="text-xl xs:text-3xl md:text-2xl font-black leading-tight">
                Welcome <br/>
                <span className="text-orange-400">Back!</span>
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              {/* Username / Email */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Username or Email</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="User or Email" 
                    value={loginData.username}
                    onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                    className="w-full pl-11 pr-4 py-3.5 md:py-4 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition-all text-sm" 
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex justify-between px-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Password</label>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    className="w-full pl-11 pr-10 py-3.5 md:py-4 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition-all text-sm" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button 
                type="submit"
                className="w-full bg-green-700 text-white py-3.5 md:py-4 rounded-2xl font-bold shadow-lg shadow-green-100 active:scale-95 transition-all flex items-center justify-center gap-2 mt-2"
              >
                Sign In <ArrowRight size={18} />
              </button>
            </form>

            <div className="mt-6 md:mt-10 text-center">
              <p className="text-xs md:text-sm text-gray-500 font-medium">
                New here? <Link to="/signup" className="text-green-700 font-bold hover:underline">Create Account</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
