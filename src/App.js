// App.js
import React, { useState } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";

import Header from "./component/header/Header";
import Navbar from "./pages/Navbar";
import Footer from "./pages/Footer";

import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Product from "./pages/product/Product";
import CartBox from "./component/cartbox/CartBox";
import Cart from "./pages/cart/Cart";
import Payment from "./pages/cart/paymentpage/Payment";
import OrderDetail from "./pages/Order-Detail";
import NotFoundPage from "./component/404/NotFoundPage";
import WishList from "./pages/WishList";
import Compare from "./pages/Compare";
import Box from "./component/box/Box";

import "react-toastify/dist/ReactToastify.css";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ViewAllOrder from "./pages/View-All-Order";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import DynemicProductDetail from "./pages/product/DynemicProductDetail";
import ProductDetail from "./pages/product/ProductDetail";
import Home from "./pages/Home";
import Coupon from "./pages/Coupon";

// Admin Pages
import AdminDashboardMain from "./pages/admin/AdminDashboardMain";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";
import AdminActivityPage from "./pages/admin/AdminActivityPage";
import AdminLogin from './component/admin/AdminLogin';
import AdminSignup from './component/admin/AdminSignup';
import AdminProtectedRoute from './component/AdminProtectedRoute';
import AdminProfile from './component/admin/AdminProfile';
import AdminNotifications from './component/admin/AdminNotifications';

function PrivateRoute() {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login" />;
}

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartItems = useSelector((state) => state.cart.items);

  const handleOpenCart = () => setIsCartOpen(true);
  const handleCloseCart = () => setIsCartOpen(false);

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      <Header onCartClick={handleOpenCart} cartItemCount={cartItems.length} />
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        {/* <Route path="/product/:id" element={<DynemicProductDetail onCartOpen={handleOpenCart} onCartClick={handleOpenCart} />} /> */}
        <Route path="/product/:productId" element={<ProductDetail onCartOpen={handleOpenCart} onCartClick={handleOpenCart} />} />
        <Route path="/product" element={<Product onCartOpen={handleOpenCart} onCartClick={handleOpenCart} />} />
        <Route path="/" element={<Home />} />

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/AddProduct" element={<AddProduct />} />
          <Route path="/edit-product/:productId" element={<EditProduct />} />
          <Route path="/WishList" element={<WishList onCartOpen={handleOpenCart} />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/view-all-order" element={<ViewAllOrder />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/cart/payment" element={<Payment />} />
          <Route path="/order-detail" element={<OrderDetail />} />
          <Route path="/coupon" element={<Coupon />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-signup" element={<AdminSignup />} />
          
          {/* Admin Routes */}
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin-dashboard" element={<AdminDashboardMain />} />
            <Route path="/admin-products" element={<AdminProducts />} />
            <Route path="/admin-orders" element={<AdminOrders />} />
            <Route path="/admin-customers" element={<AdminCustomers />} />
            <Route path="/admin-analytics" element={<AdminAnalyticsPage />} />
            <Route path="/admin-activity" element={<AdminActivityPage />} />
            <Route path="/admin-settings" element={<AdminSettingsPage />} />
            <Route path="/admin-profile" element={<AdminProfile />} />
            <Route path="/admin-notifications" element={<AdminNotifications />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>


      <CartBox
        isOpen={isCartOpen}
        closeSidebar={handleCloseCart}
        cartItems={cartItems}
      />

      <div className="hidden md:flex">
        <Box onCartOpen={handleOpenCart} />
      </div>

      <div className="mt-20">
        <Footer />
      </div>
    </>
  );
}
