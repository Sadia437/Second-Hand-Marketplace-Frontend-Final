import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/axiosConfig';
import toast from 'react-hot-toast';

export default function Login() {
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '' 
  });
  const [loading, setLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTime, setLockTime] = useState(0);
  
  const { login, googleSignIn, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // যদি ইউজার আগে থেকেই লগইন করা থাকে তবে হোম পেজে পাঠিয়ে দাও
  useEffect(() => {
    if (currentUser) {
      navigate('/', { replace: true });
    }
  }, [currentUser, navigate]);

  const from = location.state?.from?.pathname || '/';

  // অ্যাকাউন্ট লক চেক (Security feature)
  useEffect(() => {
    const storedLock = localStorage.getItem('accountLock');
    if (storedLock) {
      const lockData = JSON.parse(storedLock);
      const now = Date.now();
      if (now < lockData.until) {
        setIsLocked(true);
        setLockTime(Math.ceil((lockData.until - now) / 1000 / 60));
      } else {
        localStorage.removeItem('accountLock');
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ 
      ...prev, 
      [e.target.name]: e.target.value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLocked) {
      toast.error(`Account locked. Try in ${lockTime} minutes.`);
      return;
    }
    
    setLoading(true);
    try {
      // ১. আপনার কাস্টম মঙ্গোডিবি ব্যাকএন্ডে রিকোয়েস্ট পাঠানো
      const { data } = await API.post('/users/login', {
        email: formData.email.toLowerCase(),
        password: formData.password
      });

      if (data.token) {
        // টোকেন লোকাল স্টোরেজে সেভ করা
        localStorage.setItem('token', data.token);
        
        // ২. ফায়ারবেস বা কনটেক্সট লগইন (এটি ক্যাচ ব্লকের ভেতরে রাখা হয়েছে যাতে ফায়ারবেস এরর দিলেও ডাটাবেস লগইন কাজ করে)
        try {
          await login(formData.email, formData.password);
        } catch (authErr) {
          console.warn("Auth context sync issues:", authErr.message);
        }

        localStorage.removeItem('accountLock');
        toast.success('Welcome back! 🎉');
        
        // ৩. রোল অনুযায়ী নেভিগেশন (অ্যাডমিন হলে সরাসরি ড্যাশবোর্ড)
        if (data.role === 'admin') {
            window.location.href = '/dashboard/admin';
        } else {
            window.location.href = from;
        }
      }
      
    } catch (error) {
      console.error('❌ Login error:', error);
      const message = error.response?.data?.message || 'Invalid email or password';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isLocked) return;
    setLoading(true);
    try {
      const result = await googleSignIn();
      const user = result.user;

      const { data } = await API.post('/users/google-login', {
        email: user.email,
        name: user.displayName,
        googleId: user.uid,
        photoURL: user.photoURL
      });

      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      toast.success('Google login successful! 🎉');
      window.location.href = '/';
      
    } catch (error) {
      console.error('❌ Google login error:', error);
      toast.error('Google login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    const demoAccounts = {
      admin: { email: 'admin@secondhand.com', password: 'admin123' },
      seller: { email: 'john@gmail.com', password: 'password123' },
      buyer: { email: 'sadia8@gmail.com', password: 'password123' }
    };
    setFormData(demoAccounts[role]);
    toast.success(`${role.toUpperCase()} credentials loaded!`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#f3f4f6]">
      {/* Background Blurs */}
      <div className="absolute top-[-5%] right-[-5%] w-[35%] h-[35%] bg-[#2563EB]/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-5%] left-[-5%] w-[35%] h-[35%] bg-[#2563EB]/15 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-md z-10 px-4">
        <div className="bg-white p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-800">
              Secondhand <span className="text-[#2563EB]">Marketplace</span>
            </h1>
            <p className="text-gray-400 mt-2 font-medium">Sign in to your account</p>
          </div>

          {/* Quick Demo Login Buttons */}
          <div className="flex gap-2 justify-center mb-8">
            {['admin', 'seller', 'buyer'].map(role => (
              <button 
                key={role} 
                onClick={() => handleDemoLogin(role)} 
                className="px-3 py-1 bg-gray-50 text-gray-500 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-[#2563EB] hover:text-white transition-all duration-200 border border-gray-100"
              >
                {role}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
              value={formData.email}
              onChange={handleChange}
              required
            />
            
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full py-4 bg-[#2563EB] text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:bg-[#1d4ed8] hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:bg-gray-300"
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>

          <div className="relative my-8 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <span className="relative px-4 bg-white text-gray-400 text-xs font-bold uppercase tracking-widest">Or</span>
          </div>

          <button 
            onClick={handleGoogleLogin} 
            disabled={loading}
            className="w-full py-4 border border-gray-200 rounded-xl flex items-center justify-center space-x-3 hover:bg-gray-50 transition-all active:scale-[0.98]"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            <span className="text-gray-600 font-semibold">Continue with Google</span>
          </button>

          <p className="text-center mt-8 text-sm text-gray-500">
            Don't have an account? <Link to="/register" className="text-[#2563EB] font-bold hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}