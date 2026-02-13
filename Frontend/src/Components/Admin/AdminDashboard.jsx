import React, { useState, useEffect, useRef } from "react";
import {
  Package,
  Truck,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  Eye,
  Phone,
  MapPin,
  AlertCircle,
  ChefHat,
  CreditCard,
  TrendingUp,
  ShoppingCart,
  Edit,
  Trash2,
  CircleCheckBig,
  Search,
  UserPlus,
  Calendar,
  User,
  ArrowLeftToLine,
  Menu,
  X,
} from "lucide-react";
import axios from "axios";
import API_BASE_URL from "../../config/api";
import { useReactToPrint } from "react-to-print";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const billRefs = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef: billRefs,
    documentTitle: "Order Bill",
  });
  const [activeTab, setActiveTab] = useState("orders");

  // Delivery States
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [ordersBill, setOrdersBill] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false); // Pop Up for the assign boy
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [assigningOrder, setAssigningOrder] = useState(null);
  const [selectedBoy, setSelectedBoy] = useState("");

  const [deliveryForm, setDeliveryForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebar, setsidebar] = useState(false);

  const [cancellingOrder, setCancellingOrder] = useState(null);
  useEffect(() => {
    fetchOrders();
    fetchDeliveryBoys();
  }, []);

  //All Delivery Boys Which We Have Created For The Assigned Orders To  Active Boys.
  // Important Thing Is We can See There Status Like Online Or Offline
  const fetchDeliveryBoys = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/delivery-boys`);
      setDeliveryBoys(res.data);
    } catch (err) {
      console.error("Failed to fetch delivery boys", err);
    }
  };

  //Here The Admin Able To Access The All Customer Orders With The Proper Data
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/orders`);
      const mappedOrders = res.data.map((order) => ({
        id: order.orderNumber,
        deliveryBoyPhone: order.deliveryBoyPhone,
        customerName: order.customerName ?? "N/A",
        phone: order.customerPhone ?? "N/A",
        address: `${order.customerAddress || ""}, ${
          order.customerCity || ""
        } - ${order.customerPincode || ""}`,
        items:
          order.items?.map((i) => ({
            category: i.category,
            name: i.productName,
            qty: i.quantity,
            price: i.price,
          })) || [],
        total: order.total,
        Payment_Status: order.paymentStatus,
        status: order.status ?? "PENDING",
        DeliveryCharge: order.deliveryCharge,

        time: order.orderDate
          ? new Date(order.orderDate).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "N/A",
        paymentMethod: order.paymentMethod ?? "N/A",
        Date: order.orderDate
          ? new Date(order.orderDate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              weekday: "long",
            })
          : "N/A",
      }));
      setOrders(mappedOrders);
      setInventory(mappedOrders);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  // With The Help Of OrderNumber We Assigned Delivery Boy Number
  const handleAssignSubmit = async () => {
    if (!selectedBoy) {
      toast.error("Please select a delivery boy!");
      return;
    }

    try {
      await axios.put(`${API_BASE_URL}/api/assign-order`, {
        orderNumber: assigningOrder.id,
        deliveryBoyPhone: selectedBoy,
      });
      toast.success("Order Assigned Successfully 🚴");
      updateOrderStatus(assigningOrder.id, "assigned");

      setShowAssignModal(false);
      setAssigningOrder(null);
      setSelectedBoy("");
      fetchOrders(); // Refresh to see status update
    } catch (err) {
      toast.error("Failed to assign order. Please try again.");
    }
  };
  // console.log(orders);

  //Here Admin Have The Access To Update The Order Status From Pending To Accept&Preparing ,Ready And Assigned.
  const updateOrderStatus = async (orderNumber, newStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/api/${orderNumber}/status`, {
        status: newStatus,
      });
      fetchOrders();
    } catch (err) {
      console.error("Failed to update order:", err);
    }
  };

  //Account Of Delivery Boy
  const createDeliveryBoy = async () => {
    try {
      await axios.post(`${API_BASE_URL}/admin/delivery-boy`, {
        ...deliveryForm,
        active: "offline",
      });
      toast.success("Delivery Boy Created Successfully");
      setShowDeliveryModal(false);
      setDeliveryForm({ name: "", phone: "", email: "", password: "" });
      fetchDeliveryBoys();
    } catch (err) {
      toast.error("Failed to create delivery boy ❌");
    }
  };

  const handleDeliveryChange = (e) => {
    setDeliveryForm({ ...deliveryForm, [e.target.name]: e.target.value });
  };

  const validateDeliveryForm = () => {
  const { name, phone, email, password } = deliveryForm;

  if (!name || name.trim().length < 3) {
    toast.error("Enter valid full name (min 3 characters)");
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

  if (!password || password.length < 6) {
    toast.error("Password must be at least 6 characters");
    return false;
  }

  return true;
};


  const stats = {
    todayOrders: orders.length,

    //Only Total When Delivered
    todayRevenue: orders.reduce(
      (sum, o) =>
        o.status?.toLowerCase() == "delivered" ? sum + o.total : sum,
      0,
    ),

    pendingOrders: orders.filter((o) => o.status === "PENDING").length,
    totalCustomers: orders.filter((o) => o.status === "delivered").length,
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    return new Date(b.Date) - new Date(a.Date);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
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
          <div className="lg:block hidden">
            <div className="flex items-center gap-4 ">
              <span
                className="mr-5 hover:underline  cursor-pointer flex items-center gap-1 text-green-700 font-medium"
                onClick={() => navigate("/deliveryB_list")}
              >
                <Eye size={18} />
                Delivery Boys
              </span>
              <span
                className="mr-5 hover:underline cursor-pointer flex items-center gap-1 text-green-700 font-medium"
                onClick={() => setShowDeliveryModal(true)}
              >
                <UserPlus size={18} /> Add Delivery Boy
              </span>
              <span className="text-sm font-semibold text-black">
                {new Date().toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  weekday: "long",
                })}
              </span>
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                <Users size={20} className="text-green-700" />
              </div>
            </div>
          </div>
          <div className="h-10 w-10 bg-green-100 rounded-sm flex items-center justify-center md:hidden">
            {sidebar ? (
              <X
                onClick={() => setsidebar(false)}
                size={20}
                className="text-green-700"
              />
            ) : (
              <Menu
                onClick={() => setsidebar(true)}
                size={20}
                className="text-green-700"
              />
            )}
          </div>
        </div>
      </header>
      {sidebar && (
        <div className="absolute top-20 right-0 w-full bg-white  shadow-xl  z-50 border border-gray-100 md:hidden animate-in slide-in-from-top-5 duration-200">
          <div className="flex flex-col gap-4 items-end shadow-2xs py-5">
            <span className="text-sm font-semibold text-black p-2 shadow-2xs ">
              {new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                weekday: "long",
              })}
            </span>

            <span
              className="hover:underline cursor-pointer flex items-center p-2 shadow-2xs gap-1  text-green-700 font-medium"
              onClick={() => navigate("/deliveryB_list")}
            >
              <Eye size={18} />
              Delivery Boys
            </span>

            <span
              className="hover:underline cursor-pointer flex items-center gap-1 shadow-2xs p-2   text-green-700 font-medium"
              onClick={() => setShowDeliveryModal(true)}
            >
              <UserPlus size={18} />
              Add Delivery Boy
            </span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {/* Same Stats UI as before */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Orders</p>
              <p className="text-3xl font-bold">{stats.todayOrders}</p>
            </div>
            <Package
              size={24}
              className="text-green-700 bg-green-100 p-1 rounded"
            />
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Revenue</p>
              <p className="text-3xl font-bold">₹{stats.todayRevenue}</p>
            </div>
            <DollarSign
              size={24}
              className="text-blue-700 bg-blue-100 p-1 rounded"
            />
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-3xl font-bold">{stats.pendingOrders}</p>
            </div>
            <Clock
              size={24}
              className="text-yellow-700 bg-yellow-100 p-1 rounded"
            />
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Customers</p>
              <p className="text-3xl font-bold">{stats.totalCustomers}</p>
            </div>
            <Users
              size={24}
              className="text-purple-700 bg-purple-100 p-1 rounded"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="border-b md:px-6 px-2 flex md:gap-2">
            {["orders", "assigned", "cancelled", "history"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`md:px-6 px-2 py-4 font-semibold capitalize ${
                  activeTab === tab
                    ? "border-b-2 border-green-600 text-green-700"
                    : "text-gray-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="p-6">
              <div className="relative mb-8">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by Order ID or Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div className="space-y-6">
                {sortedOrders.map((order) =>
                  order.status == "PENDING" ||
                  order.status == "confirmed_preparing" ||
                  order.status == "ready" ? (
                    <div key={order.id} className="space-y-6">
                      <div className="bg-white rounded-3xl shadow-md border overflow-hidden">
                        {/* Order Header */}
                        <div className="flex items-center m-2 gap-3 bg-gradient-to-r from-green-50 to-green-100 p-2 rounded-xl border-l-4 border-green-500">
                          <Calendar className="w-6 h-6 text-green-600" />
                          <div>
                            <h3 className="font-bold text-lg text-gray-800">
                              {order.Date}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {order.time}
                            </p>
                          </div>
                        </div>
                        <div className="p-4 md:p-6 pt-3 border-b bg-gray-50">
                          {/* TOP ROW */}
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            {/* LEFT SIDE */}
                            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 w-full">
                              {/* ORDER ID */}
                              <span className="bg-green-600 text-white px-4 py-2 md:w-70  rounded-xl font-bold text-sm md:text-lg">
                                #{order.id}
                              </span>

                              {/* DETAILS */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 w-full">
                                <span className="px-3 py-1 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg font-bold text-xs uppercase text-center">
                                  {order.status}
                                </span>

                                <span className="px-3 py-1 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg font-bold text-xs uppercase text-center">
                                  {order.deliveryBoyPhone
                                    ? `Assigned: ${order.deliveryBoyPhone}`
                                    : "Not Assigned :-"}
                                </span>

                                <span
                                  onClick={() => {
                                    setOrdersBill(order);
                                    setShowBillModal(true);
                                  }}
                                  className="flex justify-center items-center gap-1 px-3 py-1 bg-yellow-100 border border-yellow-400 cursor-pointer hover:underline text-yellow-800 rounded-lg font-bold text-xs uppercase"
                                >
                                  <Eye size={16} />
                                  View Bill
                                </span>

                                <div
                                  className={`flex justify-center items-center gap-1 px-3 py-1 rounded-lg font-bold text-xs
                                 ${
                                order.Payment_Status === "PAID"
                                ? "bg-green-100 text-green-800 border border-green-400"
                                : "bg-yellow-100 text-yellow-800 border border-yellow-400"
                                }`}
                                >
                                  {order.Payment_Status === "PAID" ? (
                                    <CircleCheckBig className="size-4" />
                                  ) : (
                                    <Clock className="size-4" />
                                  )}
                                  {order.Payment_Status === "PAID"
                                    ? "PAID"
                                    : "PENDING"}
                                </div>
                                <div className="w-auto text-left md:text-center mt-1  md:mt-0">
                                  <p className=" font-bold text-green-600">
                                    Total :- ₹{order.total}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Order Content */}
                        <div className="p-6 grid md:grid-cols-2 gap-6">
                          <div className="bg-blue-50 p-4 rounded-2xl">
                            <h3 className="text-xs font-bold text-blue-800 uppercase mb-2">
                              Customer
                            </h3>
                            <p className="font-bold">{order.customerName}</p>
                            <p className="text-sm text-gray-600">
                              📞 {order.phone}
                            </p>

                            <p className="text-sm mt-2 flex gap-1">
                              <MapPin size={14} /> {order.address}
                            </p>

                            <div className="pt-2 mt-2 border-t border-blue-200">
                              <p className="text-xs text-gray-600 mb-1 font-medium">
                                Delivery Charge
                              </p>
                              <p className="font-semibold text-gray-900">
                                ₹{order.DeliveryCharge}
                              </p>
                            </div>
                          </div>

                          <div className="bg-orange-50 p-4 rounded-2xl">
                            <h3 className="text-xs font-bold text-orange-800 uppercase mb-2">
                              Items
                            </h3>
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between text-sm"
                              >
                                <span>
                                  {item.qty}x {item.name}
                                </span>
                                <span className="font-bold">
                                  ₹{item.price * item.qty}
                                </span>
                              </div>
                            ))}

                            <div className="bg-gradient-to-r my-5 from-purple-50 to-purple-100/50 p-4 rounded-2xl">
                              <h3 className="text-sm  font-semibold text-purple-900 mb-2 uppercase tracking-wide flex items-center gap-2">
                                <CreditCard className="w-4 h-4" />
                                Payment Method
                              </h3>
                              <p className="font-semibold text-gray-900">
                                {order.paymentMethod}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="p-6 pt-0 flex gap-3">
                          {order.status === "PENDING" && (
                            <button
                              onClick={() =>
                                updateOrderStatus(
                                  order.id,
                                  "confirmed_preparing",
                                )
                              }
                              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700"
                            >
                              Accept & Prepare
                            </button>
                          )}
                          {order.status === "confirmed_preparing" && (
                            <button
                              onClick={() =>
                                updateOrderStatus(order.id, "ready")
                              }
                              className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700"
                            >
                              Mark as Ready
                            </button>
                          )}
                          {order.status === "ready" && (
                            <button
                              onClick={() => {
                                setAssigningOrder(order);
                                setShowAssignModal(true);
                              }}
                              className="flex-1 bg-orange-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-700"
                            >
                              <Truck size={20} /> Assign Delivery Boy
                            </button>
                          )}
                          {order.status === "assigned" && (
                            <button
                              onClick={() =>
                                updateOrderStatus(order.id, "assigned")
                              }
                              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700"
                            >
                              <i>Order Assigned</i>
                            </button>
                          )}

                          {order.status === "delivering" && (
                            <button className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700">
                              Delivering,,,
                            </button>
                          )}
                          {order.status === "delivered" && (
                            <div className="flex-1 text-center py-3 bg-gray-100 rounded-xl font-bold text-gray-500 border italic">
                              Order Closed
                            </div>
                          )}

                          {order.status === "cancelled" && (
                            <div className="flex-1 text-center py-3 bg-gradient-to-r from-red-100 px-5 to-red-200 text-red-800 border rounded-xl font-bold italic">
                              Order Cancelled
                            </div>
                          )}

                          {order.status === "PENDING" && (
                            <div className=" bg-gradient-to-r from-red-100 px-5 to-red-200 text-red-800 py-4 rounded-xl font-bold flex items-center justify-center gap-2 border-2 border-red-300">
                              <XCircle
                                onClick={() => setCancellingOrder(order)}
                                className="w-5 h-5"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : null,
                )}
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="p-6">
              <div className="relative mb-8">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search History by Order ID or Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div className="space-y-6">
                {sortedOrders.map((order) =>
                  order.status == "delivered" || order.status == "cancelled" ? (
                    <div
                      key={order.time}
                      className="bg-white rounded-3xl shadow-md border overflow-hidden"
                    >
                      {/* Order Header */}

                      <div className="flex items-center  gap-3 m-2 bg-gradient-to-r from-green-50 to-green-100 p-2 rounded-xl border-l-4 border-green-500">
                        <Calendar className="w-6 h-6 text-green-600" />
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">
                            {order.Date}
                          </h3>
                          <p className="text-xs text-gray-500">{order.time}</p>
                        </div>
                      </div>

                      <div className="p-4 md:p-6 pt-3 border-b bg-gray-50">
                          {/* TOP ROW */}
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            {/* LEFT SIDE */}
                            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 w-full">
                              {/* ORDER ID */}
                              <span className="bg-green-600 text-white px-4 py-2 md:w-70  rounded-xl font-bold text-sm md:text-lg">
                                #{order.id}
                              </span>

                              {/* DETAILS */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 w-full">
                                <span className="px-3 py-1 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg font-bold text-xs uppercase text-center">
                                  {order.status}
                                </span>

                                <span className="px-3 py-1 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg font-bold text-xs uppercase text-center">
                                  {order.deliveryBoyPhone
                                    ? `Assigned: ${order.deliveryBoyPhone}`
                                    : "Not Assigned :-"}
                                </span>

                                <span
                                  onClick={() => {
                                    setOrdersBill(order);
                                    setShowBillModal(true);
                                  }}
                                  className="flex justify-center items-center gap-1 px-3 py-1 bg-yellow-100 border border-yellow-400 cursor-pointer hover:underline text-yellow-800 rounded-lg font-bold text-xs uppercase"
                                >
                                  <Eye size={16} />
                                  View Bill
                                </span>

                                <div
                                  className={`flex justify-center items-center gap-1 px-3 py-1 rounded-lg font-bold text-xs
                                 ${
                                order.Payment_Status === "PAID" || order.status ==="delivered"
                                ? "bg-green-100 text-green-800 border border-green-400"
                                : "bg-yellow-100 text-yellow-800 border border-yellow-400"
                                }`}
                                >
                                  {order.Payment_Status === "PAID" || order.status ==="delivered"  ? (
                                    <CircleCheckBig className="size-4" />
                                  ) : (
                                    <Clock className="size-4" />
                                  )}
                                  {order.Payment_Status === "PAID" || order.status ==="delivered"
                                    ? "PAID"
                                    : "PENDING"}
                                </div>
                                <div className="w-auto text-left md:text-center mt-1  md:mt-0">
                                  <p className=" font-bold text-green-600">
                                    Total :- ₹{order.total}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                      {/* Order Content */}
                      <div className="p-6 grid md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 p-4 rounded-2xl">
                          <h3 className="text-xs font-bold text-blue-800 uppercase mb-2">
                            Customer
                          </h3>
                          <p className="font-bold">{order.customerName}</p>
                          <p className="text-sm text-gray-600">📞 {order.phone}</p>
                          <p className="text-sm mt-2 flex gap-1">
                            <MapPin size={14} /> {order.address}
                          </p>

                          <div className="pt-2 mt-2 border-t border-blue-200">
                            <p className="text-xs text-gray-600 mb-1 font-medium">
                              Delivery Charge
                            </p>
                            <p className="font-semibold text-gray-900">
                              ₹{order.DeliveryCharge}
                            </p>
                          </div>
                        </div>

                        <div className="bg-orange-50 p-4 rounded-2xl">
                          <h3 className="text-xs font-bold text-orange-800 uppercase mb-2">
                            Items
                          </h3>
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between text-sm"
                            >
                              <span>
                                {item.qty}x {item.name}
                              </span>
                              <span className="font-bold">
                                ₹{item.price * item.qty}
                              </span>
                            </div>
                          ))}

                          <div className="bg-gradient-to-r my-5 from-purple-50 to-purple-100/50 p-4 rounded-2xl">
                            <h3 className="text-sm  font-semibold text-purple-900 mb-2 uppercase tracking-wide flex items-center gap-2">
                              <CreditCard className="w-4 h-4" />
                              Payment Method
                            </h3>
                            <p className="font-semibold text-gray-900">
                              {order.paymentMethod}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* ACTION BUTTONS */}
                      <div className="p-6 pt-0 flex gap-3">
                        {order.status === "delivered" && (
                          <div className="flex-1 text-center py-3 bg-gray-100 rounded-xl font-bold text-gray-500 border italic">
                            Order Closed
                          </div>
                        )}

                        {order.status === "cancelled" && (
                          <div className="flex-1 text-center py-3 bg-gradient-to-r from-red-100 px-5 to-red-200 text-red-800 border rounded-xl font-bold italic">
                            Order Cancelled
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null,
                )}
              </div>
            </div>
          )}

          {activeTab === "cancelled" && (
            <div className="p-6">
              <div className="relative mb-8">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search Cancelled Orders by Order ID or Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div className="space-y-6">
                {sortedOrders.map((order) =>
                  order.status == "cancelled" ? (
                    <div
                      key={order.id}
                      className="bg-white rounded-3xl shadow-md border overflow-hidden"
                    >
                      {/* Order Header */}

                      <div className="flex items-center gap-3 m-2 bg-gradient-to-r from-green-50 to-green-100 p-2 rounded-xl border-l-4 border-green-500">
                        <Calendar className="w-6 h-6 text-green-600" />
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">
                            {order.Date}
                          </h3>
                          <p className="text-xs text-gray-500">{order.time}</p>
                        </div>
                      </div>
                      <div className="p-4 md:p-6 pt-3 border-b bg-gray-50">
                          {/* TOP ROW */}
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            {/* LEFT SIDE */}
                            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 w-full">
                              {/* ORDER ID */}
                              <span className="bg-green-600 text-white px-4 py-2 md:w-70  rounded-xl font-bold text-sm md:text-lg">
                                #{order.id}
                              </span>

                              {/* DETAILS */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 w-full">
                                <span className="px-3 py-1 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg font-bold text-xs uppercase text-center">
                                  {order.status}
                                </span>

                                <span className="px-3 py-1 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg font-bold text-xs uppercase text-center">
                                  {order.deliveryBoyPhone
                                    ? `Assigned: ${order.deliveryBoyPhone}`
                                    : "Not Assigned :-"}
                                </span>

                                <span
                                  onClick={() => {
                                    setOrdersBill(order);
                                    setShowBillModal(true);
                                  }}
                                  className="flex justify-center items-center gap-1 px-3 py-1 bg-yellow-100 border border-yellow-400 cursor-pointer hover:underline text-yellow-800 rounded-lg font-bold text-xs uppercase"
                                >
                                  <Eye size={16} />
                                  View Bill
                                </span>

                                <div
                                  className={`flex justify-center items-center gap-1 px-3 py-1 rounded-lg font-bold text-xs
                                 ${
                                order.Payment_Status === "PAID"
                                ? "bg-green-100 text-green-800 border border-green-400"
                                : "bg-yellow-100 text-yellow-800 border border-yellow-400"
                                }`}
                                >
                                  {order.Payment_Status === "PAID" ? (
                                    <CircleCheckBig className="size-4" />
                                  ) : (
                                    <Clock className="size-4" />
                                  )}
                                  {order.Payment_Status === "PAID"
                                    ? "PAID"
                                    : "PENDING"}
                                </div>
                                <div className="w-auto text-left md:text-center mt-1  md:mt-0">
                                  <p className=" font-bold text-green-600">
                                    Total :- ₹{order.total}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                      {/* Order Content */}
                      <div className="p-6 grid md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 p-4 rounded-2xl">
                          <h3 className="text-xs font-bold text-blue-800 uppercase mb-2">
                            Customer
                          </h3>
                          <p className="font-bold">{order.customerName}</p>
                          <p className="text-sm text-gray-600">📞 {order.phone}</p>
                          <p className="text-sm mt-2 flex gap-1">
                            <MapPin size={14} /> {order.address}
                          </p>

                          <div className="pt-2 mt-2 border-t border-blue-200">
                            <p className="text-xs text-gray-600 mb-1 font-medium">
                              Delivery Charge
                            </p>
                            <p className="font-semibold text-gray-900">
                              ₹{order.DeliveryCharge}
                            </p>
                          </div>
                        </div>

                        <div className="bg-orange-50 p-4 rounded-2xl">
                          <h3 className="text-xs font-bold text-orange-800 uppercase mb-2">
                            Items
                          </h3>
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between text-sm"
                            >
                              <span>
                                {item.qty}x {item.name}
                              </span>
                              <span className="font-bold">
                                ₹{item.price * item.qty}
                              </span>
                            </div>
                          ))}

                          <div className="bg-gradient-to-r my-5 from-purple-50 to-purple-100/50 p-4 rounded-2xl">
                            <h3 className="text-sm  font-semibold text-purple-900 mb-2 uppercase tracking-wide flex items-center gap-2">
                              <CreditCard className="w-4 h-4" />
                              Payment Method
                            </h3>
                            <p className="font-semibold text-gray-900">
                              {order.paymentMethod}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* ACTION BUTTONS */}
                      <div className="p-6 pt-0 flex gap-3">
                        {order.status === "cancelled" && (
                          <div className="flex-1 text-center py-3 bg-gradient-to-r from-red-100 px-5 to-red-200 text-red-800 border rounded-xl font-bold italic">
                            Order Cancelled
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null,
                )}
              </div>
            </div>
          )}

          {activeTab === "assigned" && (
            <div className="p-6">
              <div className="relative mb-8">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search Assigned Orders by Order ID or Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div className="space-y-6">
                {sortedOrders.map((order) =>
                  order.status == "assigned" || order.status == "delivering" ? (
                    <div
                      key={order.id}
                      className="bg-white rounded-3xl shadow-md border overflow-hidden"
                    >
                      {/* Order Header */}

                      <div className="flex items-center gap-3 m-2 bg-gradient-to-r from-green-50 to-green-100 p-2 rounded-xl border-l-4 border-green-500">
                        <Calendar className="w-6 h-6 text-green-600" />
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">
                            {order.Date}
                          </h3>
                          <p className="text-xs text-gray-500">{order.time}</p>
                        </div>
                      </div>
                      <div className="p-4 md:p-6 pt-3 border-b bg-gray-50">
                          {/* TOP ROW */}
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            {/* LEFT SIDE */}
                            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 w-full">
                              {/* ORDER ID */}
                              <span className="bg-green-600 text-white px-4 py-2 md:w-70  rounded-xl font-bold text-sm md:text-lg">
                                #{order.id}
                              </span>

                              {/* DETAILS */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 w-full">
                                <span className="px-3 py-1 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg font-bold text-xs uppercase text-center">
                                  {order.status}
                                </span>

                                <span className="px-3 py-1 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg font-bold text-xs uppercase text-center">
                                  {order.deliveryBoyPhone
                                    ? `Assigned: ${order.deliveryBoyPhone}`
                                    : "Not Assigned :-"}
                                </span>

                                <span
                                  onClick={() => {
                                    setOrdersBill(order);
                                    setShowBillModal(true);
                                  }}
                                  className="flex justify-center items-center gap-1 px-3 py-1 bg-yellow-100 border border-yellow-400 cursor-pointer hover:underline text-yellow-800 rounded-lg font-bold text-xs uppercase"
                                >
                                  <Eye size={16} />
                                  View Bill
                                </span>

                                <div
                                  className={`flex justify-center items-center gap-1 px-3 py-1 rounded-lg font-bold text-xs
                                 ${
                                order.Payment_Status === "PAID"
                                ? "bg-green-100 text-green-800 border border-green-400"
                                : "bg-yellow-100 text-yellow-800 border border-yellow-400"
                                }`}
                                >
                                  {order.Payment_Status === "PAID" ? (
                                    <CircleCheckBig className="size-4" />
                                  ) : (
                                    <Clock className="size-4" />
                                  )}
                                  {order.Payment_Status === "PAID"
                                    ? "PAID"
                                    : "PENDING"}
                                </div>
                                <div className="w-auto text-left md:text-center mt-1  md:mt-0">
                                  <p className=" font-bold text-green-600">
                                    Total :- ₹{order.total}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                      {/* Order Content */}
                      <div className="p-6 grid md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 p-4 rounded-2xl">
                          <h3 className="text-xs font-bold text-blue-800 uppercase mb-2">
                            Customer
                          </h3>
                          <p className="font-bold">{order.customerName}</p>
                          <p className="text-sm text-gray-600">📞 {order.phone}</p>
                          <p className="text-sm mt-2 flex gap-1">
                            <MapPin size={14} /> {order.address}
                          </p>

                          <div className="pt-2 mt-2 border-t border-blue-200">
                            <p className="text-xs text-gray-600 mb-1 font-medium">
                              Delivery Charge
                            </p>
                            <p className="font-semibold text-gray-900">
                              ₹{order.DeliveryCharge}
                            </p>
                          </div>
                        </div>

                        <div className="bg-orange-50 p-4 rounded-2xl">
                          <h3 className="text-xs font-bold text-orange-800 uppercase mb-2">
                            Items
                          </h3>
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between text-sm"
                            >
                              <span>
                                {item.qty}x {item.name}
                              </span>
                              <span className="font-bold">
                                ₹{item.price * item.qty}
                              </span>
                            </div>
                          ))}

                          <div className="bg-gradient-to-r my-5 from-purple-50 to-purple-100/50 p-4 rounded-2xl">
                            <h3 className="text-sm  font-semibold text-purple-900 mb-2 uppercase tracking-wide flex items-center gap-2">
                              <CreditCard className="w-4 h-4" />
                              Payment Method
                            </h3>
                            <p className="font-semibold text-gray-900">
                              {order.paymentMethod}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* ACTION BUTTONS */}
                      <div className="p-6 pt-0 flex gap-3">
                        {order.status === "assigned" && (
                          <button
                            onClick={() =>
                              updateOrderStatus(order.id, "assigned")
                            }
                            className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700"
                          >
                            <i>Order Assigned</i>
                          </button>
                        )}

                        {order.status === "delivering" && (
                          <button className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700">
                            Delivering,,,
                          </button>
                        )}
                      </div>
                    </div>
                  ) : null,
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= MODAL: ASSIGN DELIVERY BOY. When The Admin Update The ready status ================= */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full md:mx-10 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-orange-600">
              <Truck /> Assign Order #{assigningOrder?.id}
            </h2>
            <div className="space-y-3 mb-6">
              <p className="text-sm text-gray-500">
                Select an available delivery partner:
              </p>
              <select
                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                value={selectedBoy}
                onChange={(e) => setSelectedBoy(e.target.value)}
              >
                <option value="">-- Choose Delivery Boy --</option>
                {deliveryBoys.map((boy) =>
                  // Only Online Boys Visible For Assigned.
                  boy.active == "online" ? (
                    <option key={boy.phone} value={boy.phone}>
                      {boy.name} ({boy.phone}){" "}
                      {boy.active == "online" ? "🟢" : "⚪"}
                    </option>
                  ) : (
                    ""
                  ),
                )}
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAssignModal(false)}
                className="flex-1 py-3 bg-gray-100 rounded-xl font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignSubmit}
                className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE DELIVERY BOY ================= */}
      {showDeliveryModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-green-700 flex items-center gap-2">
                🚴 Create Delivery Boy
              </h2>
            </div>
            <div className="space-y-4">
              <input
                name="name"
                placeholder="Full Name"
                value={deliveryForm.name}
                onChange={handleDeliveryChange}
                className="w-full border p-3 rounded-xl"
              />
              <input
                name="phone"
                placeholder="Phone Number"
                value={deliveryForm.phone}
                onChange={handleDeliveryChange}
                className="w-full border p-3 rounded-xl"
              />
              <input
                name="email"
                placeholder="Email"
                value={deliveryForm.email}
                onChange={handleDeliveryChange}
                className="w-full border p-3 rounded-xl"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={deliveryForm.password}
                onChange={handleDeliveryChange}
                className="w-full border p-3 rounded-xl"
              />
            </div>
            <button
              onClick={()=>
                {
                  if(validateDeliveryForm())
                  {
                  createDeliveryBoy();
                  }

                }}
              className="w-full mt-6 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition"
            >
              Create Account
            </button>
            <button
              onClick={() => setShowDeliveryModal(false)}
              className="w-full mt-2 text-gray-500 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {cancellingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
          {/* Modal Box */}
          <div className="relative w-[380px] bg-white rounded-2xl shadow-2xl p-6 text-center animate-scaleIn">
            {/* Close Icon */}
            <button
              onClick={() => setCancellingOrder(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
            >
              ✕
            </button>

            {/* Warning Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-100 text-red-600 text-3xl">
                ⚠
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Cancel Order?
            </h2>

            {/* Description */}
            <p className="text-gray-500 text-sm mb-6">
              This action cannot be undone. The order will be permanently
              cancelled.
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setCancellingOrder(null)}
                className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
              >
                Keep Order
              </button>

              <button
                onClick={() => {
                  updateOrderStatus(cancellingOrder.id, "cancelled");
                  setCancellingOrder(null);
                }}
                className="flex-1 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 active:scale-95 transition"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showBillModal && ordersBill && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full md:mx-10 rounded-2xl p-6 shadow-2xl relative">
            {/* CLOSE BUTTON */}
            <button
              onClick={() => {
                setShowBillModal(false);
                setOrdersBill(null);
              }}
              className="absolute top-4 right-4 text-xl font-bold"
            >
              ✕
            </button>

            {/* BILL */}

            <div className="max-w-4xl mx-auto">
              <div ref={billRefs} className="p-2">
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-bold">BHAKRI CENTER</h2>
                  <p>Address :- Shop No (08) Asavari Gate Closest</p>
                  <p>
                    <u>Contact Us</u> :- +91 1234567891
                  </p>
                </div>

                <div className="flex justify-between mb-2">
                  <span className="font-semibold">
                    Customer Name: {ordersBill.customerName}
                  </span>
                  <span className="text-sm text-black">{ordersBill.Date}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold ">
                    Payment:{" "}
                    {ordersBill.paymentMethod !== "COD"
                      ? ordersBill.paymentMethod
                      : "Scanner"}
                  </span>
                  <span className="text-sm text-black ">
                    Time: {ordersBill.time}
                  </span>
                </div>

                {/* ITEMS TABLE */}
                <table className="w-full border border-gray-300 border-collapse text-sm mb-3">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-3 py-2 text-left">Items</th>
                      <th className="border px-3 py-2 text-right">Price (₹)</th>
                      <th className="border px-3 py-2 text-center">Qty</th>
                      <th className="border px-3 py-2 text-right">Total (₹)</th>
                    </tr>
                  </thead>

                  <tbody>
                    {ordersBill.items.map((item, i) => (
                      <tr key={i}>
                        <td className="border px-3 py-2">{item.name}</td>
                        <td className="border px-3 py-2 text-right">
                          ₹{item.price}
                        </td>
                        <td className="border px-3 py-2 text-center">
                          {item.qty}
                        </td>
                        <td className="border px-3 py-2 text-right font-semibold">
                          ₹{item.price * item.qty}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  <tfoot>
                    <tr className="bg-gray-50">
                      <td
                        colSpan="3"
                        className="border px-3 py-2 text-right font-bold"
                      >
                        Grand Total
                      </td>
                      <td className="border border-black px-3 py-2 text-right font-bold text-orange-600">
                        ₹{ordersBill.total}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* BUTTONS (BILL PRINTOUT) */}
              <div className="flex gap-3 mt-3 print:hidden">
                <button
                  onClick={handlePrint}
                  className="bg-green-500 text-white px-3 py-1 rounded cursor-pointer"
                >
                  PRINT / PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
