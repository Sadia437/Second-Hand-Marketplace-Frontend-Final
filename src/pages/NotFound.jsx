import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  const errorMessages = [
    "Oops! This page went on an adventure and got lost.",
    "Looks like this page took a wrong turn at the internet.",
    "We searched everywhere, but this page is playing hide and seek.",
    "This page must be on vacation. Can't seem to find it!",
    "404: Page not found. Even our best detectives are stumped!"
  ];

  const randomMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)];

  const quickLinks = [
    { path: '/', label: 'Home', icon: '🏠', description: 'Back to homepage' },
    { path: '/products', label: 'Browse Products', icon: '🛍️', description: 'Discover amazing deals' },
    { path: '/blog', label: 'Blog', icon: '📚', description: 'Read helpful guides' },
    { path: '/dashboard', label: 'Dashboard', icon: '📊', description: 'Your account dashboard' }
  ];

  return (
    <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center px-4 py-12 space-y-12">
      
      
      <div className="relative text-center">
        <span className="text-9xl font-bold text-primary">4</span>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-24 h-24 bg-linear-to-r from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <span className="text-4xl text-white">0</span>
          </div>
        </div>
        <span className="text-9xl font-bold text-primary">4</span>
      </div>

      
      <div className="text-center max-w-2xl space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">Page Not Found</h1>
        <p className="text-lg text-gray-600">{randomMessage}</p>
        <div className="text-6xl animate-pulse">🔍</div>
      </div>

     
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          onClick={() => navigate(-1)}
          className="btn btn-primary btn-lg flex items-center gap-2"
        >
          ← Go Back
        </button>
        <Link to="/" className="btn btn-outline btn-lg flex items-center gap-2">
          🏠 Homepage
        </Link>
      </div>

     
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickLinks.map((link, index) => (
          <Link
            key={index}
            to={link.path}
            className="card bg-base-200 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 p-4 text-center"
          >
            <div className="text-3xl mb-2">{link.icon}</div>
            <h3 className="card-title justify-center text-lg">{link.label}</h3>
            <p className="text-sm text-gray-600">{link.description}</p>
          </Link>
        ))}
      </div>

     
      <div className="card bg-base-200 shadow-lg max-w-2xl w-full">
        <div className="card-body">
          <h3 className="card-title text-xl justify-center mb-4">Can't find what you're looking for?</h3>
          <div className="join w-full max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search products, categories..."
              className="input input-bordered join-item flex-1"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  navigate(`/products?search=${e.target.value}`);
                }
              }}
            />
            <button 
              className="btn btn-primary join-item"
              onClick={() => {
                const input = document.querySelector('input');
                if (input.value) navigate(`/products?search=${input.value}`);
              }}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      
      <div className="text-center mt-8 space-y-2">
        <div className="text-8xl">🌿</div>
        <div className="relative w-8 h-8 mx-auto">
          <div className="absolute top-0 left-0 bg-error text-error-content rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold animate-ping">?</div>
        </div>
        <p className="text-gray-500">Don't worry, even our green leaf got a little lost!</p>
      </div>

     
      <div className="mt-8 p-6 bg-base-200 rounded-2xl max-w-2xl w-full flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/contact" className="btn btn-ghost flex-1 flex items-center justify-center gap-2">
          📧 Contact Support
        </Link>
        <Link to="/blog" className="btn btn-ghost flex-1 flex items-center justify-center gap-2">
          📚 Visit Blog
        </Link>
      </div>

      
      <div className="fixed bottom-10 left-10 opacity-20 animate-float text-6xl">🛒</div>
      <div className="fixed top-10 right-10 opacity-20 animate-float text-6xl" style={{ animationDelay: '2s' }}>🌱</div>
      <div className="fixed top-1/2 left-20 opacity-20 animate-float text-4xl" style={{ animationDelay: '4s' }}>💰</div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
