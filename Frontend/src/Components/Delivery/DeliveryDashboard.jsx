import React from "react";
import { useEffect, useState } from "react";
import {
  Package,
  MapPin,
  User,
  Clock,
  CheckCircle,
  Truck,
  Phone,
  Navigation,
  CreditCard,
  ShoppingBag,
  IndianRupee,
  History,
  Calendar,
  ArrowLeftFromLine
} from "lucide-react";
import axios from "axios";
import API_BASE_URL from "./src/config/api.js";


import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function DeliveryDashboard() {
  const phone = localStorage.getItem("deliveryBoyPhone");

  const [active, setActive] = useState(false);
  const [orders, setOrders] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const navigate=useNavigate();

  

  /* =======================
     FETCH ORDERS
     ======================= */
  const getOrders = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/admin/delivery/orders/${phone}`
      );

        const mappedOrders =res.data.map(order => ({
        id: order.orderNumber,
        customerName: order.customerName ?? "N/A",
        phone: order.customerPhone ?? "N/A",
        address: `${order.customerAddress || ""}, ${
          order.customerCity || ""
        } - ${order.customerPincode || ""}`,
        items:
          order.items?.map(i => ({
            name: i.productName,
            category: i.category,
            qty: i.quantity,
            price: i.price
          })) || [],
        total: order.total ?? 0,
        status: order.status ?? "assigned",
        DeliveryCharged: order.deliveryCharge,
        orderTime: order.orderDate
          ? new Date(order.orderDate).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })
          : "N/A",
        orderDate:  order.orderDate
          ? new Date(order.orderDate).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              weekday: 'long',
            })
          : 'N/A',
        paymentMethod: order.paymentMethod,
        deliveredTime: order.deliveredTime || null
      }));

      setOrders(mappedOrders);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const updateOrderStatus = async (orderNumber, newStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/api/${orderNumber}/status`, { 
        status: newStatus 
      });
      getOrders();
    } catch (err) {
      console.error("Failed to update order:", err);
    }
  };

  useEffect(() => {
    const saved = window.localStorage?.getItem("deliveryActive");
    if (saved !== null) setActive(saved === "true");
  }, []);

  /* =======================
     TOGGLE STATUS
     ======================= */
  const toggleStatus = async () => {
    try {
      const newStatus = !active;
      await axios.put(
        `${API_BASE_URL}/admin/status?phone=${phone}&active=${newStatus}`
      );
      setActive(newStatus);
      window.localStorage?.setItem("deliveryActive", String(newStatus));
    } catch {
      console.log("Failed to update status");
    }
  };

  /* =======================
     DYNAMIC STATS CALCULATION
     ======================= */
  const stats = {
    totalDeliveries: orders.length,
    earnings: orders
      .filter(o => o.status === "delivered")
      .reduce((sum, o) => sum + (o.DeliveryCharged || 0), 0),
    completed: orders.filter(o => o.status === "delivered").length,
    pending: orders.filter(o => o.status === "assigned").length
  };

  /* =======================
     GROUP ORDERS BY DAY
     ======================= */
  const groupOrdersByDay = () => {
    const deliveredOrders = orders.filter(o => o.status === "delivered");
    const grouped = {};

    deliveredOrders.forEach(order => {
      const date = new Date(order.orderDate);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      const dateStr = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
      const key = `${dayName}, ${dateStr}`;

      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(order);
    });

    return grouped;
  };

  const historyByDay = groupOrdersByDay();

  const statusColor = status =>
    ({
      assigned: "bg-amber-50 text-amber-700 border border-amber-200",
      delivering: "bg-blue-50 text-blue-700 border border-blue-200",
      delivered: "bg-emerald-50 text-emerald-700 border border-emerald-200"
    }[status] || "bg-gray-50 text-gray-700 border border-gray-200");

  const CheckingActiveMode=localStorage.getItem("deliveryActive");
     
  const LogOut=()=>
  {
       if(CheckingActiveMode == "true")
      {
            toast.error("You Are Online Please Change Status");
            return 0;
      }
      else
      {
          toast.success("Log Out Successfully !");
          localStorage.removeItem("deliveryBoyPhone");
          navigate("/");
          
      }
  }
 

  /* =======================
     UI
     ======================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 text-white shadow-xl sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center gap-3">

             <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                <ArrowLeftFromLine onClick={LogOut} className="w-7 h-7" />
              </div> 
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">ChapatiMart Delivery</h1>
                <p className="text-white text-sm font-medium">📞{phone}</p>
              </div>
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                <Truck className="w-7 h-7" />
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
              <div className={`w-3 h-3 rounded-full ${active ? 'bg-white' : 'bg-green-400'}`}></div>
              {active ? "GO OFFLINE" : "GO ONLINE"}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards - Now Dynamic */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Orders</p>
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
                <p className="text-gray-600 text-sm">Assigned</p>
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

        {/* Toggle Button for History */}
        <div className="mb-6">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <History className="w-5 h-5" />
            {showHistory ? "Show Active Orders" : "View Delivery History"}
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showHistory ? (
          <>
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Package className="text-orange-600 w-6 h-6" />
                </div>
                Active Orders
                <span className="text-lg font-normal text-gray-500">
                  ({orders.filter(o => o.status !== "delivered").length})
                </span>
              </h2>
            </div>

            {orders.filter(o => o.status !== "delivered").length === 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg font-medium">No active orders at the moment</p>
                <p className="text-gray-400 text-sm mt-2">New orders will appear here</p>
              </div>
            )}

            <div className="space-y-6">
              {orders
                .filter(o => o.status !== "delivered")
                .map(order => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                  >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-100">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div>
                          <h3 className="font-bold text-xl text-gray-800 mb-1">
                            Order #{order.id}
                          </h3>
                          <p className="text-sm text-gray-500 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Ordered at {order.orderTime}
                          </p>
                        </div>

                        <span
                          className={`px-5 py-2 rounded-xl text-sm uppercase font-bold ${statusColor(
                            order.status
                          )}`}
                        >
                          {order.status.replace(/_/g, " ")}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* Customer Info */}
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <div className="bg-white p-2 rounded-lg shadow-sm">
                              <User className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">Customer</p>
                              <p className="font-semibold text-gray-800">{order.customerName}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <div className="bg-white p-2 rounded-lg shadow-sm">
                              <Phone className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">Phone</p>
                              <p className="font-semibold text-gray-800">{order.phone}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl border border-orange-200">
                          <div className="bg-white p-2 rounded-lg shadow-sm mt-1">
                            <MapPin className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-xs text-orange-700 font-bold uppercase tracking-wide mb-1">Delivery Address</p>
                            <p className="text-gray-800 font-medium leading-relaxed">{order.address}</p>
                          </div>
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 p-5 rounded-xl border border-purple-200">
                        <h3 className="text-xs font-bold text-purple-900 mb-2 uppercase tracking-wide flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          Payment Method
                        </h3>
                        <p className="font-bold text-gray-900 text-lg">{order.paymentMethod}</p>
                      </div>

                      {/* Items & Pricing */}
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-6 border border-gray-200">
                        {/* Categories */}
                        <div className="mb-5">
                          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4" />
                            Categories
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {order.items.map((i, idx) => (
                              <span
                                key={idx}
                                className="bg-white border-2 border-gray-200 px-4 py-2 rounded-full text-sm font-semibold text-gray-700 shadow-sm"
                              >
                                {i.category}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Items */}
                        <div className="mb-5">
                          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Order Items
                          </h4>
                          <div className="space-y-2">
                            {order.items.map((i, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between items-center bg-white px-4 py-3 rounded-lg border border-gray-200 shadow-sm"
                              >
                                <span className="font-semibold text-gray-800">
                                  <span className="text-orange-600 font-bold">{i.qty}×</span> {i.name}
                                </span>
                                <span className="font-bold text-gray-900 flex items-center gap-1">
                                  <IndianRupee className="w-4 h-4" />
                                  {i.price}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Pricing Summary */}
                        <div className="border-t-2 border-gray-300 pt-4 space-y-3">
                          <div className="flex justify-between items-center text-gray-700">
                            <span className="font-semibold">Delivery Charge</span>
                            <span className="font-bold flex items-center gap-1">
                              <IndianRupee className="w-4 h-4" />
                              {order.DeliveryCharged}
                            </span>
                          </div>
                          <div className="flex justify-between items-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-lg shadow-md">
                            <span className="font-bold text-lg">Total Amount</span>
                            <span className="font-bold text-2xl flex items-center gap-1">
                              <IndianRupee className="w-6 h-6" />
                              {order.total}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3 pt-2">
                        <button
                          onClick={() =>
                            window.open(
                              `https://maps.google.com/?q=${encodeURIComponent(
                                order.address
                              )}`,
                              "_blank"
                            )
                          }
                          className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                          <Navigation className="inline w-5 h-5 mr-2" />
                          Navigate
                        </button>

                        {order.status === "assigned" && (
                          <button
                            onClick={() =>
                              updateOrderStatus(order.id, "delivering")
                            }
                            className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold shadow-lg transition-all duration-300 transform hover:scale-105"
                          >
                            <Truck className="inline w-5 h-5 mr-2" />
                            Start Delivery
                          </button>
                        )}

                        {order.status === "delivering" && (
                          <button
                            onClick={() =>
                              updateOrderStatus(order.id, "delivered")
                            }
                            className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl font-bold shadow-lg transition-all duration-300 transform hover:scale-105"
                          >
                            <CheckCircle className="inline w-5 h-5 mr-2" />
                            Mark Delivered
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </>
        ) : (
          <>
            {/* DELIVERY HISTORY */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <History className="text-green-600 w-6 h-6" />
                </div>
                Delivery History
                <span className="text-lg font-normal text-gray-500">
                  ({orders.filter(o => o.status === "delivered").length} completed)
                </span>
              </h2>
            </div>

            {Object.keys(historyByDay).length === 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <History className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg font-medium">No delivery history yet</p>
                <p className="text-gray-400 text-sm mt-2">Completed deliveries will appear here</p>
              </div>
            )}

            <div className="space-y-8">
              {Object.entries(historyByDay)
              .slice()
              .sort((a, b) => new Date(b[0]) - new Date(a[0]))
              .map(([day, dayOrders]) => (
                <div key={day} className="space-y-4">
                  {/* Day Header */}
                  <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border-l-4 border-green-500">
                    <Calendar className="w-6 h-6 text-green-600" />
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{day}</h3>
                      <p className="text-sm text-gray-600">
                        {dayOrders.length} {dayOrders.length === 1 ? 'delivery' : 'deliveries'} • 
                        Earned ₹{dayOrders.reduce((sum, o) => sum + (o.DeliveryCharged || 0), 0)}
                      </p>
                    </div>
                  </div>

                  {/* Orders for this day */}
                  <div className="space-y-4 pl-4">
                    {dayOrders.map(order => (
                      <div
                        key={order.id}
                        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
                      >
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-bold text-lg text-gray-800">Order #{order.id}</h4>
                              <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                <Clock className="w-4 h-4" />
                                {order.orderTime}
                              </p>
                            </div>
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-lg text-sm font-bold">
                              ✓ DELIVERED
                            </span>
                          </div>

                          <div className="grid sm:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500 font-medium mb-1">Customer</p>
                              <p className="font-semibold text-gray-800">{order.customerName}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 font-medium mb-1">Items</p>
                              <p className="font-semibold text-gray-800">{order.items.length} items</p>
                            </div>
                            <div>
                              <p className="text-gray-500 font-medium mb-1">Earnings</p>
                              <p className="font-bold text-green-600 flex items-center gap-1">
                                <IndianRupee className="w-4 h-4" />
                                {order.DeliveryCharged}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}