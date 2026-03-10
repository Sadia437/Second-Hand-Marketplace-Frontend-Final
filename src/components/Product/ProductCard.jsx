import React from 'react';
import { Link } from 'react-router-dom';
import tomatoImg from '../../assets/tomato.jpg';

export default function ProductCard({ product }) {
  
  const imageUrl = product?.image && product.image !== 'N/A' ? product.image : tomatoImg;

  
  const formatTime = (date) => {
    if (!date) return 'Just now';
    const now = new Date();
    const posted = new Date(date);
    const diff = now - posted;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl border border-gray-100 transition-all duration-500 overflow-hidden flex flex-col h-full">
      
     
      <div className="relative h-60 overflow-hidden bg-gray-100">
        <img 
          src={imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = tomatoImg;
          }}
        />
        <div className="absolute top-4 right-4">
          <span className="bg-white/90 backdrop-blur-md text-[#4F46E5] px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm">
            {product.category || 'Secondhand'}
          </span>
        </div>
      </div>

      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-extrabold text-gray-900 text-lg mb-2 truncate group-hover:text-[#4F46E5] transition-colors">
          {product.name}
        </h3>

        
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-black text-[#4F46E5]">
            ৳{product.resalePrice || product.price || '0'}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through font-medium">৳{product.originalPrice}</span>
          )}
        </div>

        
        <div className="flex items-center gap-3 mb-6 bg-gray-50 p-3 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-[#4F46E5] flex items-center justify-center text-white font-black shadow-lg shadow-indigo-100">
            {product.seller?.name?.charAt(0) || 'S'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
              <span className="truncate">{product.seller?.name || 'Trusted Seller'}</span>
              
             
              <svg className="w-4 h-4 text-[#10B981] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.24.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
              </svg>
            </span>
            <span className="text-[10px] text-gray-500 font-medium tracking-tight">Posted {formatTime(product.postedTime)}</span>
          </div>
        </div>

      
     <Link 
  to={`/product/${product._id}`}
  className="mt-auto block w-full bg-[#EEF2FF] text-[#4F46E5] text-center py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#4F46E5] hover:text-white hover:-translate-y-1 transition-all duration-300 border border-[#E0E7FF]"
>
  View Details
</Link>
      </div>
    </div>
  );
}