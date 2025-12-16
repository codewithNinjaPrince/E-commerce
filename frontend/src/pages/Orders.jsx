//       {/* ✅ Empty Orders UI */}
//       {!loading && orderData.length === 0 && (
//         <div className="flex flex-col items-center justify-center text-center py-20">
//           <FiBox size={80} className="text-white mb-4" />
//           <h2 className="text-xl font-semibold mb-2">No Orders Found</h2>
//           <p className="text-gray-500 mb-6">
//             Looks like you haven't ordered anything yet.
//           </p>

//           <Link
//             to="/collections"
//             className="bg-black text-white px-6 py-3 flex items-center gap-2 rounded hover:bg-gray-900 transition"
//           >
//             Go To Collection <span>→</span>
//           </Link>
//         </div>
//       )}

// import React, { useContext, useState, useEffect } from "react";
// import Title from "../components/Title";
// import { ShopContext } from "../context/ShopContext";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import { FiBox } from "react-icons/fi"; // Empty box icon

// const Orders = () => {
//   const { backendUrl, token, currency } = useContext(ShopContext);
//   const [orderData, setOrderData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const loadOrderData = async () => {
//     try {
//       if (!token) return;

//       setLoading(true);

//       const response = await axios.post(
//         backendUrl + "/api/order/userorders",
//         {},
//         { headers: { token } }
//       );

//       if (response.data.success) {
//         let allOrdersItem = [];

//         response.data.orders.forEach((order) => {
//           order.items.forEach((item) => {
//             item.orderId = order._id;
//             item.status = order.status;
//             item.paymentMethod = order.paymentMethod;
//             item.date = order.date;
//             allOrdersItem.push(item);
//           });
//         });

//         setOrderData(allOrdersItem.reverse());
//       }
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadOrderData();
//   }, [token]);

//   return (
//     <div className="border-t pt-16 min-h-[70vh] text-white">
//       <div className="text-2xl mb-6">
//         <Title text1="Your" text2="Orders" />
//       </div>

//       {/* ====================== LOADER ====================== */}
//       {loading && (
//         <div className="flex flex-col items-center justify-center py-20">
//           <div className="w-12 h-12 border-4 border-gray-500 border-t-white rounded-full animate-spin"></div>
//           <p className="mt-4 text-gray-300 text-sm">Fetching your orders…</p>
//         </div>
//       )}

//       {/* ====================== EMPTY STATE ====================== */}
//       {!loading && orderData.length === 0 && (
//         <div className="flex flex-col items-center justify-center py-20">
//           <FiBox size={90} className="text-gray-400 mb-4" />

//           <h1 className="text-xl font-semibold mb-2">No Orders Yet</h1>
//           <p className="text-gray-500 mb-6">Start exploring our collection now!</p>

//           <Link
//             to="/collections"
//             className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
//           >
//             Browse Products →
//           </Link>
//         </div>
//       )}

//       {/* ====================== ORDERS LIST ====================== */}
//       {!loading && orderData.length > 0 && (
//         <div className="space-y-6">
//           {orderData.map((item, index) => {
//             const discountPercent = item.actualPrice
//               ? Math.round(
//                   ((item.actualPrice - item.discountedPrice) /
//                     item.actualPrice) *
//                     100
//                 )
//               : 0;

//             return (
//               <div
//                 key={index}
//                 className="bg-[#1c1c1c] border border-white/10 p-5 rounded-xl shadow-md hover:border-white/20 transition"
//               >
//                 {/* Top: Order ID + Date */}
//                 <div className="flex justify-between flex-wrap gap-2">
//                   <p className="text-sm text-gray-400">
//                     Order ID:{" "}
//                     <span className="text-gray-200">{item.orderId}</span>
//                   </p>

//                   <p className="text-sm text-gray-400">
//                     Placed on:{" "}
//                     <span className="text-gray-200">
//                       {new Date(item.date).toDateString()}
//                     </span>
//                   </p>
//                 </div>

//                 {/* Main Row */}
//                 <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mt-6">
//                   {/* ---------------- IMAGE ---------------- */}
//                   <img
//                     src={item.image[0]}
//                     alt={item.name}
//                     className="w-24 md:w-28 rounded-lg object-cover border border-gray-700"
//                   />

//                   {/* ---------------- PRODUCT INFO ---------------- */}
//                   <div className="flex-1">
//                     <p className="text-lg font-semibold">{item.name}</p>

//                     <p className="text-sm text-gray-400 mt-1">
//                       Brand: <span className="text-gray-300">{item.brandName}</span>
//                     </p>

//                     {/* PRICE */}
//                     <div className="flex items-center gap-3 mt-2">
//                       <p className="text-green-400 font-bold">
//                         {currency} {item.discountedPrice}
//                       </p>

//                       {item.actualPrice && (
//                         <p className="text-gray-500 line-through">
//                           {currency} {item.actualPrice}
//                         </p>
//                       )}

//                       <span className="text-red-400 font-medium text-sm">
//                         {discountPercent}% OFF
//                       </span>
//                     </div>

//                     {/* QTY & SIZE */}
//                     <div className="flex gap-4 mt-2 text-sm text-gray-300">
//                       <p>Qty: {item.quantity}</p>
//                       <p>Size: {item.size}</p>
//                     </div>

//                     {/* PAYMENT */}
//                     <p className="text-sm text-gray-400 mt-1">
//                       Payment:{" "}
//                       <span className="text-gray-200">{item.paymentMethod}</span>
//                     </p>
//                   </div>

//                   {/* ---------------- STATUS + TRACK ---------------- */}
//                   <div className="flex flex-col items-end gap-3 md:w-1/4">
//                     {/* STATUS */}
//                     <div className="flex items-center gap-2">
//                       <span
//                         className={`w-3 h-3 rounded-full ${
//                           item.status === "Delivered"
//                             ? "bg-green-400"
//                             : item.status === "Shipped"
//                             ? "bg-blue-400"
//                             : "bg-yellow-400"
//                         }`}
//                       ></span>

//                       <p className="text-sm text-gray-300">{item.status}</p>
//                     </div>

//                     {/* TRACK BTN */}
//                     <button
//                       className="bg-white text-black px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-300 transition cursor-pointer"
//                     >
//                       Track Order
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Orders;

// import React, { useContext, useState, useEffect } from "react";
// import Title from "../components/Title";
// import { ShopContext } from "../context/ShopContext";
// import axios from "axios";
// import { FiBox } from "react-icons/fi";
// import { FaCheckCircle } from "react-icons/fa";

// const Orders = () => {
//   const { backendUrl, token, currency } = useContext(ShopContext);

//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [trackingId, setTrackingId] = useState(null);

