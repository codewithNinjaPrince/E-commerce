// import React, { useContext, useState, useEffect } from "react";
// import Title from "../components/Title";
// import { ShopContext } from "../context/ShopContext";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import { FiBox } from "react-icons/fi"; // Open box icon

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
//             item["status"] = order.status;
//             item["paymentMethod"] = order.paymentMethod;
//             item["date"] = order.date;
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
//     <div className="border-t pt-16 min-h-[70vh]">
//       <div className="text-2xl mb-6 text-white">
//         <Title text1={"My"} text2={"Orders"} />
//       </div>

//       {/* ✅ Loader */}
//       {loading && (
//         <div className="flex flex-col items-center justify-center py-20">
//           <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
//           <p className="mt-4 text-white text-sm">Loading your orders...</p>
//         </div>
//       )}

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

//       {/* ✅ Orders List */}
//       {!loading && orderData.length > 0 && (
//         <div>
//           {orderData.map((item, index) => (
//             <div
//               key={index}
//               className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
//             >
//               {/* Left Side */}
//               <div className="flex items-start gap-6 text-sm">
//                 <img
//                   className="w-16 sm:w-20"
//                   src={item.image[0]}
//                   alt={item.name}
//                 />
//                 <div>
//                   <p className="sm:text-base font-medium">{item.name}</p>

//                   <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
//                     <p className="text-lg">{currency}{item.price}</p>
//                     <p>Qty: {item.quantity}</p>
//                     <p>Size: {item.size}</p>
//                   </div>

//                   <p className="mt-2">
//                     Date:{" "}
//                     <span className="text-gray-400">
//                       {new Date(item.date).toDateString()}
//                     </span>
//                   </p>

//                   <p className="mt-2 text-sm">
//                     Payment:{" "}
//                     <span className="text-gray-400">
//                       {item.paymentMethod}
//                     </span>
//                   </p>
//                 </div>
//               </div>

//               {/* Right Side */}
//               <div className="md:w-1/2 flex justify-between items-center">
// //                 <div className="flex items-center gap-2">
// //                   <span className="w-2 h-2 rounded-full bg-green-500"></span>
// //                   <p className="text-sm md:text-base">{item.status}</p>
// //                 </div>

// //                 <button
// //                   onClick={loadOrderData}
// //                   className="cursor-pointer border px-4 py-2 text-sm font-medium rounded-sm hover:bg-gray-100"
// //                 >
// //                   Track Order
// //                 </button>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default Orders;

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

import React, { useContext, useState, useEffect } from "react";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiBox } from "react-icons/fi";

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackingId, setTrackingId] = useState(null); // ⭐ Track loading for specific order

  const loadOrderData = async () => {
    try {
      if (!token) return;

      setLoading(true);

      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        let allOrdersItem = [];

        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            item.orderId = order._id;
            item.status = order.status;
            item.paymentMethod = order.paymentMethod;
            item.date = order.date;
            allOrdersItem.push(item);
          });
        });

        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  // ⭐ TRACK ORDER HANDLER
  const handleTrackOrder = (id) => {
    setTrackingId(id);

    setTimeout(() => {
      setTrackingId(null);
    }, 2000);
  };

  return (
    <div className="border-t pt-16 min-h-[70vh] text-white cursor-pointer">
      <div className="text-2xl mb-6">
        <Title text1="Your" text2="Orders" />
      </div>

      {/* ====================== LOADER ====================== */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-gray-500 border-t-white rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-300 text-sm">Fetching your orders…</p>
        </div>
      )}

      {/* ====================== EMPTY STATE ====================== */}
      {!loading && orderData.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <FiBox size={90} className="text-gray-400 mb-4" />

          <h1 className="text-xl font-semibold mb-2">No Orders Yet</h1>
          <p className="text-gray-500 mb-6">
            Start exploring our collection now!
          </p>

          <Link
            to="/collections"
            className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Browse Products →
          </Link>
        </div>
      )}

      {/* ====================== ORDERS LIST ====================== */}
      {!loading && orderData.length > 0 && (
        <div className="space-y-6">
          {orderData.map((item, index) => {
            const discountPercent = item.actualPrice
              ? Math.round(
                  ((item.actualPrice - item.discountedPrice) /
                    item.actualPrice) *
                    100
                )
              : 0;

            return (
              <div
                key={index}
                className="bg-[#1c1c1c] border border-white/10 p-5 rounded-xl shadow-md hover:border-white/20 transition cursor-pointer"
              >
                {/* TOP: Order ID + Date */}
                <div className="flex justify-between flex-wrap gap-2">
                  <p className="text-sm text-gray-400">
                    Order ID:{" "}
                    <span className="text-gray-200">{item.orderId}</span>
                  </p>

                  <p className="text-sm text-gray-400">
                    Placed on:{" "}
                    <span className="text-gray-200">
                      {new Date(item.date).toDateString()}
                    </span>
                  </p>
                </div>

                {/* MAIN ROW */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mt-6">
                  {/* IMAGE */}
                  <img
                    src={item.image[0]}
                    alt={item.name}
                    className="w-24 md:w-28 rounded-lg object-cover border border-gray-700"
                  />

                  {/* PRODUCT INFO */}
                  <div className="flex-1">
                    <p className="text-lg font-semibold">{item.name}</p>

                    <p className="text-sm text-gray-400 mt-1">
                      Brand: <span className="text-gray-300">{item.brandName}</span>
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                      <p className="text-green-400 font-bold">
                        {currency} {item.discountedPrice}
                      </p>

                      {item.actualPrice && (
                        <p className="text-gray-500 line-through">
                          {currency} {item.actualPrice}
                        </p>
                      )}

                      <span className="text-red-400 font-medium text-sm">
                        {discountPercent}% OFF
                      </span>
                    </div>

                    <div className="flex gap-4 mt-2 text-sm text-gray-300">
                      <p>Qty: {item.quantity}</p>
                      <p>Size: {item.size}</p>
                    </div>

                    <p className="text-sm text-gray-400 mt-1">
                      Payment:{" "}
                      <span className="text-gray-200">{item.paymentMethod}</span>
                    </p>
                  </div>

                  {/* STATUS + TRACK */}
                  <div className="flex flex-col items-end gap-3 md:w-1/4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-3 h-3 rounded-full ${
                          item.status === "Delivered"
                            ? "bg-green-400"
                            : item.status === "Shipped"
                            ? "bg-blue-400"
                            : "bg-yellow-400"
                        }`}
                      ></span>

                      <p className="text-sm text-gray-300">{item.status}</p>
                    </div>

                    {/* TRACK BUTTON */}
                    <button
                      onClick={() => handleTrackOrder(item.orderId)}
                      disabled={trackingId === item.orderId}
                      className="bg-white text-black px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-300 transition cursor-pointer flex items-center gap-2"
                    >
                      {trackingId === item.orderId ? (
                        <>
                          <div className="w-4 h-4 border-2 border-gray-400 border-t-black rounded-full animate-spin"></div>
                          Tracking…
                        </>
                      ) : (
                        "Track Order"
                      )}
                    </button>

                    {trackingId === item.orderId && (
                      <p className="text-xs mt-1 text-gray-400 animate-pulse">
                        Tracking your order… hold tight 🚚😎
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;



