import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { FiMail, FiLock, FiLoader } from 'react-icons/fi';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/admin-dashboard');
    }
    
    window.scrollTo(0, 0);
  }, [navigate]);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    // Loading toast
    const loadingToast = toast.loading("Logging in...", {
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });

    try {
      const response = await axios.post("https://react-task-cyan-nine.vercel.app/login", {
        email,
        password,
      });
      
      console.log('Login response data: ', response.data);
      
      if (response.data.status === true) {
        // Dismiss loading toast
        toast.dismiss(loadingToast);
        
        toast.success("Login successful! Welcome to Admin Dashboard.", {
          icon: '👋',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
          duration: 3000,
        });
        
        // Store admin credentials
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("adminEmail", email);
        localStorage.setItem("isAdmin", "true");
        
        // Handle admin profile data if available
        if (response.data.user) {
          localStorage.setItem("adminName", response.data.user.name || "Admin");
          if (response.data.user.photo) {
            localStorage.setItem("adminPhoto", response.data.user.photo);
          }
          localStorage.setItem("adminRole", response.data.user.role || "Administrator");
        }
        
        // Short delay for better UX
        setTimeout(() => {
          // Navigate to admin dashboard
          navigate("/admin-dashboard");
        }, 1000);
      } else {
        // Dismiss loading toast
        toast.dismiss(loadingToast);
        
        setError(response.data.message || "Login failed");
        toast.error(response.data.message || "Login failed", {
          icon: '❌',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Login failed');
        toast.error(err.response.data.message || 'Login failed', {
          icon: '❌',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      } else {
        setError('Login failed. Please check your credentials or try again later.');
        toast.error('Login failed. Please check your credentials or try again later.', {
          icon: '❌',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            <span className="text-orange-500">D</span>Cart Admin
          </h1>
          <p className="text-sm text-gray-500">Sign in to your Admin account</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
        
        <form className="space-y-6 mt-8" onSubmit={handleSubmit}>
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                id="email"
                className="pl-10 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-3 transition-all duration-200"
                placeholder="admin@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="text-right">
                <a 
                  href="/admin-forgot-password" 
                  className="text-sm font-medium text-orange-600 hover:text-orange-500"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                id="password"
                className="pl-10 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-3 transition-all duration-200"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  {passwordVisible ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 shadow-md"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Logging in...
                </span>
              ) : (
                "Sign in to Admin"
              )}
            </button>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an admin account?{" "}
              <Link
                to="/admin-signup"
                className="font-medium text-orange-600 hover:text-orange-500"
              >
                Create admin account
              </Link>
            </p>
          </div>
          
          <div className="text-center border-t border-gray-200 pt-4 mt-4">
            <Link
              to="/"
              className="text-sm font-medium text-gray-600 hover:text-orange-500"
            >
              Return to Store
            </Link>
          </div>
        </form>
      </div>
      
      {/* Toast Container */}
      <Toaster position="top-center" reverseOrder={false} />
    </section>
  );
};

export default AdminLogin; 