//   const loadOrderData = async () => {
//     try {
//       if (!token) return;

//       setLoading(true);

//       const response = await axios.post(
//         backendUrl + "/api/order/userorders",
//         {},
//         { headers: { token } }
//       );

//       if (response.data.success) {
//         // Orders already contain the full enriched items
//         setOrders(response.data.orders);
//       }
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadOrderData();
//   }, [token]);

//   // TRACK ORDER
//   const handleTrackOrder = (orderId) => {
//     setTrackingId(orderId);
//     setTimeout(() => setTrackingId(null), 2000);
//   };

//   // TIMELINE STAGES
//   const timelineStages = [
//     "Order Placed",
//     "Packing",
//     "Shipped",
//     "Out for Delivery",
//     "Delivered",
//   ];

//   return (
//     <div className="border-t pt-16 min-h-[70vh] text-white">
//       <div className="text-2xl mb-6">
//         <Title text1="Your" text2="Orders" />
//       </div>

//       {/* LOADING */}
//       {loading && (
//         <div className="flex flex-col items-center justify-center py-20">
//           <div className="w-12 h-12 border-4 border-gray-500 border-t-white rounded-full animate-spin"></div>
//           <p className="mt-4 text-gray-300 text-sm">Fetching your orders…</p>
//         </div>
//       )}

//       {/* NO ORDERS */}
//       {!loading && orders.length === 0 && (
//         <div className="flex flex-col items-center justify-center py-20">
//           <FiBox size={90} className="text-gray-400 mb-4" />
//           <h1 className="text-xl font-semibold mb-2">No Orders Yet</h1>
//           <p className="text-gray-500 mb-6">Start exploring our collection.</p>
//         </div>
//       )}

//       {/* MERGED ORDERS */}
//       {!loading && orders.length > 0 && (
//         <div className="space-y-8">
//           {orders.map((order) => {
//             return (
//               <div
//                 key={order._id}
//                 className="bg-[#1c1c1c] border border-white/10 p-6 rounded-xl shadow-md"
//               >
//                 {/* TOP ROW */}
//                 <div className="flex justify-between flex-wrap gap-2">
//                   <p className="text-sm text-gray-400">
//                     Order ID: <span className="text-gray-200">{order._id}</span>
//                   </p>

//                   <p className="text-sm text-gray-400">
//                     Placed on:{" "}
//                     <span className="text-gray-200">
//                       {new Date(order.date).toLocaleString("en-IN", {
//                         weekday: "short",
//                         year: "numeric",
//                         month: "short",
//                         day: "numeric",
//                         hour: "2-digit",
//                         minute: "2-digit",
//                         hour12: true,
//                       })}
//                     </span>
//                   </p>
//                 </div>

//                 {/* ITEMS LIST */}
//                 <div className="mt-6 space-y-5">
//                   {order.items.map((item, idx) => {
//                     const discountPercent =
//                       item.actualPrice && item.discountedPrice
//                         ? Math.round(
//                             ((item.actualPrice - item.discountedPrice) /
//                               item.actualPrice) *
//                               100
//                           )
//                         : 0;

//                     return (
//                       <div
//                         key={idx}
//                         className="flex items-start gap-5 bg-[#121212] p-4 rounded-lg border border-white/10"
//                       >
//                         {/* IMAGE */}
//                         <img
//                           src={
//                             Array.isArray(item.image)
//                               ? item.image[0]
//                               : item.image
//                           }
//                           alt={item.name}
//                           className="w-20 h-20 rounded-lg object-cover border border-gray-700"
//                         />

//                         {/* ITEM INFO */}
//                         <div className="flex-1">
//                           <p className="font-semibold">{item.name}</p>
//                           <p className="text-sm text-gray-400 mt-1">
//                             Brand:{" "}
//                             <span className="text-gray-300">
//                               {item.brandName || "—"}
//                             </span>
//                           </p>

//                           <div className="flex items-center gap-3 mt-2">
//                             <p className="text-green-400 font-bold">
//                               {currency} {item.discountedPrice || item.price}
//                             </p>

//                             {item.actualPrice && (
//                               <p className="text-gray-500 line-through">
//                                 {currency} {item.actualPrice}
//                               </p>
//                             )}

//                             {discountPercent > 0 && (
//                               <span className="text-red-400 font-medium text-sm">
//                                 {discountPercent}% OFF
//                               </span>
//                             )}
//                           </div>

//                           <p className="text-sm text-gray-400 mt-2">
//                             Qty: {item.quantity} • Size: {item.size}
//                           </p>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 {/* ORDER TOTAL */}
//                 <p className="text-right text-xl font-semibold text-blue-400 mt-4">
//                   Total: {currency} {order.amount}
//                 </p>

//                 {/* TIMELINE */}
//                 <div className="mt-6">
//                   <h3 className="text-gray-300 mb-3 font-medium">
//                     Order Status
//                   </h3>

//                   <div className="flex items-center justify-between relative">
//                     {timelineStages.map((stage, idx) => {
//                       const isCompleted =
//                         timelineStages.indexOf(order.status) >= idx;

//                       return (
//                         <div key={idx} className="flex flex-col items-center">
//                           <div
//                             className={`w-6 h-6 rounded-full flex items-center justify-center ${
//                               isCompleted
//                                 ? "bg-green-500"
//                                 : "bg-gray-600 opacity-40"
//                             }`}
//                           >
//                             {isCompleted && (
//                               <FaCheckCircle className="text-white text-xs" />
//                             )}
//                           </div>

//                           <p className="text-xs text-gray-400 mt-1">
//                             {stage}
//                           </p>
//                         </div>
//                       );
//                     })}

//                     {/* TIMELINE BAR */}
//                     <div className="absolute top-3 left-0 right-0 h-[2px] bg-gray-700 -z-10"></div>
//                   </div>
//                 </div>

//                 {/* TRACK BUTTON */}
//                 <div className="text-right mt-6">
//                   <button
//                     onClick={() => handleTrackOrder(order._id)}
//                     disabled={trackingId === order._id}
//                     className="bg-white text-black px-6 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 transition"
//                   >
//                     {trackingId === order._id ? "Tracking…" : "Track Order"}
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Orders;

// import React, { useContext, useState, useEffect } from "react";
// import Title from "../components/Title";
// import { ShopContext } from "../context/ShopContext";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { FiBox } from "react-icons/fi";
// import { FaCheckCircle, FaTruck } from "react-icons/fa";

// const TIMELINE_STAGES = [
//   "Order Placed",
//   "Packing",
//   "Shipped",
//   "Out for Delivery",
//   "Delivered",
// ];

// const Orders = () => {
//   const { backendUrl, token, currency } = useContext(ShopContext);

