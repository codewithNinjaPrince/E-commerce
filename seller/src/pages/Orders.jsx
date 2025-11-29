// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { FaBoxOpen } from "react-icons/fa";

// const Orders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState(null); // orderId-productId while updating

//   const backendUrl = import.meta.env.VITE_BACKEND_URL;
//   const token = localStorage.getItem("merchantToken");

//   // Fetch merchant orders
//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `${backendUrl}/api/merchant/dashboard/orders`,
//         { headers: { token } }
//       );

//       if (res.data.success) setOrders(res.data.orders);
//       else toast.error("Unable to load orders");
//     } catch (err) {
//       toast.error("Something went wrong");
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   // Update item status
//   const updateStatus = async (e, orderId, productId) => {
//     const newStatus = e.target.value;
//     setUpdating(`${orderId}-${productId}`);

//     try {
//       const res = await axios.post(
//         `${backendUrl}/api/merchant/dashboard/update-merchant-item-status`,
//         { orderId, productId, status: newStatus },
//         { headers: { token } }
//       );

//       if (res.data.success) {
//         setOrders((prev) =>
//           prev.map((o) => (o._id === orderId ? res.data.order : o))
//         );
//         toast.success("Status updated");
//       } else {
//         toast.error(res.data.message || "Failed to update");
//       }
//     } catch (err) {
//       toast.error("Unable to update");
//     }

//     setUpdating(null);
//   };

//   if (loading)
//     return (
//       <div className="text-center text-white mt-20 text-lg animate-pulse">
//         Loading Orders…
//       </div>
//     );

//   return (
//     <div className="w-full max-w-[1400px] mx-auto p-4 sm:p-6 text-white">
//       {/* HEADER */}
//       <h2 className="text-3xl font-bold flex items-center gap-3 mb-6">
//         <FaBoxOpen className="text-blue-400" /> Orders Management
//       </h2>

//       {/* EMPTY STATE */}
//       {orders.length === 0 && (
//         <div className="bg-[#101010] border border-[#222] py-16 rounded-xl text-center mt-10">
//           <p className="text-xl font-semibold">No Orders Found</p>
//         </div>
//       )}

//       {/* ORDER LIST */}
//       <div className="flex flex-col gap-8 mt-6">
//         {orders.map((order) => (
//           <div
//             key={order._id}
//             className="bg-[#131313] border border-[#222] rounded-xl p-6 shadow-lg hover:border-blue-500/30 transition-all duration-200"
//           >
//             {/* ORDER HEADER */}
//             <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
//               <div>
//                 <p className="font-semibold text-lg">
//                   Order #{order._id.slice(-6).toUpperCase()}
//                 </p>
//                 <p className="text-sm text-gray-400">
//                   {new Date(order.date).toLocaleString()}
//                 </p>
//               </div>

//               <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-800/50 text-gray-300">
//                 {order.status}
//               </span>
//             </div>

//             {/* ITEMS */}
//             <div className="divide-y divide-[#222]">
//               {order.items.map((item, index) => {
//                 const key = `${order._id}-${item.productId}`;
//                 const isUpdating = updating === key;

//                 return (
//                   <div
//                     key={index}
//                     className="py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
//                   >
//                     {/* LEFT: IMAGE + INFO */}
//                     <div className="flex items-center gap-4">
//                       <img
//                         src={item.image?.[0] || "/placeholder.png"}
//                         alt={item.name}
//                         className="w-16 h-16 object-cover rounded-lg border border-[#333]"
//                       />

//                       <div>
//                         <p className="font-semibold">{item.name}</p>
//                         <p className="text-gray-400 text-xs">
//                           Brand: {item.brandName}
//                         </p>
//                         <p className="text-gray-400 text-xs">
//                           Size: {item.size}
//                         </p>
//                         <p className="text-gray-200 text-xs mt-1">
//                           Qty: {item.quantity}
//                         </p>
//                       </div>
//                     </div>

//                     {/* RIGHT: STATUS DROPDOWN */}
//                     <select
//                       value={item.itemStatus || "Order Placed"}
//                       disabled={isUpdating}
//                       onChange={(e) =>
//                         updateStatus(e, order._id, item.productId)
//                       }
//                       className={`bg-[#0f0f0f] border border-[#333] text-white p-2 rounded-lg w-full sm:w-auto ${
//                         isUpdating ? "opacity-50 cursor-not-allowed" : ""
//                       }`}
//                     >
//                       <option value="Order Placed">Order Placed</option>
//                       <option value="Packing">Packing</option>
//                       <option value="Shipped">Shipped</option>
//                       <option value="Out for Delivery">Out for Delivery</option>
//                       <option value="Delivered">Delivered</option>
//                       <option value="Cancelled">Cancelled</option>
//                     </select>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* FOOTER */}
//             <div className="flex justify-between items-center mt-6">
//               <p className="text-xl font-semibold text-blue-400">
//                 ₹{order.amount}
//               </p>
//               <p className="text-sm text-gray-400">
//                 Payment:{" "}
//                 <span
//                   className={`font-semibold ${
//                     order.payment ? "text-green-400" : "text-red-400"
//                   }`}
//                 >
//                   {order.payment ? "Completed" : "Pending"}
//                 </span>
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Orders;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { FaBoxOpen } from "react-icons/fa";

