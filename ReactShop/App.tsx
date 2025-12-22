import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Shop } from './pages/Shop';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Cart } from './pages/Cart';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { Forum } from './pages/Forum';

const MainLayout: React.FC = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Admin Login Route (No Navbar) */}
              <Route path="/admin" element={<AdminLogin />} />
              
              {/* Main App Routes (With Navbar) */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Shop />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/forum" element={<Forum />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Route>

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;