//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [actionLoading, setActionLoading] = useState({}); // { "orderId-productId": { cancel: true } }
//   const [confirmUI, setConfirmUI] = useState(null);
//   // value = "orderId-productId" if open

//   const keyFor = (orderId, productId) => `${orderId}-${productId}`;
//   const stageIndex = (stage) => TIMELINE_STAGES.indexOf(stage);

//   const getItemStatus = (order, item) =>
//     item.itemStatus || item.status || order.status || "Order Placed";

//   // Fetch orders
//   const loadOrders = async () => {
//     try {
//       setLoading(true);

//       const res = await axios.post(
//         backendUrl + "/api/order/userorders",
//         {},
//         { headers: { token } }
//       );

//       if (res.data.success) {
//         setOrders(res.data.orders); // Already newest → oldest
//       } else {
//         toast.error(res.data.message || "Failed to load orders");
//       }
//     } catch (err) {
//       toast.error("Failed to load orders");
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     if (token) loadOrders();
//   }, [token]);

//   // Generic action handler (track / cancel )
//   const handleAction = async (type, orderId, productId, api) => {
//     const k = keyFor(orderId, productId);

//     // start loading
//     setActionLoading((prev) => ({
//       ...prev,
//       [k]: { ...(prev[k] || {}), [type]: true },
//     }));

//     try {
//       const res = await axios.post(
//         backendUrl + api,
//         { orderId, productId },
//         { headers: { token } }
//       );

//       if (res.data.success) {
//         toast.success(res.data.message || `${type} successful`);
//         loadOrders();
//       } else {
//         toast.error(res.data.message || `${type} failed`);
//       }
//     } catch (err) {
//       toast.error(`Unable to ${type}`);
//     }

//     // stop loading
//     setActionLoading((prev) => ({
//       ...prev,
//       [k]: { ...(prev[k] || {}), [type]: false },
//     }));
//   };

//   const cancelItem = (orderId, productId) =>
//     handleAction("cancel", orderId, productId, "/api/order/cancel");

//   const trackItem = async (orderId) => {
//     try {
//       const res = await axios.post(
//         backendUrl + "/api/order/track",
//         { orderId },
//         { headers: { token } }
//       );

//       if (res.data.success) {
//         // Replace this order with updated one
//         setOrders((prev) =>
//           prev.map((o) => (o._id === orderId ? res.data.order : o))
//         );

//         toast.success("Order updated!");
//       } else {
//         toast.error(res.data.message);
//       }
//     } catch (err) {
//       toast.error("Unable to fetch latest status");
//     }
//   };

//   return (
//     <div className="border-t pt-16 pb-16 min-h-[70vh] text-white">
//       <div className="text-2xl mb-6 px-4">
//         <Title text1="Your" text2="Orders" />
//       </div>

//       {/* LOADING */}
//       {loading && (
//         <div className="flex flex-col items-center justify-center py-20">
//           <div className="w-12 h-12 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>
//           <p className="mt-4 text-gray-400 text-sm">Loading your orders...</p>
//         </div>
//       )}

//       {/* EMPTY */}
//       {!loading && orders.length === 0 && (
//         <div className="flex flex-col items-center py-20 px-4">
//           <FiBox size={90} className="text-gray-500 mb-4" />
//           <h2 className="text-xl font-semibold mb-2">No Orders Found</h2>
//           <p className="text-gray-500">
//             Start shopping to place your first order!
//           </p>
//         </div>
//       )}

//       {/* ORDERS */}
//       {!loading && orders.length > 0 && (
//         <div className="max-w-5xl mx-auto px-4 space-y-8">
//           {orders.map((order) => (
//             <div
//               key={order._id}
//               className="bg-[#1c1c1c] p-6 rounded-xl border border-white/10 shadow-md"
//             >
//               {/* Order Header */}
//               <div className="flex justify-between items-start flex-wrap gap-4">
//                 <div>
//                   <p className="text-sm text-gray-400">
//                     Order ID: <span className="text-gray-200">{order._id}</span>
//                   </p>
//                   <p className="text-xs text-gray-400 mt-1">
//                     Placed on:{" "}
//                     <span className="text-gray-200">
//                       {new Date(order.date).toLocaleString("en-IN", {
//                         day: "numeric",
//                         month: "short",
//                         year: "numeric",
//                         hour: "2-digit",
//                         minute: "2-digit",
//                         hour12: true,
//                       })}
//                     </span>
//                   </p>
//                 </div>

//                 <div className="text-right">
//                   <p className="text-sm text-gray-400">Payment</p>
//                   <p
//                     className={`font-semibold ${
//                       order.payment ? "text-green-400" : "text-red-400"
//                     }`}
//                   >
//                     {order.payment ? "Completed" : "Pending"}
//                   </p>
//                 </div>
//               </div>
//               {/* ITEMS */}
//               <div className="mt-6 space-y-4">
//                 {[...order.items]
//                   .sort((a, b) => {
//                     const dateA = a.productDate || a.date || 0;
//                     const dateB = b.productDate || b.date || 0;
//                     return dateB - dateA; // 🚀 Newest → Oldest
//                   })
//                   .map((item, idx) => {
//                     const k = keyFor(order._id, item.productId);
//                     const status = getItemStatus(order, item);
//                     const statusIndex = stageIndex(status);

//                     const loadingTrack = actionLoading[k]?.track;
//                     const loadingCancel = actionLoading[k]?.cancel;

//                     const price = item.discountedPrice ?? item.price ?? 0;
//                     const discountPercent =
//                       item.actualPrice && item.discountedPrice
//                         ? Math.round(
//                             ((item.actualPrice - item.discountedPrice) /
//                               item.actualPrice) *
//                               100
//                           )
//                         : 0;

//                     return (
//                       <div
//                         key={item.productId + "-" + idx}
//                         className="flex flex-col md:flex-row gap-4 bg-[#121212] p-4 rounded-lg border border-white/10"
//                       >
//                         {/* IMAGE + DETAILS + BUTTONS (same as before) */}

//                         {/* IMAGE */}
//                         <img
//                           src={
//                             Array.isArray(item.image)
//                               ? item.image[0]
//                               : item.image
//                           }
//                           alt={item.name}
//                           className="w-24 h-24 md:w-28 md:h-28 rounded-lg object-cover border border-gray-700 mx-auto md:mx-0"
//                         />

//                         {/* DETAILS */}
//                         <div className="flex-1 flex flex-col justify-between">
//                           <div>
//                             <p className="font-semibold text-base md:text-lg">
//                               {item.name}
//                             </p>

//                             <p className="text-sm text-gray-400 mt-1">
//                               Brand:{" "}
//                               <span className="text-gray-300">
//                                 {item.brandName || "—"}
//                               </span>
//                             </p>

