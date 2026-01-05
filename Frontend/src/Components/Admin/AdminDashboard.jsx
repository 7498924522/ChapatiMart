import React, { useState, useEffect } from 'react';
import { 
  Package, Truck, DollarSign, Users, Clock, CheckCircle, 
  XCircle, Eye, Phone, MapPin, AlertCircle,ChefHat,CreditCard, TrendingUp,
  ShoppingCart, Edit, Trash2, Plus, Search
} from 'lucide-react';
import axios from 'axios';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([
    { id: 'P001', name: 'Wheat Chapati', stock: 150, price: 10, sold: 45 },
    { id: 'P002', name: 'Puranpoli', stock: 80, price: 25, sold: 23 },
    { id: 'P003', name: 'Bhakari', stock: 120, price: 15, sold: 38 },
    { id: 'P004', name: 'Rice Chapati', stock: 90, price: 20, sold: 19 }
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch orders from backend
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/orders"); // Update with your API
    const mappedOrders = res.data.map(order => ({
  id: order.orderNumber,

  customerName: order.customerName ?? "N/A",
  phone: order.customerPhone ?? "N/A",
  address: `${order.customerAddress || ""}, ${order.customerCity || ""} - ${order.customerPincode || ""}`,

  items: order.items?.map(i => ({
    category:i.category,
    name: i.productName,
    qty: i.quantity,
    price: i.price
  })) || [],

  total: order.total,
  status: order.status ?? "PENDING",
  DeliveryCharge:order.deliveryCharge,

  time: order.orderDate
    ? new Date(order.orderDate).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    : "N/A",

  paymentMethod: order.paymentMethod ?? "N/A"
}));

      setOrders(mappedOrders);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderNumber, newStatus) => {
    try {
      await axios.put(`http://localhost:8080/api/${orderNumber}/status`, { status: newStatus });
      fetchOrders(); // Refresh orders after update
    } catch (err) {
      console.error("Failed to update order:", err);
      alert("Failed to update order status. Try again.");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed_preparing: 'bg-blue-100 text-blue-800',
      ready: 'bg-purple-100 text-purple-800',
      delivering: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const stats = {
    todayOrders: orders.length,
    todayRevenue: orders.reduce((sum, o) => sum + o.total, 0),
    pendingOrders: orders.filter(o => o.status === 'PENDING').length,
    totalCustomers: 127
  };

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-700 text-white p-2 rounded-xl">
                <ShoppingCart size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  ChapatiMart <span className="text-green-700">Admin</span>
                </h1>
                <p className="text-sm text-gray-500">Shop Owner Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Today: Jan 4, 2026</span>
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                <Users size={20} className="text-green-700" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Today's Orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.todayOrders}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Package size={24} className="text-green-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Today's Revenue</p>
                <p className="text-3xl font-bold text-gray-900">₹{stats.todayRevenue}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <DollarSign size={24} className="text-blue-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Pending Orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingOrders}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock size={24} className="text-yellow-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Customers</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalCustomers}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users size={24} className="text-purple-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="border-b">
            <div className="flex gap-2 px-6">
              {['orders', 'inventory', 'analytics'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-semibold capitalize transition ${
                    activeTab === tab
                      ? 'border-b-2 border-green-600 text-green-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Tab */}
{activeTab === 'orders' && (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6">
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Management</h1>
        <p className="text-gray-600">Track and manage all your orders in one place</p>
      </div>

      {/* Search Bar */}
      <div className="mb-8 relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by Order ID, Customer Name, or Phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
        />
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
          <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-500 font-medium">No orders found.</p>
          <p className="text-gray-400 mt-2">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Orders Grid */}
      <div className="space-y-6">
        {filteredOrders.map((order) => {
          const getStatusColor = (status) => {
            const colors = {
              pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
              preparing: 'bg-blue-100 text-blue-800 border-blue-200',
              ready: 'bg-purple-100 text-purple-800 border-purple-200',
              delivering: 'bg-orange-100 text-orange-800 border-orange-200',
              delivered: 'bg-green-100 text-green-800 border-green-200',
              cancelled: 'bg-red-100 text-red-800 border-red-200'
            };
            return colors[status] || 'bg-gray-100 text-gray-800';
          };

          const getStatusIcon = (status) => {
            const icons = {
              pending: Clock,
              preparing: ChefHat,
              ready: Package,
              delivering: Truck,
              delivered: CheckCircle,
              cancelled: XCircle
            };
            return icons[status] || Clock;
          };

          const StatusIcon = getStatusIcon(order.status);
          
          return (
            <div
              key={order.id}
              className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Order Header */}
              <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-100">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 text-white px-4 py-2 rounded-xl font-bold text-lg shadow-lg">
                      #{order.id}
                    </div>
                    <div className={`px-4 py-2 rounded-xl border-2 font-semibold flex items-center gap-2 ${getStatusColor(order.status)}`}>
                      <StatusIcon className="w-4 h-4" />
                      {order.status.toUpperCase()}
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Order Time</p>
                      <p className="font-semibold text-gray-900 flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {order.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="text-2xl font-bold text-green-600">₹{order.total}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Body */}
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Customer Info */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 p-4 rounded-2xl">
                      <h3 className="text-sm font-semibold text-blue-900 mb-3 uppercase tracking-wide">Customer Details</h3>
                      <div className="space-y-2">
                        <p className="text-lg font-bold text-gray-900">{order.customerName}</p>
                        <p className="flex items-center gap-2 text-gray-700">
                          <Phone className="w-4 h-4 text-blue-500" />
                          {order.phone}
                        </p>
                        <div className="pt-2 mt-2 border-t border-blue-200">
                          <p className="text-xs text-gray-600 mb-1 font-medium">Delivery Charge</p>
                          <p className="font-semibold text-gray-900">₹{order.DeliveryCharge}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 p-4 rounded-2xl">
                      <h3 className="text-sm font-semibold text-purple-900 mb-2 uppercase tracking-wide flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Payment Method
                      </h3>
                      <p className="font-semibold text-gray-900">{order.paymentMethod}</p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="bg-gradient-to-r from-green-50 to-green-100/50 p-4 rounded-2xl">
                    <h3 className="text-sm font-semibold text-green-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Delivery Address
                    </h3>
                    <p className="text-gray-800 leading-relaxed">{order.address}</p>
                    
                    <div className="mt-4 pt-4 border-t border-green-200">
                      <p className="text-xs text-green-800 font-semibold mb-2">CATEGORIES:</p>
                      <div className="flex flex-wrap gap-2">
                        {order.items.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-white text-green-700 rounded-lg text-xs font-medium border border-green-200"
                          >
                            {item.category}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 p-5 rounded-2xl mb-6">
                  <h3 className="text-sm font-semibold text-orange-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Order Items
                  </h3>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center bg-white p-4 rounded-xl hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-200 rounded-lg flex items-center justify-center font-bold text-orange-700">
                            {item.qty}×
                          </div>
                          <span className="font-semibold text-gray-900">{item.name}</span>
                        </div>
                        <span className="text-lg font-bold text-orange-600">₹{item.price * item.qty}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {order.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'confirmed_preparing')}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <ChefHat className="inline w-5 h-5 mr-2" />
                        Accept & Prepare
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        className="px-6 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-all font-semibold border-2 border-red-200"
                      >
                        <XCircle className="inline w-5 h-5" />
                      </button>
                    </>
                  )}

                  {order.status === 'confirmed_preparing' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <Package className="inline w-5 h-5 mr-2" />
                      Mark as Ready
                    </button>
                  )}

                  {order.status === 'ready' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'delivering')}
                      className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 text-white py-4 rounded-xl hover:from-orange-700 hover:to-orange-800 transition-all font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    >
                      <Truck className="w-5 h-5" />
                      Out for Delivery
                    </button>
                  )}

                  {order.status === 'delivering' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl hover:from-green-700 hover:to-green-800 transition-all font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Mark as Delivered
                    </button>
                  )}

                  {order.status === 'delivered' && (
                    <div className="flex-1 bg-gradient-to-r from-green-100 to-green-200 text-green-800 py-4 rounded-xl font-bold flex items-center justify-center gap-2 border-2 border-green-300">
                      <CheckCircle className="w-5 h-5" />
                      Order Completed
                    </div>
                  )}

                  {order.status === 'cancelled' && (
                    <div className="flex-1 bg-gradient-to-r from-red-100 to-red-200 text-red-800 py-4 rounded-xl font-bold flex items-center justify-center gap-2 border-2 border-red-300">
                      <XCircle className="w-5 h-5" />
                      Cancelled
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
)}
          {/* Inventory Tab */}
           {activeTab === 'inventory' && (
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Inventory Management</h2>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2">
                  <Plus size={18} />
                  Add Product
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-3 px-4 font-semibold">Product</th>
                      <th className="text-left py-3 px-4 font-semibold">Stock</th>
                      <th className="text-left py-3 px-4 font-semibold">Price</th>
                      <th className="text-left py-3 px-4 font-semibold">Sold Today</th>
                      <th className="text-left py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-4 font-medium">{item.name}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            item.stock > 100 ? 'bg-green-100 text-green-700' :
                            item.stock > 50 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {item.stock} units
                          </span>
                        </td>
                        <td className="py-4 px-4 font-semibold">₹{item.price}</td>
                        <td className="py-4 px-4 text-gray-600">{item.sold} units</td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                              <Edit size={18} />
                            </button>
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}


         {activeTab === 'analytics' && (
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6">Sales Analytics</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border rounded-xl p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp size={20} className="text-green-600" />
                    Top Selling Products
                  </h3>
                  <div className="space-y-3">
                    {inventory.sort((a, b) => b.sold - a.sold).map((item, idx) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-gray-300">#{idx + 1}</span>
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <span className="text-green-700 font-bold">{item.sold} sold</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border rounded-xl p-6">
                  <h3 className="font-semibold mb-4">Weekly Revenue Trend</h3>
                  <div className="space-y-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                      const revenue = Math.floor(Math.random() * 5000) + 2000;
                      const percentage = (revenue / 7000) * 100;
                      return (
                        <div key={day}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">{day}</span>
                            <span className="text-green-700 font-bold">₹{revenue}</span>
                          </div>
                          <div className="bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}