import { useEffect, useState } from "react";
import { Package, MapPin, User, Clock, CheckCircle, Truck, Phone, Navigation } from "lucide-react";
import axios from "axios";

export default function DeliveryDashboard() {

  const phone = localStorage.getItem("deliveryBoyPhone");
  const [active, setActive] = useState(false);


  useEffect(() => {
    const savedStatus = localStorage.getItem("deliveryActive");
    if (savedStatus !== null) {
      setActive(savedStatus === "true"); // localStorage stores strings
    }
  }, []);
  
  const toggleStatus = async () => {
    try {
      const newStatus = !active;
      await axios.put(
        `http://localhost:8080/admin/status?phone=${phone}&active=${newStatus}`
      );
      setActive(newStatus);
      localStorage.setItem("deliveryActive", newStatus); // save to localStorage

      alert(`You are now ${newStatus ? "Online" : "Offline"}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  


  const [orders, setOrders] = useState([
    {
      id: "ORD001",
      customerName: "Rajesh Kumar",
      address: "123 MG Road, Sitabuldi, Nagpur - 440012",
      phone: "+91 98765 43210",
      status: "ASSIGNED",
      items: ["4x Chapati", "2x Dal Makhani", "1x Paneer Butter Masala"],
      orderTime: "10:30 AM",
      estimatedTime: "25 min",
      amount: "₹450"
    },
    {
      id: "ORD002",
      customerName: "Priya Sharma",
      address: "45 Civil Lines, Near Ram Mandir, Nagpur - 440001",
      phone: "+91 87654 32109",
      status: "OUT_FOR_DELIVERY",
      items: ["6x Chapati", "1x Chole", "2x Gulab Jamun"],
      orderTime: "10:15 AM",
      estimatedTime: "15 min",
      amount: "₹380"
    },
    {
      id: "ORD003",
      customerName: "Amit Patel",
      address: "78 Dharampeth, Opposite Bank, Nagpur - 440010",
      phone: "+91 76543 21098",
      status: "DELIVERED",
      items: ["8x Chapati", "1x Rajma", "1x Rice"],
      orderTime: "9:45 AM",
      deliveredTime: "10:20 AM",
      amount: "₹520"
    }
  ]);
  
  const [stats, setStats] = useState({
    totalDeliveries: 12,
    earnings: 2450,
    completed: 8,
    pending: 4
  });

  

  const updateStatus = (orderId, newStatus) => {
    setOrders(orders.map(o => 
      o.id === orderId 
        ? { ...o, status: newStatus, deliveredTime: newStatus === "DELIVERED" ? new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : o.deliveredTime }
        : o
    ));
    
    if (newStatus === "DELIVERED") {
      setStats({
        ...stats,
        completed: stats.completed + 1,
        pending: stats.pending - 1
      });
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "ASSIGNED": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "OUT_FOR_DELIVERY": return "bg-blue-100 text-blue-800 border-blue-300";
      case "DELIVERED": return "bg-green-100 text-green-800 border-green-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "ASSIGNED": return <Package className="w-4 h-4" />;
      case "OUT_FOR_DELIVERY": return <Truck className="w-4 h-4" />;
      case "DELIVERED": return <CheckCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg">
                <Package className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">ChapatiMart Delivery</h1>
                <p className="text-orange-100 text-sm">Partner Dashboard</p>
              </div>
            </div>
            
            <button
              onClick={toggleStatus}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                active 
                  ? "bg-green-500 hover:bg-green-600 text-white" 
                  : "bg-gray-700 hover:bg-gray-800 text-white"
              }`}
            >
              <div className={`w-3 h-3 rounded-full`}></div>
              {active ? "⚪GO OFFLINE":"🟢 GO ONLINE" }
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Today</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalDeliveries}</p>
              </div>
              <Package className="w-10 h-10 text-orange-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-2xl font-bold text-gray-800">{stats.completed}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending</p>
                <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
              </div>
              <Truck className="w-10 h-10 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Earnings</p>
                <p className="text-2xl font-bold text-gray-800">₹{stats.earnings}</p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Truck className="w-6 h-6 text-orange-600" />
            Active Orders
          </h2>
          
          {orders.filter(o => o.status !== "DELIVERED").length === 0 && (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No active orders at the moment</p>
              <p className="text-gray-400 text-sm mt-2">New orders will appear here</p>
            </div>
          )}
          
          {orders.filter(o => o.status !== "DELIVERED").map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
              <div className="p-6">
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <Package className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">Order #{order.id}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>Ordered at {order.orderTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  <span className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status.replace(/_/g, " ")}
                  </span>
                </div>

                {/* Order Details Grid */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  {/* Customer Info */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Customer</p>
                        <p className="font-semibold text-gray-800">{order.customerName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Contact</p>
                        <a href={`tel:${order.phone}`} className="font-semibold text-blue-600 hover:text-blue-700">{order.phone}</a>
                      </div>
                    </div>
                  </div>

                  {/* Address & Time */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Delivery Address</p>
                        <p className="font-semibold text-gray-800">{order.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Estimated Time</p>
                        <p className="font-semibold text-orange-600">{order.estimatedTime}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Order Items:</p>
                  <div className="flex flex-wrap gap-2">
                    {order.items.map((item, idx) => (
                      <span key={idx} className="bg-white px-3 py-1 rounded-full text-sm text-gray-700 border border-gray-200">
                        {item}
                      </span>
                    ))}
                  </div>
                  <p className="text-right mt-3 text-lg font-bold text-gray-800">{order.amount}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(order.address)}`, '_blank')}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg transition-colors"
                  >
                    <Navigation className="w-4 h-4" />
                    Navigate
                  </button>
                  
                  {order.status === "ASSIGNED" && (
                    <button
                      onClick={() => updateStatus(order.id, "OUT_FOR_DELIVERY")}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-md"
                    >
                      <Truck className="w-5 h-5" />
                      Start Delivery
                    </button>
                  )}

                  {order.status === "OUT_FOR_DELIVERY" && (
                    <button
                      onClick={() => updateStatus(order.id, "DELIVERED")}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-md"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Mark as Delivered
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Completed Orders */}
        {orders.filter(o => o.status === "DELIVERED").length > 0 && (
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Completed Orders
            </h2>
            
            {orders.filter(o => o.status === "DELIVERED").map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-md p-4 border border-gray-100 opacity-75">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-gray-800">#{order.id}</span>
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-600">{order.customerName}</span>
                      <span className={`ml-auto sm:ml-0 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        <CheckCircle className="w-3 h-3" />
                        Delivered
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">Delivered at {order.deliveredTime}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{order.amount}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}