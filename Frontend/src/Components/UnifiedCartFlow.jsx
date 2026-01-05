import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ShoppingCart,
  Trash,
  MapPin,
  CreditCard,
  CheckCircle,
  ArrowRight,
  Clock,
  Phone,Loader,Truck,XCircle
} from 'lucide-react';

export default function UnifiedCartFlow() {
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    pincode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [orderHistory, setOrderHistory] = useState([]);

  const allPossibleItems = {
    'P001': { name: 'Wheat Chapati', category: "Chapati", price: 10, mrp: 15 },
    'P002': { name: 'Puranpoli', category: "Chapati", price: 25, mrp: 30 },
    'P003': { name: 'Bhakari', category: "Chapati", price: 15, mrp: 20 },
    'P004': { name: 'Rice Chapati', category: "Chapati", price: 20, mrp: 25 },
    'P005': { name: 'Bajari', category: "Chapati", price: 15, mrp: 20 },
    'W001': { name: 'Wheat (1kg)', category: 'Grains', price: 10, mrp: 15 },
    'W002': { name: 'Toor', category: 'Grains', price: 25, mrp: 30 },
    'W003': { name: 'JWAR', category: 'Grains', price: 15, mrp: 20 },
    'W004': { name: 'GRAM(Harabhara)', category: 'Grains', price: 20, mrp: 25 },
    'F001': { name: 'Wheat Flour', category: 'Flour', price: 20, mrp: 25 },
    'F002': { name: 'Jwar Flour', category: 'Flour', price: 25, mrp: 30 },
    'F003': { name: 'Gram Flour', category: 'Flour', price: 15, mrp: 35 },
    'F004': { name: 'Toor Flour', category: 'Flour', price: 25, mrp: 30 }
  };
  

//   useEffect(() => {
//   if (!customerInfo.email || orderHistory.length === 0) return;

//   const fetchStatuses = async () => {
//     try {
//       const res = await axios.get('http://localhost:8080/api/orders/status', {
//         params: { email: customerInfo.email }
//       });

//       // res.data = [{ orderNumber: "CM-MUM-2026-547", deliveryStatus: "out_for_delivery" }, ...]
//       const updatedStatuses = res.data;

//       setOrderHistory(prevOrders =>
//         prevOrders.map(order => {
//           const updated = updatedStatuses.find(o => o.orderNumber === order.orderNumber);
//           if (!updated) return order;
//           // Highlight status change
//           if (order.status !== updated.deliveryStatus.toLowerCase()) {
//             console.log(`Order ${order.orderNumber} status changed from ${order.status} to ${updated.deliveryStatus}`);
//           }
//           return { ...order, status: updated.deliveryStatus.toLowerCase() };
//         })
//       );
//     } catch (err) {
//       console.error("Failed to fetch delivery statuses:", err);
//     }
//   };

//   fetchStatuses(); // fetch immediately
//   const intervalId = setInterval(fetchStatuses, 5000); // fetch every 5s

//   return () => clearInterval(intervalId); // cleanup on unmount
// }, [customerInfo.email, orderHistory]);

//   // Load cart & history from localStorage
  useEffect(() => {
    try {
      const rawCart = localStorage.getItem('chapatiCart');
      if (rawCart) {
        const parsedCart = JSON.parse(rawCart);
        const cleanedCart = {};
        Object.keys(parsedCart).forEach(id => {
          if (allPossibleItems[id] && parsedCart[id] > 0) cleanedCart[id] = parsedCart[id];
        });
        setCart(cleanedCart);
        localStorage.setItem('chapatiCart', JSON.stringify(cleanedCart));
      }
    } catch {
      localStorage.removeItem('chapatiCart');
      setCart({});
    }

    try {
      const rawHistory = localStorage.getItem('orderHistory');
      if (rawHistory) {
        const parsedHistory = JSON.parse(rawHistory);
        const cleanedHistory = parsedHistory.filter(order =>
          order && order.orderNumber && Array.isArray(order.items)
        );
        setOrderHistory(cleanedHistory);
        if (cleanedHistory.length !== parsedHistory.length) {
          localStorage.setItem('orderHistory', JSON.stringify(cleanedHistory));
        }
      }
    } catch {
      localStorage.removeItem('orderHistory');
      setOrderHistory([]);
    }
  }, []);

  // Cart calculations
  const cartItems = Object.entries(cart)
    .filter(([id, qty]) => qty > 0 && allPossibleItems[id])
    .map(([id, qty]) => ({
      id,
      productId: id,
      productName: allPossibleItems[id].name,
      name: allPossibleItems[id].name,
      category: allPossibleItems[id].category,
      price: allPossibleItems[id].price,
      mrp: allPossibleItems[id].mrp,
      quantity: qty
    }));

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = cartItems.reduce((sum, item) => sum + (item.mrp - item.price) * item.quantity, 0);
  const deliveryCharge = subtotal >= 99 ? 0 : 40;
  const total = subtotal + deliveryCharge;

  const removeItem = id => {
    const updated = { ...cart };
    delete updated[id];
    setCart(updated);
    localStorage.setItem('chapatiCart', JSON.stringify(updated));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    setStep(2);
  };

  const handleCustomerSubmit = e => {
    e.preventDefault();
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address || !customerInfo.city || !customerInfo.pincode) {
      alert('Please fill all required fields');
      return;
    }
    setStep(3);
  };

  const orderNum = `CM-MUM-${new Date().getFullYear()}-${String(Math.floor(Math.random()*1000)).padStart(3,'0')}`;

  const handlePayment = async () => {
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }
    setLoading(true);

    const orderPayload = {
      orderNumber: orderNum,
      customer: { ...customerInfo },
      items: cartItems.map(item => ({
        productId: item.productId,
        productName: item.productName,
        category: item.category,
        price: item.price,
        quantity: item.quantity
      })),
      paymentMethod,
      subtotal,
      deliveryCharge,
      total,
      deliveryStatus: 'PENDING'
    };

    try {
      await axios.post('http://localhost:8080/api/orders/place', orderPayload);

      setOrderNumber(orderNum);

      const newOrder = {
        orderNumber: orderNum,
        orderDate: new Date().toISOString(),
        date: new Date().toLocaleString(),
        items: cartItems.map(item => ({ ...item })),
        customerInfo: { ...customerInfo },
        paymentMethod,
        subtotal,
        discount,
        deliveryCharge,
        total,
        status: 'pending'
      };

      const updatedHistory = [...orderHistory, newOrder];
      setOrderHistory(updatedHistory);
      localStorage.setItem('orderHistory', JSON.stringify(updatedHistory));

      setStep(4);
      localStorage.removeItem('chapatiCart');
      setCart({});
    } catch (err) {
      console.error(err);
      alert("Order placement failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const navigateToHome = () => window.location.href = "/home";

  const clearHistory = () => {
  if (window.confirm("Clear all history?")) {
    localStorage.removeItem("orderHistory");
    setOrderHistory([]);
  }
};


  // Step rendering
  switch(step) {
    case 1: // CART
      return (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <ShoppingCart className="text-pink-600" /> Your Cart
              </h1>
              {orderHistory.length > 0 && (
                <button onClick={() => setStep(5)} className="flex items-center gap-2 text-pink-600 hover:text-pink-700 font-semibold">
                  <Clock size={20} /> View All History
                </button>
              )}
            </div>

            {cartItems.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <ShoppingCart className="mx-auto text-gray-300 mb-4" size={64} />
                <h2 className="text-2xl font-semibold text-gray-600 mb-2">Your cart is empty</h2>
                <p className="text-gray-500">Add some items to get started!</p>
                <button onClick={navigateToHome} className="mt-4 bg-pink-600 text-white px-6 py-2 rounded">Start Shopping</button>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-center gap-4 py-4 border-b last:border-0">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.category}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-700">₹{item.price * item.quantity}</p>
                        <p className="text-sm text-gray-400 line-through">₹{item.mrp * item.quantity}</p>
                        <button onClick={() => removeItem(item.id)} className="text-red-500 text-sm mt-2 hover:text-red-700 flex items-center gap-1">
                          <Trash size={14} /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between"><span>Subtotal</span><span className="font-semibold">₹{subtotal}</span></div>
                    <div className="flex justify-between text-green-600"><span>Discount</span><span className="font-semibold">- ₹{discount}</span></div>
                    <div className="flex justify-between"><span>Delivery</span><span className="font-semibold">{deliveryCharge===0?'FREE':`₹${deliveryCharge}`}</span></div>
                    <div className="border-t pt-2 flex justify-between text-xl font-bold"><span>Total</span><span className="text-green-700">₹{total}</span></div>
                  </div>
                  <button onClick={handleCheckout} className="w-full bg-gradient-to-r from-pink-600 to-pink-700 text-white py-3 rounded-xl font-bold hover:from-pink-700 hover:to-pink-800 transition flex items-center justify-center gap-2">
                    Proceed to Checkout <ArrowRight />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      );

    case 2: // CUSTOMER DETAILS
      if(cartItems.length === 0) return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500 text-xl">Your cart is empty. Go back to shopping.</p>
          <button onClick={()=>setStep(1)} className="ml-4 bg-pink-600 text-white px-4 py-2 rounded">Back to Cart</button>
        </div>
      );
      return (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-2xl mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <MapPin className="text-pink-600" /> Delivery Details
            </h1>
            <form className="bg-white rounded-xl shadow-lg p-6 space-y-4" onSubmit={handleCustomerSubmit}>
              <div><label className="block font-semibold mb-2">Full Name *</label>
              <input type="text" placeholder='Enter Full Name' value={customerInfo.name} onChange={e=>setCustomerInfo({...customerInfo,name:e.target.value})} required className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500" /></div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><label  className="block font-semibold mb-2">Phone *</label>
                <input type="tel" placeholder='Enter Phone Number' value={customerInfo.phone} onChange={e=>setCustomerInfo({...customerInfo,phone:e.target.value})} required className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500" /></div>
                <div><label className="block font-semibold mb-2">Email</label>
                <input type="email" placeholder='Enter Your E-mail ' value={customerInfo.email} onChange={e=>setCustomerInfo({...customerInfo,email:e.target.value})} className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500" /></div>
              </div>
              <div><label className="block font-semibold mb-2">Address *</label>
              <textarea value={customerInfo.address} placeholder='Address...' onChange={e=>setCustomerInfo({...customerInfo,address:e.target.value})} required className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500" rows={3}></textarea></div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="block font-semibold mb-2">City *</label>
                <input type="text" placeholder='City' value={customerInfo.city} onChange={e=>setCustomerInfo({...customerInfo,city:e.target.value})} required className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500" /></div>
                <div><label className="block font-semibold mb-2">Pincode *</label>
                <input type="text" placeholder='PIN' value={customerInfo.pincode} onChange={e=>setCustomerInfo({...customerInfo,pincode:e.target.value})} required className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500" /></div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={()=>setStep(1)} className="flex-1 border-2 border-gray-300 py-3 rounded-xl font-bold">Back to Cart</button>
                <button type="submit" className="flex-1 bg-gradient-to-r from-pink-600 to-pink-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">Continue to Payment <ArrowRight /></button>
              </div>
            </form>
          </div>
        </div>
      );

    case 3: // PAYMENT
      return (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-2xl mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <CreditCard className="text-pink-600" /> Payment Method
            </h1>
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              {['UPI','Credit/Debit Card','Cash on Delivery','Net Banking'].map(method => (
                <label key={method} className={`flex items-center gap-3 border-2 rounded-lg p-4 mb-2 cursor-pointer ${paymentMethod===method?'border-pink-600 bg-pink-50':'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="payment" value={method} checked={paymentMethod===method} onChange={e=>setPaymentMethod(e.target.value)} className="w-4 h-4 text-pink-600"/>
                  <span className="font-semibold">{method}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={()=>setStep(2)} className="flex-1 border-2 border-gray-300 py-3 rounded-xl font-bold">Back</button>
              <button onClick={handlePayment} disabled={loading} className="flex-1 bg-gradient-to-r from-pink-600 to-pink-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50">
                {loading?'Processing...':'Place Order'}
              </button>
            </div>
          </div>
        </div>
      );

    case 4: 
      return (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <CheckCircle className="mx-auto text-green-600 mb-4" size={80}/>
            <h1 className="text-3xl font-bold text-green-700 mb-2">Order Placed Successfully! 🎉</h1>
            <p className="text-gray-600 mb-6">Thank you, {customerInfo.name}!</p>
            <button onClick={()=>setStep(5)} className="bg-gradient-to-r from-pink-600 to-pink-700 text-white px-8 py-3 rounded-xl font-bold hover:from-pink-700 hover:to-pink-800 transition">View Order History</button>
          </div>
        </div>
      );

 case 5: 
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Clock className="text-pink-600" /> Order History
          </h1>
          <div className="flex gap-2">
            <button 
              onClick={clearHistory} 
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Clear History
            </button>
            <button 
              onClick={() => setStep(1)} 
              className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition"
            >
              Back to Cart
            </button>
          </div>
        </div>

        {/* Empty state */}
        {orderHistory.length === 0 ? (
          <p className="text-gray-500 text-center py-12">No past orders found.</p>
        ) : (
          <div className="space-y-6">
            {orderHistory.map(order => {
              // Color coding for delivery status
              let statusColor = "bg-gray-200 text-gray-800";
              if(order.status === 'pending') statusColor = "bg-yellow-100 text-yellow-800";
              else if(order.status === 'confirmed_preparing') statusColor = "bg-blue-100 text-blue-800";
              else if(order.status === 'out_for_delivery') statusColor = "bg-purple-100 text-purple-800";
              else if(order.status === 'delivered') statusColor = "bg-green-100 text-green-800";
              else if(order.status === 'cancelled') statusColor = "bg-red-100 text-red-800";

              return (
                <div key={order.orderNumber} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition">
                  {/* Header */}
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="font-bold text-lg">Order #{order.orderNumber}</h2>
                    <span className="text-gray-500 text-sm">{order.date}</span>
                  </div>

                  {/* Delivery Status */}
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3 ${statusColor}`}>
                    {order.status.replace('_', ' ').toUpperCase()}
                  </div>

                  {/* Items */}
                  <div className="border-t pt-2 space-y-2 mb-3">
                    {order.items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm hover:bg-gray-50 rounded px-2 py-1 transition">
                        <span>{item.name} x {item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="border-t pt-2 space-y-1">
                    <div className="flex justify-between text-sm"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
                    <div className="flex justify-between text-sm text-green-600"><span>Discount</span><span>- ₹{order.discount}</span></div>
                    <div className="flex justify-between text-sm"><span>Delivery</span><span>{order.deliveryCharge===0?'FREE':`₹${order.deliveryCharge}`}</span></div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total</span><span>₹{order.total}</span></div>
                  </div>

                  {/* Optional: Reorder / Track button */}
                  <div className="mt-4 flex justify-end gap-2">
                    
                    <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition text-sm">
                      Track Order
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );



    default:
      return null;
  }
}