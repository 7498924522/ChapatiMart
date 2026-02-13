import React, { useState, useEffect } from "react";
import {
  ShoppingCart, Trash, MapPin, CreditCard, CheckCircle, 
  ArrowRight, Clock, Loader, RefreshCw
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API_BASE_URL from "../config/api";

export default function UnifiedCartFlow() {
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "", phone: "", email: "", address: "", city: "", pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("");
  const navigate=useNavigate();

  const allPossibleItems = {
    P001: { name: "Wheat Chapati", category: "Chapati", price: 10, mrp: 15 },
    P002: { name: "Puranpoli", category: "Chapati", price: 25, mrp: 30 },
    P003: { name: "Bhakari", category: "Chapati", price: 15, mrp: 20 },
    P004: { name: "Rice Chapati", category: "Chapati", price: 20, mrp: 25 },
    P005: { name: "Bajari", category: "Chapati", price: 15, mrp: 20 },
    W001: { name: "Wheat (1kg)", category: "Grains", price: 10, mrp: 15 },
    W002: { name: "Toor", category: "Grains", price: 25, mrp: 30 },
    W003: { name: "JWAR", category: "Grains", price: 15, mrp: 20 },
    W004: { name: "GRAM(Harabhara)", category: "Grains", price: 20, mrp: 25 },
    F001: { name: "Wheat Flour", category: "Flour", price: 20, mrp: 25 },
    F002: { name: "Jwar Flour", category: "Flour", price: 25, mrp: 30 },
    F003: { name: "Gram Flour", category: "Flour", price: 15, mrp: 35 },
    F004: { name: "Toor Flour", category: "Flour", price: 25, mrp: 30 },
  };

  useEffect(() => {
    const rawCart = localStorage.getItem("chapatiCart");
    if (rawCart) {
      try {
        setCart(JSON.parse(rawCart));
      } catch (e) {
        setCart({});
      }
    }
  }, []);

  const cartItems = Object.entries(cart)
    .filter(([id, qty]) => qty > 0 && allPossibleItems[id])
    .map(([id, qty]) => ({
      productId: id,
      productName: allPossibleItems[id].name,
      category: allPossibleItems[id].category,
      price: allPossibleItems[id].price,
      mrp: allPossibleItems[id].mrp,
      quantity: qty,
    }));

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = cartItems.reduce((sum, item) => sum + (item.mrp - item.price) * item.quantity, 0);
  const deliveryCharge = subtotal >= 99 ? 0 : 40;
  const total = subtotal + deliveryCharge;

  const removeItem = (id) => {
    const updated = { ...cart };
    delete updated[id];
    setCart(updated);
    localStorage.setItem("chapatiCart", JSON.stringify(updated));
  };

  
  const userEmail=localStorage.getItem("loggedInUser");
  
 

  const handlePayment = async () => {
    if (!paymentMethod) return toast.error("Please select payment method");
    
    const token = localStorage.getItem("jwtToken");
    console.log(token);
    if (!token) return alert("Please login to place an order");

    setLoading(true);
      const orderNum = `CM-MUM-${new Date().getFullYear()}-${String(
    Math.floor(Math.random() * 10),
  ).padStart(3, "0")}`;

    const orderPayload = {
      orderNumber: orderNum,
      customer: customerInfo,
      items: cartItems,
      paymentMethod,
      subtotal,
      deliveryCharge,
      total,
      deliveryStatus: "PENDING",
    };

    try {
      // 1. Place Order in Backend
      if(userEmail != customerInfo.email)
      {
        toast.error("Enter the valid Email")
        setStep(2);
        return 0;
      }
      
      const response = await axios.post(
        `${API_BASE_URL}/api/orders/place`,
        orderPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const savedOrder = response.data;

      // 2. COD Flow
      if (paymentMethod === "Cash on Delivery") {
        finalizeOrder();
        return;
      }

      // 3. Razorpay Online Flow
      const options = {
        key: "rzp_test_SBaMfW6L4tRcnB",
        amount: savedOrder.total * 100, 
        currency: "INR",
        order_id: savedOrder.razorpayId,
        handler: async (payRes) => {
          try {
            await axios.post(`${API_BASE_URL}/api/orders/verify-payment`, {
              razorpay_order_id: payRes.razorpay_order_id,
              razorpay_payment_id: payRes.razorpay_payment_id,
              razorpay_signature: payRes.razorpay_signature,
            }, { headers: { Authorization: `Bearer ${token}` } });
            finalizeOrder();
          } catch (err) {
            alert("Payment verification failed");
          }
        },
        prefill: { name: customerInfo.name, email: customerInfo.email, contact: customerInfo.phone },
        theme: { color: "#ec4899" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Order failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const finalizeOrder = () => {
    localStorage.removeItem("chapatiCart");
    setCart({});
    setStep(4);
  };

  
  const validateAddress = () => {
    const { name, phone, email,city,pincode,address, } = customerInfo;
  
    if (!name || name.trim().length < 3) {
      toast.error("Enter valid full name ");
      return false;
    }
  
    if (!/^[0-9]{10}$/.test(phone)) {
     toast.error("Enter valid 10 digit phone number");
      return false;
    }
  
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Enter valid email address");
      return false;
    }
  
    if (!city || city.trim().length < 3) {
      toast.error("Enter the city name");
      return false;
    }
    if (!pincode || pincode.length < 3) {
      toast.error("Enter correct pin");
      return false;
    }
    if (!address || address.trim().length < 3) {
      toast.error("Enter valid address");
      return false;
    }
  
    return true;
  };
  
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* STEP 1: CART */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold flex items-center gap-2"><ShoppingCart className="text-pink-600"/> Your Cart</h1>
                <button onClick={() => navigate("/myorders")} className="text-pink-600 font-semibold flex items-center gap-1 hover:underline">
                    <Clock size={18}/> View History
                </button>
            </div>
            {cartItems.length === 0 ? (
              <div className="bg-white p-10 rounded-xl text-center shadow">
               <div >Cart is empty</div>
                <button onClick={() => navigate('/home')} className="mt-6 bg-pink-600 text-white px-8 py-3 rounded-full font-medium shadow-lg shadow-pink-200 hover:bg-pink-700 transition-all">
              Order Now
            </button>
            </div>
            ) : (
              <div className="bg-white rounded-xl shadow p-6">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex justify-between items-center py-4 border-b last:border-0">
                    <div>
                      <p className="font-bold">{item.productName}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <span className="font-bold text-green-700">₹{item.price * item.quantity}</span>
                      <button onClick={() => removeItem(item.productId)} className="text-red-500"><Trash size={18}/></button>
                    </div>
                  </div>
                ))}
                <div className="mt-6 space-y-2">
                    <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
                    <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{discount}</span></div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t"><span>Total</span><span>₹{total}</span></div>
                </div>
                <button onClick={() => setStep(2)} className="w-full bg-pink-600 text-white py-3 rounded-xl mt-6 font-bold flex justify-center items-center gap-2">
                    Checkout <ArrowRight size={18}/>
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: ADDRESS */}
        {step === 2 && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><MapPin className="text-pink-600"/> Shipping Details</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Full Name" className="w-full border p-3 rounded-lg" value={customerInfo.name} onChange={(e)=>setCustomerInfo({...customerInfo, name: e.target.value})}/>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Phone" className="w-full border p-3 rounded-lg" value={customerInfo.phone} onChange={(e)=>setCustomerInfo({...customerInfo, phone: e.target.value})}/>
                <input type="email" placeholder="Email" className="w-full border p-3 rounded-lg" value={customerInfo.email} onChange={(e)=>setCustomerInfo({...customerInfo, email: e.target.value})}/>
                 <input type="text" placeholder="city" className="w-full border p-3 rounded-lg" value={customerInfo.city} onChange={(e)=>setCustomerInfo({...customerInfo, city: e.target.value})}/>
                <input type="text" placeholder="pincode" className="w-full border p-3 rounded-lg" value={customerInfo.pincode} onChange={(e)=>setCustomerInfo({...customerInfo, pincode: e.target.value})}/>
             
              </div>
              <textarea placeholder="Full Address" className="w-full border p-3 rounded-lg" value={customerInfo.address} onChange={(e)=>setCustomerInfo({...customerInfo, address: e.target.value})}/>
              <button onClick={() => {if (validateAddress()){setStep(3)}}} className="w-full bg-pink-600 text-white py-3 rounded-xl font-bold">Continue to Payment</button>
              <button onClick={() => setStep(1)} className="w-full text-gray-500 font-medium">Back</button>
            </div>
          </div>
        )}

        {/* STEP 3: PAYMENT */}
        {step === 3  && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><CreditCard className="text-pink-600"/> Payment Method</h2>
            <div className="space-y-3">
              {["UPI", "Credit/Debit Card", "Cash on Delivery"].map((m) => (
                <label key={m} className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer ${paymentMethod === m ? "border-pink-600 bg-pink-50" : "border-gray-100"}`}>
                  <input type="radio" name="pay" value={m} onChange={(e)=>setPaymentMethod(e.target.value)} />
                  <span className="font-bold">{m}</span>
                </label>
              ))}
              <button onClick={handlePayment} disabled={loading} className="w-full bg-pink-600 text-white py-3 rounded-xl font-bold mt-4 flex justify-center">
                {loading ? <RefreshCw className="animate-spin"/> : `Pay ₹${total}`}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS */}
        {step === 4 && (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <CheckCircle size={64} className="text-green-500 mx-auto mb-4"/>
            <h2 className="text-2xl font-bold text-gray-800">Order Placed!</h2>
            <p className="text-gray-500 mt-2">Your delicious meal is on its way.</p>
            <button onClick={() => navigate("/myorders")} className="mt-8 bg-pink-600 text-white px-8 py-3 rounded-xl font-bold">View My Orders</button>
          </div>
        )}
      </div>
    </div>
  );
}