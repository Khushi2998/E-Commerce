import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import ProductDetails from "./Pages/ProductDetails";
import AdminLayout from "./admin/AdminLayout";
import AdminProducts from "./admin/AdminProducts";
import AdminCategories from "./admin/AdminCategories";
import AdminFeedback from "./admin/AdminFeedback";
import AdminFAQs from "./admin/AdminFAQs";
import ProtectedRoute from "./auth/ProtectedRoute";
import RegisterUser from "./Pages/Register";
import LoginUser from "./auth/LoginUser";
import LoginAdmin from "./auth/LoginAdmin";
import Cart from "./Pages/Cart";
import CheckoutPage from "./Pages/Payment";
import Footer from "./Pages/Footer";


export default function App() {
  return (
    <BrowserRouter>
   
      <Navbar />
      
     
      <Routes>
      
        <Route path="/" element={<Home/>} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/register" element={<RegisterUser />} />
        <Route path="/login" element={<LoginUser />} />
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>}/>
        <Route path="" element={
          <ProtectedRoute>
            <CheckoutPage>
                {/* <ShippingAddress/> */}
                {/* <OrderSummary cartItems={cartItems} amount={amount} /> */}
                {/* <PaymentButton orderId={orderId} amount={amount} selectedAddress={selectedAddress} /> */}
              </CheckoutPage>
          </ProtectedRoute>
        }/>



        <Route path="/admin/*" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute> }/>
       <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          
          <Route path="feedback" element={<AdminFeedback />} />
          <Route path="faqs" element={<AdminFAQs />} />
          
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}
