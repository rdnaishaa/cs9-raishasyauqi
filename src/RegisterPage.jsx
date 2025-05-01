import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Theme from './Theme';

const RegisterPage = ({ register }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
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

    // Password validation according to backend requirements
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError('Password must be at least 8 characters long and contain at least 1 letter, 1 number, and 1 special character');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('https://backend-one-hazel-88.vercel.app/user/register', formData);
      
      if (response.data.success) {
        // Save token if the API returns one
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userId', response.data.payload.id);
        }
        
        // Call register function passed as prop
        register(response.data.payload);
        
        // Navigate to the homepage
        navigate('/');
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-w-full flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8" 
         style={{ backgroundColor: Theme.colors.background.default }}>
      <div className="max-w-lg w-full space-y-6 p-6 sm:p-8 rounded-xl" 
           style={{ backgroundColor: Theme.colors.background.paper, boxShadow: Theme.shadows.lg }}>
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div 
              className="p-3 rounded-full" 
              style={{ backgroundColor: Theme.colors.secondary.light }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8" 
                style={{ color: Theme.colors.secondary.main }}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" 
                />
              </svg>
            </div>
          </div>
          <h1 
            className="text-3xl font-extrabold mb-2" 
            style={{ 
              color: Theme.colors.secondary.dark,
              fontFamily: Theme.typography.headingFontFamily
            }}
          >
            Create Account
          </h1>
          <p className="text-gray-600">Join our community and start shopping</p>
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
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293-1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                clipRule="evenodd" 
              />
            </svg>
            <p className="text-sm" style={{ color: Theme.colors.semantic.error }}>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label 
              className="block text-sm font-medium mb-2" 
              style={{ color: Theme.colors.neutral.darkGray }}
              htmlFor="name"
            >
              Full Name
            </label>
            <div className="relative">
              <div 
                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                style={{ color: Theme.colors.neutral.gray }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                id="name"
                name="name"
                className="pl-10 pr-3 py-3 w-full rounded-lg border focus:ring-2 focus:outline-none transition-colors"
                style={{ 
                  borderColor: Theme.colors.neutral.lightGray,
                  backgroundColor: Theme.colors.background.default
                }}
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
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
                  backgroundColor: Theme.colors.background.default
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
            <p 
              className="text-xs mt-2 ml-1"
              style={{ color: Theme.colors.neutral.gray }}
            >
              Password must be at least 8 characters and include at least one letter, one number, and one special character.
            </p>
          </div>
          
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex justify-center items-center mt-6"
            style={{ 
              backgroundColor: Theme.colors.secondary.main, 
              color: Theme.colors.secondary.contrast,
              boxShadow: Theme.shadows.md,
              '&:hover': {
                backgroundColor: Theme.colors.secondary.dark,
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
                Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="font-medium hover:underline transition-colors"
              style={{ color: Theme.colors.secondary.main }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;