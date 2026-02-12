import React, { useState, useEffect } from 'react';
import { Search, User, ShoppingCart, LogOut, Menu, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import {toast} from "react-toastify";

function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [email, setEmail] = useState("user@example.com");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate=useNavigate();

  // Sync cart count with localStorage
  useEffect(() => {
    const updateCount = () => {
      const saved = localStorage.getItem("chapatiCart");
      if (saved) {
        const cart = JSON.parse(saved);
        const total = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
        setCartCount(total);
      }
    };

    updateCount();
    
    // Poll for changes every 500ms to detect same-tab updates
    const interval = setInterval(updateCount, 500);
    
    // Listen for storage changes in other tabs
    window.addEventListener('storage', updateCount);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', updateCount);
    };
  }, []);

  // Get logged in user email
  useEffect(() => {
    const loggedInEmail = localStorage.getItem("loggedInUser");
    if (loggedInEmail) {
      setEmail(loggedInEmail);
    }
  }, []);

  // Get first letter for avatar
  const firstLetter = email ? email.charAt(0).toUpperCase() : "U";

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("jwtToken");
    console.log("Token removed");
    localStorage.removeItem("chapatiCart");
    
    setEmail("");
    setCartCount(0);
    setShowUserMenu(false);
    toast.success("Logged out successfully!");
    navigate('/'); // Uncomment this when using with react-router
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  return (
    <header className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Navigation Bar */}
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl shadow-lg hover:bg-white/20 transition-all duration-300">
              <ShoppingCart size={24} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Chapati<span className="text-yellow-300">Mart</span>
              </h1>
              <p className="text-xs text-green-100 -mt-1">Fresh & Healthy</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-xl font-bold text-white">
                Chapati<span className="text-yellow-300">Mart</span>
              </h1>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-6">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for fresh chapatis, bhakari, rotis..."
                className="w-full pl-12 pr-4 py-3 border-2 border-white/20 rounded-full bg-white/95 backdrop-blur-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            
            {/* User Profile Dropdown */}
            <div className="relative user-menu-container">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 group"
                aria-label="User menu"
              >
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center font-bold text-white shadow-lg group-hover:scale-110 transition-transform">
                  {firstLetter}
                </div>
                <span className="hidden lg:block text-white font-medium text-sm max-w-[120px] truncate">
                  {email.split('@')[0]}
                </span>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">Signed in as</p>
                    <p className="text-sm text-gray-600 truncate mt-1">{email}</p>
                  </div>
                  
                  <div className="py-1">
                    <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-green-50 transition-colors flex items-center gap-3">
                      <User size={16} className="text-gray-500" />
                      My Profile
                    </button>
                    <button onClick={()=>navigate("/myorders")} className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-green-50 transition-colors flex items-center gap-3">
                      <ShoppingCart size={16} className="text-gray-500" />
                      My Orders
                    </button>
                  </div>

                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3 font-medium"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Button */}
            <button
            onClick={()=>navigate("/cart")}
              className="relative cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl group"
              aria-label="Shopping cart"
            >
              <div className="relative">
                <ShoppingCart size={22} className="text-green-700 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold min-w-[20px] h-5 rounded-full flex items-center justify-center px-1.5 shadow-md animate-in zoom-in">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:block text-sm font-semibold text-gray-900">
                Cart
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <X size={24} className="text-white" />
              ) : (
                <Menu size={24} className="text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chapatis, bhakari..."
              className="w-full pl-10 pr-4 py-2.5 border border-white/20 rounded-xl bg-white/95 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-inner"
            />
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-3 animate-in slide-in-from-top duration-300">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-2 space-y-1">
              <button className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-green-50 rounded-lg transition-colors flex items-center gap-3">
                <User size={18} className="text-gray-500" />
                My Profile
              </button>
              <button onClick={()=>navigate("/myorders")} className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-green-50 rounded-lg transition-colors flex items-center gap-3">
                <ShoppingCart size={18} className="text-gray-500" />
                My Orders
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-3"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;