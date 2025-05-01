import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Theme from './Theme';
import { motion, AnimatePresence } from 'framer-motion';

const HomePage = ({ user }) => {
  const [items, setItems] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStore, setSelectedStore] = useState('all');
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [featuredItems, setFeaturedItems] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showQuickView, setShowQuickView] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  const categories = ['all', 'electronics', 'clothing', 'home', 'sports', 'toys'];
  const heroRef = useRef(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const [itemsResponse, storesResponse] = await Promise.all([
          axios.get('https://backend-one-hazel-88.vercel.app/item'),
          axios.get('https://backend-one-hazel-88.vercel.app/store/getAll')
        ]);

        if (itemsResponse.data.success && storesResponse.data.success) {
          const allItems = itemsResponse.data.payload.map(item => ({
            ...item,
            image: `https://backend-one-hazel-88.vercel.app/item/${item.id}/image`
          }));
          setItems(allItems);
          setStores(storesResponse.data.payload);
          
          // Set featured items (random selection of 4 items)
          const randomItems = [...allItems].sort(() => 0.5 - Math.random()).slice(0, 4);
          setFeaturedItems(randomItems);
        } else {
          setError('Failed to fetch data');
        }
      } catch (err) {
        setError('Error connecting to the server');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();

    // Add scroll event listener
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simulate categories (since they're not in the original data)
  const getRandomCategory = () => {
    const catIndex = Math.floor(Math.random() * (categories.length - 1)) + 1;
    return categories[catIndex];
  };

  const handleStoreFilter = (storeId) => {
    setSelectedStore(storeId);
  };

  const handleCategoryFilter = (category) => {
    setActiveCategory(category);
  };

  const addToCart = (item) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      setCartItems(
        cartItems.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        )
      );
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
    
    showNotificationMessage('Item added to cart!', 'success');
  };

  const toggleWishlist = (itemId) => {
    if (wishlist.includes(itemId)) {
      setWishlist(wishlist.filter(id => id !== itemId));
      showNotificationMessage('Removed from wishlist', 'info');
    } else {
      setWishlist([...wishlist, itemId]);
      showNotificationMessage('Added to wishlist!', 'success');
    }
  };

  const showNotificationMessage = (message, type = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
    showNotificationMessage('Item removed from cart', 'info');
  };

  const updateCartItemQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems(
      cartItems.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const filteredByStoreItems = selectedStore === 'all' 
    ? items 
    : items.filter(item => item.store_id === parseInt(selectedStore));
    
  // Apply category filter (simulated)
  const categoryFilteredItems = activeCategory === 'all'
    ? filteredByStoreItems
    : filteredByStoreItems.filter(item => {
        // Assign a pseudo-random but consistent category to each item based on its ID
        const itemCategory = categories[(item.id % (categories.length - 1)) + 1];
        return itemCategory === activeCategory;
      });
    
  // Apply search filter if search query exists
  const searchFilteredItems = searchQuery 
    ? categoryFilteredItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : categoryFilteredItems;

  // Function to get store name by ID
  const getStoreName = (storeId) => {
    const store = stores.find(s => s.id === storeId);
    return store ? store.name : 'Unknown Store';
  };

  const scrollToProducts = () => {
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-full bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <div className="text-center">
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 rounded-full animate-ping opacity-20"
                 style={{ backgroundColor: Theme.colors.primary.main }}></div>
            <div className="absolute inset-2 rounded-full animate-spin"
                 style={{ 
                   borderWidth: '4px', 
                   borderStyle: 'solid', 
                   borderColor: `${Theme.colors.primary.main} transparent ${Theme.colors.secondary.main} transparent`,
                   animation: 'spin 1s linear infinite'
                 }}></div>
            <div className="absolute inset-4 rounded-full animate-pulse"
                 style={{ backgroundColor: `${Theme.colors.primary.main}30` }}></div>
          </div>
          <p className="mt-4 text-lg font-medium animate-pulse" style={{ color: Theme.colors.primary.main }}>
            Loading amazing products...
          </p>
          <p className="text-sm mt-2" style={{ color: Theme.colors.neutral.gray }}>
            This won't take long
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg p-4 mb-4 flex items-center" style={{ backgroundColor: `${Theme.colors.semantic.error}20` }}>
          <div className="rounded-full p-2 mr-3" style={{ backgroundColor: `${Theme.colors.semantic.error}30` }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={Theme.colors.semantic.error}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span style={{ color: Theme.colors.semantic.error }}>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: Theme.colors.background.default }}>
      {/* Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div 
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="fixed top-20 right-4 z-50 rounded-lg shadow-lg px-4 py-3 flex items-center"
            style={{ 
              backgroundColor: notificationType === 'success' 
                ? Theme.colors.semantic.success
                : notificationType === 'error'
                ? Theme.colors.semantic.error
                : Theme.colors.neutral.darkGray,
              color: '#ffffff'
            }}
          >
            <span className="mr-2">
              {notificationType === 'success' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {notificationType === 'error' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              {notificationType === 'info' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              )}
            </span>
            {notificationMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shopping Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', ease: 'easeOut', duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 shadow-xl overflow-y-auto"
              style={{ backgroundColor: Theme.colors.background.paper }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold" style={{ color: Theme.colors.neutral.black }}>Your Cart</h2>
                  <button 
                    className="p-2 rounded-full hover:bg-gray-100"
                    onClick={() => setIsCartOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={Theme.colors.neutral.gray}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {cartItems.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="mx-auto w-24 h-24 mb-4 rounded-full flex items-center justify-center"
                         style={{ backgroundColor: `${Theme.colors.neutral.lightGray}30` }}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke={Theme.colors.neutral.gray}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2" style={{ color: Theme.colors.neutral.darkGray }}>Your cart is empty</h3>
                    <p className="text-sm mb-6" style={{ color: Theme.colors.neutral.gray }}>Start adding items to see them here</p>
                    <button 
                      className="px-6 py-2 rounded-full text-sm font-medium"
                      style={{ 
                        backgroundColor: Theme.colors.primary.main,
                        color: Theme.colors.primary.contrast
                      }}
                      onClick={() => setIsCartOpen(false)}
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {cartItems.map(item => (
                        <div key={item.id} className="flex items-center p-3 rounded-lg" style={{ backgroundColor: `${Theme.colors.background.default}90` }}>
                          <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                          <div className="ml-3 flex-grow">
                            <h4 className="font-medium" style={{ color: Theme.colors.neutral.black }}>{item.name}</h4>
                            <div className="flex justify-between items-center mt-1">
                              <p className="font-bold" style={{ color: Theme.colors.primary.main }}>${item.price}</p>
                              <div className="flex items-center">
                                <button 
                                  className="w-6 h-6 rounded-full flex items-center justify-center"
                                  style={{ backgroundColor: Theme.colors.neutral.lightGray }}
                                  onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                  </svg>
                                </button>
                                <span className="mx-2 w-6 text-center">{item.quantity}</span>
                                <button 
                                  className="w-6 h-6 rounded-full flex items-center justify-center"
                                  style={{ backgroundColor: Theme.colors.primary.main, color: 'white' }}
                                  onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                          <button 
                            className="ml-2 p-1 rounded-full"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke={Theme.colors.neutral.gray}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-b py-4 mb-6" style={{ borderColor: Theme.colors.neutral.lightGray }}>
                      <div className="flex justify-between mb-2">
                        <span style={{ color: Theme.colors.neutral.gray }}>Subtotal</span>
                        <span style={{ color: Theme.colors.neutral.black }}>${getTotalPrice()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: Theme.colors.neutral.gray }}>Shipping</span>
                        <span style={{ color: Theme.colors.neutral.black }}>Free</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-6">
                      <span className="text-lg font-bold" style={{ color: Theme.colors.neutral.black }}>Total</span>
                      <span className="text-xl font-bold" style={{ color: Theme.colors.primary.main }}>${getTotalPrice()}</span>
                    </div>

                    <button 
                      className="w-full py-3 rounded-lg font-bold text-white mb-4"
                      style={{ 
                        backgroundColor: Theme.colors.primary.main,
                        boxShadow: `0 4px 14px ${Theme.colors.primary.main}40`
                      }}
                    >
                      Checkout Now
                    </button>

                    <button 
                      className="w-full py-3 rounded-lg font-medium border"
                      style={{ 
                        borderColor: Theme.colors.neutral.lightGray,
                        color: Theme.colors.neutral.darkGray
                      }}
                      onClick={() => setIsCartOpen(false)}
                    >
                      Continue Shopping
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Header - Gets sticky on scroll */}
      <header 
        className={`sticky top-0 z-30 w-full transition-all duration-300 ${isScrolled ? 'py-2 shadow-lg' : 'py-4'}`}
        style={{ 
          backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(10px)' : 'none'
        }}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold mr-8" style={{ color: isScrolled ? Theme.colors.primary.main : '#ffffff' }}>
              SBD<span className="text-gradient">Store</span>
            </h1>
            
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="font-medium hover:opacity-80 transition-opacity" style={{ color: isScrolled ? Theme.colors.neutral.darkGray : '#ffffff' }}>Home</a>
              <a href="#products-section" className="font-medium hover:opacity-80 transition-opacity" style={{ color: isScrolled ? Theme.colors.neutral.darkGray : '#ffffff' }}>Products</a>
              <a href="#" className="font-medium hover:opacity-80 transition-opacity" style={{ color: isScrolled ? Theme.colors.neutral.darkGray : '#ffffff' }}>Stores</a>
              <a href="#" className="font-medium hover:opacity-80 transition-opacity" style={{ color: isScrolled ? Theme.colors.neutral.darkGray : '#ffffff' }}>Deals</a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
              onClick={() => setIsCartOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={isScrolled ? Theme.colors.neutral.darkGray : '#ffffff'}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: Theme.colors.secondary.main }}>
                  {cartItems.length}
                </span>
              )}
            </button>
            
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={isScrolled ? Theme.colors.neutral.darkGray : '#ffffff'}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            
            {user ? (
              <button className="flex items-center space-x-2 rounded-full p-2 hover:bg-white/10 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:inline" style={{ color: isScrolled ? Theme.colors.neutral.darkGray : '#ffffff' }}>
                  {user?.name || 'User'}
                </span>
              </button>
            ) : (
              <button className="rounded-full px-4 py-2 text-sm font-medium"
                      style={{ 
                        backgroundColor: isScrolled ? Theme.colors.primary.main : 'rgba(255, 255, 255, 0.2)', 
                        color: isScrolled ? '#ffffff' : '#ffffff'
                      }}>
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero section - Dynamic with parallax effect */}
      <div ref={heroRef} className="w-full relative h-[70vh] overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-blue-900 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        {/* Animated circles */}
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-purple-600 opacity-20 blur-3xl animate-blob"></div>
        <div className="absolute top-1/2 -right-20 w-96 h-96 rounded-full bg-blue-600 opacity-20 blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 left-1/3 w-96 h-96 rounded-full bg-indigo-600 opacity-20 blur-3xl animate-blob animation-delay-4000"></div>
        
        <div className="container mx-auto px-4 h-full relative z-10">
          <div className="flex flex-col md:flex-row h-full items-center justify-between">
            <div className="md:w-1/2 pt-24 md:pt-0">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-5xl md:text-6xl font-bold mb-4 text-white"
              >
                Discover <span className="inline-block relative">
                  <span className="relative z-10">Amazing</span>
                  <span className="absolute bottom-1 left-0 right-0 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg z-0 opacity-60"></span>
                </span> Products
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl mb-8 text-blue-100"
              >
                Shop the latest trends with exclusive deals and discounts
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <div className="relative rounded-full overflow-hidden flex-grow">
                  <input 
                    type="text" 
                    placeholder="Search for products..." 
                    className="w-full pl-12 pr-4 py-4 rounded-full border-none focus:ring-2 focus:ring-opacity-50 shadow-lg"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      color: Theme.colors.neutral.black,
                      focusRing: Theme.colors.primary.light
                    }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" 
                         stroke={Theme.colors.neutral.gray}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                
                <button 
                  onClick={scrollToProducts}
                  className="px-8 py-4 rounded-full font-medium transition-all duration-300 hover:scale-105 text-center flex items-center justify-center"
                  style={{ 
                    backgroundColor: Theme.colors.secondary.main, 
                    color: 'white',
                    boxShadow: Theme.shadows.md
                  }}
                >
                  Explore Now
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden md:block md:w-1/2 relative"
            >
              <div className="relative flex items-center justify-center h-96">
                {/* Animated floating product cards */}
                {featuredItems.slice(0, 3).map((item, index) => (
                  <div 
                    key={item.id}
                    className="absolute bg-white rounded-xl overflow-hidden shadow-xl"
                    style={{ 
                      width: '220px',
                      height: '280px',
                      top: index === 0 ? '5%' : index === 1 ? '35%' : '65%',
                      left: index === 0 ? '20%' : index === 1 ? '60%' : '30%',
                      zIndex: 3 - index,
                      transform: `rotate(${index === 0 ? -8 : index === 1 ? 5 : -3}deg)`,
                      animation: `float ${3 + index}s ease-in-out infinite alternate`
                    }}
                  >
                    <img src={item.image} alt={item.name} className="w-full h-3/5 object-cover" />
                    <div className="p-3">
                      <h3 className="font-bold text-sm" style={{ color: Theme.colors.neutral.black }}>{item.name}</h3>
                      <p className="font-bold text-lg mt-1" style={{ color: Theme.colors.primary.main }}>${item.price}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: `${Theme.colors.secondary.main}20`, color: Theme.colors.secondary.main }}>
                          New Arrival
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={Theme.colors.primary.main} viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Decorative elements */}
                <div className="absolute w-64 h-64 rounded-full" 
                     style={{ 
                       background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 100%)',
                       backdropFilter: 'blur(20px)',
                       border: '1px solid rgba(255,255,255,0.1)',
                       top: '30%',
                       left: '40%',
                       zIndex: 0
                     }}>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Financial info for logged in users */}
        {user && (
          <div className="absolute top-6 right-6 flex space-x-4">
            <div className="bg-white bg-opacity-90 rounded-lg px-5 py-3 shadow-lg">
              <p className="text-sm" style={{ color: Theme.colors.neutral.gray }}>My Balance</p>
              <p className="text-2xl font-bold" style={{ color: Theme.colors.primary.main }}>
                ${user?.balance?.toFixed(2) || '0.00'}
              </p>
            </div>
            <button 
              className="rounded-lg px-5 py-3 flex items-center justify-center font-medium transition-all duration-300 hover:scale-105 shadow-lg"
              style={{ 
                backgroundColor: Theme.colors.primary.main, 
                color: 'white'
              }}
              onClick={() => setShowTopUp(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Top Up
            </button>
          </div>  
        )}
      </div>

      {/* Categories scroller */}
      <div className="bg-white py-4 shadow-sm sticky top-16 z-20" style={{ backgroundColor: Theme.colors.background.paper }}>
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto no-scrollbar gap-3 pb-1">
            {categories.map(category => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${activeCategory === category ? 'shadow-md' : ''}`}
                style={{ 
                  backgroundColor: activeCategory === category ? Theme.colors.primary.main : `${Theme.colors.neutral.lightGray}30`,
                  color: activeCategory === category ? Theme.colors.primary.contrast : Theme.colors.neutral.darkGray
                }}
                onClick={() => handleCategoryFilter(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Featured Products Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2" style={{ color: Theme.colors.neutral.black }}>Featured Products</h2>
          <p style={{ color: Theme.colors.neutral.gray }}>Hand-picked selection of products just for you</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map(item => (
            <motion.div
              key={item.id}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="rounded-xl overflow-hidden shadow-lg h-full flex flex-col"
              style={{ backgroundColor: Theme.colors.background.paper }}
            >
              <div className="relative">
                <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                <div className="absolute top-2 right-2 flex flex-col gap-2">
                  <button 
                    className="p-2 rounded-full shadow bg-white/80 hover:bg-white transition-colors"
                    onClick={() => toggleWishlist(item.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={wishlist.includes(item.id) ? Theme.colors.semantic.error : "none"} viewBox="0 0 24 24" stroke={wishlist.includes(item.id) ? Theme.colors.semantic.error : Theme.colors.neutral.gray}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <button 
                    className="p-2 rounded-full shadow bg-white/80 hover:bg-white transition-colors"
                    onClick={() => setShowQuickView(item.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke={Theme.colors.neutral.gray}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
                <div className="absolute left-0 top-2">
                  <div className="px-3 py-1 text-xs font-bold" style={{ backgroundColor: Theme.colors.secondary.main, color: '#fff' }}>
                    Featured
                  </div>
                </div>
              </div>
              
              <div className="p-4 flex-grow">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-semibold" style={{ color: Theme.colors.neutral.black }}>{item.name}</h3>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill={Theme.colors.secondary.main} viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    <span className="text-xs ml-1" style={{ color: Theme.colors.neutral.gray }}>
                      {4 + Math.floor(Math.random() * 10) / 10}
                    </span>
                  </div>
                </div>
                <p className="text-sm mb-3" style={{ color: Theme.colors.neutral.gray }}>
                  {item.description || `Premium quality ${item.name.toLowerCase()} with amazing features.`}
                </p>
                <p className="text-sm mb-4">
                  <span className="font-medium" style={{ color: Theme.colors.neutral.darkGray }}>Sold by:</span> 
                  <span className="ml-1" style={{ color: Theme.colors.primary.main }}>{getStoreName(item.store_id)}</span>
                </p>
              </div>
              
              <div className="p-4 pt-0 mt-auto">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-xl" style={{ color: Theme.colors.primary.main }}>${item.price}</p>
                  <button 
                    className="px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                    style={{ 
                      backgroundColor: Theme.colors.primary.main, 
                      color: Theme.colors.primary.contrast
                    }}
                    onClick={() => addToCart(item)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* New Arrivals with slider-like scrolling */}
      <div className="py-12" style={{ backgroundColor: `${Theme.colors.primary.main}08` }}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-1" style={{ color: Theme.colors.neutral.black }}>New Arrivals</h2>
              <p style={{ color: Theme.colors.neutral.gray }}>Fresh products that just landed in our stores</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded-full border" style={{ borderColor: Theme.colors.neutral.lightGray }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke={Theme.colors.neutral.darkGray}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                className="p-2 rounded-full" 
                style={{ 
                  backgroundColor: Theme.colors.primary.main,
                  color: Theme.colors.primary.contrast
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="flex overflow-x-auto gap-6 pb-6 no-scrollbar">
            {items.slice(0, 8).map(item => (
              <div key={item.id} className="min-w-[250px] w-[250px] rounded-xl overflow-hidden shadow-md bg-white flex flex-col">
                <div className="relative">
                  <img src={item.image} alt={item.name} className="w-full h-40 object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="text-white font-semibold">{item.name}</p>
                    <p className="text-white/80 text-sm">in {getStoreName(item.store_id)}</p>
                  </div>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <p className="font-bold" style={{ color: Theme.colors.primary.main }}>${item.price}</p>
                  <button 
                    className="p-2 rounded-full"
                    style={{ backgroundColor: Theme.colors.primary.main, color: Theme.colors.primary.contrast }}
                    onClick={() => addToCart(item)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Store filters and main content - Contained */}
      <div id="products-section" className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Store filters */}
          <div className="lg:w-64 w-full flex-shrink-0">
            <div className="sticky top-28 p-5 rounded-xl w-full" 
                 style={{ backgroundColor: Theme.colors.background.paper, boxShadow: Theme.shadows.sm }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: Theme.colors.neutral.black }}>Filter by Store</h2>
              
              <div className="space-y-2">
                <button
                  className={`w-full px-4 py-3 rounded-lg flex items-center transition-all duration-300 ${selectedStore === 'all' ? 'shadow' : ''}`}
                  style={{ 
                    backgroundColor: selectedStore === 'all' ? Theme.colors.primary.main : 'transparent',
                    color: selectedStore === 'all' ? Theme.colors.primary.contrast : Theme.colors.neutral.darkGray,
                  }}
                  onClick={() => handleStoreFilter('all')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  All Stores
                </button>
                
                {stores.map(store => (
                  <button
                    key={store.id}
                    className={`w-full px-4 py-3 rounded-lg flex items-center transition-all duration-300 ${selectedStore === store.id.toString() ? 'shadow' : ''}`}
                    style={{ 
                      backgroundColor: selectedStore === store.id.toString() ? Theme.colors.primary.main : 'transparent',
                      color: selectedStore === store.id.toString() ? Theme.colors.primary.contrast : Theme.colors.neutral.darkGray,
                    }}
                    onClick={() => handleStoreFilter(store.id.toString())}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    {store.name}
                  </button>
                ))}
              </div>
              
              {/* Price range filter */}
              <div className="mt-8 pt-6 border-t" style={{ borderColor: Theme.colors.neutral.lightGray }}>
                <h3 className="text-sm font-medium mb-4" style={{ color: Theme.colors.neutral.gray }}>Price Range</h3>
                
                <div className="relative h-2 rounded-full mb-6" style={{ backgroundColor: Theme.colors.neutral.lightGray }}>
                  <div className="absolute h-full rounded-full" 
                       style={{ 
                         backgroundColor: Theme.colors.primary.main,
                         width: '60%' 
                       }}></div>
                  <div className="absolute h-4 w-4 rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer" 
                       style={{ 
                         backgroundColor: Theme.colors.primary.main,
                         left: '20%',
                         border: '2px solid white',
                         boxShadow: Theme.shadows.sm
                       }}></div>
                  <div className="absolute h-4 w-4 rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer" 
                       style={{ 
                         backgroundColor: Theme.colors.primary.main,
                         left: '80%',
                         border: '2px solid white',
                         boxShadow: Theme.shadows.sm
                       }}></div>
                </div>
                
                <div className="flex justify-between">
                  <div className="px-3 py-1 rounded" style={{ backgroundColor: `${Theme.colors.background.default}80` }}>
                    <span className="text-sm font-medium" style={{ color: Theme.colors.neutral.darkGray }}>$10</span>
                  </div>
                  <div className="px-3 py-1 rounded" style={{ backgroundColor: `${Theme.colors.background.default}80` }}>
                    <span className="text-sm font-medium" style={{ color: Theme.colors.neutral.darkGray }}>$1000</span>
                  </div>
                </div>
              </div>
              
              {/* Quick stats */}
              <div className="mt-8 pt-6 border-t" style={{ borderColor: Theme.colors.neutral.lightGray }}>
                <h3 className="text-sm font-medium mb-3" style={{ color: Theme.colors.neutral.gray }}>Quick Stats</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm" style={{ color: Theme.colors.neutral.darkGray }}>Total Stores</span>
                    <span className="font-medium" style={{ color: Theme.colors.primary.main }}>{stores.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm" style={{ color: Theme.colors.neutral.darkGray }}>Total Products</span>
                    <span className="font-medium" style={{ color: Theme.colors.primary.main }}>{items.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm" style={{ color: Theme.colors.neutral.darkGray }}>Available Now</span>
                    <span className="font-medium" style={{ color: Theme.colors.semantic.success }}>
                      {items.filter(item => item.stock > 0).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main content - Products grid */}
          <div className="flex-grow">
            {/* Results summary and sort options */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-semibold" style={{ color: Theme.colors.neutral.black }}>
                  {selectedStore === 'all' ? 'All Products' : `Products from ${getStoreName(parseInt(selectedStore))}`}
                </h2>
                <p style={{ color: Theme.colors.neutral.gray }}>
                  Showing {searchFilteredItems.length} of {filteredByStoreItems.length} products
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button 
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" 
                         stroke={viewMode === 'grid' ? Theme.colors.primary.main : Theme.colors.neutral.gray}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button 
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" 
                         stroke={viewMode === 'list' ? Theme.colors.primary.main : Theme.colors.neutral.gray}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm" style={{ color: Theme.colors.neutral.gray }}>Sort by:</span>
                  <select 
                    className="px-3 py-2 rounded border bg-white"
                    style={{ borderColor: Theme.colors.neutral.lightGray }}
                  >
                    <option>Newest</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Popularity</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products grid/list */}
            {searchFilteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 rounded-lg" 
                   style={{ backgroundColor: Theme.colors.background.paper, boxShadow: Theme.shadows.sm }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke={Theme.colors.neutral.gray}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m14 0V5a2 2 0 00-2-2H5a2 2 0 00-2 2v2m2 4h10l2 2m-2-2v10a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1" />
                </svg>
                <h3 className="text-lg font-medium mb-2" style={{ color: Theme.colors.neutral.darkGray }}>No Products Found</h3>
                <p className="text-sm text-center mb-6" style={{ color: Theme.colors.neutral.gray }}>
                  We couldn't find any products matching your criteria
                </p>
                <button
                  className="px-4 py-2 rounded-lg font-medium"
                  style={{ backgroundColor: Theme.colors.primary.main, color: Theme.colors.primary.contrast }}
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedStore('all');
                    setActiveCategory('all');
                  }}
                >
                  Clear Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {searchFilteredItems.map((item) => (
                  <motion.div 
                    key={item.id} 
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="w-full h-full rounded-xl overflow-hidden shadow-lg bg-white transition-all"
                  >
                    <div className="relative">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button 
                          className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                          onClick={() => addToCart(item)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke={Theme.colors.primary.main}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </button>
                        <button 
                          className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                          onClick={() => toggleWishlist(item.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={wishlist.includes(item.id) ? Theme.colors.semantic.error : "none"} viewBox="0 0 24 24" stroke={Theme.colors.semantic.error}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold" style={{ color: Theme.colors.neutral.black }}>{item.name}</h3>
                        <span className="text-sm font-bold" style={{ color: Theme.colors.primary.main }}>${item.price}</span>
                      </div>
                      <p className="text-sm mb-3" style={{ color: Theme.colors.neutral.gray }}>
                        {item.description || `High-quality ${item.name.toLowerCase()} available now`}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: Theme.colors.neutral.darkGray }}>
                          {getStoreName(item.store_id)}
                        </span>
                        <button 
                          className="px-3 py-1 rounded-lg text-sm font-medium"
                          style={{ backgroundColor: Theme.colors.primary.main, color: Theme.colors.primary.contrast }}
                          onClick={() => addToCart(item)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {searchFilteredItems.map((item) => (
                  <div 
                    key={item.id}
                    className="flex gap-6 p-4 rounded-xl shadow-lg bg-white"
                  >
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-48 h-48 object-cover rounded-lg"
                    />
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold" style={{ color: Theme.colors.neutral.black }}>{item.name}</h3>
                        <span className="text-lg font-bold" style={{ color: Theme.colors.primary.main }}>${item.price}</span>
                      </div>
                      <p className="text-sm mb-4" style={{ color: Theme.colors.neutral.gray }}>
                        {item.description || `High-quality ${item.name.toLowerCase()} available now`}
                      </p>
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: `${Theme.colors.neutral.lightGray}30`, color: Theme.colors.neutral.darkGray }}>
                          {getStoreName(item.store_id)}
                        </span>
                        <span className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: `${Theme.colors.semantic.success}20`, color: Theme.colors.semantic.success }}>
                          In Stock
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          className="px-4 py-2 rounded-lg font-medium"
                          style={{ backgroundColor: Theme.colors.primary.main, color: Theme.colors.primary.contrast }}
                          onClick={() => addToCart(item)}
                        >
                          Add to Cart
                        </button>
                        <button 
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: `${Theme.colors.neutral.lightGray}30` }}
                          onClick={() => toggleWishlist(item.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={wishlist.includes(item.id) ? Theme.colors.semantic.error : "none"} viewBox="0 0 24 24" stroke={Theme.colors.semantic.error}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;