// const MerchantOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState(null); // orderId-productId while updating

//   const backendUrl = import.meta.env.VITE_BACKEND_URL;
//   const token = localStorage.getItem("merchantToken");

//   // Fetch merchant orders
//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `${backendUrl}/api/merchant/dashboard/orders`,
//         { headers: { token } }
//       );

//       if (res.data.success) setOrders(res.data.orders);
//       else toast.error("Unable to load orders");
//     } catch (err) {
//       toast.error("Something went wrong");
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   // Update item status
//   const updateStatus = async (e, orderId, productId) => {
//     const newStatus = e.target.value;
//     setUpdating(`${orderId}-${productId}`);

//     try {
//       const res = await axios.post(
//         `${backendUrl}/api/merchant/dashboard/update-merchant-item-status`,
//         { orderId, productId, status: newStatus },
//         { headers: { token } }
//       );

//       if (res.data.success) {
//         setOrders((prev) =>
//           prev.map((o) => (o._id === orderId ? res.data.order : o))
//         );
//         toast.success("Status updated");
//       } else {
//         toast.error(res.data.message || "Failed to update");
//       }
//     } catch (err) {
//       toast.error("Unable to update");
//     }

//     setUpdating(null);
//   };

//   if (loading)
//     return (
//       <div className="text-center text-white mt-20 text-lg animate-pulse">
//         Loading Orders…
//       </div>
//     );

//   return (
//     <div className="w-full max-w-[1400px] mx-auto p-4 sm:p-6 text-white">
//       {/* HEADER */}
//       <h2 className="text-3xl font-bold flex items-center gap-3 mb-6">
//         <FaBoxOpen className="text-blue-400" /> Orders Management
//       </h2>

//       {/* EMPTY STATE */}
//       {orders.length === 0 && (
//         <div className="bg-[#101010] border border-[#222] py-16 rounded-xl text-center mt-10">
//           <p className="text-xl font-semibold">No Orders Found</p>
//         </div>
//       )}

//       {/* ORDER LIST */}
//       <div className="flex flex-col gap-8 mt-6">
//         {orders.map((order) => (
//           <div
//             key={order._id}
//             className="bg-[#131313] border border-[#222] rounded-xl p-6 shadow-lg hover:border-blue-500/30 transition-all duration-200"
//           >
//             {/* ORDER HEADER */}
//             <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
//               <div>
//                 <p className="font-semibold text-lg">
//                   Order #{order._id.slice(-6).toUpperCase()}
//                 </p>
//                 <p className="text-sm text-gray-400">
//                   {new Date(order.date).toLocaleString()}
//                 </p>
//               </div>

//               <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-800/50 text-gray-300">
//                 {order.status}
//               </span>
//             </div>

//             {/* CUSTOMER NAME */}
//             <div className="mt-2 mb-4 bg-[#0f0f0f] p-3 rounded-lg border border-[#222]">
//               <p className="text-gray-400 text-xs">Customer</p>
//               <p className="text-white font-semibold text-sm mt-1">
//                 {order.address?.firstName} {order.address?.lastName}
//               </p>
//               <p className="text-gray-400 text-xs mt-1">
//                 {order.address?.address}
//               </p>
//             </div>

//             {/* ITEMS */}
//             <div className="divide-y divide-[#222]">
//               {order.items.map((item, index) => {
//                 const key = `${order._id}-${item.productId}`;
//                 const isUpdating = updating === key;

//                 return (
//                   <div
//                     key={index}
//                     className="py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
//                   >
//                     {/* LEFT: IMAGE + INFO */}
//                     <div className="flex items-center gap-4">
//                       <img
//                         src={item.image?.[0] || "/placeholder.png"}
//                         alt={item.name}
//                         className="w-16 h-16 object-cover rounded-lg border border-[#333]"
//                       />

//                       <div>
//                         <p className="font-semibold">{item.name}</p>
//                         <p className="text-gray-400 text-xs">
//                           Brand: {item.brandName}
//                         </p>
//                         <p className="text-gray-400 text-xs">
//                           Size: {item.size}
//                         </p>
//                         <p className="text-gray-200 text-xs mt-1">
//                           Qty: {item.quantity}
//                         </p>
//                       </div>
//                     </div>

