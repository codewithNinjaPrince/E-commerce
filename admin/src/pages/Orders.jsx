// import React from "react";
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import {backendUrl} from "../App";
// import { toast } from "react-toastify";
// import { assets } from "../assets/assets";

// const Orders = ({ token }) => {
//   const [orders, setOrders] = useState([]);

//   const fetchAllOrders = async () => {
//     if (!token) {
//       return null;
//     }
//     try {
//       const response = await axios.post(
//         backendUrl + "/api/order/list",
//         {},
//         { headers: { token } }
//       );
//       if (response.data.success) {
//         setOrders(response.data.orders.reverse());
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const statusHandler=async(event,orderId)=>{
//     try {
//       const response=await axios.post(backendUrl+'/api/order/status',{orderId,status:event.target.value},{headers:{token}})
//       if(response.data.success){
//         await fetchAllOrders()
//       }
//     } catch (error) {
//       console.log(error)
//       toast.error(response.data.message)
      
//     }
//   }

//   useEffect(() => {
//     fetchAllOrders();
//   }, [token]);

//   return (
//     <div>
//       <h3>Order page</h3>
//       <div>
//         {orders.map((order, index) => (
//           <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700' key={index}>
//             <img className="w-12" src={assets.parcel_icon} alt="Parcel Icon" />
//             <div>
//               <div>
//                 {order.items.map((item, index) => {
//                   if (index === order.items.length - 1) {
//                     return (
//                       <p className="py-0.5" key={index}>
//                         {item.name} x {item.quantity} <span>{item.size}</span>{" "}
//                       </p>
//                     );
//                   } else {
//                     return (
//                       <p className="py-0.5" key={index}>
//                         {item.name} x {item.quantity} <span>{item.size}</span>,{" "}
//                       </p>
//                     );
//                   }
//                 })}
//               </div>
//               <p className="mt-3 mb-2 font-medium">{order.address.firstName + " " + order.address.lastName}</p>
//               <div>
//                 <p>{order.address.street + ","}</p>
//                 <p>
//                   {order.address.city +
//                     ", " +
//                     order.address.state +
//                     ", " +
//                     order.address.country +
//                     ", " +
//                     order.address.pincode}
//                 </p>
//               </div>
//               <p>{order.address.phone}</p>
//             </div>
//             <div>
//               <p className="text-sm sm:text-[15px]">Items:{order.items.length}</p>
//               <p className="mt-3">Method:{order.PaymentMethod}</p>
//               <p>Payment:{order.payment? 'Done':'Pending'}</p>
//               <p>Date:{new Date(order.date).toDateString()}</p>
//             </div>
//             <p className="text-s sm:text-[15px]" >{order.currency}{order.amount}</p>
//             <select onChange={(event)=>statusHandler(event,order._id)} value={order.status} className="p-2 font-semibold">
//               <option value="Order Placed">Order Placed</option>
//               <option value="Packing">Packing</option>
//               <option value="Shipped">Shipped</option>
//               <option value="Out for Delivery">Out for delivey</option>
//               <option value="Delivered">Delivered</option>
//               <option value="Cancelled">Cancelled</option>
//             </select>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Orders;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);

  // ============================
  // Fetch Orders
  // ============================
  const fetchAllOrders = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }

    setLoading(false);
  };

  // ============================
  // Change Status
  // ============================
  const statusHandler = async (event, orderId) => {
    setStatusLoading(true);

    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: event.target.value },
        { headers: { token } }
      );

      if (response.data.success) {
        await fetchAllOrders();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }

    setStatusLoading(false);
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  // ============================
  // Status Colors
  // ============================
  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      case "Shipped":
        return "bg-blue-100 text-blue-700";
      case "Packing":
        return "bg-yellow-100 text-yellow-700";
      case "Out for Delivery":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const LoaderScreen = ({ text, sub }) => {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
        <div className="w-14 h-14 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>

        <p className="mt-6 text-lg font-semibold text-gray-800">{text}</p>
        <p className="text-sm text-gray-500">{sub}</p>
      </div>
    );
  };

  if (loading) {
    return (
      <LoaderScreen
        text="Fetching latest orders..."
        sub="Please wait while we prepare everything."
      />
    );
  }

  if (statusLoading) {
    return (
      <LoaderScreen
        text="Updating order status..."
        sub="Hold tight, almost done!"
      />
    );
  }

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        📦 Orders Management
      </h2>

      {orders.length === 0 && (
        <p className="text-gray-500 mt-10 text-center">No orders yet.</p>
      )}

      <div className="flex flex-col gap-6">
        {orders.map((order, index) => {
          const date = new Date(order.date);

          return (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-5 border border-gray-200 hover:shadow-lg transition"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={assets.parcel_icon}
                    className="w-10"
                    alt="Parcel icon"
                  />
                  <div>
                    <p className="font-semibold text-gray-700">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {date.toLocaleDateString()} • {date.toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 text-xs rounded-full font-semibold ${getStatusClass(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              {/* ITEMS LIST */}
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="py-1 text-sm flex justify-between border-b border-gray-100 last:border-none"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">
                      {item.name}
                    </span>
                    <span className="text-gray-500 text-xs">
                      Brand:{" "}
                      <span className="font-medium text-gray-700">
                        {item.brandName}
                      </span>
                    </span>
                    <span className="text-gray-500 text-xs">
                      Size: {item.size}
                    </span>
                  </div>

                  <span className="text-gray-700 font-medium">
                    x {item.quantity}
                  </span>
                </div>
              ))}

              {/* CUSTOMER INFO */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                <div>
                  <p className="font-semibold text-gray-700">Customer</p>
                  <p className="text-gray-600">
                    {order.address.firstName} {order.address.lastName}
                  </p>
                  <p className="text-gray-600">{order.address.phone}</p>
                </div>

                <div>
                  <p className="font-semibold text-gray-700">Address</p>
                  <p className="text-gray-600">{order.address.street}</p>
                  <p className="text-gray-600">
                    {order.address.city}, {order.address.state}
                  </p>
                  <p className="text-gray-600">
                    {order.address.country} - {order.address.pincode}
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-gray-700">Order Info</p>
                  <p className="text-gray-600">Items: {order.items.length}</p>
                  <p className="text-gray-600">Method: {order.PaymentMethod}</p>
                  <p className="text-gray-600">
                    Payment:{" "}
                    <span
                      className={`font-semibold ${
                        order.payment ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {order.payment ? "Done" : "Pending"}
                    </span>
                  </p>
                </div>
              </div>

              {/* FOOTER: AMOUNT + STATUS DROPDOWN */}
              <div className="flex justify-between items-center mt-3">
                <p className="text-lg font-semibold text-gray-800">
                  {order.currency}
                  {order.amount}
                </p>

                <select
                  onChange={(e) => statusHandler(e, order._id)}
                  value={order.status}
                  className="p-2 border rounded-md bg-white shadow-sm cursor-pointer"
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
