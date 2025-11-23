import React, { useState, useEffect, useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import PreLoader from './components/PreLoader';
import Home from './pages/Home'
import Collections from './pages/Collections'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import PlaceOrder from './pages/PlaceOrder'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import Footer from './components/footer'
import Searchbar from './components/Searchbar'
import ScrollToTop from './components/ScrollToTop';
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundReturnPolicy from "./pages/RefundReturnPolicy";
import ShippingDelivery from "./pages/ShippingDelivery";
import TermsConditions from "./pages/TermsConditions";
import {ToastContainer,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify'
import { ShopContext } from "./context/ShopContext";



const App = () => {

  // 🔥 real loading control
  const { products } = useContext(ShopContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // as soon as products arrive from backend, stop loader
    if (products && products.length > 0) {
      setLoading(false);
    }
  }, [products]);

  return (
    <div className='pt-[80px] px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>

      {/* Pass loading state */}
      <PreLoader isLoading={loading} />

      <ToastContainer/>
      <Navbar/>
      <Searchbar/>

      {/* Show app only after loading */}
      {!loading && (
        <>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/collections" element={<Collections/>}/>
            <Route path="/about" element={<About/>}/>
            <Route path="/contact" element={<Contact/>}/>
            <Route path="/product/:productId" element={<Product/>}/>
            <Route path="/cart" element={<Cart/>}/>
            <Route path="/orders" element={<Orders/>}/>
            <Route path="/placeorder" element={<PlaceOrder/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/verify" element={<Verify/>}/>
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/refund-return" element={<RefundReturnPolicy />} />
            <Route path="/shipping-delivery" element={<ShippingDelivery />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
          </Routes>

          <Footer/>
          <ScrollToTop />
        </>
      )}

    </div>
  );
}

export default App;
