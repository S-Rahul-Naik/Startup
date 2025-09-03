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
  const [upiLoading, setUpiLoading] = useState(true);
  const [upiError, setUpiError] = useState<string | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
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
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  React.useEffect(() => {
    setUpiLoading(true);
    setUpiError(null);
    fetch('http://localhost:5001/api/upi')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch UPI ID');
        return res.json();
      })
      .then(data => setUpiId(data.upiId || ''))
      .catch(() => setUpiError('Could not load UPI ID. Please try again later.'))
      .finally(() => setUpiLoading(false));
  }, []);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressFields(prev => ({ ...prev, [name]: value }));
  };

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = ev => setReceiptPreview(ev.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        setReceiptPreview(null);
      }
    }
  };

  const validateFields = () => {
    const errors: { [key: string]: string } = {};
    if (!receiptFile) errors.receipt = 'Please upload your payment receipt.';
    if (!addressFields.name.trim()) errors.name = 'Full name is required.';
    if (!addressFields.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(addressFields.email)) errors.email = 'Valid email is required.';
    if (!addressFields.phone.trim() || !/^\d{10}$/.test(addressFields.phone)) errors.phone = 'Valid 10-digit phone number required.';
    if (!addressFields.street.trim()) errors.street = 'Street address is required.';
    if (!addressFields.city.trim()) errors.city = 'City is required.';
    if (!addressFields.district.trim()) errors.district = 'District is required.';
    if (!addressFields.state.trim()) errors.state = 'State is required.';
    if (!addressFields.zip.trim() || !/^\d{6}$/.test(addressFields.zip)) errors.zip = 'Valid 6-digit ZIP code required.';
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setSubmitError(null);
    if (!user) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }
    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Please fix the errors in the form.');
      return;
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
        formData.append('receipt', receiptFile!);
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
      setSubmitError(error?.message || 'Payment failed. Please try again.');
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
                    {upiLoading ? 'Loading...' : upiError ? (
                      <span className="text-red-500">{upiError}</span>
                    ) : (
                      upiId
                    )}
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
                      aria-invalid={!!formErrors.receipt}
                      className={`block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 ${formErrors.receipt ? 'border-red-500' : ''}`}
                    />
                    {formErrors.receipt && <div className="text-red-500 text-xs mt-1">{formErrors.receipt}</div>}
                    {receiptPreview && (
                      <div className="mt-2">
                        <img src={receiptPreview} alt="Receipt Preview" className="max-h-40 rounded border" />
                      </div>
                    )}
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
                          aria-invalid={!!formErrors.name}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="Your Name"
                        />
                        {formErrors.name && <div className="text-red-500 text-xs mt-1">{formErrors.name}</div>}
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
                            aria-invalid={!!formErrors.email}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="you@email.com"
                          />
                          {formErrors.email && <div className="text-red-500 text-xs mt-1">{formErrors.email}</div>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                          <input
                            type="tel"
                            name="phone"
                            value={addressFields.phone}
                            onChange={handleAddressChange}
                            required
                            aria-invalid={!!formErrors.phone}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${formErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="10-digit mobile number"
                          />
                          {formErrors.phone && <div className="text-red-500 text-xs mt-1">{formErrors.phone}</div>}
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
                          aria-invalid={!!formErrors.street}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${formErrors.street ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="Street, Area, Landmark"
                        />
                        {formErrors.street && <div className="text-red-500 text-xs mt-1">{formErrors.street}</div>}
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
                            aria-invalid={!!formErrors.city}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${formErrors.city ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="City"
                          />
                          {formErrors.city && <div className="text-red-500 text-xs mt-1">{formErrors.city}</div>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                          <input
                            type="text"
                            name="district"
                            value={addressFields.district}
                            onChange={handleAddressChange}
                            required
                            aria-invalid={!!formErrors.district}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${formErrors.district ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="District"
                          />
                          {formErrors.district && <div className="text-red-500 text-xs mt-1">{formErrors.district}</div>}
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
                            aria-invalid={!!formErrors.state}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${formErrors.state ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="State"
                          />
                          {formErrors.state && <div className="text-red-500 text-xs mt-1">{formErrors.state}</div>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                          <input
                            type="text"
                            name="zip"
                            value={addressFields.zip}
                            onChange={handleAddressChange}
                            required
                            aria-invalid={!!formErrors.zip}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${formErrors.zip ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="PIN/ZIP Code"
                          />
                          {formErrors.zip && <div className="text-red-500 text-xs mt-1">{formErrors.zip}</div>}
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
                  {submitError && <div className="text-red-500 text-sm mb-2">{submitError}</div>}
                  <button
                    type="submit"
                    disabled={isProcessing || upiLoading || !!upiError}
                    className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium py-3 px-4 rounded-lg transition-colors transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
                    aria-busy={isProcessing}
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
                  {cartItems.map((item) => {
                    // Robust image logic: backend file, external URL, or placeholder
                    let imageUrl = '';
                    if (item.image && !item.image.startsWith('http') && !item.image.startsWith('/') && /\.(jpg|jpeg|png|gif|webp)$/i.test(item.image)) {
                      imageUrl = `http://localhost:5001/api/projects/files/${item.image}`;
                    } else if (item.image && item.image.startsWith('http')) {
                      imageUrl = item.image;
                    } else if (item.image && item.image.startsWith('/')) {
                      imageUrl = item.image;
                    } else {
                      imageUrl = 'https://via.placeholder.com/60x60?text=Project';
                    }
                    return (
                      <div key={item._id} className="flex items-center space-x-3">
                        <img
                          src={imageUrl}
                          alt={item.title}
                          className="w-15 h-15 rounded-lg object-cover bg-gray-200"
                          onError={e => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://via.placeholder.com/60x60?text=Project';
                          }}
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
                    );
                  })}
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
