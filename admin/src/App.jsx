// import React, { useState, useEffect } from 'react';
// import Navbar from './components/Navbar';
// import Sidebar from './components/Sidebar';
// import { Routes, Route } from 'react-router-dom';
// import Add from './pages/Add';
// import List from './pages/List';
// import Orders from './pages/Orders';
// import Login from './components/Login';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// // Export backendUrl outside the component
// export const backendUrl = import.meta.env.VITE_BACKEND_URL;
// export const currency='₹'

//   const App = () => {
//   const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');

//   useEffect(() => {
//     localStorage.setItem('token', token);
//   }, [token]);

//   return (
//     <div className='bg-gray-50 min-h-screen'>
//       <ToastContainer />
//       {token === ""
//        ? 
//         <Login setToken={setToken} />
//        : 
//         <>
//           <Navbar setToken={setToken} />
//           <hr />
//           <div className='flex w-full'>
//             <Sidebar />
//             <div className='w-[70%] mx-[max(5vw,25px)] my-8 text-gray-600 text-base'>
//               <Routes>
//                 <Route path="/" element={<Add token ={token} />} />
//                 <Route path='/add' element={<Add token={token} />} />
//                 <Route path='/list' element={<List token={token} />} />
//                 <Route path='/order' element={<Orders token={token} />} />
//               </Routes>
//             </div>
//           </div>
//         </>
//       }
//     </div>
//   );
// };

// export default App;
//This code is also fine at 8:12:35

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Add from './pages/Add';
import List from './pages/List';
import Orders from './pages/Orders';
import Login from './components/Login';
import AddSeller from './pages/AddSeller';
import SellersPage from './pages/Sellers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Export backendUrl outside the component
export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency='₹'

  const App = () => {
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");
  const [role, setRole] = useState(localStorage.getItem("adminRole") || "");

  useEffect(() => {
  if (token) localStorage.setItem("adminToken", token);
  if (role) localStorage.setItem("adminRole", role);
  }, [token, role]);


  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      {token === ""
       ? 
        <Login setToken={setToken} setRole={setRole} />
       : 
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className='flex w-full'>
            <Sidebar role={role} />
            <div className='w-[70%] mx-[max(5vw,25px)] my-8 text-gray-600 text-base'>
              <Routes>
                <Route path="/" element={<Add token ={token} />} />
                <Route path='/add' element={<Add token={token} />} />
                <Route path='/list' element={<List token={token} />} />
                <Route path='/order' element={<Orders token={token} />} />
                <Route path="/add-seller" element={<AddSeller />} />
                <Route path="/sellers" element={<SellersPage />} />
              </Routes>
            </div>
          </div>
        </>
      }
    </div>
  );
};

export default App;
