import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Trash,
  MapPin,
  CreditCard,
  CheckCircle,
  ArrowRight,
  Clock,
  Loader,
  Truck,
  XCircle,
  RefreshCw,
  Package,
 PersonStanding
} from 'lucide-react';
import axios from 'axios';

export default function UnifiedCartFlow() {
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
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

    loadLocalOrderHistory();
  }, []);

  const loadLocalOrderHistory = () => {
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
  };

  const fetchOrderStatus = async (orderNumber) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/orders/status/${orderNumber}`);
      
      return response.data.deliveryStatus;
    } catch (error) {
      console.error(`Failed to fetch status for order ${orderNumber}:`, error.response?.data|| error.message);
      return null;
    }
  };

  const refreshAllOrderStatuses = async () => {
    if (orderHistory.length === 0) return;
    
    setRefreshing(true);
    try {
      const updatedOrders = await Promise.all(
        orderHistory.map(async (order) => {
          const newStatus = await fetchOrderStatus(order.orderNumber);
          if (newStatus) {
            return { ...order, status: newStatus.toLowerCase() };
          }
          return order;
        })
      );
      
      setOrderHistory(updatedOrders);
      localStorage.setItem('orderHistory', JSON.stringify(updatedOrders));
    } catch (error) {
      console.error('Error refreshing orders:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (step === 5 && orderHistory.length > 0) {
      refreshAllOrderStatuses();
    }
  }, [step]);

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

  const handleCustomerSubmit = (e) => {
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
  const response = await axios.post(
    'http://localhost:8080/api/orders/place',
    orderPayload, // Axios automatically stringifies JSON
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  // The saved order is in response.data
  const savedOrder = response.data;
  console.log('Order placed successfully:', savedOrder);


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

  const getStatusInfo = (status) => {
    const statusLower = status?.toLowerCase() || 'pending';
    
    const statusMap = {
      'pending': { 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300', 
        icon: Clock, 
        label: 'PENDING',
        description: 'Order received, waiting for confirmation'
      },
      'confirmed_preparing': { 
        color: 'bg-blue-100 text-blue-800 border-blue-300', 
        icon: Package, 
        label: 'PREPARING',
        description: 'Order confirmed and being prepared'
      },
      'ready': { 
        color: 'bg-purple-100 text-purple-800 border-purple-300', 
        icon: PersonStanding, 
        label: 'READY',
        description: 'Order is Ready'
      },
      'delivering': { 
        color: 'bg-purple-100 text-purple-800 border-purple-300', 
        icon: Truck, 
        label: 'OUT FOR DELIVERY',
        description: 'Order is On the Way'
      },
      'delivered': { 
        color: 'bg-green-100 text-green-800 border-green-300', 
        icon: CheckCircle, 
        label: 'DELIVERED',
        description: 'Order successfully delivered'
      },
      'cancelled': { 
        color: 'bg-red-100 text-red-800 border-red-300', 
        icon: XCircle, 
        label: 'CANCELLED',
        description: 'Order has been cancelled'
      }
    };

    return statusMap[statusLower] || statusMap['pending'];
  };

  switch(step) {
    case 1:
      return (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <ShoppingCart className="text-pink-600" /> Your Cart
              </h1>
              {orderHistory.length > 0 && (
                <button onClick={() => setStep(5)} className="flex items-center gap-2 text-pink-600 hover:text-pink-700 font-semibold">
                  <Clock size={20} /> View Order History
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

    case 2:
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
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
              <div><label className="block font-semibold mb-2">Full Name *</label>
              <input type="text" placeholder='Enter Full Name' value={customerInfo.name} onChange={e=>setCustomerInfo({...customerInfo,name:e.target.value})} required className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500" /></div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="block font-semibold mb-2">Phone *</label>
                <input type="tel" placeholder='Enter Phone Number' value={customerInfo.phone} onChange={e=>setCustomerInfo({...customerInfo,phone:e.target.value})} required className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500" /></div>
                <div><label className="block font-semibold mb-2">Email</label>
                <input type="email" placeholder='Enter Your E-mail' value={customerInfo.email} onChange={e=>setCustomerInfo({...customerInfo,email:e.target.value})} className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500" /></div>
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
                <button onClick={handleCustomerSubmit} className="flex-1 bg-gradient-to-r from-pink-600 to-pink-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">Continue to Payment <ArrowRight /></button>
              </div>
            </div>
          </div>
        </div>
      );

    case 3:
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
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Clock className="text-pink-600" /> Order History
              </h1>
              <div className="flex gap-2">
                <button 
                  onClick={refreshAllOrderStatuses} 
                  disabled={refreshing}
                  className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
                >
                  <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                  {refreshing ? 'Refreshing...' : 'Refresh Status'}
                </button>
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

            {orderHistory.length === 0 ? (
              <p className="text-gray-500 text-center py-12">No past orders found.</p>
            ) : (
              <div className="space-y-6">
                {orderHistory.map(order => {
                  const statusInfo = getStatusInfo(order.status);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <div key={order.orderNumber} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="font-bold text-lg">Order #{order.orderNumber}</h2>
                          <span className="text-gray-500 text-sm">{order.date}</span>
                        </div>
                        
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 ${statusInfo.color}`}>
                          <StatusIcon size={18} />
                          <span className="font-semibold text-sm">{statusInfo.label}</span>
                        </div>
                      </div>
                      <div className='flex justify-between'>
                           <p className='font-semibold'>Order Status :-</p>
                           <p className="text-sm text-gray-600 mb-4">{statusInfo.description}</p>
                      </div>
                      
                      <div className="border-t pt-3 space-y-2 mb-3">
                        {order.items.map(item => (
                          <div key={item.id} className="flex justify-between text-sm hover:bg-gray-50 rounded px-2 py-1 transition">
                            <span>{item.name} x {item.quantity}</span>
                            <span>₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t pt-3 space-y-1">
                        <div className="flex justify-between text-sm"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
                        <div className="flex justify-between text-sm text-green-600"><span>Discount</span><span>- ₹{order.discount}</span></div>
                        <div className="flex justify-between text-sm"><span>Delivery</span><span>{order.deliveryCharge===0?'FREE':`₹${order.deliveryCharge}`}</span></div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total</span><span>₹{order.total}</span></div>
                      </div>

                      {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                          💡 Your order status will update automatically when the admin processes it
                        </div>
                      )}
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