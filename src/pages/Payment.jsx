import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import API from '../utils/axiosConfig';
import CheckoutForm from '../components/Dashboard/CheckoutForm';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const Payment = () => {
    const { id } = useParams();
    const location = useLocation();

  
    const { data: booking, isLoading } = useQuery({
        queryKey: ['booking', id],
        queryFn: async () => {
            if (location.state?.booking) return location.state.booking;
            const { data } = await API.get(`/bookings/${id}`);
            return data;
        }
    });

    if (isLoading) return <LoadingSpinner text="Preparing payment..." />;

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="max-w-md mx-auto bg-white p-8 border border-gray-100 shadow-2xl rounded-2xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Secure Payment</h2>
                <p className="text-gray-600 mb-6">
                    Product: <span className="font-semibold text-primary">{booking?.productName}</span>
                </p>
                <div className="bg-blue-50 p-4 rounded-xl mb-8 flex justify-between items-center">
                    <div>
                        <p className="text-xs text-blue-700 uppercase tracking-wider">Total Amount</p>
                        <p className="text-3xl font-black text-blue-900">৳{booking?.productPrice}</p>
                    </div>
                    <div className="text-blue-200">
                        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>
                    </div>
                </div>

                <Elements stripe={stripePromise}>
                    <CheckoutForm booking={booking} />
                </Elements>
            </div>
        </div>
    );
};

export default Payment;