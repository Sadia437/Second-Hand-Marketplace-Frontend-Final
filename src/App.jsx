import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Dashboard from './pages/Dashboard';
import MyBookings from './pages/MyBookings'; 
import Payment from './pages/Payment';
import AdminDashboard from './components/Dashboard/AdminDashboard'; 
import Blog from './pages/Blog';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/Route/PrivateRoute';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}>
            <Route path="my-bookings" element={<MyBookings />} />
            <Route path="payment/:id" element={<Payment />} />
            <Route path="admin" element={<AdminDashboard />} /> 
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}

export default App;