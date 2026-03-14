import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import API from '../utils/axiosConfig';
import LoadingSpinner from '../components/UI/LoadingSpinner';

export default function MyBookings() {
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['buyer-bookings'],
    queryFn: async () => {
      const { data } = await API.get('/bookings/my-bookings'); 
      return data;
    }
  });

  if (isLoading) return <LoadingSpinner text="Loading your bookings..." />;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">My Bookings</h2>
      
      {bookings.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No bookings found. Start shopping!</p>
          <Link to="/products" className="btn btn-primary mt-4">View Products</Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="table w-full">
            <thead>
              <tr className="bg-gray-100">
                <th>Product</th>
                <th>Price</th>
                <th>Meeting Info</th>
                <th>Payment Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-b">
                  <td>
                    <div className="font-bold">{booking.productName}</div>
                    <div className="text-xs text-gray-500">Seller: {booking.sellerName}</div>
                  </td>
                  <td className="font-semibold text-primary">৳{booking.productPrice?.toLocaleString()}</td>
                  <td className="text-sm">
                    {booking.meetingLocation} <br />
                    <span className="text-xs text-gray-400">{booking.meetingDate} at {booking.meetingTime}</span>
                  </td>
                  <td>
                    {booking.paid ? (
                      <span className="badge badge-success gap-1">✅ Paid</span>
                    ) : (
                      <span className="badge badge-warning gap-1">⏳ Pending</span>
                    )}
                  </td>
                  <td>
                  
                    {!booking.paid ? (
                      <Link to={`/dashboard/payment/${booking._id}`}>
                        <button className="btn btn-sm btn-primary text-white">
                          Pay Now
                        </button>
                      </Link>
                    ) : (
                      <span className="text-xs text-green-600 font-bold uppercase">Transaction Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}