import React, { useState } from "react";
import { ArrowRight, CheckCircle, ShieldCheck, Clock, ShoppingCart, Facebook, Instagram, Twitter, MapPin, Phone, Mail, X, Utensils, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImg from "../assets/ch.jpg";
import MainHeader from "./MainHeader";

export default function MainPage() {
  const navigate = useNavigate();
  const [PopUp,setPopUp]=useState(false);
  const [showMenu, setShowMenu] = useState(false); // New state for popup
  const FirstLogin=()=>
  {
    //  const isOk=window.confirm("Please Login First");
    //  if(isOk)
    //  {
    //     navigate("/login")
    //  }

    setPopUp(true)
  }
  const menuItems = [
    { name: "Wheat Chapati", price: "10", desc: "100% Whole Wheat" },
    { name: "Puranpoli", price: "25", desc: "Sweet Chana Dal" },
    { name: "Jowar Bhakari", price: "15", desc: "Traditional & Healthy" },
    { name: "Rice Chapati", price: "15", desc: "Winter Special" },
  ];

  return (
    <div className="min-h-screen bg-white relative">
      
      {/* --- CENTER FLOATING MENU POPUP --- */}
      {showMenu && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-md transition-opacity"
            onClick={() => setShowMenu(false)}
          ></div>

          {/* Center Modal */}
          <div className="relative bg-white w-full max-w-5xl h-auto max-h-[85vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in duration-300">
            
            {/* Left Brand Panel (Desktop Only) */}
            <div className="hidden md:flex md:w-1/3 bg-green-700 p-10 flex-col justify-between text-white">
              <div>
                <Utensils size={48} className="mb-6 text-green-200" />
                <h2 className="text-4xl font-black leading-tight italic">FRESHLY <br/> BAKED.</h2>
                <p className="mt-4 text-green-100 opacity-80">Handmade with love using premium grains.</p>
              </div>
              <div className="bg-green-800/50 p-4 rounded-2xl border border-green-600">
                <div className="flex gap-1 text-yellow-400 mb-1">
                    <Star size={14} fill="currentColor"/>
                    <Star size={14} fill="currentColor"/>
                    <Star size={14} fill="currentColor"/>
                    <Star size={14} fill="currentColor"/>
                    <Star size={14} fill="currentColor"/>
                </div>
                <p className="text-xs font-bold">"Best chapatis in town!"</p>
              </div>
            </div>

            {/* Right Menu Content */}
            <div className="flex-1 p-8 md:p-12 overflow-y-auto">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">Our Specials</h3>
                <button 
                  onClick={() => setShowMenu(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={28} className="text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {menuItems.map((item, index) => (
                  <div key={index} className="p-2 rounded-[2rem] border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-xl hover:border-green-200 transition-all group cursor-pointer">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-xl text-gray-900 group-hover:text-green-700 transition">{item.name}</h4>
                      <span className="font-black text-green-700">₹{item.price}</span>
                    </div>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => {
             FirstLogin();
             setShowMenu(false);
            }}

                className="w-full mt-10 bg-green-700 cursor-pointer text-white py-5 rounded-2xl font-bold hover:bg-green-800 transition-all shadow-xl shadow-green-100 flex items-center justify-center gap-3"
              >
                Start Ordering Now <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- REST OF YOUR ORIGINAL CODE --- */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
        <MainHeader />

        <div className="grid lg:grid-cols-2 gap-12 items-center pt-12 pb-24">
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div>
              <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold text-green-700 bg-green-50 rounded-full">
                #1 Fresh Food Delivery in Mumbai 📍
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight">
                Fresh Chapatis. <br />
                <span className="text-green-700">Zero Effort.</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-lg mx-auto lg:mx-0">
                The traditional taste of handmade chapatis, delivered fresh to your door. 
                Hygienic, healthy, and always on time.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={FirstLogin}
                className="w-full cursor-pointer sm:w-auto px-10 py-4 bg-green-700 text-white font-bold rounded-2xl shadow-xl shadow-green-100 hover:bg-green-800 hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                Order Now <ArrowRight size={20} />
              </button>
              {/* Trigger the Popup here */}
              <button 
                onClick={() => setShowMenu(true)}
                className="w-full cursor-pointer sm:w-auto px-10 py-4 bg-white text-gray-900 font-bold rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all"
              >
                View Menu
              </button>
            </div>
          </div>

          {/* Right Image Content */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[500px]">
              <div className="bg-green-100 absolute inset-0 rounded-[3rem] rotate-6 scale-95 -z-10"></div>
              <img
                src={heroImg}
                alt="Fresh Chapatis"
                className="rounded-[3rem] shadow-2xl w-full h-auto object-cover border-8 border-white"
              />
              <div className="absolute -bottom-12 -right-2 bg-white p-6 rounded-3xl shadow-2xl md:block border border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-full text-orange-600">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Delivery Time</p>
                    <p className="text-lg font-bold text-gray-900">25-30 Mins</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- STATS BAR --- */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Daily Orders", val: "500+" },
            { label: "Happy Clients", val: "2k+" },
            { label: "Purity", val: "100%" },
            { label: "Cities", val: "1 (Mumbai)" },
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-3xl font-extrabold text-green-700">{stat.val}</p>
              <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>


      {PopUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
          {/* Modal Box */}
          <div className="relative w-[380px] bg-white rounded-2xl shadow-2xl p-6 text-center animate-scaleIn">
            {/* Close Icon */}
            <button
              onClick={() => setPopUp(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
            >
              ✕
            </button>

           <p className="text-2xl font-bold mb-10">Please Login First</p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setPopUp(false)}
                className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
              >
                Not Now
              </button>

              <button
                onClick={() => {
                  navigate("/login");
                  setPopUp(false);
                }}
                className="flex-1 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 active:scale-95 transition"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="bg-gray-900 text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="bg-green-600 p-2 rounded-lg">
                  <ShoppingCart size={20} />
                </div>
                <span className="text-2xl font-bold">ChapatiMart</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Bringing back the authentic taste of home-cooked meals to your busy lifestyle. 
              </p>
              <div className="flex gap-4">
                <SocialIcon Icon={Facebook} />
                <SocialIcon Icon={Instagram} />
                <SocialIcon Icon={Twitter} />
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Explore</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-green-500 transition">Our Story</a></li>
                <li><a href="#" className="hover:text-green-500 transition">Bulk Orders</a></li>
                <li><a href="#" className="hover:text-green-500 transition">Partner with Us</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Support</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-green-500 transition">Help Center</a></li>
                <li><a href="#" className="hover:text-green-500 transition">Track Order</a></li>
                <li><a href="#" className="hover:text-green-500 transition">Privacy Policy</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Contact Us</h4>
              <div className="space-y-4">
                <ContactInfo Icon={Phone} text="+91 98765 43210" />
                <ContactInfo Icon={Mail} text="hello@chapatimart.com" />
                <ContactInfo Icon={MapPin} text="Jalna, Maharashtra" />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-xs">
            <p>© 2025 ChapatiMart Fresh Foods Pvt Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
    

    
  );
}


const SocialIcon = ({ Icon }) => (
  <div className="p-2 rounded-full border border-gray-700 hover:bg-green-600 hover:border-green-600 transition cursor-pointer">
    <Icon size={18} />
  </div>
);

const ContactInfo = ({ Icon, text }) => (
  <div className="flex items-center gap-3 text-sm text-gray-400">
    <Icon className="text-green-600" size={18} />
    <span>{text}</span>
  </div>
);