import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Theme from './Theme'; // Assuming Theme file exists

const ItemDetailPage = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [store, setStore] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creatingTransaction, setCreatingTransaction] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedItems, setRelatedItems] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchItemAndStore = async () => {
      try {
        const itemResponse = await axios.get(`https://backend-one-hazel-88.vercel.app/item/byId/${id}`);
        
        if (itemResponse.data.success) {
          setItem(itemResponse.data.payload);
          
          // Fetch store details
          const storeResponse = await axios.get(`https://backend-one-hazel-88.vercel.app/store/${itemResponse.data.payload.store_id}`);
          if (storeResponse.data.success) {
            setStore(storeResponse.data.payload);
            
            // Simulate fetching related items (would be real in production)
            setTimeout(() => {
              setRelatedItems([
                { id: 1, name: 'Similar Product 1', price: 19.99, image_url: '/api/placeholder/150/150' },
                { id: 2, name: 'Similar Product 2', price: 24.99, image_url: '/api/placeholder/150/150' },
                { id: 3, name: 'Similar Product 3', price: 17.99, image_url: '/api/placeholder/150/150' },
              ]);
            }, 500);
          }
        } else {
          setError('Failed to fetch item details');
        }
      } catch (err) {
        setError('Error connecting to the server');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItemAndStore();
    // Reset state when product changes
    return () => {
      setQuantity(1);
      setImageLoaded(false);
    };
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= item.stock) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < item.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleBuy = async () => {
    if (quantity > item.stock) {
      toast.error('Quantity exceeds available stock');
      return;
    }

    setCreatingTransaction(true);
    try {
      const response = await axios.post('https://backend-one-hazel-88.vercel.app/transaction/create', {
        item_id: item.id,
        quantity: quantity,
        user_id: user.id
      });

      if (response.data.success) {
        // Proceed to payment
        const transactionId = response.data.payload.id;
        const paymentResponse = await axios.post(`https://backend-one-hazel-88.vercel.app/transaction/pay/${transactionId}`);
        
        if (paymentResponse.data.success) {
          toast.success('Payment successful!');
          navigate('/'); // Redirect to home page after successful purchase
        } else {
          toast.error(paymentResponse.data.message || 'Payment failed');
        }
      } else {
        toast.error(response.data.message || 'Failed to create transaction');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error processing your purchase');
      console.error(err);
    } finally {
      setCreatingTransaction(false);
    }
  };

  const addToCart = () => {
    // In real implementation, this would add to cart
    toast.info(`Added ${quantity} ${item.name} to your cart!`);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md">
        <div className="flex">
          <div className="py-1">
            <svg className="h-6 w-6 text-red-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p className="font-bold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-10">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="mt-4 text-xl text-gray-600">Product not found</p>
        <Link 
          to="/" 
          className="mt-4 inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>
    );
  }

  const totalPrice = item.price * quantity;
  const canAfford = user.balance >= totalPrice;
  const discountPercentage = 15; // Example discount
  const originalPrice = (totalPrice / (1 - discountPercentage / 100)).toFixed(2);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center mb-6">
        <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center transition-colors">
          <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Shop
        </Link>
        
        <nav className="mx-4 flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-1 text-sm text-gray-500">
            <li><Link to="/" className="hover:text-gray-700">Home</Link></li>
            <li className="flex items-center">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li><Link to="/category" className="hover:text-gray-700">{item.category || 'Products'}</Link></li>
            <li className="flex items-center">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="text-gray-700 font-medium truncate">{item.name}</li>
          </ol>
        </nav>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden lg:flex">
        {/* Product Image Section */}
        <div className="lg:w-2/5 relative bg-gray-100">
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`}>
            <div className="animate-pulse flex space-x-4">
              <div className="w-full h-96 bg-gray-300"></div>
            </div>
          </div>
          
          <img 
            src={item.image_url || '/api/placeholder/600/600'} 
            alt={item.name}
            className={`w-full h-96 object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Sale badge */}
          <div className="absolute top-4 left-4">
            <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              {discountPercentage}% OFF
            </div>
          </div>
        </div>
        
        {/* Product Details Section */}
        <div className="p-8 lg:w-3/5">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{item.name}</h1>
              {store && (
                <div className="mt-1 flex items-center">
                  <span className="text-gray-600 text-sm">by</span>
                  <Link to={`/store/${store.id}`} className="ml-1 text-blue-600 hover:underline text-sm font-medium">
                    {store.name}
                  </Link>
                </div>
              )}
            </div>
            
            {/* Wishlist button */}
            <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-red-500 transition-colors">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
          
          {/* Rating stars (example) */}
          <div className="flex items-center mt-2">
            <div className="flex text-yellow-400">
              {[...Array(4)].map((_, i) => (
                <svg key={i} className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
              <svg className="h-5 w-5 fill-current text-gray-300" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            </div>
            <span className="ml-2 text-sm text-gray-600">4.0 (128 reviews)</span>
          </div>
          
          {/* Price */}
          <div className="mt-6 flex items-center">
            <p className="text-3xl font-bold text-blue-600">${item.price.toFixed(2)}</p>
            <p className="ml-3 text-gray-500 line-through text-lg">${originalPrice}</p>
            <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">SAVE ${(originalPrice - totalPrice).toFixed(2)}</span>
          </div>
          
          {/* Stock status */}
          <div className="mt-4">
            <div className="flex items-center">
              <div className={`h-3 w-3 rounded-full ${item.stock > 10 ? 'bg-green-500' : item.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
              <span className="ml-2 text-sm font-medium">
                {item.stock > 10 ? 'In Stock' : item.stock > 0 ? 'Low Stock' : 'Out of Stock'}
              </span>
              <span className="ml-1 text-sm text-gray-500">
                {item.stock > 0 ? `(${item.stock} remaining)` : ''}
              </span>
            </div>
          </div>
          
          {/* Description */}
          <div className="mt-6">
            <p className="text-gray-600">
              {item.description || 'Premium quality product with excellent features and durability. Perfect for everyday use and designed with attention to detail.'}
            </p>
          </div>
          
          {/* Quantity selector */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <div className="flex border rounded-lg w-36">
              <button 
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className={`w-10 h-10 flex items-center justify-center rounded-l-lg ${quantity <= 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                </svg>
              </button>
              <input
                type="number"
                min="1"
                max={item.stock}
                className="w-16 px-2 py-1 text-center focus:outline-none border-x"
                value={quantity}
                onChange={handleQuantityChange}
              />
              <button 
                onClick={incrementQuantity}
                disabled={quantity >= item.stock}
                className={`w-10 h-10 flex items-center justify-center rounded-r-lg ${quantity >= item.stock ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Total and balance */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between">
              <span className="text-gray-600">Total:</span>
              <span className="font-bold text-lg">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mt-1 text-sm">
              <span className="text-gray-500">Your balance:</span>
              <span className={`font-medium ${canAfford ? 'text-green-600' : 'text-red-500'}`}>
                ${user.balance.toFixed(2)}
              </span>
            </div>
            {!canAfford && (
              <p className="text-red-500 text-xs mt-1">
                Insufficient balance for this purchase.
              </p>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              onClick={addToCart}
              disabled={item.stock <= 0}
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Add to Cart
            </button>
            <button
              onClick={handleBuy}
              disabled={creatingTransaction || item.stock <= 0 || !canAfford}
              className={`flex items-center justify-center px-4 py-3 rounded-lg font-medium text-white transition-colors ${
                creatingTransaction || item.stock <= 0 || !canAfford ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {creatingTransaction ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : item.stock <= 0 ? 'Out of Stock' : !canAfford ? 'Insufficient Balance' : 'Buy Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailPage;