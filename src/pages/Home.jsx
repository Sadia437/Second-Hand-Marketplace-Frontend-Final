import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import API from '../utils/axiosConfig';
import ProductCard from '../components/Product/ProductCard';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ParticlesBackground from '../components/ParticlesBackground';

export default function Home() {
  const [text, setText] = useState('');
  const fullText = "Secondhand Marketplace";
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + fullText.charAt(index));
        setIndex((prev) => prev + 1);
      }, 200); 
      return () => clearTimeout(timeout);
    } else {
      setText('');
      setIndex(0);
    }
  }, [index]);

  const { data: featuredProducts, isLoading, error } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const { data } = await API.get('/products?limit=8');
      return data.products;
    },
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  const categories = [
    { id: 'electronics', name: 'Electronics', icon: '📱', description: 'Smartphones, Laptops, Cameras & more', gradient: 'from-blue-500 to-cyan-500' },
    { id: 'furniture', name: 'Furniture', icon: '🛋️', description: 'Home & Office Furniture', gradient: 'from-amber-500 to-orange-500' },
    { id: 'vehicles', name: 'Vehicles', icon: '🚗', description: 'Cars, Bikes & Accessories', gradient: 'from-primary to-indigo-500' },
    { id: 'property', name: 'Property', icon: '🏠', description: 'Apartments, Lands & Commercial', gradient: 'from-purple-500 to-pink-500' },
  ];

  const stats = [
    { number: "2,500+", label: "Active Listings", description: "Quality pre-loved items", icon: "🛍️" },
    { number: "10,000+", label: "Happy Customers", description: "Trusted by users", icon: "😊" },
    { number: "500+", label: "Verified Sellers", description: "Trusted partners", icon: "✅" },
    { number: "98%", label: "Success Rate", description: "Satisfied customers", icon: "⭐" }
  ];

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Failed to load products</h2>
          <button onClick={() => window.location.reload()} className="btn btn-primary px-8 rounded-full">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="relative h-[85vh] w-full flex items-center justify-center bg-[#2563EB] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ParticlesBackground />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto pointer-events-none">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight drop-shadow-lg">
            Welcome to <br />
            <span className="text-yellow-400 min-h-[1.2em] inline-block border-r-4 border-yellow-400 pr-2 pointer-events-auto">
              {text}
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed opacity-95 pointer-events-auto drop-shadow-md">
            Bangladesh's trusted marketplace for buying and selling pre-loved items. 
            Join the sustainable shopping revolution! ♻️
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center pointer-events-auto">
            <Link to="/products" className="btn btn-lg bg-white text-[#2563EB] border-none hover:bg-gray-100 px-10 rounded-full font-bold shadow-2xl hover:scale-105 transition-all">
              🛍️ Start Shopping
            </Link>
            <Link to="/register" className="btn btn-lg bg-indigo-500 text-white border-none hover:bg-indigo-400 px-10 rounded-full font-bold shadow-2xl hover:scale-105 transition-all">
              🚀 Start Selling
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-base-100 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
              Browse <span className="text-primary">Categories</span>
            </h2>
            <div className="w-24 h-1.5 bg-primary mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                to={`/products?category=${category.id}`} 
                className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${category.gradient}`}></div>
                <div className="p-8 text-center">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">{category.icon}</div>
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{category.name}</h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4 md:mb-0">
              Featured <span className="text-primary">Products</span>
            </h2>
            <Link to="/products" className="text-primary font-bold hover:underline">View All Products →</Link>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts?.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-primary to-indigo-700 text-white relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all transform hover:scale-105">
                <div className="text-5xl mb-4">{stat.icon}</div>
                <div className="text-4xl font-black text-yellow-300 mb-2">{stat.number}</div>
                <div className="text-xl font-bold">{stat.label}</div>
                <p className="text-sm opacity-70 mt-2">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes blink { 50% { border-color: transparent } }
        .animate-typewriter { animation: blink 0.7s infinite; }
      `}</style>
    </div>
  );
}