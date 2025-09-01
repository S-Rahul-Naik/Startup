import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrashIcon, 
  PlusIcon, 
  MinusIcon, 
  ArrowLeftIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  TruckIcon
} from '@heroicons/react/24/outline';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const CartPage: React.FC = () => {
  const { items: cartItems, total, itemCount, removeFromCart, updateQuantity, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      toast.success('Item removed from cart');
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
    toast.success('Item removed from cart');
  };

  const handleClearCart = () => {
    clearCart();
    toast.success('Cart cleared');
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to continue with checkout');
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    setIsCheckingOut(true);
    // In production, this would redirect to checkout/payment page
    setTimeout(() => {
      setIsCheckingOut(false);
      toast.success('Redirecting to checkout...');
      navigate('/checkout');
    }, 1000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const calculateDiscount = (originalPrice: number, discountedPrice: number) => {
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
              <ShoppingBagIcon className="w-full h-full" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-gray-600 mb-8 text-lg">
              Looks like you haven't added any projects to your cart yet.
            </p>
            <div className="space-y-4">
              <Link
                to="/projects"
                className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors transform hover:scale-105"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Browse Projects
              </Link>
              <p className="text-sm text-gray-500">
                Discover amazing academic projects across various domains
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/projects"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Projects
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-soft overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Cart Items</h2>
                  <button
                    onClick={handleClearCart}
                    className="text-sm text-red-600 hover:text-red-700 transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                <AnimatePresence>
                  {cartItems.map((item: any, index: number) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-6"
                    >
                      <div className="flex items-center space-x-4">
                        {/* Item Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={item.image || 'https://via.placeholder.com/80x80?text=Project'}
                            alt={item.title}
                            className="w-20 h-20 rounded-lg object-cover bg-gray-200"
                          />
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900 truncate">
                                {item.title}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">
                                {item.category} • {item.domain}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold text-gray-900">
                                {formatPrice(item.price)}
                              </p>
                              {item.originalPrice && item.originalPrice > item.price && (
                                <p className="text-sm text-gray-500 line-through">
                                  {formatPrice(item.originalPrice)}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                              >
                                <MinusIcon className="w-4 h-4 text-gray-600" />
                              </button>
                              <span className="w-12 text-center text-gray-900 font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                              >
                                <PlusIcon className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>

                            <button
                              onClick={() => handleRemoveItem(item._id)}
                              className="text-red-600 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-md"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-soft p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                  <span>{formatPrice(total)}</span>
                </div>
                
                {/* Calculate total savings */}
                {(() => {
                  const totalSavings = cartItems.reduce((savings: number, item: any) => {
                    if (item.originalPrice && item.originalPrice > item.price) {
                      return savings + ((item.originalPrice - item.price) * item.quantity);
                    }
                    return savings;
                  }, 0);
                  
                  return totalSavings > 0 ? (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Total Savings</span>
                      <span>-{formatPrice(totalSavings)}</span>
                    </div>
                  ) : null;
                })()}

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium py-3 px-4 rounded-lg transition-colors transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
              >
                {isCheckingOut ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <CreditCardIcon className="w-5 h-5 mr-2" />
                    Proceed to Checkout
                  </div>
                )}
              </button>

              {/* Security & Trust */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <ShieldCheckIcon className="w-4 h-4 mr-2 text-green-500" />
                  Secure checkout with SSL encryption
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <TruckIcon className="w-4 h-4 mr-2 text-blue-500" />
                  Instant digital delivery
                </div>
              </div>

              {/* Continue Shopping */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  to="/projects"
                  className="block w-full text-center text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-soft p-6 text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ShieldCheckIcon className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Payment</h3>
            <p className="text-gray-600 text-sm">
              Your payment information is protected with bank-level security
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-soft p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TruckIcon className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Delivery</h3>
            <p className="text-gray-600 text-sm">
              Get your project files immediately after successful payment
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-soft p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ShoppingBagIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Assured</h3>
            <p className="text-gray-600 text-sm">
              All projects are reviewed and tested for quality and functionality
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
