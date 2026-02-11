import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // Add framer-motion for "wow" factor
import { 
  ArrowLeft, RefreshCw, Package, CheckCircle, Clock, Truck, 
  XCircle, PersonStanding, Handshake, CircleCheckBig, Phone, ReceiptText 
} from "lucide-react";

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const getStatusInfo = (status) => {
    const statusLower = status?.toLowerCase() || "pending";
    const statusMap = {
      pending: { color: "text-amber-600 bg-amber-50 border-amber-200", icon: Clock, label: "Pending", bar: "w-1/4 bg-amber-400" },
      confirmed_preparing: { color: "text-blue-600 bg-blue-50 border-blue-200", icon: Package, label: "Preparing", bar: "w-2/4 bg-blue-400" },
      ready: { color: "text-indigo-600 bg-indigo-50 border-indigo-200", icon: PersonStanding, label: "Ready", bar: "w-3/4 bg-indigo-400" },
      assigned: { color: "text-purple-600 bg-purple-50 border-purple-200", icon: Handshake, label: "Assigned", bar: "w-3/4 bg-purple-400" },
      delivering: { color: "text-orange-600 bg-orange-50 border-orange-200", icon: Truck, label: "Out for Delivery", bar: "w-5/6 bg-orange-400" },
      delivered: { color: "text-emerald-600 bg-emerald-50 border-emerald-200", icon: CheckCircle, label: "Delivered", bar: "w-full bg-emerald-500" },
      cancelled: { color: "text-red-600 bg-red-50 border-red-200", icon: XCircle, label: "Cancelled", bar: "w-full bg-red-500" },
    };
    return statusMap[statusLower] || statusMap["pending"];
  };

  const fetchOrders = async () => {
    setRefreshing(true);
    try {
      const token = localStorage.getItem("jwtToken");
      const res = await axios.get("http://localhost:8080/api/orders/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data);
      setOrders(res.data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setTimeout(() => setRefreshing(false), 600); // Smooth transition
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 mb-8">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={22} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
            Order History
          </h1>
          <button
            onClick={fetchOrders}
            disabled={refreshing}
            className="p-2 hover:bg-pink-50 rounded-full text-pink-600 transition-all active:scale-95"
          >
            <RefreshCw size={20} className={refreshing ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {orders.length === 0 && !refreshing ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white p-16 rounded-3xl text-center shadow-sm border border-gray-100"
          >
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="text-gray-300" size={40} />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">No orders yet</h2>
            <p className="text-gray-500 mt-2">Hungry? Your next delicious meal is just a click away.</p>
            <button onClick={() => navigate('/home')} className="mt-6 bg-pink-600 text-white px-8 py-3 rounded-full font-medium shadow-lg shadow-pink-200 hover:bg-pink-700 transition-all">
              Order Now
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {orders.map((order, index) => {
                const status = getStatusInfo(order.deliveryStatus);
                const StatusIcon = status.icon;

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden"
                  >
                    {/* Status Progress Bar */}
                    <div className="h-1.5 w-full bg-gray-100">
                      <div className={`h-full transition-all duration-1000 ${status.bar}`} />
                    </div>

                    <div className="p-5 md:p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ORDER ID</span>
                            <span className="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-0.5 rounded">#{order.orderNumber}</span>
                          </div>
                          <p className="text-sm text-gray-500 flex items-center gap-1.5">
                            <Clock size={14} />
                            {new Date(order.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>

                        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${status.color}`}>
                          <StatusIcon size={16} />
                          <span className="font-bold text-xs uppercase tracking-wide">{status.label}</span>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="space-y-3 mb-6 bg-gray-50/50 p-4 rounded-xl">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-pink-400" />
                              <span className="font-medium text-gray-700">
                                {item.productName} <span className="text-gray-400 ml-1">× {item.quantity}</span>
                              </span>
                            </div>
                            <span className="font-semibold text-gray-900">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                        <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-200/60">
                          <span>Delivery Fee</span>
                          <span>₹{order.deliveryCharge}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-end justify-between gap-4">
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payment Status</p>
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold w-fit border ${
                            order.paymentStatus === "PAID" || order.deliveryStatus === "delivered"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : "bg-amber-50 text-amber-700 border-amber-100"
                          }`}>
                            {order.paymentStatus === "PAID" || order.deliveryStatus === "delivered" ? (
                              <CircleCheckBig size={14} />
                            ) : (
                              <Clock size={14} />
                            )}
                            {order.paymentStatus === "PAID" || order.deliveryStatus === "delivered" ? "PAID" : "CASH ON DELIVERY"}
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1 font-medium">Total Amount</p>
                          <p className="text-2xl font-black text-gray-900 leading-none">₹{order.total}</p>
                        </div>
                      </div>

                      {/* Interactive Footer */}
                      {order.deliveryStatus === "delivering" && order.deliveryBoyPhone && (
                        <div className="mt-6 pt-5 border-t border-gray-100">
                          <a 
                            href={`tel:${order.deliveryBoyPhone}`}
                            className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-gray-200"
                          >
                            <Phone size={18} /> Call Delivery Partner {order.deliveryBoyPhone}
                          </a>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;