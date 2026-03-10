import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import API from '../../utils/axiosConfig';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';

export default function AdminDashboard({ user }) {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch admin statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [usersRes, productsRes, bookingsRes, reportsRes] = await Promise.all([
        API.get('/users'),
        API.get('/products'),
        API.get('/bookings'),
        API.get('/reports')
      ]);

      const users = usersRes.data || [];
      const products = productsRes.data?.products || productsRes.data || [];
      const bookings = bookingsRes.data || [];
      const reports = reportsRes.data || [];

      const sellers = users.filter(u => u.role === 'seller');
      const buyers = users.filter(u => u.role === 'buyer');
      const pendingVerification = sellers.filter(s => !s.isVerified);
      const reportedProducts = products.filter(p => p.reports && p.reports.length > 0);
      const pendingBookings = bookings.filter(b => b.status === 'pending');

      return {
        totalUsers: users.length,
        totalSellers: sellers.length,
        totalBuyers: buyers.length,
        pendingVerification: pendingVerification.length,
        totalProducts: products.length,
        totalBookings: bookings.length,
        pendingBookings: pendingBookings.length,
        reportedItems: reportedProducts.length,
        totalReports: reports.length,
        activeReports: reports.filter(r => r.status === 'pending').length
      };
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Fetch recent activities
  const { data: recentActivities, isLoading: activitiesLoading } = useQuery({
    queryKey: ['recent-activities'],
    queryFn: async () => {
      const [usersRes, productsRes, bookingsRes] = await Promise.all([
        API.get('/users?limit=5&sort=-createdAt'),
        API.get('/products?limit=5&sort=-createdAt'),
        API.get('/bookings?limit=5&sort=-createdAt')
      ]);

      const users = usersRes.data || [];
      const products = productsRes.data?.products || productsRes.data || [];
      const bookings = bookingsRes.data || [];

      const activities = [];

      // Recent users
      users.slice(0, 3).forEach(user => {
        activities.push({
          type: 'user_registration',
          title: `New ${user.role} registration`,
          description: `${user.name} registered as ${user.role}`,
          timestamp: user.createdAt,
          user: user,
          icon: '👤'
        });
      });

      // Recent products
      products.slice(0, 3).forEach(product => {
        activities.push({
          type: 'product_listed',
          title: 'New product listed',
          description: `${product.name} added by ${product.seller?.name}`,
          timestamp: product.createdAt,
          product: product,
          icon: '📦'
        });
      });

      // Recent bookings
      bookings.slice(0, 2).forEach(booking => {
        activities.push({
          type: 'booking_created',
          title: 'New booking request',
          description: `Booking for ${booking.product?.name} by ${booking.buyer?.name}`,
          timestamp: booking.createdAt,
          booking: booking,
          icon: '💰'
        });
      });

      // Sort by timestamp and return top 5
      return activities
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);
    }
  });

  // User management mutations
  const verifyUserMutation = useMutation({
    mutationFn: async (userId) => {
      const { data } = await API.patch(`/users/${userId}/verify`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-stats']);
      queryClient.invalidateQueries(['recent-activities']);
      toast.success('User verified successfully!');
      setShowUserModal(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to verify user');
    }
  });

  const suspendUserMutation = useMutation({
    mutationFn: async ({ userId, reason }) => {
      const { data } = await API.patch(`/users/${userId}/suspend`, { reason });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-stats']);
      queryClient.invalidateQueries(['recent-activities']);
      toast.success('User suspended successfully!');
      setShowUserModal(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to suspend user');
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId) => {
      const { data } = await API.delete(`/users/${userId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-stats']);
      queryClient.invalidateQueries(['recent-activities']);
      toast.success('User deleted successfully!');
      setShowUserModal(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  });

  // Handle user actions
  const handleVerifyUser = async (userId) => {
    setActionLoading(`verify-${userId}`);
    await verifyUserMutation.mutateAsync(userId);
    setActionLoading(null);
  };

  const handleSuspendUser = async (userId, reason = 'Violation of terms') => {
    setActionLoading(`suspend-${userId}`);
    await suspendUserMutation.mutateAsync({ userId, reason });
    setActionLoading(null);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setActionLoading(`delete-${userId}`);
      await deleteUserMutation.mutateAsync(userId);
      setActionLoading(null);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Recently';
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getStatusBadge = (user) => {
    if (user.isSuspended) {
      return <span className="badge badge-error">Suspended</span>;
    }
    if (user.role === 'seller' && !user.isVerified) {
      return <span className="badge badge-warning">Pending Verification</span>;
    }
    if (user.isVerified) {
      return <span className="badge badge-success">Verified</span>;
    }
    return <span className="badge badge-info">Active</span>;
  };

  if (statsLoading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading admin dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name}! Here's what's happening.</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="stat bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="stat-figure text-blue-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <div className="stat-title text-gray-600">Total Users</div>
          <div className="stat-value text-3xl text-gray-900">{stats?.totalUsers || 0}</div>
          <div className="stat-desc text-gray-500">
            {stats?.totalBuyers || 0} buyers • {stats?.totalSellers || 0} sellers
          </div>
        </div>

        
        <div className="stat bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="stat-figure text-green-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div className="stat-title text-gray-600">Total Products</div>
          <div className="stat-value text-3xl text-gray-900">{stats?.totalProducts || 0}</div>
          <div className="stat-desc text-gray-500">Active listings</div>
        </div>

        
        <div className="stat bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="stat-figure text-amber-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="stat-title text-gray-600">Pending Verification</div>
          <div className="stat-value text-3xl text-gray-900">{stats?.pendingVerification || 0}</div>
          <div className="stat-desc text-gray-500">Sellers waiting approval</div>
        </div>

      
        <div className="stat bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="stat-figure text-red-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="stat-title text-gray-600">Reported Items</div>
          <div className="stat-value text-3xl text-gray-900">{stats?.reportedItems || 0}</div>
          <div className="stat-desc text-gray-500">{stats?.activeReports || 0} active reports</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
       
        <div className="lg:col-span-1">
          <div className="card bg-white border border-gray-200 shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-lg font-semibold text-gray-900">Quick Actions</h3>
              <div className="space-y-3">
                <Link 
                  to="/dashboard/admin/users" 
                  className="btn btn-primary btn-block justify-start"
                >
                  👥 Manage Users
                </Link>
                <Link 
                  to="/dashboard/admin/products" 
                  className="btn btn-secondary btn-block justify-start"
                >
                  📦 Manage Products
                </Link>
                <Link 
                  to="/dashboard/admin/bookings" 
                  className="btn btn-accent btn-block justify-start"
                >
                  💰 Manage Bookings
                </Link>
                <Link 
                  to="/dashboard/admin/reports" 
                  className="btn btn-warning btn-block justify-start"
                >
                  ⚠️ View Reports
                </Link>
                <Link 
                  to="/dashboard/admin/verification" 
                  className="btn btn-info btn-block justify-start"
                >
                  ✅ Seller Verification
                </Link>
              </div>
            </div>
          </div>

          
          <div className="card bg-white border border-gray-200 shadow-sm mt-6">
            <div className="card-body">
              <h3 className="card-title text-lg font-semibold text-gray-900">System Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Platform Health</span>
                  <span className="badge badge-success">Operational</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">API Status</span>
                  <span className="badge badge-success">Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Database</span>
                  <span className="badge badge-success">Connected</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last Backup</span>
                  <span className="text-sm text-gray-500">Today, 02:00 AM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div className="lg:col-span-2">
          <div className="card bg-white border border-gray-200 shadow-sm">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h3 className="card-title text-lg font-semibold text-gray-900">Recent Activity</h3>
                <Link to="/dashboard/admin/activities" className="text-sm text-primary hover:underline">
                  View All
                </Link>
              </div>
              
              {activitiesLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner size="md" />
                </div>
              ) : recentActivities?.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="text-2xl">{activity.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{activity.title}</p>
                        <p className="text-sm text-gray-600 truncate">{activity.description}</p>
                      </div>
                      <span className="text-sm text-gray-500 whitespace-nowrap">
                        {formatTime(activity.timestamp)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No recent activities found</p>
                </div>
              )}
            </div>
          </div>

          
          <div className="card bg-white border border-gray-200 shadow-sm mt-6">
            <div className="card-body">
              <h3 className="card-title text-lg font-semibold text-gray-900">Pending Actions</h3>
              <div className="space-y-3">
                {stats?.pendingVerification > 0 && (
                  <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                    <div>
                      <p className="font-medium text-amber-900">Seller Verifications</p>
                      <p className="text-sm text-amber-700">{stats.pendingVerification} sellers waiting approval</p>
                    </div>
                    <Link to="/dashboard/admin/verification" className="btn btn-warning btn-sm">
                      Review
                    </Link>
                  </div>
                )}
                
                {stats?.pendingBookings > 0 && (
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-blue-900">Pending Bookings</p>
                      <p className="text-sm text-blue-700">{stats.pendingBookings} bookings need attention</p>
                    </div>
                    <Link to="/dashboard/admin/bookings" className="btn btn-primary btn-sm">
                      Manage
                    </Link>
                  </div>
                )}
                
                {stats?.activeReports > 0 && (
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-red-900">Active Reports</p>
                      <p className="text-sm text-red-700">{stats.activeReports} reports to investigate</p>
                    </div>
                    <Link to="/dashboard/admin/reports" className="btn btn-error btn-sm">
                      Investigate
                    </Link>
                  </div>
                )}

                {!stats?.pendingVerification && !stats?.pendingBookings && !stats?.activeReports && (
                  <div className="text-center py-4 text-gray-500">
                    <p>No pending actions. Everything is up to date! 🎉</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      
      {showUserModal && selectedUser && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Manage User: {selectedUser.name}</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="font-semibold">Email:</label>
                  <p>{selectedUser.email}</p>
                </div>
                <div>
                  <label className="font-semibold">Role:</label>
                  <p className="capitalize">{selectedUser.role}</p>
                </div>
                <div>
                  <label className="font-semibold">Status:</label>
                  <div className="mt-1">{getStatusBadge(selectedUser)}</div>
                </div>
                <div>
                  <label className="font-semibold">Joined:</label>
                  <p>{formatTime(selectedUser.createdAt)}</p>
                </div>
              </div>

              <div className="modal-action">
                {selectedUser.role === 'seller' && !selectedUser.isVerified && (
                  <button
                    className="btn btn-success"
                    onClick={() => handleVerifyUser(selectedUser._id)}
                    disabled={actionLoading === `verify-${selectedUser._id}`}
                  >
                    {actionLoading === `verify-${selectedUser._id}` ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      'Verify Seller'
                    )}
                  </button>
                )}
                
                {!selectedUser.isSuspended ? (
                  <button
                    className="btn btn-warning"
                    onClick={() => handleSuspendUser(selectedUser._id)}
                    disabled={actionLoading === `suspend-${selectedUser._id}`}
                  >
                    {actionLoading === `suspend-${selectedUser._id}` ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      'Suspend'
                    )}
                  </button>
                ) : (
                  <button
                    className="btn btn-info"
                    onClick={() => handleSuspendUser(selectedUser._id)}
                    disabled={actionLoading === `suspend-${selectedUser._id}`}
                  >
                    {actionLoading === `suspend-${selectedUser._id}` ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      'Unsuspend'
                    )}
                  </button>
                )}
                
                <button
                  className="btn btn-error"
                  onClick={() => handleDeleteUser(selectedUser._id)}
                  disabled={actionLoading === `delete-${selectedUser._id}`}
                >
                  {actionLoading === `delete-${selectedUser._id}` ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    'Delete'
                  )}
                </button>
                
                <button 
                  className="btn btn-ghost"
                  onClick={() => setShowUserModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}