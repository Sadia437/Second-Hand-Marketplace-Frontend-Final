import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import API from '../utils/axiosConfig';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import BookingModal from '../components/Product/BookingModal';
import toast from 'react-hot-toast';
import tomatoImg from '../assets/tomato.jpg';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [showBookingModal, setShowBookingModal] = useState(false);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      try {
        try {
          const { data } = await API.get(`/products/${id}`);
          return data;
        } catch (directError) {
          console.log('Direct endpoint failed, trying products list...');
        }

        const { data } = await API.get('/products');
        const productsArray = data.products || data || [];
        const foundProduct = productsArray.find(p => p._id === id);
        
        if (!foundProduct) {
          throw new Error('Product not found');
        }
        return foundProduct;
      } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
      }
    },
    enabled: !!id,
    retry: 1
  });

  const handleBookNow = () => {
    if (!currentUser) {
      toast.error('Please login to book this product');
      navigate('/login');
      return;
    }
    setShowBookingModal(true);
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <Link to="/products" className="bg-blue-600 text-white px-6 py-2 rounded-lg">Back to Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span>›</span>
          <Link to="/products" className="hover:text-blue-600">Products</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-200">
              <img 
                src={product?.image || tomatoImg} 
                alt={product?.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = tomatoImg;
                }}
              />
            </div>
          </div>

          
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {product.category || 'Vegetables'}
                </span>
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20">
                  {product.condition || 'Good'}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-gray-900">
                  ৳{product.price?.toLocaleString() || 'N/A'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 py-6 border-y border-gray-200">
              <div className="space-y-1">
                <span className="text-sm text-gray-600 font-medium">Category</span>
                <p className="text-lg font-semibold text-gray-900 capitalize">{product.category || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-gray-600 font-medium">Location</span>
                <p className="text-lg font-semibold text-gray-900">📍 Dhaka, BD</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h3>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {product.seller?.name?.charAt(0) || 'S'}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{product.seller?.name || 'Sadia Akhter'}</p>
                  <p className="text-sm text-gray-500">Verified Seller</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleBookNow}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg transition-all"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {showBookingModal && (
        <BookingModal
          product={product}
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => {
           
            console.log('Booking process completed in modal');
          }}
        />
      )}
    </div>
  );
}