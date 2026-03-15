import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import API from '../../utils/axiosConfig';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { FaUsers, FaBox, FaShieldAlt, FaExclamationCircle } from 'react-icons/fa';

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
    
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      try {
        const [u, p, b] = await Promise.allSettled([
          API.get('/users', config),
          API.get('/products', config),
          API.get('/bookings', config)
        ]);

        const users = u.status === 'fulfilled' ? u.value.data : [];
        const products = p.status === 'fulfilled' ? (p.value.data.products || p.value.data) : [];
        const bookings = b.status === 'fulfilled' ? b.value.data : [];

        return {
          totalUsers: users.length || 0,
          totalSellers: users.filter(usr => usr.role === 'seller').length || 0,
          totalBuyers: users.filter(usr => usr.role === 'buyer').length || 0,
          totalProducts: products.length || 0,
          pendingVerifications: users.filter(usr => usr.role === 'seller' && !usr.isVerified).length || 0,
          reportedItems: products.filter(prd => prd.reports?.length > 0).length || 0
        };
      } catch (err) {
        console.error("Stats Fetch Error", err);
        return {};
      }
    }
  });

  if (isLoading) return <LoadingSpinner size="lg" text="Loading Real-time Stats..." />;

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-black text-gray-800 italic">Admin Dashboard</h2>
          <p className="text-gray-400 text-sm">Real-time platform overview and management.</p>
        </div>
        <div className="text-xs font-bold text-gray-400 uppercase bg-gray-100 px-3 py-1 rounded-md">
          Status: <span className="text-green-500">Live</span>
        </div>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><FaUsers className="text-xl" /></div>
            <span className="text-[10px] font-black text-gray-300 uppercase">Users</span>
          </div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Users</p>
          <h3 className="text-3xl font-black mt-1">{stats?.totalUsers || 0}</h3>
          <p className="text-[10px] text-gray-400 mt-2">{stats?.totalBuyers} buyers • {stats?.totalSellers} sellers</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl"><FaBox className="text-xl" /></div>
          </div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Products</p>
          <h3 className="text-3xl font-black mt-1">{stats?.totalProducts || 0}</h3>
          <p className="text-[10px] text-gray-400 mt-2">Active listings in market</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><FaShieldAlt className="text-xl" /></div>
          </div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Pending Verification</p>
          <h3 className="text-3xl font-black mt-1">{stats?.pendingVerifications || 0}</h3>
          <p className="text-[10px] text-gray-400 mt-2">Sellers waiting for approval</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-xl"><FaExclamationCircle className="text-xl" /></div>
          </div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Reported Items</p>
          <h3 className="text-3xl font-black mt-1">{stats?.reportedItems || 0}</h3>
          <p className="text-[10px] text-gray-400 mt-2">Flagged by community</p>
        </div>
      </div>

     
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="text-xl font-bold mb-2">Quick Management</h4>
            <p className="text-gray-400 text-sm mb-6">Access all administrative tools from here.</p>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/dashboard/admin/users" className="btn btn-sm normal-case bg-white/10 border-none text-white hover:bg-white/20">Manage Users</Link>
              <Link to="/dashboard/admin/products" className="btn btn-sm normal-case bg-white/10 border-none text-white hover:bg-white/20">Review Products</Link>
              <Link to="/dashboard/admin/bookings" className="btn btn-sm normal-case bg-white/10 border-none text-white hover:bg-white/20">View Bookings</Link>
              <Link to="/dashboard/admin/reports" className="btn btn-sm normal-case bg-red-500/20 border-none text-red-200 hover:bg-red-500/40">Violation Reports</Link>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-10 text-[150px] font-black italic select-none">ADMIN</div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <h4 className="text-xl font-bold mb-6">System Health</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 font-bold uppercase text-[10px]">API Status</span>
              <span className="badge badge-success badge-sm text-white">Online</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 font-bold uppercase text-[10px]">Database</span>
              <span className="text-gray-800 font-bold italic">Connected</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mt-4">
              <div className="bg-primary w-4/5 h-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}