//                             {/* Price */}
//                             <div className="flex items-center gap-2 flex-wrap mt-3">
//                               <p className="text-green-400 font-bold text-lg">
//                                 {currency} {price}
//                               </p>

//                               {item.actualPrice && (
//                                 <p className="line-through text-gray-500 text-sm">
//                                   {currency} {item.actualPrice}
//                                 </p>
//                               )}

//                               {discountPercent > 0 && (
//                                 <span className="text-red-400 text-sm font-semibold">
//                                   {discountPercent}% OFF
//                                 </span>
//                               )}
//                             </div>

//                             <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-300">
//                               <p>Qty: {item.quantity}</p>
//                               <p>Size: {item.size}</p>
//                             </div>
//                           </div>

//                           {/* TIMELINE */}
//                           <div className="mt-4 overflow-x-auto pb-2">
//                             <div className="flex items-center min-w-max gap-4">
//                               {TIMELINE_STAGES.map((stage, sIdx) => {
//                                 const done = sIdx <= statusIndex;

//                                 return (
//                                   <div
//                                     key={stage}
//                                     className="flex items-center gap-2"
//                                   >
//                                     <div
//                                       className={`w-4 h-4 rounded-full flex items-center justify-center ${
//                                         done ? "bg-green-500" : "bg-gray-600"
//                                       }`}
//                                     >
//                                       {done && (
//                                         <FaCheckCircle className="text-white text-[10px]" />
//                                       )}
//                                     </div>

//                                     <p className="text-xs text-gray-300 whitespace-nowrap">
//                                       {stage}
//                                     </p>

//                                     {sIdx < TIMELINE_STAGES.length - 1 && (
//                                       <div
//                                         className={`h-[2px] w-10 ${
//                                           done ? "bg-green-500" : "bg-gray-700"
//                                         }`}
//                                       ></div>
//                                     )}
//                                   </div>
//                                 );
//                               })}
//                             </div>
//                           </div>
//                         </div>

//                         {/* ACTION BUTTONS */}
//                         <div className="flex md:flex-col gap-3 justify-end w-full md:w-auto">
//                           {/* TRACK */}
//                           <button
//                             onClick={() => trackItem(order._id)}
//                             disabled={loadingTrack}
//                             className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white text-black rounded-md text-sm font-semibold hover:bg-gray-300 transition cursor-pointer"
//                           >
//                             {loadingTrack ? (
//                               <div className="w-4 h-4 border-2 border-gray-400 border-t-black rounded-full animate-spin"></div>
//                             ) : (
//                               <>
//                                 <FaTruck /> Track
//                               </>
//                             )}
//                           </button>

//                           {/* CANCEL */}
//                           {/* CANCEL BUTTON + CONFIRM UI */}
//                           {status !== "Delivered" &&
//                             status !== "Cancelled" &&
//                             status !== "Out for Delivery" && (
//                               <>
//                                 {/* CANCEL BUTTON */}
//                                 <button
//                                   onClick={() =>
//                                     setConfirmUI(
//                                       `${order._id}-${item.productId}`
//                                     )
//                                   }
//                                   className="flex-1 md:flex-none px-4 py-2 bg-red-600 text-white rounded-md text-sm
//         font-semibold hover:bg-red-700 transition cursor-pointer"
//                                 >
//                                   Cancel
//                                 </button>

//                                 {/* INLINE CONFIRM BOX */}
//                                 {confirmUI ===
//                                   `${order._id}-${item.productId}` && (
//                                   <div className="mt-3 p-4 bg-[#181818] border border-red-500/40 rounded-lg animate-fadeIn">
//                                     <p className="text-sm text-gray-300">
//                                       Are you sure you want to cancel this item?
//                                     </p>

//                                     <div className="flex justify-end gap-3 mt-3">
//                                       <button
//                                         onClick={() => setConfirmUI(null)}
//                                         className="px-4 py-2 bg-gray-700 text-white rounded-md text-sm
//               hover:bg-gray-600 transition"
//                                       >
//                                         No
//                                       </button>

//                                       <button
//                                         onClick={() => {
//                                           cancelItem(order._id, item.productId);
//                                           setConfirmUI(null);
//                                         }}
//                                         className="px-4 py-2 bg-red-600 text-white rounded-md text-sm
//               hover:bg-red-700 transition"
//                                       >
//                                         Yes, Cancel
//                                       </button>
//                                     </div>
//                                   </div>
//                                 )}
//                               </>
//                             )}
//                         </div>
//                       </div>
//                     );
//                   })}
//               </div>

//               {/* ORDER TOTAL */}
//               <div className="mt-4 flex justify-between items-center">
//                 <p className="text-sm text-gray-400">
//                   Items:{" "}
//                   <span className="text-gray-200">{order.items.length}</span>
//                 </p>

//                 <div className="text-right">
//                   <p className="text-sm text-gray-400">Total</p>
//                   <p className="text-xl font-semibold text-blue-400">
//                     {currency} {order.amount}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Orders;

// // src/pages/Orders.jsx
// import React, { useContext, useEffect, useState, useRef } from "react";
// import Title from "../components/Title";
// import { ShopContext } from "../context/ShopContext";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { FiBox } from "react-icons/fi";
// import { FaCheckCircle, FaTruck, FaTrashAlt } from "react-icons/fa";

// /**
//  * Orders.jsx
//  * - Shows merged orders (order contains items array)
//  * - Shows per-item vertical timeline
//  * - Track / Cancel / Delete item actions (per-item)
//  * - Newest orders first, newest items first
//  * - Mobile responsive + simple animations
//  */

// const TIMELINE_STAGES = [
//   "Order Placed",
//   "Packing",
//   "Shipped",
//   "Out for Delivery",
//   "Delivered",
// ];

// const Orders = () => {
//   const { backendUrl, token, currency } = useContext(ShopContext);

//   const [orders, setOrders] = useState([]); // array of order objects
//   const [loading, setLoading] = useState(true);

//   // action loading map keyed by `${orderId}-${productId}` { track: bool, cancel: bool, delete: bool }
//   const [actionLoading, setActionLoading] = useState({});
//   // which inline confirm UI is open (key)
//   const [confirmUI, setConfirmUI] = useState(null);

//   // which items recently advanced (for temporary animation)
//   const animRef = useRef({}); // { key: timestamp }
//   const [, tick] = useState(0); // force re-render on animation triggers

//   const keyFor = (orderId, productId) => `${orderId}-${productId}`;
//   const stageIndex = (stage) => {
//     const idx = TIMELINE_STAGES.indexOf(stage);
//     return idx === -1 ? 0 : idx;
//   };

