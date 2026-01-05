import React, { useState, useEffect } from "react";
import { Minus, Plus, Trash, ShoppingCart } from "lucide-react";
import Gahu from "../assets/w.jpg";
import J from "../assets/jwar.jpg";
import H from "../assets/Harabhara.jpg";
import T from "../assets/toor.jpg";
import Header from "./Header";
import { useNavigate } from "react-router-dom";


export default function Wheat() {
  const navigate=useNavigate();
  const mainItem = {
    id: "W001",
    name: "Wheat (1kg)",
    brand: "ChapatiMart",
    price: 10,
    mrp: 15,
    image: Gahu,
    rating: 4.7,
    reviews: "3.5k",
  };

  const similarItems = [
    {
      id: "W002",
      name: "Toor",
      brand: "ChapatiMart",
      price: 25,
      mrp: 30,
      image: T,
     
    },
    {
      id: "W003",
      name: "JWAR",
      brand: "ChapatiMart",
      price: 15,
      mrp: 20,
      image: J,
      
    },
    {
      id: "W004",
      name: "GRAM(Harabhara)",
      brand: "ChapatiMart",
      price: 20,
      mrp: 25,
      image: H,
     
    },
  ];

  // Load cart from state
  const [cart, setCart] = useState(() => {
    const saved =localStorage.getItem("chapatiCart");
    return saved ? JSON.parse(saved) : { [mainItem.id]: 0 };
  });

  const [showNotification, setShowNotification] = useState(false);

  // Save cart whenever it changes
  useEffect(() => {
    localStorage.setItem("chapatiCart", JSON.stringify(cart));
  }, [cart]);

  // Update quantity for any item
  const updateQuantity = (itemId, newQty) => {
    setCart((prev) => ({
      ...prev,
      [itemId]: Math.max(0, newQty),
    }));
  };

  // Add item to cart
  const addToCart = (itemId) => {
    setCart((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  // Delete item from cart
  const deleteItem = (itemId) => {
    setCart((prev) => {
      const updated = { ...prev };
      delete updated[itemId];
      return updated;
    });
  };

  // Get all items in cart
  const allItems = [mainItem, ...similarItems];
  const cartItems = allItems.filter((item) => cart[item.id] > 0);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * cart[item.id],
    0
  );
  const discount = cartItems.reduce(
    (sum, item) => sum + (item.mrp - item.price) * cart[item.id],
    0
  );
  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const handlePlaceOrder = () => {
    if (totalItems === 0) return;
    alert(`Order placed successfully!\nTotal Items: ${totalItems}\nTotal Amount: ₹${subtotal}`);
     navigate("/cart")
  };

  return (
    <><Header/>
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
          ✓ Item added to cart!
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <p className="text-sm text-gray-500 mb-4">
          Home &gt; Wheat &gt; {mainItem.name}
        </p>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT: MAIN PRODUCT + SIMILAR ITEMS */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Product Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center justify-center bg-gray-50 rounded-lg p-4">
                  <img
                    src={mainItem.image}
                    alt={mainItem.name}
                    className="h-64 object-contain"
                  />
                </div>

                <div>
                  <h1 className="text-2xl font-bold">{mainItem.name}</h1>
                  <p className="text-gray-500 mt-1">by {mainItem.brand}</p>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-green-600 text-white px-2 py-0.5 rounded text-sm">
                      {mainItem.rating} ★
                    </span>
                    <span className="text-sm text-gray-500">
                      ({mainItem.reviews})
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <span className="text-3xl font-bold text-green-700">
                      ₹{mainItem.price}
                    </span>
                    <span className="line-through text-gray-400">
                      ₹{mainItem.mrp}
                    </span>
                    <span className="text-green-600 font-semibold text-sm">
                      {Math.round(
                        ((mainItem.mrp - mainItem.price) / mainItem.mrp) * 100
                      )}
                      % OFF
                    </span>
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <span className="font-semibold">Quantity:</span>
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(mainItem.id, cart[mainItem.id] - 1)
                        }
                        className="p-2 hover:bg-gray-100 transition"
                        disabled={!cart[mainItem.id]}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 font-semibold">
                        {cart[mainItem.id] || 0}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(mainItem.id, cart[mainItem.id] + 1)
                        }
                        className="p-2 hover:bg-gray-100 transition"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {cart[mainItem.id] > 0 && (
                      <button
                        onClick={() => deleteItem(mainItem.id)}
                        className="text-red-500 hover:text-red-700 flex items-center gap-1 ml-2"
                      >
                        <Trash size={16} />
                      </button>
                    )}
                  </div>

                  {/* <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 text-green-800">
                      🎉 Coupons & Offers
                    </h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>✔ Get ₹20 OFF on first order</li>
                      <li>✔ Free delivery above ₹99</li>
                      <li>✔ 5% cashback on UPI payment</li>
                    </ul>
                  </div> */}
                </div>
              </div>
            </div>

            {/* Similar Items */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Similar Items</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {similarItems.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-lg p-4 hover:shadow-md transition group"
                  >
                    <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-center mb-3 h-40">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full object-contain"
                      />
                    </div>
                    <h3 className="font-semibold text-center mb-2">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <span className="text-lg font-bold text-green-700">
                        ₹{item.price}
                      </span>
                      <span className="text-sm line-through text-gray-400">
                        ₹{item.mrp}
                      </span>
                    </div>

                    {cart[item.id] > 0 ? (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, cart[item.id] - 1)}
                          className="bg-pink-600 text-white p-1.5 rounded-lg hover:bg-pink-700"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-semibold px-3">
                          {cart[item.id]}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, cart[item.id] + 1)}
                          className="bg-pink-600 text-white p-1.5 rounded-lg hover:bg-pink-700"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(item.id)}
                        className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition flex items-center justify-center gap-2 font-semibold"
                      >
                        <ShoppingCart size={16} />
                        Add to Cart
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: CART SUMMARY (STICKY) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ShoppingCart size={20} />
                Cart Summary
              </h2>

              {cartItems.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <ShoppingCart size={48} className="mx-auto mb-2 opacity-30" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 pb-3 border-b"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-contain bg-gray-50 rounded"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            ₹{item.price} × {cart[item.id]}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-700">
                            ₹{item.price * cart[item.id]}
                          </p>
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-semibold">- ₹{discount}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery</span>
                      <span className="font-semibold">
                        {subtotal >= 99 ? "FREE" : "₹40"}
                      </span>
                    </div>
                    <div className="border-t pt-2 flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-green-700">
                        ₹{subtotal + (subtotal >= 99 ? 0 : 40)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    className="w-full bg-gradient-to-r from-pink-600 to-pink-700 text-white py-3 rounded-xl font-bold hover:from-pink-700 hover:to-pink-800 transition shadow-lg"
                  >
                    Place Order ({totalItems} items)
                  </button>

                  {subtotal < 99 && (
                    <p className="text-xs text-center text-gray-500 mt-2">
                      Add ₹{99 - subtotal} more for FREE delivery!
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}