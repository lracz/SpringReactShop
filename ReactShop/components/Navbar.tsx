import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Navbar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? "text-primary font-bold" : "text-gray-600 hover:text-primary";

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary tracking-tight">ReactShop</Link>
            
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link to="/" className={isActive('/')}>Shop</Link>
              <Link to="/forum" className={isActive('/forum')}>Forum</Link>
              {isAdmin && (
                <Link to="/admin/dashboard" className={isActive('/admin/dashboard')}>Dashboard</Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700 hidden sm:block">Hi, {user.username}</span>
                <button 
                  onClick={logout} 
                  className="text-sm text-gray-500 hover:text-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-primary">Login</Link>
                <span className="text-gray-300">|</span>
                <Link to="/register" className="text-sm font-medium text-gray-700 hover:text-primary">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
