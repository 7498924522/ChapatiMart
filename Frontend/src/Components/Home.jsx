import React, { useState, useRef, useEffect } from "react";
import { ArrowRight, Phone, Mail, MapPin, Facebook, Twitter, Instagram, ChevronLeft, ChevronRight, ShoppingCart, Plus, Minus, X, Truck, Clock, ShieldCheck, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import chapati from "../assets/ch.jpg";
import H from "../assets/Harabhara.jpg";
import Puranpoli from "../assets/puran.jpg";
import flour from "../assets/F.jpg";
import Gahu from "../assets/w.jpg";
import Bhakari from "../assets/BB.jpg";
import R from "../assets/rice.jpg";
import T from "../assets/toor.jpg";
export default function Home() {
 
  const [cart, setCart] = useState({});

 
  const scrollContainerRef = useRef(null);
  const navigate=useNavigate();

  // Load cart from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('chapatiCart');
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (error) {
        setCart({});
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('chapatiCart', JSON.stringify(cart));
  }, [cart]);

  // Calculate cart totals
  const cartItems = Object.entries(cart)
    .filter(([id, qty]) => qty > 0)
    .map(([id, qty]) => {
      const item = [...popularItems, ...allProducts].find(p => p.id === id);
      return item ? { ...item, quantity: qty } : null;
    })
    .filter(Boolean);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  

 

  // Scroll function
  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth'
      });
    }
  };

 
    
  return (
    <div className="w-full relative">
     

      {/* HEADER */}
      
      <Header/>

     

      {/* HERO SECTION */}
      <section id="home" className="bg-gradient-to-r from-green-700 to-green-500 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Fresh Chapati & Daily Essentials <br />
              Delivered at Your Doorstep 🫓
            </h1>
            <p className="mt-4 text-lg text-green-100">
              Wheat Flour • Fresh Chapati • Rice Chapati • Puran Poli • Water Bottle Supply
            </p>
            <button
              onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
              className="mt-6 bg-white text-green-700 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:scale-105 transition"
            >
              Order Now <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* CATEGORIES SLIDER */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="relative">
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white cursor-pointer rounded-full p-2 shadow-lg hover:bg-gray-100 transition"
            >
              <ChevronLeft className="text-green-700" size={24} />
            </button>
            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white rounded-2xl shadow p-6 text-center hover:shadow-lg transition cursor-pointer flex-shrink-0 w-48"
                >
                  <img src={cat.image} alt={cat.name} className="h-20 mx-auto object-contain rounded" />
                  <h3 className="mt-4 font-semibold">{cat.name}</h3>
                  <p className="text-sm text-gray-500">{cat.desc}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white cursor-pointer rounded-full p-2 shadow-lg hover:bg-gray-100 transition"
            >
              <ChevronRight className="text-green-700" size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why ChapatiMart?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((item, index) => (
              <div key={index} className="bg-green-50 rounded-xl p-6 text-center">
                <item.icon className="mx-auto text-green-700" size={40} />
                <h3 className="mt-4 font-semibold text-lg">{item.title}</h3>
                <p className="text-gray-600 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR ITEMS */}
      <section id="products" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8">Popular Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularItems.map((item) => {
              const qty = cart[item.id] || 0;
              return (
                <div key={item.id} className="bg-white rounded-xl cursor-pointer shadow p-4 hover:shadow-lg transition">
                  <div onClick={()=>navigate(item.route)} className="w-full h-32 flex items-center justify-center overflow-hidden rounded mb-3">
                    <img src={item.image} alt={item.name} className="h-full w-auto object-contain" />
                  </div>
                  <h3 className="font-semibold text-center mb-2">{item.name}</h3>
                  <div className=" items-center justify-center mb-3">
                    <div className="text-center space-x-2">
                    <span className="text-lg font-bold text-green-700">₹{item.price}</span>
                    <span className="text-sm text-gray-400 line-through">₹{item.oldprice}</span>
                    </div>
                    <button
                      onClick={() => navigate(item.route)}
                      className="w-full bg-pink-600 text-white cursor-pointer py-2 rounded-lg hover:bg-pink-700 transition flex items-center justify-center gap-2 font-semibold"
                    >
                         <ShoppingCart size={16} />
                      Add to Cart
                    </button>
                  </div>
                  </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-green-700 text-white text-center">
        <h2 className="text-4xl font-bold">Ready to Order Fresh Chapatis?</h2>
        <p className="mt-3 text-green-100">Simple • Fast • Hygienic</p>
        <button
          onClick={ () => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
          className="mt-6 cursor-pointer bg-white text-green-700 px-8 py-3 rounded-xl font-semibold hover:scale-105 transition"
        >
          Start Ordering
        </button>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex">
                 <div className=" p-2 rounded-lg text-green-600">
                    <ShoppingCart size={20} />
                 </div>
              <h3 className="text-xl font-bold text-green-400 mb-4">ChapatiMart</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Your trusted partner for fresh chapatis, quality flour, and daily essentials delivered to your doorstep.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#home" className="hover:text-green-400">Home</a></li>
                <li><a href="#products" className="hover:text-green-400">Products</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <Phone size={16} />
                  <span>+91 12345 67890</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={16} />
                  <span>info@chapatimart.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>Jalna, Maharashtra</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-green-600 transition">
                  <Facebook size={20} />
                </a>
                <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-green-600 transition">
                  <Twitter size={20} />
                </a>
                <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-green-600 transition">
                  <Instagram size={20} />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-400">
            <p>&copy; 2025 ChapatiMart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}


const categories = [
  { id: 1, name: "Wheat Flour", desc: "Premium Quality", image: flour },
  { id: 2, name: "Chapatis", desc: "Freshly Made", image: chapati },
  { id: 3, name: "Puran Poli", desc: "Traditional Taste", image: Puranpoli },
  // { id: 4, name: "Water Bottles", desc: "RO Purified", image: bottel },
  { id: 5, name: "Wheat", desc: "Pure", image: Gahu },
  { id: 6, name: "Rice Chapati", desc: "Tasty", image: R },
  { id: 7, name: "Toor Dal", desc: "Fresh & Pure", image: T },
  { id: 8, name: "(GRAM)Harabhara", desc: "Daily Needs", image: H},
  { id: 9, name: "Bhakari", desc:"Strong", image: Bhakari }

];

const features = [
  { title: "Daily Fresh", desc: "Prepared fresh every morning", icon: Clock },
  { title: "Fast Delivery", desc: "Same day doorstep delivery", icon: Truck },
  { title: "100% Hygienic", desc: "Clean & safe preparation", icon: ShieldCheck }
];

const popularItems = [
  { id: "P001", name: "Wheat Chapati", price: 10, oldprice: 15, route:"/chapati", image: chapati },
  { id: "P002", name: "Wheat Flour (1kg)", price: 20, oldprice: 25,route:"/flour", image: flour },
  { id: "P003", name: "Wheat", price: 15, oldprice: 20,  route:"/gahu", image: Gahu },
  // { id: "P004", name: "Water Bottle (20L)", price: 20, oldprice: 25, image: bottel },
 
];

const allProducts = [...popularItems];