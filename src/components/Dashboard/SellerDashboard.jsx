import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import API from '../../utils/axiosConfig';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

export default function SellerDashboard({ user }) {
  const { data: products, isLoading } = useQuery({
    queryKey: ['seller-products'],
    queryFn: async () => {
      const { data } = await API.get('/products/my-products');
      return data;
    }
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Products</h2>
        <Link to="/dashboard/seller/add-product" className="btn btn-primary">
          Add New Product
        </Link>
      </div>

      {!user?.isVerified && (
        <div className="alert alert-warning">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span>Your seller account is pending verification. You can add products but they won't be visible to buyers until verified.</span>
        </div>
      )}

      {products?.length === 0 ? (
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body text-center py-12">
            <div className="text-6xl mb-4">🛍️</div>
            <h3 className="text-xl font-semibold mb-2">No products listed</h3>
            <p className="text-gray-600 mb-4">Start selling by adding your first product</p>
            <Link to="/dashboard/seller/add-product" className="btn btn-primary">
              Add Your First Product
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products?.map(product => (
            <div key={product._id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
              <figure className="px-4 pt-4">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="rounded-xl h-48 w-full object-cover"
                />
              </figure>
              <div className="card-body p-4">
                <h3 className="card-title text-lg">{product.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold text-primary">
                    ৳{product.resalePrice}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ৳{product.originalPrice}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`badge font-semibold ${
  product.isSold ? 'badge-error' : 'badge-success'
}`}>
  {product.isSold ? 'Sold' : 'Available'}
</span>
                  <div className="flex gap-2">
  <button className="btn btn-outline btn-sm btn-info hover:text-white">
    Edit
  </button>
  <button className="btn btn-outline btn-sm btn-error hover:text-white">
    Delete
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