//   // helper: determine per-item status preference
//   const getItemStatus = (order, item) => item.itemStatus || item.status || order.status || "Order Placed";

//   // Load user orders (newest -> oldest) and sort items newest -> oldest
//   const loadOrders = async () => {
//     if (!token) return;
//     setLoading(true);
//     try {
//       const res = await axios.post(
//         `${backendUrl}/api/order/userorders`,
//         {},
//         { headers: { token } }
//       );

//       if (!res.data.success) {
//         toast.error(res.data.message || "Could not fetch orders");
//         setOrders([]);
//         setLoading(false);
//         return;
//       }

//       // make sure orders sorted newest → oldest
//       const fetched = Array.isArray(res.data.orders) ? res.data.orders : [];

//       const prepared = fetched
//         .map((o) => {
//           const copy = { ...o };
//           // sort items inside order: newest -> oldest (by productDate or item.date)
//           copy.items = Array.isArray(copy.items) ? [...copy.items].sort((a, b) => {
//             const da = a.productDate || a.date || 0;
//             const db = b.productDate || b.date || 0;
//             return db - da;
//           }) : [];
//           return copy;
//         })
//         .sort((a, b) => (b.date || 0) - (a.date || 0));

//       setOrders(prepared);
//     } catch (err) {
//       console.error("loadOrders error:", err);
//       toast.error("Failed to load orders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (token) loadOrders();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [token]);

//   // helper to set action loading
//   const setAction = (key, type, value) => {
//     setActionLoading((prev) => ({
//       ...prev,
//       [key]: { ...(prev[key] || {}), [type]: value },
//     }));
//   };

//   // TRACK action: fetch fresh single order and update local state
//   // Note: track is per-order (we refresh whole order), not just item
//   const trackOrder = async (orderId) => {
//     if (!token) {
//       toast.error("Not authorized");
//       return;
//     }
//     const keyDummy = `${orderId}-track`;
//     setAction(keyDummy, "track", true);

//     try {
//       const res = await axios.post(
//         `${backendUrl}/api/order/track`,
//         { orderId },
//         { headers: { token } }
//       );

//       if (res.data.success && res.data.order) {
//         // update the single order in local state
//         setOrders((prev) => {
//           const next = prev.map((o) => {
//             if (String(o._id) === String(orderId)) {
//               // animate items which advanced: compare statuses
//               const old = o.items || [];
//               const fresh = res.data.order.items || [];

//               // For each item in fresh, if its itemStatus advanced compared to old, trigger animation
//               fresh.forEach((fi) => {
//                 const matching = old.find((oi) => String(oi.productId) === String(fi.productId));
//                 const oldStage = matching ? (matching.itemStatus || matching.status || o.status) : null;
//                 const newStage = fi.itemStatus || fi.status || res.data.order.status;
//                 if (oldStage && TIMELINE_STAGES.indexOf(newStage) > TIMELINE_STAGES.indexOf(oldStage)) {
//                   const k = keyFor(orderId, fi.productId);
//                   animRef.current[k] = Date.now();
//                 }
//               });
//               return { ...res.data.order, items: (res.data.order.items || []).sort((a,b)=> (b.productDate||b.date||0) - (a.productDate||a.date||0)) };
//             }
//             return o;
//           });
//           return next;
//         });

//         // trigger rerender for animation visuals
//         tick((t) => t + 1);
//         toast.success("Order status updated");
//       } else {
//         toast.error(res.data.message || "Could not fetch updated order");
//       }
//     } catch (err) {
//       console.error("trackOrder error:", err);
//       toast.error("Unable to fetch latest status");
//     } finally {
//       setAction(keyDummy, "track", false);
//     }
//   };

//   // Cancel a specific item in order (per-item)
//   // Calls /api/order/cancel with { orderId, productId }
//   const cancelItem = async (orderId, productId) => {
//     if (!token) {
//       toast.error("Not authorized");
//       return;
//     }
//     const k = keyFor(orderId, productId);
//     setAction(k, "cancel", true);

//     try {
//       const res = await axios.post(
//         `${backendUrl}/api/order/cancel`,
//         { orderId, productId },
//         { headers: { token } }
//       );

//       if (res.data.success) {
//         // update local orders: set item's itemStatus = "Cancelled"
//         setOrders((prev) =>
//           prev.map((o) => {
//             if (String(o._id) !== String(orderId)) return o;
//             const items = (o.items || []).map((it) =>
//               String(it.productId) === String(productId) ? { ...it, itemStatus: "Cancelled" } : it
//             );
//             return { ...o, items };
//           })
//         );
//         toast.success(res.data.message || "Item cancelled");
//       } else {
//         toast.error(res.data.message || "Cancel failed");
//       }
//     } catch (err) {
//       console.error("cancelItem error:", err);
//       toast.error("Unable to cancel item");
//     } finally {
//       setAction(k, "cancel", false);
//     }
//   };

//   // small helper to check if animation for item should show (1.5s pulse then keep check)
//   const isAnimated = (orderId, productId) => {
//     const k = keyFor(orderId, productId);
//     const ts = animRef.current[k];
//     if (!ts) return false;
//     // show animation for 3s after event
//     return Date.now() - ts < 3000;
//   };

//   // UI render
//   return (
//     <div className="border-t pt-16 pb-16 min-h-[70vh] text-white">
//       <div className="text-2xl mb-6 px-4">
//         <Title text1="Your" text2="Orders" />
//       </div>

//       {loading && (
//         <div className="flex flex-col items-center justify-center py-20">
//           <div className="w-12 h-12 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>
//           <p className="mt-4 text-gray-400 text-sm">Loading your orders...</p>
//         </div>
//       )}

//       {!loading && orders.length === 0 && (
//         <div className="flex flex-col items-center py-20 px-4">
//           <FiBox size={90} className="text-gray-500 mb-4" />
//           <h2 className="text-xl font-semibold mb-2">No Orders Found</h2>
//           <p className="text-gray-500">Start shopping to place your first order!</p>
//         </div>
//       )}

//       {!loading && orders.length > 0 && (
//         <div className="max-w-5xl mx-auto px-4 space-y-8">
//           {orders.map((order) => (
//             <article
//               className="bg-[#1c1c1c] p-6 rounded-xl border border-white/10 shadow-md"
//               key={order._id}
//             >
//               {/* header */}
//               <div className="flex justify-between items-start flex-wrap gap-4">
//                 <div>
//                   <p className="text-sm text-gray-400">
//                     Order ID: <span className="text-gray-200 break-all">{order._id}</span>
//                   </p>
//                   <p className="text-xs text-gray-400 mt-1">
//                     Placed on{" "}
//                     <span className="text-gray-200">
//                       {new Date(order.date).toLocaleString("en-IN", {
//                         day: "numeric",
//                         month: "short",
//                         year: "numeric",
//                         hour: "2-digit",
//                         minute: "2-digit",
//                         hour12: true,
//                       })}
//                     </span>
//                   </p>
//                 </div>

