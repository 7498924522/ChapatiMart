import React, { useState, useEffect } from "react";
import { Minus, Plus, Trash } from "lucide-react";
import chapati from "../assets/ch.jpg";
import Puranpoli from "../assets/puran.jpg";
import Bhakari from "../assets/BB.jpg";
import Header from "./Header";

export default function Bhakaries() {
  // ✅ Load quantity from localStorage on first render
  const [quantity, setQuantity] = useState(() => {
    const savedQty = localStorage.getItem("chapatiQty");
    return savedQty ? Number(savedQty) : 0;
  });

  // ✅ Save quantity to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("chapatiQty", quantity);
  }, [quantity]);

  const cartItem = {
    name: "Wheat Chapati (Fresh)",
    brand: "ChapatiMart",
    price: 10,
    mrp: 15,
    image: Bhakari,
    rating: 4.7,
    reviews: "3.5k",
  };
  const SimilarItem = [
    {
      id: "P001",
      name: "Puranpoli",
      price: 25,
      oldprice: 30,
      image: Puranpoli,
    },
    {
      id: "P002",
      name: "Bhakari",
      price: 15,
      oldprice: 20,
      image: Bhakari,
    },
     {
      id: "P001",
      name: "Puranpoli",
      price: 25,
      oldprice: 30,
      image: Puranpoli,
    },
    {
      id: "P002",
      name: "Bhakari",
      price: 15,
      oldprice: 20,
      image: Bhakari,
    },
  ];

  const totalPrice = cartItem.price * quantity;

  // ✅ Delete item function
  const handleDelete = () => {
    setQuantity(0);
    localStorage.removeItem("chapatiQty");
  };

  return (
    <>
     <Header/>
    <div className="max-w-6xl mx-auto px-6 py-10">
       
      {/* Breadcrumb */}
      <p className="text-sm text-gray-500 mb-4">
        Home &gt; Chapaties &gt; {cartItem.name}
      </p>

      <div className="grid md:grid-cols-2 gap-10">
        {/* LEFT: IMAGE */}
        <div className="bg-white rounded-xl shadow p-6 flex items-center justify-center">
          <img
            src={cartItem.image}
            alt={cartItem.name}
            className="h-80 object-contain"
          />
        </div>

        {/* RIGHT: DETAILS */}
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold">{cartItem.name}</h1>
          <p className="text-gray-500 mt-1">by {cartItem.brand}</p>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-green-600 text-white px-2 py-0.5 rounded text-sm">
              {cartItem.rating} ★
            </span>
            <span className="text-sm text-gray-500">({cartItem.reviews})</span>
          </div>

          {/* Price */}
          <div className="mt-4 flex items-center gap-4">
            <span className="text-3xl font-bold text-green-700">
              ₹{cartItem.price}
            </span>
            <span className="line-through text-gray-400">₹{cartItem.mrp}</span>
            <span className="text-green-600 font-semibold">
              {Math.round(
                ((cartItem.mrp - cartItem.price) / cartItem.mrp) * 100
              )}
              % OFF
            </span>
          </div>

          {/* Quantity */}
          <div className="mt-6 flex items-center gap-4">
            <span className="font-semibold">Quantity:</span>

            <div className="flex items-center border rounded">
              <button
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                className="p-2 hover:bg-gray-100"
              >
                <Minus size={16} />
              </button>

              <span className="px-4">{quantity}</span>

              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 hover:bg-gray-100"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* ✅ DELETE BUTTON */}
            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700 flex items-center gap-1"
            >
              <Trash size={16} /> Delete Item
            </button>
          </div>

          {/* Offers */}
          <div className="mt-6 bg-gray-50 p-4 rounded">
            <h3 className="font-semibold mb-2">Coupons & Offers</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✔ Get ₹20 OFF on first order</li>
              <li>✔ Free delivery above ₹99</li>
              <li>✔ 5% cashback on UPI payment</li>
            </ul>
          </div>

          {/* Total */}
          <div className="mt-6 flex justify-between items-center">
            <span className="text-lg font-semibold">Total Amount</span>
            <span className="text-2xl font-bold text-green-700">
              ₹{totalPrice}
            </span>
          </div>

          {/* CTA */}
          <button
            disabled={quantity === 0}
            className={`mt-6 w-full py-3 rounded-xl font-semibold transition
              ${
                quantity === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-pink-600 text-white hover:bg-pink-700"
              }`}
          >
            Place Order
          </button>
        </div>

        
      </div>
      {/* similar items */}
        <p className="text-2xl font-semibold py-10">Similar Items</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 ">
          {SimilarItem.map((item) => (
            <div
              key={item.id}
              className="bg-white  rounded-xl shadow p-4 hover:shadow-lg transition flex flex-col items-center"
            >
              <div className="w-full h-auto flex items-center justify-center overflow-hidden rounded">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-auto object-contain cursor-pointer"
                />
              </div>
              <h3 className="mt-2 font-semibold ">{item.name}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate("/chapaties")}
                  className="text-white bg-green-600 font-bold mt-1 px-4 rounded-md cursor-pointer"
                >
                  ₹{item.price}
                </button>
                <p className="text-black/50">
                  <strike>₹{item.oldprice}</strike>
                </p>
              </div>
            </div>
          ))}
        </div>
    </div>
    </>
  );
}
