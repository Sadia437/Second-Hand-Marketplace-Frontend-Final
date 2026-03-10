import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const apiUrl = categoryId 
  ? `https://second-hand-marketplace-backend-final.onrender.com/api/products?category=${categoryId}` 
  : 'https://second-hand-marketplace-backend-final.onrender.com/api/products?limit=50';
          
        const response = await axios.get(apiUrl);
        setProducts(response.data.products || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("পণ্যগুলো লোড করা সম্ভব হয়নি।");
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5b1ee9]"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-20 text-red-500 font-bold">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      
     
      <section className="relative bg-[#2563EB] py-20 text-center text-white mb-12 shadow-md overflow-hidden">
        
       
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white/20 rounded-full animate-float"
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 10 + 5}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

       
        <div className="relative z-10">
          <div className="flex justify-center items-center gap-3 mb-2">
            <span className="text-4xl animate-bounce-slow">🛍️</span>
            
            <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-lg">
              {categoryId 
                ? categoryId.charAt(0).toUpperCase() + categoryId.slice(1).toLowerCase() 
                : "All Collections"}
            </h1>
          </div>
          
          <p className="text-lg font-medium opacity-90 drop-shadow-md">
            {products.length > 0 ? `${products.length} টি আইটেম পাওয়া গেছে` : "কোনো পণ্য পাওয়া হয়নি"}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {categoryId && (
           <div className="mb-8 flex justify-end">
              <Link to="/products" className="text-sm font-bold text-[#4F46E5] hover:underline bg-white px-6 py-2 rounded-full shadow-sm border border-slate-100">
                ← Show All Products
              </Link>
           </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product._id} className="group bg-white rounded-[30px] overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300">
              
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
                  }}
                />
                <span className="absolute top-3 right-3 bg-black/50 text-white text-[10px] px-2 py-1 rounded">
                  {product.category}
                </span>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold text-slate-800 truncate group-hover:text-[#4F46E5] transition-colors">{product.name}</h3>
                <p className="text-xs text-slate-500 mb-2">
                    📍 {product.location || 'N/A'} • {product.condition || 'Used'}
                </p>
                
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-black text-slate-900">৳{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-slate-400 line-through">৳{product.originalPrice}</span>
                  )}
                </div>
                
                <div className="flex items-center gap-3 mb-5 p-2 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white text-xs">
                    {product.seller?.name?.charAt(0) || 'S'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="text-[11px] font-bold text-slate-700 truncate">{product.seller?.name || "Verified Seller"}</p>
                    </div>
                    <p className="text-[9px] text-slate-400 font-semibold uppercase">Trusted Partner</p>
                  </div>
                </div>

                <Link to={`/product/${product._id}`} className="block w-full text-center py-3.5 bg-[#F1F5F9] text-[#4F46E5] rounded-[18px] font-bold text-[10px] uppercase tracking-wider hover:bg-[#4F46E5] hover:text-white transition-all duration-300 shadow-sm">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) translateX(0px); opacity: 0; }
          25% { opacity: 0.5; }
          50% { transform: translateY(-100px) translateX(20px); opacity: 0.8; }
          75% { opacity: 0.5; }
          100% { transform: translateY(-200px) translateX(-20px); opacity: 0; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float linear infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}