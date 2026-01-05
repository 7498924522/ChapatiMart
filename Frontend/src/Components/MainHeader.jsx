import React, { useState } from 'react';
import { ShoppingCart, Menu, X, User } from "lucide-react";
import { useNavigate } from 'react-router-dom';

function MainHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <header className="relative">
      <nav className="flex items-center justify-between py-6">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <div className="bg-green-700 text-white p-2 rounded-xl shadow-md">
            <ShoppingCart size={20} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-900">
            Chapati<span className="text-green-700">Mart</span>
          </span>
        </div>

        {/* Desktop Links (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm hover:underline font-semibold text-gray-600 hover:text-green-700 transition">Features</a>
          <a href="#about" className="text-sm font-semibold hover:underline text-gray-600 hover:text-green-700 transition">About</a>
          
          <div className="flex items-center gap-4 ml-4">
              <button onClick={()=>navigate("/login")} className=" text-gray-700 px-6 py-2.5 rounded-full  cursor-pointer text-sm font-bold  transition shadow-sm">
              Login
            </button>
            <button onClick={()=>navigate("/signup")} className=" text-gray-700 px-6 py-2.5 rounded-full  cursor-pointer text-sm font-bold  transition shadow-sm">
              Sign Up
            </button>
          </div>
        </div>

        {/* Mobile Menu Toggle (Visible only on Mobile) */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-700 hover:bg-gray-100 cursor-pointer rounded-lg transition"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-white shadow-xl rounded-2xl p-6 z-50 border border-gray-100 md:hidden animate-in slide-in-from-top-5 duration-200">
          <div className="flex flex-col gap-5">
            <a href="#features" className="text-lg cursor-pointer font-semibold text-gray-700" onClick={() => setIsMenuOpen(false)}>Features</a>
            <a href="#about" className="text-lg  cursor-pointer font-semibold text-gray-700" onClick={() => setIsMenuOpen(false)}>About</a>
            <hr className="border-gray-100" />
            <div className="flex flex-col gap-3">
              <button onClick={()=>navigate("/login")}  className="w-full cursor-pointer flex items-center justify-center gap-2 py-3 text-gray-700 font-bold border border-gray-200 rounded-xl hover:bg-gray-50">
                <User size={18} /> Login
              </button>
              <button onClick={()=>navigate("/signup")} className="w-full cursor-pointer py-3 bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-100">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default MainHeader;