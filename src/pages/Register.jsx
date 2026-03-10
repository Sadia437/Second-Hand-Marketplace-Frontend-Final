import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/axiosConfig';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/UI/LoadingSpinner';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer',
    phone: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  const { signup, googleSignIn, currentUser, error, clearError } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, navigate]);

  // Show error toast if there's an auth error
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const validateField = (name, value) => {
    const errors = {};
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          errors.name = 'Full name is required';
        } else if (value.trim().length < 2) {
          errors.name = 'Name must be at least 2 characters';
        }
        break;
        
      case 'email':
        if (!value) {
          errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Please enter a valid email address';
        }
        break;
        
      case 'password':
        if (!value) {
          errors.password = 'Password is required';
        } else if (value.length < 6) {
          errors.password = 'Password must be at least 6 characters';
        } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(value)) {
          errors.password = 'Password must contain letters and numbers';
        }
        break;
        
      case 'confirmPassword':
        if (!value) {
          errors.confirmPassword = 'Please confirm your password';
        } else if (value !== formData.password) {
          errors.confirmPassword = 'Passwords do not match';
        }
        break;
        
      case 'phone':
        if (value && !/^\+?[\d\s-()]{10,}$/.test(value)) {
          errors.phone = 'Please enter a valid phone number';
        }
        break;
        
      default:
        break;
    }
    
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Check password strength
    if (name === 'password') {
      checkPasswordStrength(value);
    }

    // Validate field on change if it's been touched
    if (touched[name]) {
      const errors = validateField(name, value);
      setFormErrors(prev => ({
        ...prev,
        ...errors
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const errors = validateField(name, value);
    setFormErrors(prev => ({
      ...prev,
      ...errors
    }));
  };

  const checkPasswordStrength = (password) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    const mediumRegex = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;

    if (strongRegex.test(password)) {
      setPasswordStrength('strong');
    } else if (mediumRegex.test(password)) {
      setPasswordStrength('medium');
    } else if (password.length > 0) {
      setPasswordStrength('weak');
    } else {
      setPasswordStrength('');
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'strong': return 'text-primary';
      case 'medium': return 'text-yellow-600';
      case 'weak': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 'strong': return 'Strong password ✓';
      case 'medium': return 'Medium password';
      case 'weak': return 'Weak password';
      default: return 'Enter a password';
    }
  };

  const getPasswordStrengthBar = () => {
    switch (passwordStrength) {
      case 'strong': return 'w-full bg-primary';
      case 'medium': return 'w-2/3 bg-yellow-500';
      case 'weak': return 'w-1/3 bg-red-500';
      default: return 'w-0 bg-gray-300';
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Validate required fields
    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
      isValid = false;
    }

    if (!formData.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain letters and numbers';
      isValid = false;
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setFormErrors(errors);
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      role: true
    });

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    setLoading(true);

    try {
      console.log('🚀 Starting registration process...');
      
      // Backend registration
      const { data } = await API.post('/users/register', {
        name: formData.name.trim(),
        email: formData.email.toLowerCase(),
        password: formData.password,
        role: formData.role,
        phone: formData.phone || undefined,
        location: formData.location || undefined
      });

      console.log('✅ Backend registration completed');

      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      
      toast.success('🎉 Account created successfully!');
      
      // Show role-specific guidance
      if (formData.role === 'seller') {
        toast.success('📋 Your seller account is pending verification. You will be notified once approved.');
      } else {
        toast.success('🛍️ Welcome! Start exploring sustainable products.');
      }
      
      console.log('🔄 Redirecting to dashboard...');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('❌ Registration process failed:', error);
      
      // Enhanced error handling
      const errorMessages = {
        'auth/email-already-in-use': 'This email is already registered. Please try logging in.',
        'auth/invalid-email': 'The email address is invalid.',
        'auth/weak-password': 'Please choose a stronger password.',
        'auth/network-request-failed': 'Network connection failed. Please check your internet.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.'
      };

      if (error.code && errorMessages[error.code]) {
        toast.error(errorMessages[error.code]);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Registration failed. Please check your information and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);

    try {
      console.log('🔐 Initiating Google OAuth registration...');
      const result = await googleSignIn();
      const user = result.user;

      console.log('✅ Google authentication successful');

      // Register with backend using Google info
      const { data } = await API.post('/users/google-auth', {
        name: user.displayName,
        email: user.email,
        googleId: user.uid,
        role: 'buyer',
        photoURL: user.photoURL
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      
      console.log('✅ Backend registration completed');
      
      toast.success('🎉 Welcome! Google registration successful.');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('❌ Google registration failed:', error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        toast.info('Google registration was cancelled.');
      } else if (error.code === 'auth/network-request-failed') {
        toast.error('🌐 Network error. Please check your connection.');
      } else if (error.response?.status === 400 && error.response?.data?.message === 'User already exists') {
        toast.error('An account with this email already exists. Please try logging in.');
      } else {
        toast.error('Unable to register with Google. Please try another method.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary/10 via-white to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        
        <div className="text-center">
          <Link to="/" className="inline-block transition-transform hover:scale-105 mb-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-linear-to-br from-primary to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl text-white">🛍️</span>
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-black bg-linear-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
                  Secondhand Marketplace
                </h1>
                <p className="text-xs text-gray-500 font-medium -mt-1">Sustainable Marketplace</p>
              </div>
            </div>
          </Link>
          
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-600 mt-2">Join our sustainable marketplace</p>
        </div>

        <div className="bg-white py-8 px-6 shadow-2xl rounded-3xl border border-gray-100">
        
          <form onSubmit={handleSubmit} className="space-y-6">
           
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
                  formErrors.name ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                required
                disabled={loading}
              />
              {formErrors.name && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="w-4 h-4 mr-1">⚠️</span>
                  {formErrors.name}
                </p>
              )}
            </div>
            
           
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="your.email@example.com"
                className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
                  formErrors.email ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                required
                disabled={loading}
              />
              {formErrors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="w-4 h-4 mr-1">⚠️</span>
                  {formErrors.email}
                </p>
              )}
            </div>

            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="+8801XXXXXXXXX"
                  className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
                    formErrors.phone ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={loading}
                />
                {formErrors.phone && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="w-4 h-4 mr-1">⚠️</span>
                    {formErrors.phone}
                  </p>
                )}
              </div>
              
              
              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Your city/area"
                  className={`w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={loading}
                />
              </div>
            </div>
            
           
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                I want to *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`relative border-2 rounded-2xl p-4 cursor-pointer transition-all duration-200 ${
                  formData.role === 'buyer' 
                    ? 'border-primary bg-primary/10 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="buyer"
                    checked={formData.role === 'buyer'}
                    onChange={handleChange}
                    className="sr-only"
                    disabled={loading}
                  />
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-lg">🛒</span>
                    </div>
                    <span className="font-medium text-gray-900">Buy Products</span>
                  </div>
                  <div className={`absolute top-3 right-3 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    formData.role === 'buyer' ? 'border-primary bg-primary' : 'border-gray-300'
                  }`}>
                    {formData.role === 'buyer' && (
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    )}
                  </div>
                </label>

                <label className={`relative border-2 rounded-2xl p-4 cursor-pointer transition-all duration-200 ${
                  formData.role === 'seller' 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="seller"
                    checked={formData.role === 'seller'}
                    onChange={handleChange}
                    className="sr-only"
                    disabled={loading}
                  />
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">🏪</span>
                    </div>
                    <span className="font-medium text-gray-900">Sell Products</span>
                  </div>
                  <div className={`absolute top-3 right-3 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    formData.role === 'seller' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}>
                    {formData.role === 'seller' && (
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    )}
                  </div>
                </label>
              </div>
              
              {formData.role === 'seller' && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-2xl p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm">ℹ️</span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-blue-900 text-sm">Seller Verification Required</h5>
                      <p className="text-blue-700 text-xs mt-1">
                        Your seller account will need admin verification before you can start listing products.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Create a secure password"
                  className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 pr-12 ${
                    formErrors.password ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  required
                  minLength="6"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              
             
              {formData.password && (
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-medium ${getPasswordStrengthColor()}`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthBar()}`}></div>
                  </div>
                </div>
              )}
              
              {formErrors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="w-4 h-4 mr-1">⚠️</span>
                  {formErrors.password}
                </p>
              )}
            </div>
            
          
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password *
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Re-enter your password"
              className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
                  formErrors.confirmPassword ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                required
                disabled={loading}
              />
              {formErrors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="w-4 h-4 mr-1">⚠️</span>
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>
            
            
            <button 
              type="submit" 
              className="w-full bg-linear-to-r from-primary to-indigo-600 text-white py-4 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>🎉</span>
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>
          
          
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

           
            <button 
              onClick={handleGoogleRegister}
              className="mt-6 w-full flex justify-center items-center py-4 px-4 border border-gray-300 rounded-2xl shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 hover:scale-105 disabled:opacity-50"
              disabled={loading}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>
          
          
          <div className="mt-8 text-center pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
              className="font-semibold text-primary hover:text-indigo-500 transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>

         
          <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-200">
            <p className="text-xs text-blue-700 text-center">
              By creating an account, you agree to our{' '}
              <a href="/terms" className="font-semibold underline hover:text-blue-800 transition-colors" target="_blank" rel="noopener noreferrer">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="font-semibold underline hover:text-blue-800 transition-colors" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>

      
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full mx-4">
            <div className="flex flex-col items-center space-y-4">
              <LoadingSpinner size="lg" />
              <p className="text-lg font-semibold text-gray-900">Creating your account</p>
              <p className="text-sm text-gray-600 text-center">
                Please wait while we set up your account...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}