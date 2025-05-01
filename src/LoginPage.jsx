import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Theme from './Theme';

const LoginPage = ({ login }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('https://backend-one-hazel-88.vercel.app/user/login', formData);
      
      if (response.data.success) {
        // Save token in localStorage if needed
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);

        // Call the login function passed as a prop
        login(response.data.payload);

        // Navigate to the homepage or dashboard
        navigate('/');
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-w-full flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8" 
         style={{ backgroundColor: Theme.colors.background.default }}>
      <div className="max-w-md w-full space-y-8 p-6 sm:p-8 rounded-xl" 
           style={{ backgroundColor: Theme.colors.background.paper, boxShadow: Theme.shadows.lg }}>
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div 
              className="p-3 rounded-full" 
              style={{ backgroundColor: Theme.colors.primary.light }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8" 
                style={{ color: Theme.colors.primary.main }}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                />
              </svg>
            </div>
          </div>
          <h1 
            className="text-3xl font-extrabold mb-2" 
            style={{ 
              color: Theme.colors.primary.dark,
              fontFamily: Theme.typography.headingFontFamily
            }}
          >
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>
        
        {error && (
          <div 
            className="mb-6 p-4 rounded-lg border-l-4 flex items-start" 
            style={{ 
              backgroundColor: 'rgba(244, 67, 54, 0.08)',
              borderColor: Theme.colors.semantic.error 
            }}
          >
            <svg 
              className="h-5 w-5 mr-3 flex-shrink-0" 
              style={{ color: Theme.colors.semantic.error }}
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                clipRule="evenodd" 
              />
            </svg>
            <p className="text-sm" style={{ color: Theme.colors.semantic.error }}>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              className="block text-sm font-medium mb-2" 
              style={{ color: Theme.colors.neutral.darkGray }}
              htmlFor="email"
            >
              Email Address
            </label>
            <div className="relative">
              <div 
                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                style={{ color: Theme.colors.neutral.gray }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                type="email"
                id="email"
                name="email"
                className="pl-10 pr-3 py-3 w-full rounded-lg border focus:ring-2 focus:outline-none transition-colors"
                style={{ 
                  borderColor: Theme.colors.neutral.lightGray,
                  backgroundColor: Theme.colors.background.default,
                  '&:focus': {
                    borderColor: Theme.colors.primary.main,
                    ringColor: `${Theme.colors.primary.light}50`
                  }
                }}
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div>
            <label 
              className="block text-sm font-medium mb-2" 
              style={{ color: Theme.colors.neutral.darkGray }}
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <div 
                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                style={{ color: Theme.colors.neutral.gray }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                className="pl-10 pr-3 py-3 w-full rounded-lg border focus:ring-2 focus:outline-none transition-colors"
                style={{ 
                  borderColor: Theme.colors.neutral.lightGray,
                  backgroundColor: Theme.colors.background.default
                }}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <a 
              href="#" 
              className="text-sm font-medium hover:underline transition-colors"
              style={{ color: Theme.colors.primary.main }}
            >
              Forgot password?
            </a>
          </div>
          
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex justify-center items-center"
            style={{ 
              backgroundColor: Theme.colors.primary.main, 
              color: Theme.colors.primary.contrast,
              boxShadow: Theme.shadows.md,
              '&:hover': {
                backgroundColor: Theme.colors.primary.dark,
                transform: 'translateY(-1px)',
                boxShadow: Theme.shadows.lg,
              }
            }}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg 
                  className="animate-spin -ml-1 mr-3 h-5 w-5" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign in'
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Don't have an account yet?{' '}
            <Link 
              to="/register" 
              className="font-medium hover:underline transition-colors"
              style={{ color: Theme.colors.primary.main }}
            >
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;