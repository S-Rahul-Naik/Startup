import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LockClosedIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  TruckIcon
} from '@heroicons/react/24/outline';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const CheckoutPage: React.FC = () => {
  const { items: cartItems, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [addressFields, setAddressFields] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    district: '',
    state: '',
    zip: '',
    country: 'India',
  });

  React.useEffect(() => {
    // Fetch UPI ID from backend
    fetch('http://localhost:5001/api/upi')
      .then(res => res.json())
      .then(data => setUpiId(data.upiId || ''));
  }, []);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressFields(prev => ({ ...prev, [name]: value }));
  };

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }
    if (!receiptFile) {
      toast.error('Please upload your payment receipt.');
      return;
    }
    // Validate all address fields
    if (!addressFields.name || addressFields.name.trim() === '') {
      toast.error('Please enter your full name.');
      return;
    }
    for (const key of Object.keys(addressFields)) {
      if (!addressFields[key as keyof typeof addressFields] || addressFields[key as keyof typeof addressFields].trim() === '') {
        toast.error('Please fill all address fields.');
        return;
      }
    }
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      for (const item of cartItems) {
        const formData = new FormData();
        formData.append('projectId', item._id);
        formData.append('paymentMethod', 'upi');
        Object.entries(addressFields).forEach(([key, value]) => {
          formData.append(key, value);
        });
        formData.append('receipt', receiptFile);
        // Debug: log FormData keys/values
        Array.from(formData.entries()).forEach(pair => {
          console.log(pair[0] + ': ' + pair[1]);
        });
        const response = await fetch('http://localhost:5001/api/orders', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
        if (!response.ok) {
          let errorMsg = 'Order creation failed';
          try {
            const errorData = await response.json();
            if (errorData && errorData.message) errorMsg = errorData.message;
          } catch {}
          throw new Error(errorMsg);
        }
      }
      toast.success('Payment successful! Your order has been placed.');
      clearCart();
      navigate('/order-success');
    } catch (error: any) {
      toast.error(error?.message || 'Payment failed. Please try again.');
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CheckCircleIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some projects to your cart to continue</p>
          <button
            onClick={() => navigate('/projects')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Browse Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your purchase securely</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-lg shadow-soft p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">UPI Payment Only</h2>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current UPI ID (Pay to this ID):</label>
                  <div className="bg-gray-100 px-4 py-2 rounded text-lg font-mono text-primary-700 select-all">
                    {upiId || 'Loading...'}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Please pay using your UPI app and upload the payment receipt below.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Payment Receipt (screenshot or PDF)</label>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleReceiptChange}
                      required
                      className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Delivery Address Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={addressFields.name}
                          onChange={handleAddressChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Your Name"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={addressFields.email}
                            onChange={handleAddressChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="you@email.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                          <input
                            type="tel"
                            name="phone"
                            value={addressFields.phone}
                            onChange={handleAddressChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="10-digit mobile number"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                        <input
                          type="text"
                          name="street"
                          value={addressFields.street}
                          onChange={handleAddressChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Street, Area, Landmark"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                          <input
                            type="text"
                            name="city"
                            value={addressFields.city}
                            onChange={handleAddressChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="City"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                          <input
                            type="text"
                            name="district"
                            value={addressFields.district}
                            onChange={handleAddressChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="District"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                          <input
                            type="text"
                            name="state"
                            value={addressFields.state}
                            onChange={handleAddressChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="State"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                          <input
                            type="text"
                            name="zip"
                            value={addressFields.zip}
                            onChange={handleAddressChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="PIN/ZIP Code"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                        <input
                          type="text"
                          name="country"
                          value={addressFields.country}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium py-3 px-4 rounded-lg transition-colors transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing Payment...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <LockClosedIcon className="w-5 h-5 mr-2" />
                        Pay {formatPrice(total * 1.18)}
                      </div>
                    )}
                  </button>
                </form>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center text-sm text-gray-600">
                    <ShieldCheckIcon className="w-4 h-4 text-green-500 mr-2" />
                    Your payment information is secure and encrypted
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="bg-white rounded-lg shadow-soft p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex items-center space-x-3">
                      <img
                        src={item.image || 'https://via.placeholder.com/60x60?text=Project'}
                        alt={item.title}
                        className="w-15 h-15 rounded-lg object-cover bg-gray-200"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-500">{item.category}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax (18% GST)</span>
                    <span>{formatPrice(total * 0.18)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-semibold text-gray-900">
                      <span>Total</span>
                      <span>{formatPrice(total * 1.18)}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <TruckIcon className="w-4 h-4 text-blue-500 mr-2" />
                    Instant digital delivery
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <ShieldCheckIcon className="w-4 h-4 text-green-500 mr-2" />
                    Secure payment processing
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                    Quality assured projects
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
