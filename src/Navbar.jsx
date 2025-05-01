import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Theme from './Theme';

const Navbar = ({ user, logout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.user-dropdown')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'Products', path: '/products' },
    { title: 'Collections', path: '/collections' },
    { title: 'About', path: '/about' }
  ];

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'py-2 shadow-lg' : 'py-4 shadow-md'}`} 
      style={{ 
        backgroundColor: scrolled ? Theme.colors.primary.dark : Theme.colors.primary.main,
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center group">
            <div className="bg-white p-2 rounded-full mr-3 shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                stroke={Theme.colors.primary.dark} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="transition-transform group-hover:rotate-12">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
            <div>
              <span className="font-bold text-xl transition-all duration-300 group-hover:text-white" style={{ 
                color: Theme.colors.primary.contrast,
                fontFamily: Theme.typography.headingFontFamily,
                textShadow: scrolled ? '0px 1px 2px rgba(0,0,0,0.2)' : 'none'
              }}>UI <span className="font-light">Store</span></span>
            </div>
          </Link>

          {/* Desktop Menu Items */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map((link, index) => (
              <Link 
                key={index}
                to={link.path} 
                className={`font-medium relative py-2 group transition-all duration-300 ${location.pathname === link.path ? 'font-semibold' : ''}`} 
                style={{ color: Theme.colors.primary.contrast }}
              >
                {link.title}
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full ${location.pathname === link.path ? 'w-full' : ''}`}></span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 rounded-lg" 
            onClick={toggleMobileMenu}
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
              style={{ color: Theme.colors.primary.contrast }}>
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12"></path>
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18"></path>
              )}
            </svg>
          </button>

          {/* User Menu */}
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="relative user-dropdown">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 hover:shadow-md"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    transform: dropdownOpen ? 'scale(1.05)' : 'scale(1)'
                  }}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm transition-all duration-300 hover:shadow-md">
                    <span className="font-semibold text-sm" style={{ color: Theme.colors.primary.dark }}>
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                  <span className="font-medium" style={{ color: Theme.colors.primary.contrast }}>
                    ${user.balance?.toFixed(2) || '0.00'}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: Theme.colors.primary.contrast }}
                    className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-lg shadow-xl z-10 py-2 transition-all duration-300 animate-fadeIn"
                       style={{ 
                         backgroundColor: Theme.colors.background.paper,
                         boxShadow: Theme.shadows.lg,
                         borderRadius: Theme.borderRadius.lg 
                       }}>
                    <div className="px-6 py-4 border-b border-gray-100">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center mr-3"
                             style={{ backgroundColor: Theme.colors.primary.light }}>
                          <span className="font-bold text-lg" style={{ color: Theme.colors.primary.dark }}>
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold">{user.name || 'User'}</p>
                          <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="px-6 py-3 border-b border-gray-100">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500">Current Balance</p>
                        <p className="font-bold text-lg" style={{ color: Theme.colors.success.main }}>
                          ${user.balance?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                    </div>
                    <div className="p-2">
                      <Link 
                        to="/profile" 
                        className="flex items-center px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" 
                             fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" 
                             strokeLinejoin="round" className="mr-3" style={{ color: Theme.colors.primary.main }}>
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        My Profile
                      </Link>
                      <Link 
                        to="/orders" 
                        className="flex items-center px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" 
                             fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" 
                             strokeLinejoin="round" className="mr-3" style={{ color: Theme.colors.primary.main }}>
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="3" y1="9" x2="21" y2="9"></line>
                          <line x1="9" y1="21" x2="9" y2="9"></line>
                        </svg>
                        My Orders
                      </Link>
                      <Link 
                        to="/topup" 
                        className="flex items-center px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                        style={{ color: Theme.colors.secondary.dark }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" 
                             fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" 
                             strokeLinejoin="round" className="mr-3" style={{ color: Theme.colors.secondary.dark }}>
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Top Up Balance
                      </Link>
                      <div className="px-2 my-2 border-t border-gray-100"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                        style={{ color: Theme.colors.semantic.error }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" 
                             fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" 
                             strokeLinejoin="round" className="mr-3" style={{ color: Theme.colors.semantic.error }}>
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                          <polyline points="16 17 21 12 16 7"></polyline>
                          <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-x-3 flex items-center">
                <Link 
                  to="/login" 
                  className="px-4 py-2 rounded-full font-medium transition-all duration-300 hover:shadow-md hover:bg-opacity-40"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    color: Theme.colors.primary.contrast 
                  }}
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 rounded-full font-medium transition-all duration-300 hover:shadow-md hover:bg-opacity-90"
                  style={{ 
                    backgroundColor: Theme.colors.secondary.dark,
                    color: Theme.colors.secondary.contrast 
                  }}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg animate-slideDown" 
             style={{ backgroundColor: Theme.colors.background.paper }}>
          <div className="py-3">
            {navLinks.map((link, index) => (
              <Link 
                key={index}
                to={link.path} 
                className={`block px-4 py-3 font-medium transition-colors ${location.pathname === link.path ? 'font-semibold' : ''}`}
                style={{ 
                  color: location.pathname === link.path ? Theme.colors.primary.dark : Theme.colors.text.primary,
                  backgroundColor: location.pathname === link.path ? Theme.colors.primary.light + '20' : 'transparent'
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.title}
              </Link>
            ))}
            
            {user ? (
              <>
                <div className="border-t border-gray-100 my-2"></div>
                <div className="px-4 py-3">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                         style={{ backgroundColor: Theme.colors.primary.light }}>
                      <span className="font-bold" style={{ color: Theme.colors.primary.dark }}>
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{user.name || 'User'}</p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-3 p-3 rounded-lg"
                       style={{ backgroundColor: Theme.colors.background.default }}>
                    <p className="text-sm">Balance</p>
                    <p className="font-bold" style={{ color: Theme.colors.success.main }}>
                      ${user.balance?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <Link 
                    to="/topup" 
                    className="block w-full py-2 text-center rounded-lg font-medium mb-2"
                    style={{ 
                      backgroundColor: Theme.colors.secondary.light,
                      color: Theme.colors.secondary.dark 
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Top Up Balance
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full py-2 text-center rounded-lg font-medium"
                    style={{ 
                      backgroundColor: Theme.colors.semantic.error + '15',
                      color: Theme.colors.semantic.error 
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="border-t border-gray-100 my-2"></div>
                <div className="p-4 flex flex-col space-y-2">
                  <Link 
                    to="/login" 
                    className="w-full py-2 text-center rounded-lg font-medium"
                    style={{ 
                      backgroundColor: Theme.colors.primary.light,
                      color: Theme.colors.primary.dark 
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register" 
                    className="w-full py-2 text-center rounded-lg font-medium"
                    style={{ 
                      backgroundColor: Theme.colors.secondary.dark,
                      color: Theme.colors.secondary.contrast 
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

// Add these CSS animations to your global CSS file
const globalStyles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideDown {
  from { max-height: 0; opacity: 0; }
  to { max-height: 500px; opacity: 1; }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}

.animate-slideDown {
  animation: slideDown 0.3s ease-out forwards;
  overflow: hidden;
}
`;

export default Navbar;