//                 <div className="text-right">
//                   <p className="text-sm text-gray-400">Payment</p>
//                   <p className={`font-semibold ${order.payment ? "text-green-400" : "text-red-400"}`}>
//                     {order.payment ? "Completed" : "Pending"}
//                   </p>
//                 </div>
//               </div>

//               {/* items - newest first (already sorted on fetch) */}
//               <div className="mt-6 space-y-4">
//                 {Array.isArray(order.items) && order.items.map((item, idx) => {
//                   const itemKey = keyFor(order._id, item.productId);
//                   const status = getItemStatus(order, item);
//                   const statusIdx = stageIndex(status);

//                   const loadingTrack = actionLoading[`${order._id}-track`]?.track || false;
//                   const loadingCancel = actionLoading[itemKey]?.cancel || false;
//                   const loadingDelete = actionLoading[itemKey]?.delete || false;

//                   const price = item.discountedPrice ?? item.price ?? 0;
//                   const discountPercent = (item.actualPrice && item.discountedPrice)
//                     ? Math.round(((item.actualPrice - item.discountedPrice) / item.actualPrice) * 100)
//                     : 0;

//                   const animate = isAnimated(order._id, item.productId);

//                   return (
//                     <div key={String(item.productId) + "-" + idx} className="flex flex-col md:flex-row gap-4 bg-[#121212] p-4 rounded-lg border border-white/10">
//                       {/* image */}
//                       <div className="flex-shrink-0">
//                         <img
//                           src={Array.isArray(item.image) ? item.image[0] : item.image}
//                           alt={item.name}
//                           className="w-24 h-24 md:w-28 md:h-28 rounded-lg object-cover border border-gray-700 mx-auto md:mx-0"
//                         />
//                       </div>

//                       {/* content */}
//                       <div className="flex-1 flex flex-col justify-between">
//                         <div>
//                           <p className="font-semibold text-base md:text-lg leading-tight">{item.name}</p>
//                           <p className="text-sm text-gray-400 mt-1">Brand: <span className="text-gray-300">{item.brandName || "—"}</span></p>

//                           {/* price row */}
//                           <div className="flex flex-wrap items-center gap-2 mt-3">
//                             <p className="text-green-400 font-bold text-lg">{currency} {price}</p>
//                             {item.actualPrice && <p className="line-through text-gray-500 text-sm">{currency} {item.actualPrice}</p>}
//                             {discountPercent > 0 && <span className="text-red-400 text-sm font-semibold">{discountPercent}% OFF</span>}
//                           </div>

//                           <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-300">
//                             <p>Qty: {item.quantity}</p>
//                             <p>Size: {item.size}</p>
//                           </div>
//                         </div>

//                         {/* vertical timeline (mobile-friendly) */}
//                         <div className="mt-4">
//                           <div className="flex flex-col gap-3">
//                             {TIMELINE_STAGES.map((stage, sIdx) => {
//                               const done = sIdx <= statusIdx;
//                               // animation bar width logic
//                               const barFill = done ? "bg-green-500" : "bg-gray-700";
//                               return (
//                                 <div key={stage} className="flex items-center gap-3">
//                                   <div className="flex flex-col items-center">
//                                     <div className={`w-6 h-6 rounded-full flex items-center justify-center ${done ? "bg-green-500" : "bg-gray-600"}`}>
//                                       {done ? <FaCheckCircle className="text-white text-[12px]" /> : null}
//                                     </div>

//                                     {/* vertical connecting line */}
//                                     {sIdx < TIMELINE_STAGES.length - 1 && <div className={`w-[2px] ${done ? "bg-green-500" : "bg-gray-700"} h-6 mt-1`} />}
//                                   </div>

//                                   <div className="flex-1">
//                                     <p className={`text-sm ${done ? "text-gray-200 font-semibold" : "text-gray-400"}`}>{stage}</p>

//                                     {/* subtle animated progress indicator when item recently advanced */}
//                                     {animate && sIdx === statusIdx && (
//                                       <div className="mt-1 w-full">
//                                         <div className="h-1 w-full bg-gray-700 rounded overflow-hidden">
//                                           <div className="h-1 bg-green-500 animate-grow" style={{ animationDuration: "900ms" }} />
//                                         </div>
//                                       </div>
//                                     )}
//                                   </div>
//                                 </div>
//                               );
//                             })}
//                           </div>
//                         </div>
//                       </div>

//                       {/* action buttons column */}
//                       <div className="flex md:flex-col gap-3 justify-end w-full md:w-auto">
//                         {/* Track (order-level) */}
//                         <button
//                           onClick={() => trackOrder(order._id)}
//                           disabled={loadingTrack}
//                           className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white text-black rounded-md text-sm font-semibold hover:bg-gray-300 transition"
//                         >
//                           {loadingTrack ? <div className="w-4 h-4 border-2 border-gray-400 border-t-black rounded-full animate-spin" /> : <><FaTruck /> Track</>}
//                         </button>

//                         {/* Cancel - inline confirm toggle */}
//                         {status !== "Delivered" && status !== "Cancelled" && status !== "Out for Delivery" && (
//                           <>
//                             <button
//                               onClick={() => setConfirmUI(itemKeyFor(order._id, item.productId))}
//                               className="flex-1 md:flex-none px-4 py-2 bg-red-600 text-white rounded-md text-sm font-semibold hover:bg-red-700 transition"
//                             >
//                               {loadingCancel ? "Cancelling…" : "Cancel"}
//                             </button>

//                             {confirmUI === itemKeyFor(order._id, item.productId) && (
//                               <div className="mt-3 px-3 py-3 bg-[#181818] border border-red-500/40 rounded-lg w-full md:w-64 mx-auto">
//                                 <p className="text-sm text-gray-300">Are you sure you want to cancel this item?</p>
//                                 <div className="flex justify-end gap-3 mt-3">
//                                   <button onClick={() => setConfirmUI(null)} className="px-3 py-1 bg-gray-700 text-white rounded-md text-sm hover:bg-gray-600">No</button>
//                                   <button onClick={() => { setConfirmUI(null); cancelItem(order._id, item.productId); }} className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700">Yes, Cancel</button>
//                                 </div>
//                               </div>
//                             )}
//                           </>
//                         )}

//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>

