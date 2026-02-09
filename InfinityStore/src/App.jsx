import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar";
import Footer from "./Pages/Footer";

import Home from "./Pages/Home";
import ProductDetails from "./Pages/ProductDetails";
import Cart from "./Pages/Cart";

import Search from "./components/Search";
import RegisterUser from "./Pages/Register";
import Login from "./auth/Login";
import Invoice from "./Pages/Invoice";
import Profile from "./Pages/Profiles";
import Orders from "./Pages/Orders";
import OrderDetails from "./Pages/OrderDetails";
import AdminOrders from "./admin/AdminOrders";
import ProtectedRoute from "./auth/ProtectedRoute";

import Contact from "./Pages/Contact";
import FAQs  from "./Pages/FAQs";
import Shipping from "./Pages/Shipping";
import ReturnsPolicy from "./Pages/ReturnsPolicy";
import PrivacyPolicy from "./Pages/PrivacyPolicy";

import CheckoutAddress from "./components/CheckoutAddress";
import OrderSuccess from "./Pages/OrderSuccess";

// Admin
import AdminLayout from "./admin/AdminLayout";
import AdminProducts from "./admin/AdminProducts";
import AdminCategories from "./admin/AdminCategories";
import AdminFeedback from "./admin/AdminFeedback";
import AdminFAQs from "./admin/AdminFAQs";
import Wishlist from "./Pages/Wishlist";


export default function App() {
  return (
   <>
      <Navbar />
      <div className="app-content">
      <Routes>
        {/*PUBLIC*/}
        <Route path="/" element={<Home />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/register" element={<RegisterUser />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/CheckoutAddress" element={<CheckoutAddress />} />
        <Route path="/order-success/:id" element={<OrderSuccess />} /> 
        <Route path="/invoice/:id" element={<Invoice/>} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        <Route path="/wishlist" element={<Wishlist/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/faqs" element={<FAQs/>}/>
        <Route path="/shipping" element={<Shipping/>}/>
        <Route path="/returns" element={<ReturnsPolicy/>}/>
        <Route path="/privacy" element={<PrivacyPolicy/>}/>
        {/*CUSTOMER*/}
        <Route path="/cart" element={<ProtectedRoute role="Customer">
              <Cart />
            </ProtectedRoute>}
        />
        <Route path="/search" element={<Search />} />
        <Route path="/checkout" element={
            <ProtectedRoute role="Customer">
              <CheckoutAddress />
            </ProtectedRoute>}
        />

        {/*ADMIN*/}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="Admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="orders"element={<AdminOrders />}/>
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="feedback" element={<AdminFeedback />} />
          <Route path="faqs" element={<AdminFAQs />} />
        </Route>
      </Routes>
     </div>
      <Footer />
</>
  );
}
