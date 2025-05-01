import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Navbar from './Navbar';
import Footer from './Footer';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import StoreDetailPage from './StoreDetailPage';
import Theme from './Theme';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (token && userId) {
      // Verify token and get user data
      const fetchUserData = async () => {
        try {
          // Using the stored token and user ID
          const response = await axios.get(`https://backend-one-hazel-88.vercel.app/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (response.data.success) {
            setUser(response.data.payload);
          } else {
            // Invalid token or user, clear storage
            handleLogout();
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
          // Clear invalid credentials
          handleLogout();
        } finally {
          setLoading(false);
          // Add a small delay to allow for animation
          setTimeout(() => setInitialLoad(false), 800);
        }
      };
      
      fetchUserData();
    } else {
      setLoading(false);
      // Add a small delay to allow for animation
      setTimeout(() => setInitialLoad(false), 800);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
  };

  const handleRegister = (userData) => {
    setUser(userData);
  };

  // Loading screen with enhanced animation
  if (loading || initialLoad) {
    return (
      <div className="flex items-center justify-center min-h-screen relative overflow-hidden" 
           style={{ backgroundColor: Theme.colors.background.default }}>
        {/* Background decorative elements */}
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full opacity-10"
             style={{ backgroundColor: Theme.colors.primary.light, filter: 'blur(60px)' }}></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full opacity-10"
             style={{ backgroundColor: Theme.colors.secondary.light, filter: 'blur(80px)' }}></div>
        
        <div className="flex flex-col items-center z-10">
          {/* Logo */}
          <div className="mb-8 relative">
            <div className="absolute inset-0 animate-ping rounded-full opacity-30"
                 style={{ backgroundColor: Theme.colors.primary.light }}></div>
            <div className="bg-white p-5 rounded-full shadow-lg relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" 
                   stroke={Theme.colors.primary.main} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
          </div>
          
          {/* Spinner */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full animate-ping opacity-25"
                 style={{ borderWidth: '4px', borderStyle: 'solid', borderColor: `${Theme.colors.primary.main} transparent ${Theme.colors.primary.main} transparent` }}></div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4" 
                 style={{ borderColor: Theme.colors.primary.main }}></div>
          </div>
          
          {/* Loading text with typing animation */}
          <div className="mt-6 overflow-hidden h-8">
            <p className="text-lg font-medium loading-text" 
               style={{ color: Theme.colors.primary.main }}>
              Loading UI Store<span className="loading-dots">...</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{
      backgroundImage: `
        radial-gradient(circle at 10% 20%, rgb(242, 242, 242) 0%, transparent 20%),
        radial-gradient(circle at 90% 50%, rgb(242, 242, 242) 0%, transparent 20%),
        radial-gradient(circle at 40% 80%, rgb(242, 242, 242) 0%, transparent 20%)
      `
    }}>
      <Router>
        <div className="min-h-screen flex flex-col fade-in" style={{ backgroundColor: Theme.colors.background.default }}>
          <Navbar user={user} logout={handleLogout} />
          
          <main className="container mx-auto px-4 py-8 flex-grow">
            <Routes>
              <Route path="/" element={<HomePage user={user} />} />
              <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage login={handleLogin} />} />
              <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage register={handleRegister} />} />
              <Route path="/store/:id" element={<StoreDetailPage user={user} />} />
              {/* Add other routes like ItemDetailPage when available */}
              
              {/* Catch-all route for 404 pages */}
              <Route path="*" element={
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="text-9xl font-bold mb-8" style={{ color: Theme.colors.primary.light }}>404</div>
                  <h1 className="text-2xl font-semibold mb-4" style={{ color: Theme.colors.neutral.darkGray }}>Page Not Found</h1>
                  <p className="text-center mb-8" style={{ color: Theme.colors.neutral.gray }}>
                    The page you are looking for doesn't exist or has been moved.
                  </p>
                  <button 
                    onClick={() => window.location.href = '/'}
                    className="px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                    style={{ 
                      backgroundColor: Theme.colors.primary.main, 
                      color: Theme.colors.primary.contrast,
                      boxShadow: Theme.shadows.md
                    }}
                  >
                    Back to Home
                  </button>
                </div>
              } />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </Router>
    </div>
  );
}

export default App;