//                     {/* RIGHT: STATUS DROPDOWN */}
//                     <select
//                       value={item.itemStatus || "Order Placed"}
//                       disabled={isUpdating}
//                       onChange={(e) =>
//                         updateStatus(e, order._id, item.productId)
//                       }
//                       className={`bg-[#0f0f0f] border border-[#333] text-white p-2 rounded-lg w-full sm:w-auto ${
//                         isUpdating ? "opacity-50 cursor-not-allowed" : ""
//                       }`}
//                     >
//                       <option value="Order Placed">Order Placed</option>
//                       <option value="Packing">Packing</option>
//                       <option value="Shipped">Shipped</option>
//                       <option value="Out for Delivery">Out for Delivery</option>
//                       <option value="Delivered">Delivered</option>
//                       <option value="Cancelled">Cancelled</option>
//                     </select>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* FOOTER */}
//             <div className="flex justify-between items-center mt-6">
//               <p className="text-xl font-semibold text-blue-400">
//                 ₹{order.amount}
//               </p>
//               <p className="text-sm text-gray-400">
//                 Payment:{" "}
//                 <span
//                   className={`font-semibold ${
//                     order.payment ? "text-green-400" : "text-red-400"
//                   }`}
//                 >
//                   {order.payment ? "Completed" : "Pending"}
//                 </span>
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MerchantOrders;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaBoxOpen } from "react-icons/fa";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("merchantToken");

  // Fetch merchant orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${backendUrl}/api/merchant/dashboard/orders`,
        { headers: { token } }
      );

      if (res.data.success) setOrders(res.data.orders);
      else toast.error("Unable to load orders");
    } catch (err) {
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update item status
  const updateStatus = async (e, orderId, productId) => {
    const newStatus = e.target.value;
    setUpdating(`${orderId}-${productId}`);

    try {
      const res = await axios.post(
        `${backendUrl}/api/merchant/dashboard/update-merchant-item-status`,
        { orderId, productId, status: newStatus },
        { headers: { token } }
      );

      if (res.data.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? res.data.order : o))
        );
        toast.success("Status updated");
      } else {
        toast.error(res.data.message || "Failed to update");
      }
    } catch (err) {
      toast.error("Unable to update");
    }

    setUpdating(null);
  };

  if (loading)
    return (
      <div className="text-center text-white mt-20 text-lg animate-pulse">
        Loading Orders…
      </div>
    );

  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 sm:p-6 text-white">
      {/* HEADER */}
      <h2 className="text-3xl font-bold flex items-center gap-3 mb-6">
        <FaBoxOpen className="text-blue-400" /> Orders Management
      </h2>

      {/* EMPTY STATE */}
      {orders.length === 0 && (
        <div className="bg-[#101010] border border-[#222] py-16 rounded-xl text-center mt-10">
          <p className="text-xl font-semibold">No Orders Found</p>
        </div>
      )}

      {/* ORDER LIST */}
      <div className="flex flex-col gap-8 mt-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-[#131313] border border-[#222] rounded-xl p-6 shadow-lg hover:border-blue-500/30 transition-all duration-200"
          >
            {/* ORDER HEADER */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
              <div>
                <p className="font-semibold text-lg">
                  Order #{order._id.slice(-6).toUpperCase()}
                </p>
                <p className="text-sm text-gray-400">
                  {new Date(order.date).toLocaleString()}
                </p>
              </div>

              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-800/50 text-gray-300">
                {order.status}
              </span>
            </div>

            {/* CUSTOMER SECTION - WITH ADDRESS */}
            <div className="mt-2 mb-4 bg-[#0f0f0f] p-4 rounded-lg border border-[#222]">
              <p className="text-gray-400 text-xs">Customer</p>
              <p className="text-white font-semibold text-sm mt-1">
                {order.address?.firstName} {order.address?.lastName}
              </p>

              <p className="text-gray-400 text-xs mt-2">
                <span className="font-medium text-gray-300">Address:</span>
                <br />
                {order.address?.street},
                <br />
                {order.address?.city}, {order.address?.state}
                <br />
                {order.address?.country} – {order.address?.pincode}
              </p>
            </div>

            {/* ITEMS */}
            <div className="divide-y divide-[#222]">
              {order.items.map((item) => {
                const key = `${order._id}-${item.productId}`;
                const isUpdating = updating === key;

                return (
                  <div
                    key={item.productId}
                    className="py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
                  >
                    {/* IMAGE + INFO */}
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image?.[0]}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg border border-[#333]"
                      />

                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-gray-400 text-xs">
                          Brand: {item.brandName}
                        </p>
                        <p className="text-gray-400 text-xs">Size: {item.size}</p>
                        <p className="text-gray-200 text-xs mt-1">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>

                    {/* STATUS DROPDOWN */}
                    <select
                      value={item.itemStatus || "Order Placed"}
                      disabled={isUpdating}
                      onChange={(e) =>
                        updateStatus(e, order._id, item.productId)
                      }
                      className={`bg-[#0f0f0f] border border-[#333] text-white p-2 rounded-lg w-full sm:w-auto ${
                        isUpdating ? "opacity-50" : ""
                      }`}
                    >
                      <option value="Order Placed">Order Placed</option>
                      <option value="Packing">Packing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                );
              })}
            </div>

            {/* FOOTER */}
            <div className="flex justify-between items-center mt-6">
              <p className="text-xl font-semibold text-blue-400">
                ₹{order.amount}
              </p>
              <p className="text-sm text-gray-400">
                Payment:{" "}
                <span
                  className={`font-semibold ${
                    order.payment ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {order.payment ? "Completed" : "Pending"}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;

