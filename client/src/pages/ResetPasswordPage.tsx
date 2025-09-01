
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff, FiLock } from 'react-icons/fi';

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post(`/api/auth/reset-password/${token}`, { password });
      setSuccess(true);
      toast.success('Password reset successful!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to reset password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 via-pink-100 to-orange-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 relative">
        <div
          className="relative py-10 px-6 sm:px-10 rounded-2xl overflow-hidden shadow-xl"
          style={{
            background: 'rgba(255,255,255,0.7)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
            backdropFilter: 'blur(12px)',
            border: '1.5px solid rgba(255,255,255,0.25)'
          }}
        >
          <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{background: 'linear-gradient(135deg, #a5b4fc33 0%, #fca5a533 100%)', zIndex: 0}} />
          <div className="relative z-10">
            <div className="flex flex-col items-center mb-6">
              <span className="bg-gradient-to-r from-primary-600 to-primary-400 p-3 rounded-full shadow-lg mb-2">
                <FiLock className="text-white text-2xl" />
              </span>
              <h2 className="text-3xl font-extrabold text-gray-900 bg-gradient-to-r from-blue-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">Reset Your Password</h2>
            </div>
            {success ? (
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold text-green-600 mb-2">Password reset successful!</h3>
                <p className="text-gray-700 mb-4">You can now log in with your new password.</p>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="relative">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <div className="flex items-center relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 border-gray-300 pr-10"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-2 text-gray-400 hover:text-primary-500 focus:outline-none"
                      onClick={() => setShowPassword(v => !v)}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <div className="flex items-center relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirm ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 border-gray-300 pr-10"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-2 text-gray-400 hover:text-primary-500 focus:outline-none"
                      onClick={() => setShowConfirm(v => !v)}
                    >
                      {showConfirm ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                >
                  {isSubmitting ? (
                    <span className="flex items-center"><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>Resetting...</span>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
