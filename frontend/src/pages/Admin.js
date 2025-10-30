import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { couponAPI } from '../services/api';

const Admin = () => {
  const { user } = useAuth();
  
  const [couponData, setCouponData] = useState({
    code: '',
    discount: '',
    expirationDate: '',
    maxUses: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // In a real app, you would check if the user is an admin
  // For now, we'll just show this page to all users as a demo

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Validate input
      if (!couponData.code || !couponData.discount || !couponData.expirationDate) {
        throw new Error('All fields are required');
      }
      
      // Limit discount to maximum 10%
      const couponDataToSend = {
        ...couponData,
        discount: Math.min(parseInt(couponData.discount), 10)
      };
      
      // Call API to create a coupon
      const response = await couponAPI.create(couponDataToSend);
      
      if (response.data) {
        setSuccess(`Coupon ${response.data.code} created successfully with ${response.data.discount}% discount! This coupon can now be used to reduce subscription prices.`);
      } else {
        setSuccess(`Coupon created successfully! The coupon can now be used to reduce subscription prices.`);
      }
      
      // Reset form
      setCouponData({
        code: '',
        discount: '',
        expirationDate: '',
        maxUses: ''
      });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(`Error creating coupon: ${error.response.data.message}`);
      } else {
        setError('Error creating coupon. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCouponData({
      ...couponData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center dark:text-white">Admin Panel</h1>
      
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold dark:text-white">Coupon Management</h2>
          <Link 
            to="/coupon-admin" 
            className="btn-secondary px-4 py-2 text-sm whitespace-nowrap"
          >
            View Coupon Usage Statistics
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6 dark:text-white">Create New Coupon</h2>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  {success}
                </div>
              )}
              
              <form onSubmit={handleCreateCoupon}>
                <div className="mb-4">
                  <label htmlFor="code" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={couponData.code}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., WELCOME10"
                    maxLength="20"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Enter a unique coupon code (max 20 characters)
                  </p>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="discount" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    id="discount"
                    name="discount"
                    value={couponData.discount}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., 5 (Max 10%)"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Maximum discount allowed: 10%
                  </p>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="expirationDate" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    id="expirationDate"
                    name="expirationDate"
                    value={couponData.expirationDate}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Select when this coupon will expire
                  </p>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="maxUses" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
                    Maximum Uses (optional)
                  </label>
                  <input
                    type="number"
                    id="maxUses"
                    name="maxUses"
                    value={couponData.maxUses}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Leave blank for unlimited"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Leave blank for unlimited uses
                  </p>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3"
                >
                  {loading ? 'Creating Coupon...' : 'Create Coupon'}
                </button>
              </form>
              
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                <h3 className="font-bold text-lg mb-2 dark:text-white">How to Use Coupons</h3>
                <ul className="list-disc pl-5 space-y-1 dark:text-gray-300">
                  <li>Create a coupon with a unique code and discount percentage</li>
                  <li>Share the coupon code with users</li>
                  <li>Users can apply the coupon on the Subscription page</li>
                  <li>The subscription price will be automatically reduced by the discount percentage</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6 dark:text-white">Coupon Usage Instructions</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                  <h3 className="font-bold text-lg mb-2 dark:text-white">How It Works</h3>
                  <p className="dark:text-gray-300">
                    When users apply coupons during subscription or payment, their usage is automatically tracked.
                    You can view detailed statistics about which users have used each coupon.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                  <h3 className="font-bold text-lg mb-2 dark:text-white">Viewing Statistics</h3>
                  <p className="dark:text-gray-300">
                    Click the "View Coupon Usage Statistics" button to see detailed information about coupon usage,
                    including which users have used each coupon and when.
                  </p>
                </div>
                
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                  <h3 className="font-bold text-lg mb-2 dark:text-white">Coupon Benefits</h3>
                  <ul className="list-disc pl-5 space-y-1 dark:text-gray-300">
                    <li>Track marketing campaign effectiveness</li>
                    <li>Monitor user engagement with promotions</li>
                    <li>Identify popular coupon codes</li>
                    <li>Prevent coupon abuse with usage limits</li>
                    <li>Maximum discount limited to 10% for security</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
                  <h3 className="font-bold text-lg mb-2 dark:text-white">Subscription Pricing</h3>
                  <p className="dark:text-gray-300">
                    The standard subscription price is ₹250/month. When a coupon is applied, 
                    the price is reduced by the coupon's discount percentage.
                  </p>
                  <p className="mt-2 dark:text-gray-300">
                    Example: A 10% coupon reduces the price to ₹225/month.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;