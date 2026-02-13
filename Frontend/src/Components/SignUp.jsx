import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from "./src/config/api";



export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/signup`, formData);

      alert(res.data); // show response from backend
      navigate('/login'); // redirect to login page
    } catch (error) {
      if (error.response && error.response.data) {
        alert("Signup failed: " + error.response.data);
      } else {
        alert("Signup failed: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Side */}
        <div className="hidden md:flex md:w-1/2 bg-green-700 p-12 flex-col justify-between text-white relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full border-8 border-white"></div>
            <div className="absolute bottom-20 right-10 w-20 h-20 rounded-full bg-white"></div>
          </div>
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2 mb-12">
              <div className="bg-white text-green-700 p-2 rounded-xl">
                <ShoppingCart size={24} />
              </div>
              <span className="text-2xl font-bold tracking-tight">ChapatiMart</span>
            </Link>
            <h1 className="text-4xl font-extrabold leading-tight mb-6">
              Join the community of <span className="text-orange-400">Healthy Eaters.</span>
            </h1>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-green-100">Track your orders in real-time</li>
              <li className="flex items-center gap-3 text-green-100">Exclusive discounts on bulk orders</li>
              <li className="flex items-center gap-3 text-green-100">Save your favorite chapatis</li>
            </ul>
          </div>
          <p className="relative z-10 text-sm text-green-200">
            © 2025 ChapatiMart Fresh Foods. Quality Guaranteed.
          </p>
        </div>

        {/* Right Side: Signup Form */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-black text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-500">Sign up to get started with your first order.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Username</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" size={20} />
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" size={20} />
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" size={20} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-700 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-green-100 hover:bg-green-800 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              >
                {loading ? "Signing Up..." : "Create Account"} <ArrowRight size={20} />
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-green-700 font-bold hover:underline underline-offset-4">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