//               {/* bottom summary */}
//               <div className="mt-4 flex justify-between items-center">
//                 <p className="text-sm text-gray-400">Items: <span className="text-gray-200">{(order.items || []).length}</span></p>
//                 <div className="text-right">
//                   <p className="text-sm text-gray-400">Total</p>
//                   <p className="text-xl font-semibold text-blue-400">{currency} {order.amount}</p>
//                 </div>
//               </div>
//             </article>
//           ))}
//         </div>
//       )}

//       {/* small CSS for animations (tailwind + inline) */}
//       <style>{`
//         /* grow animation for progress inside timeline */
//         @keyframes grow {
//           0% { width: 0%; }
//           100% { width: 100%; }
//         }
//         .animate-grow {
//           animation-name: grow;
//           animation-timing-function: ease-out;
//           animation-fill-mode: forwards;
//         }

//         /* helper to create unique key string for confirm UI */
//       `}</style>
//     </div>
//   );
// };

// // helper outside component to build confirmUI key (keeps JSX clearer)
// function itemKeyFor(orderId, productId) {
//   return `${orderId}-${productId}`;
// }

// export default Orders;

import React, { useContext, useEffect, useState, useRef } from "react";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { FiBox } from "react-icons/fi";
import { FaCheckCircle, FaTruck } from "react-icons/fa";

/**
 * Orders.jsx
 * Merged orders + per-item tracking + cancel
 * Horizontal timeline on desktop, vertical on mobile
 */

