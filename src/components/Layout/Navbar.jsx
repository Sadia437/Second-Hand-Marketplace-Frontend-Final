import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  
  const { currentUser, dbUser, logout, loading } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('token');
      localStorage.removeItem('access-token');
      localStorage.removeItem('user-role');
      setProfileOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/products', label: 'Products', icon: '🛍️' },
    { path: '/blog', label: 'Blog', icon: '📚' },
  ];

  const isActiveRoute = (path) => {
    return path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
  };

  const getUserInitials = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return currentUser?.email?.[0]?.toUpperCase() || 'U';
  };

  const isAdmin = dbUser?.role === 'admin' || currentUser?.email === 'ronjusadia92@gmail.com';

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-gray-100' 
            : 'bg-white/90 backdrop-blur-lg shadow-lg'
        }`}
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            
           
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-primary to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-lg lg:text-xl font-bold">🛍️</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl lg:text-2xl font-black bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
                  Secondhand
                </span>
                <span className="text-xs text-gray-500 font-medium -mt-1">Marketplace</span>
              </div>
            </Link>

            {/* Nav Items */}
            <div className="hidden lg:flex lg:items-center lg:space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    isActiveRoute(item.path) ? 'text-primary bg-primary/10' : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                </Link>
              ))}
              
              {currentUser && isAdmin && (
                <Link
                  to="/dashboard"
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    isActiveRoute('/dashboard') ? 'text-primary bg-primary/10' : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span className="text-lg">📊</span>
                    <span>Dashboard</span>
                  </span>
                </Link>
              )}
            </div>

           
            <div className="flex items-center space-x-3">
              {currentUser ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center space-x-3 p-1.5 rounded-2xl hover:bg-gray-50 transition-all duration-300 border border-transparent hover:border-gray-100"
                  >
                    <div className="w-10 h-10 lg:w-11 lg:h-11 bg-gradient-to-br from-primary to-indigo-600 rounded-2xl flex items-center justify-center text-white font-semibold shadow-lg overflow-hidden">
                      {currentUser.photoURL ? (
                        <img 
                          src={currentUser.photoURL} 
                          alt="User" 
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${currentUser.displayName || 'User'}&background=6366f1&color=fff`; }}
                        />
                      ) : (
                        <span className="text-lg">{getUserInitials()}</span>
                      )}
                    </div>
                    
                    <div className="hidden lg:block text-left mr-1">
                      <div className="font-bold text-gray-900 text-sm leading-tight">
                        {currentUser.displayName || 'User'}
                      </div>
                      <div className="text-[10px] text-primary font-bold uppercase tracking-wider">
                        {isAdmin ? 'Admin' : (dbUser?.role || 'Buyer')}
                      </div>
                    </div>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                      <div className="p-6 bg-gradient-to-r from-primary/10 to-indigo-50 border-b">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-xl overflow-hidden shadow-inner">
                            {currentUser.photoURL ? (
                              <img src={currentUser.photoURL} alt="User" className="w-full h-full object-cover" />
                            ) : getUserInitials()}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 truncate w-44">{currentUser.displayName || 'User'}</h3>
                            <p className="text-gray-600 text-xs truncate w-44">{currentUser.email}</p>
                            <span className="inline-block px-2 py-0.5 mt-1 bg-primary text-white text-[10px] font-black rounded-full uppercase">
                              {isAdmin ? 'Admin' : (dbUser?.role || 'Buyer')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 space-y-1">
                        {isAdmin && (
                             <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center space-x-2 p-3 rounded-xl hover:bg-indigo-50 text-gray-700 font-semibold transition-colors">
                               <span>📊</span> <span>Dashboard</span>
                             </Link>
                        )}
                        <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center space-x-2 p-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-colors">
                          <span>👤</span> <span>Profile Settings</span>
                        </Link>
                        <button onClick={handleLogout} className="w-full flex items-center space-x-2 p-3 rounded-xl hover:bg-red-50 text-red-600 font-bold mt-2 transition-colors">
                          <span>🚪</span> <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link 
                    to="/login" 
                    className="px-6 py-2.5 bg-indigo-500 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700 hover:shadow-lg active:scale-95 transition-all duration-300 text-sm lg:text-base border border-indigo-700/10"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-6 py-2.5 bg-indigo-500 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700 hover:shadow-lg active:scale-95 transition-all duration-300 text-sm lg:text-base border border-indigo-700/10"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <div className="h-16 lg:h-20"></div>
    </>
  );
}