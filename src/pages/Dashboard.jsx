import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import API from '../utils/axiosConfig';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';

export default function AdminSellers() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedSellers, setSelectedSellers] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ✅ FETCH UPDATED: Now fetching specifically from /users/sellers
  const { 
    data: sellers, // Directly getting sellers now
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['admin-sellers', searchTerm, statusFilter], // Added dependencies
    queryFn: async () => {
      try {
        // Corrected Endpoint: /users/sellers
        const { data } = await API.get('/users/sellers', {
          params: {
            search: searchTerm,
            status: statusFilter !== 'all' ? statusFilter : undefined
          }
        });
        return data || [];
      } catch (error) {
        console.error('Error fetching sellers:', error);
        throw new Error('Failed to load sellers data');
      }
    },
    retry: 2,
    staleTime: 2 * 60 * 1000,
  });

  // Mutation for verifying sellers - Using updated backend path
  const verifySellerMutation = useMutation({
    mutationFn: async (sellerId) => {
      const { data } = await API.patch(`/users/${sellerId}/verify`); // Matches your backend
      return data;
    },
    onSuccess: () => {
      toast.success('Seller verified successfully!');
      queryClient.invalidateQueries(['admin-sellers']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to verify seller');
    }
  });

  // Filter and sort sellers (Client-side extra layer)
  const filteredSellers = useMemo(() => {
    if (!sellers) return [];

    return sellers
      .filter(seller => {
        const matchesVerification =
          verificationFilter === 'all' ||
          (verificationFilter === 'verified' && seller.isVerified) ||
          (verificationFilter === 'unverified' && !seller.isVerified);

        return matchesVerification;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return new Date(b.createdAt) - new Date(a.createdAt);
          case 'oldest':
            return new Date(a.createdAt) - new Date(b.createdAt);
          case 'name':
            return a.name?.localeCompare(b.name);
          default:
            return 0;
        }
      });
  }, [sellers, verificationFilter, sortBy]);

  // Pagination Logic
  const paginatedSellers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSellers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSellers, currentPage]);

  const totalPages = Math.ceil(filteredSellers.length / itemsPerPage);

  // Individual Handlers
  const handleVerifySeller = async (sellerId) => {
    setActionLoading(`verify-${sellerId}`);
    try {
      await verifySellerMutation.mutateAsync(sellerId);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) return <div className="min-h-96 flex items-center justify-center"><LoadingSpinner size="lg" text="Loading sellers..." /></div>;

  if (error) return (
    <div className="alert alert-error shadow-lg">
      <div><span>❌ {error.message}</span></div>
      <button className="btn btn-sm btn-ghost" onClick={() => refetch()}>Retry</button>
    </div>
  );

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Seller Management</h2>
          <p className="text-gray-600 mt-1">Seconhand Marketplace</p>
        </div>
      </div>

      
      <div className="card bg-white border border-gray-200 shadow-sm">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="form-control w-full lg:w-auto">
              <div className="input-group flex">
                <input
                  type="text"
                  placeholder="Search sellers..."
                  className="input input-bordered w-full lg:w-96"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <select className="select select-bordered select-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
              </select>
              <select className="select select-bordered select-sm" value={verificationFilter} onChange={(e) => setVerificationFilter(e.target.value)}>
                <option value="all">All Verification</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>
          </div>
        </div>
      </div>

     
      <div className="card bg-white border border-gray-200 shadow-sm">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Seller</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSellers.map((seller) => (
                  <tr key={seller._id} className="hover">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-neutral text-neutral-content rounded-full w-10">
                            <span>{seller.name?.charAt(0)}</span>
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{seller.name}</div>
                          <div className="text-xs">{seller.isVerified ? '✅ Verified' : '⏳ Pending'}</div>
                        </div>
                      </div>
                    </td>
                    <td>{seller.email}<br/><span className="text-gray-500 text-xs">{seller.phone}</span></td>
                    <td><span className={`badge ${seller.isVerified ? 'badge-success' : 'badge-warning'}`}>{seller.status || 'active'}</span></td>
                    <td>{formatDate(seller.createdAt)}</td>
                    <td>
                      <div className="flex gap-1">
                        {!seller.isVerified && (
                          <button className="btn btn-success btn-xs" onClick={() => handleVerifySeller(seller._id)} disabled={actionLoading === `verify-${seller._id}`}>
                            {actionLoading === `verify-${seller._id}` ? '...' : 'Verify'}
                          </button>
                        )}
                        <Link to={`/profile/${seller._id}`} className="btn btn-ghost btn-xs">View</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}