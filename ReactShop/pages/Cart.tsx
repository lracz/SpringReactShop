import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ApiService, OrderPayload } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, clearCart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const PLACEHOLDER_IMAGE = "https://placehold.co/600x400?text=No+Image";

  const [shipping, setShipping] = useState({
    fullName: '',
    address: '',
    city: '',
    zip: '',
    country: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShipping(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setIsProcessing(true);
    
    try {
      const orderPayload: OrderPayload = {
        userId: user.id,
        items: cart,
        total: cartTotal,
        shipping,
        paymentMethod: 'card' 
      };

      const response = await ApiService.createOrder(orderPayload);
      
      if (response.success) {
        setSuccess(true);
        clearCart();
      }
    } catch (error) {
      console.error("Order failed", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Order Confirmed!</h2>
          <p className="text-gray-600 mb-6">Thank you for your purchase. We have received your order.</p>
          <button 
            onClick={() => { setSuccess(false); navigate('/'); }}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <svg className="h-24 w-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
        <Link to="/" className="text-primary font-semibold hover:text-blue-700">Start Shopping &rarr;</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      
      <div className="lg:grid lg:grid-cols-2 lg:gap-12">
        {/* Left Column: Order Summary */}
        <div className="mb-10 lg:mb-0">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">Order Summary</h2>
            </div>
            <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-2">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img 
                      src={item.imageUrl || PLACEHOLDER_IMAGE} 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = PLACEHOLDER_IMAGE;
                      }}
                      alt={item.name} 
                      className="h-full w-full object-cover object-center" 
                    />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>{item.name}</h3>
                        <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex-1 flex items-end justify-between text-sm">
                      <p className="text-gray-500">Qty {item.quantity}</p>
                      <button 
                        type="button" 
                        onClick={() => removeFromCart(item.id)}
                        className="font-medium text-red-600 hover:text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                <p>Subtotal</p>
                <p>${cartTotal.toFixed(2)}</p>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Form */}
        <div>
           {user ? (
             <form onSubmit={handleCheckout} className="bg-white rounded-xl shadow-lg p-6 lg:p-8">
               <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Information</h2>
               <div className="space-y-6">
                 <div>
                   <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full name</label>
                   <input
                     type="text"
                     id="fullName"
                     name="fullName"
                     required
                     value={shipping.fullName}
                     onChange={handleInputChange}
                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                   />
                 </div>
                 
                 <div>
                   <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                   <input
                     type="text"
                     id="address"
                     name="address"
                     required
                     value={shipping.address}
                     onChange={handleInputChange}
                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                   />
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                   <div>
                     <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                     <input
                       type="text"
                       id="city"
                       name="city"
                       required
                       value={shipping.city}
                       onChange={handleInputChange}
                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                     />
                   </div>
                   <div>
                     <label htmlFor="zip" className="block text-sm font-medium text-gray-700">Postal code</label>
                     <input
                       type="text"
                       id="zip"
                       name="zip"
                       required
                       value={shipping.zip}
                       onChange={handleInputChange}
                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                     />
                   </div>
                 </div>

                 <div>
                   <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                   <select
                     id="country"
                     name="country"
                     required
                     value={shipping.country}
                     onChange={(e: any) => handleInputChange(e)}
                     className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                   >
                     <option value="">Select a country</option>
                     <option value="US">United States</option>
                     <option value="CA">Canada</option>
                     <option value="UK">United Kingdom</option>
                     <option value="EU">Europe</option>
                   </select>
                 </div>

                 {/* Mock Payment Section */}
                 <div className="pt-6 border-t border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Details</h2>
                    <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-4">
                        <p className="text-sm text-blue-700">For this demo, no real payment processing is required.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Card Number (Mock)</label>
                        <input
                            type="text"
                            placeholder="0000 0000 0000 0000"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        />
                    </div>
                 </div>

                 <button
                   type="submit"
                   disabled={isProcessing}
                   className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
                 >
                   {isProcessing ? (
                       <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                       </>
                   ) : `Pay $${cartTotal.toFixed(2)}`}
                 </button>
               </div>
             </form>
           ) : (
             <div className="bg-white rounded-xl shadow-lg p-8 text-center">
               <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to checkout?</h2>
               <p className="text-gray-600 mb-8">Please sign in to your account to complete your purchase and track your order.</p>
               <div className="space-y-4">
                 <Link to="/login" className="block w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition">
                   Sign In to Checkout
                 </Link>
                 <div className="text-sm text-gray-500">
                   New customer? <Link to="/register" className="text-primary hover:underline">Create an account</Link>
                 </div>
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};