const TIMELINE_STAGES = [
  "Order Placed",
  "Packing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] = useState({});
  const [confirmUI, setConfirmUI] = useState(null);
  const [cancelModal, setCancelModal] = useState(null);

  const animRef = useRef({});
  const [, tick] = useState(0);

  const keyFor = (orderId, productId) => `${orderId}-${productId}`;

  const stageIndex = (stage) => {
    const idx = TIMELINE_STAGES.indexOf(stage);
    return idx === -1 ? 0 : idx;
  };

  const getItemStatus = (order, item) =>
    item.itemStatus || item.status || order.status || "Order Placed";

  // --------------------------- LOAD ORDERS --------------------------
  const loadOrders = async () => {
    if (!token) return;
    setLoading(true);

    try {
      const res = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
      );

      if (!res.data.success) {
        toast.error(res.data.message || "Could not fetch orders");
        setOrders([]);
        setLoading(false);
        return;
      }

      const fetched = Array.isArray(res.data.orders) ? res.data.orders : [];

      setOrders(fetched);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadOrders();
  }, [token]);

  const setAction = (key, type, value) => {
    setActionLoading((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || {}), [type]: value },
    }));
  };

  // --------------------------- TRACK ORDER -------------------------
  const trackOrder = async (orderId) => {
    if (!token) return toast.error("Not authorized");

    const k = `${orderId}-track`;
    setAction(k, "track", true);

    try {
      const res = await axios.post(
        `${backendUrl}/api/order/track`,
        { orderId },
        { headers: { token } }
      );

      if (res.data.success && res.data.order) {
        setOrders((prev) =>
          prev.map((o) => {
            if (String(o._id) !== String(orderId)) return o;

            const oldItems = o.items || [];
            const newItems = res.data.order.items || [];

            newItems.forEach((fi) => {
              const old = oldItems.find(
                (oi) => String(oi.productId) === String(fi.productId)
              );
              const oldStage = old
                ? old.itemStatus || old.status || o.status
                : null;
              const newStage =
                fi.itemStatus || fi.status || res.data.order.status;

              if (
                oldStage &&
                TIMELINE_STAGES.indexOf(newStage) >
                  TIMELINE_STAGES.indexOf(oldStage)
              ) {
                animRef.current[keyFor(orderId, fi.productId)] = Date.now();
              }
            });

            return {
              ...o,
              status: res.data.order.status,
              items: o.items.map((oldItem) => {
                const updated = res.data.order.items.find(
                  (ni) => String(ni.productId) === String(oldItem.productId)
                );

                return updated
                  ? { ...oldItem, ...updated } // 👈 image preserved
                  : oldItem;
              }),
            };
          })
        );

        tick((t) => t + 1);
        toast.success("Order status updated");
      } else {
        toast.error(res.data.message || "Could not fetch updated status");
      }
    } catch (err) {
      toast.error("Unable to update status");
    } finally {
      setAction(k, "track", false);
    }
  };

  // --------------------------- CANCEL ITEM -------------------------
  const cancelItem = async (orderId, productId) => {
    if (!token) return toast.error("Not authorized");

    const k = keyFor(orderId, productId);
    setAction(k, "cancel", true);

    try {
      const res = await axios.post(
        `${backendUrl}/api/order/cancel`,
        { orderId, productId },
        { headers: { token } }
      );

      if (res.data.success) {
        setOrders((prev) =>
          prev.map((o) => {
            if (String(o._id) !== String(orderId)) return o;

            const items = o.items.map((it) =>
              String(it.productId) === String(productId)
                ? { ...it, itemStatus: "Cancelled" }
                : it
            );

            return { ...o, items };
          })
        );
        toast.success("Item cancelled");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Unable to cancel item");
    } finally {
      setAction(k, "cancel", false);
    }
  };

  const isAnimated = (orderId, productId) => {
    const ts = animRef.current[keyFor(orderId, productId)];
    if (!ts) return false;
    return Date.now() - ts < 3000;
  };

  // --------------------------- UI RENDER -------------------------
  return (
    <div className="border-t pt-16 pb-16 min-h-[70vh] text-white">
      <div className="text-2xl mb-6 px-4">
        <Title text1="Your" text2="Orders" />
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400 text-sm">Loading your orders...</p>
        </div>
      )}

      {!loading && orders.length === 0 && (
        <div className="flex flex-col items-center py-20">
          <FiBox size={90} className="text-gray-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Orders Found</h2>
          <p className="text-gray-500">
            Start shopping to place your first order!
          </p>
        </div>
      )}

      {!loading && orders.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 space-y-8">
          {orders.map((order) => (
            <article
              key={order._id}
              className="bg-[#1c1c1c] p-6 rounded-xl border border-white/10 shadow-md"
            >
              {/* HEADER */}
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <p className="text-sm text-gray-400">
                    Order ID:{" "}
                    <span className="text-gray-200 break-all">{order._id}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Placed on{" "}
                    <span className="text-gray-200">
                      {new Date(order.date).toLocaleString("en-IN")}
                    </span>
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-400">Payment</p>
                  <p
                    className={`font-semibold ${
                      order.payment ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {order.payment ? "Completed" : "Pending"}
                  </p>
                </div>
              </div>

              {/* ITEMS */}
              <div className="mt-6 space-y-4">
                {order.items.map((item, idx) => {
                  const itemKey = keyFor(order._id, item.productId);
                  const status = getItemStatus(order, item);
                  const statusIdx = stageIndex(status);
                  const animate = isAnimated(order._id, item.productId);

                  const loadingTrack =
                    actionLoading[`${order._id}-track`]?.track || false;
                  const loadingCancel = actionLoading[itemKey]?.cancel || false;

                  const imageSrc =
    Array.isArray(item.image) && item.image.length > 0
      ? item.image[0]
      : "https://via.placeholder.com/150?text=No+Image";


                  return (
                    <div
                      key={idx}
                      className="flex flex-col md:flex-row gap-4 bg-[#121212] p-4 rounded-lg border border-white/10"
                    >
                      <div className="flex-shrink-0">
                        <img
          src={imageSrc}
          alt={item.name}
          className="w-24 h-24 md:w-28 md:h-28 rounded-lg object-cover border border-gray-700"
          loading="lazy"
        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <p className="font-semibold text-lg">{item.name}</p>
                          <p className="text-sm text-gray-400 mt-1">
                            Brand:{" "}
                            <span className="text-gray-300">
                              {item.brandName || "—"}
                            </span>
                          </p>

                          <div className="flex gap-2 items-center mt-3">
                            <p className="text-green-400 font-bold text-lg">
                              {currency} {item.discountedPrice || item.price}
                            </p>
                            {item.actualPrice && (
                              <p className="text-gray-500 line-through">
                                {currency} {item.actualPrice}
                              </p>
                            )}
                          </div>

                          <div className="flex gap-4 mt-2 text-sm text-gray-300">
                            <p>Qty: {item.quantity}</p>
                            <p>Size: {item.size}</p>
                          </div>
                        </div>

                        {/* TIMELINE */}
                        <div className="mt-4">
                          {/* MOBILE VERTICAL */}
                          <div className="flex flex-col gap-3 md:hidden">
                            {TIMELINE_STAGES.map((stage, sIdx) => {
                              const done = sIdx <= statusIdx;
                              const animateHere = animate && sIdx === statusIdx;

                              return (
                                <div
                                  key={stage}
                                  className="flex items-center gap-3"
                                >
                                  <div className="flex flex-col items-center">
                                    <div
                                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                        done ? "bg-green-500" : "bg-gray-600"
                                      }`}
                                    >
                                      {done && (
                                        <FaCheckCircle className="text-white text-[12px]" />
                                      )}
                                    </div>

                                    {sIdx < TIMELINE_STAGES.length - 1 && (
                                      <div
                                        className={`w-[2px] h-6 mt-1 ${
                                          done ? "bg-green-500" : "bg-gray-700"
                                        }`}
                                      />
                                    )}
                                  </div>

                                  <div className="flex-1">
                                    <p
                                      className={`text-sm ${
                                        done
                                          ? "text-gray-200 font-semibold"
                                          : "text-gray-400"
                                      }`}
                                    >
                                      {stage}
                                    </p>

                                    {animateHere && (
                                      <div className="mt-1 w-full">
                                        <div className="h-1 bg-gray-700 rounded overflow-hidden">
                                          <div
                                            className="h-1 bg-green-500 animate-grow"
                                            style={{
                                              animationDuration: "900ms",
                                            }}
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* DESKTOP HORIZONTAL */}
                          <div className="hidden md:flex items-center justify-between gap-4">
                            {TIMELINE_STAGES.map((stage, sIdx) => {
                              const done = sIdx <= statusIdx;
                              const animateHere = animate && sIdx === statusIdx;

                              return (
                                <div
                                  key={stage}
                                  className="flex flex-col items-center flex-1"
                                >
                                  <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                      done ? "bg-green-500" : "bg-gray-600"
                                    }`}
                                  >
                                    {done && (
                                      <FaCheckCircle className="text-white text-[12px]" />
                                    )}
                                  </div>

                                  <p
                                    className={`text-sm mt-2 text-center ${
                                      done
                                        ? "text-gray-200 font-semibold"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    {stage}
                                  </p>

                                  {sIdx < TIMELINE_STAGES.length - 1 && (
                                    <div
                                      className={`h-[2px] w-full mt-2 ${
                                        done ? "bg-green-500" : "bg-gray-700"
                                      }`}
                                    />
                                  )}

                                  {animateHere && (
                                    <div className="mt-1 w-full">
                                      <div className="h-1 bg-gray-700 rounded overflow-hidden">
                                        <div
                                          className="h-1 bg-green-500 animate-grow"
                                          style={{
                                            animationDuration: "900ms",
                                          }}
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* ACTION BUTTONS */}
                      {/* ACTION BUTTONS */}
                      <div className="flex md:flex-col gap-3 justify-end w-full md:w-auto">
                        {/* TRACK BUTTON */}
                        <button
                          onClick={() => trackOrder(order._id)}
                          disabled={loadingTrack}
                          className="cursor-pointer flex-1 md:flex-none px-4 py-2 bg-white text-black rounded-md text-sm font-semibold hover:bg-gray-300 transition flex items-center justify-center gap-2"
                        >
                          {loadingTrack ? (
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-black rounded-full animate-spin" />
                          ) : (
                            <>
                              <FaTruck /> Track
                            </>
                          )}
                        </button>

                        {/* CANCEL BUTTON — ONLY IF ORDER PLACED */}
                        {status === "Order Placed" && (
                          <button
                            onClick={() =>
                              setCancelModal({
                                orderId: order._id,
                                productId: item.productId,
                              })
                            }
                            className="cursor-pointer flex-1 md:flex-none px-4 py-2 bg-red-600 text-white rounded-md text-sm font-semibold hover:bg-red-700 transition"
                          >
                            {loadingCancel ? "Cancelling…" : "Cancel"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* BOTTOM SUMMARY */}
              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm text-gray-400">
                  Items:{" "}
                  <span className="text-gray-200">{order.items.length}</span>
                </p>

                <div className="text-right">
                  <p className="text-sm text-gray-400">Total</p>
                  <p className="text-xl font-semibold text-blue-400">
                    {currency} {order.amount}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      {cancelModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1f1f1f] w-[90%] max-w-sm p-6 rounded-xl border border-red-500/50 shadow-xl">
            <h3 className="text-lg font-semibold text-white">Cancel Item?</h3>
            <p className="text-gray-300 mt-2 text-sm">
              Are you sure you want to cancel this item?
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setCancelModal(null)}
                className="cursor-pointer px-4 py-2 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-600"
              >
                No
              </button>

              <button
                onClick={() => {
                  cancelItem(cancelModal.orderId, cancelModal.productId);
                  setCancelModal(null);
                }}
                className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes grow {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-grow {
          animation-name: grow;
          animation-timing-function: ease-out;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
};

export default Orders;
