import React, { useState, useEffect } from 'react';
import { couponAPI } from '../services/api';

const CouponAdmin = () => {
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllCoupons();
  }, []);

  const fetchAllCoupons = async () => {
    try {
      setLoading(true);
      const response = await couponAPI.getAllUsage();
      setCoupons(response.data);
    } catch (error) {
      setError('Failed to fetch coupon data');
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCouponUsage = async (code) => {
    try {
      setLoading(true);
      const response = await couponAPI.getUsage(code);
      setSelectedCoupon(response.data);
    } catch (error) {
      setError('Failed to fetch coupon usage data');
      console.error('Error fetching coupon usage:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center dark:text-white">Coupon Management</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Coupon List */}
        <div className="card">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">All Coupons</h2>
            
            {loading && !coupons.length && (
              <div className="text-center py-4">
                <p>Loading coupons...</p>
              </div>
            )}
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Discount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Used</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {coupons.map((coupon) => (
                    <tr key={coupon.code}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {coupon.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {coupon.discount}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {coupon.usedCount} / {coupon.maxUses || '∞'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {coupon.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => fetchCouponUsage(coupon.code)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Coupon Usage Details */}
        <div className="card">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">
              {selectedCoupon ? `Usage Details: ${selectedCoupon.code}` : 'Coupon Usage Details'}
            </h2>
            
            {loading && !selectedCoupon && (
              <div className="text-center py-4">
                <p>Loading coupon details...</p>
              </div>
            )}
            
            {selectedCoupon && (
              <div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Discount</p>
                    <p className="text-xl font-bold dark:text-white">{selectedCoupon.discount}%</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Uses</p>
                    <p className="text-xl font-bold dark:text-white">{selectedCoupon.usedCount}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Max Uses</p>
                    <p className="text-xl font-bold dark:text-white">{selectedCoupon.maxUses || 'Unlimited'}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <p className="text-xl font-bold dark:text-white">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        selectedCoupon.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedCoupon.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Expiration Date</p>
                  <p className="text-lg font-medium dark:text-white">
                    {formatDate(selectedCoupon.expirationDate)}
                  </p>
                </div>
                
                <h3 className="text-xl font-bold mb-4 dark:text-white">Users Who Used This Coupon</h3>
                
                {selectedCoupon.usedBy.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">No users have used this coupon yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Used At</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {selectedCoupon.usedBy.map((usage, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {usage.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {usage.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {formatDate(usage.usedAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            
            {!selectedCoupon && !loading && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  Select a coupon from the list to view detailed usage statistics.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponAdmin;