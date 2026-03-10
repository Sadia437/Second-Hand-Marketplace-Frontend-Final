import React from 'react';
import { useQuery } from '@tanstack/react-query';
import API from '../../utils/axiosConfig';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

export default function BuyerDashboard({ user }) {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['buyer-bookings'],
    queryFn: async () => {
      const { data } = await API.get('/bookings/my-bookings');
      return data;
    }
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Orders</h2>
        <div className="text-sm text-gray-600">
          {bookings?.length || 0} order(s)
        </div>
      </div>

      {bookings?.length === 0 ? (
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-4">Start shopping to see your orders here</p>
            <a href="/products" className="btn btn-primary">Browse Products</a>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookings?.map(booking => (
            <div key={booking._id} className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-start gap-4">
                    <img 
                      src={booking.product?.image} 
                      alt={booking.product?.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{booking.product?.name}</h3>
                      <p className="text-gray-600">Seller: {booking.seller?.name}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`badge ${
                      booking.status === 'paid' ? 'badge-success' :
                      booking.status === 'pending' ? 'badge-warning' :
                      'badge-error'
                    }`}>
                      {booking.status.toUpperCase()}
                    </span>
                    <button className="btn btn-primary btn-sm">
                      {booking.status === 'pending' ? 'Pay Now' : 'View Details'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}