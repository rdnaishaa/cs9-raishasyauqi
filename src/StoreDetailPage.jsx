import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ItemCard from './ItemCard';

const StoreDetailPage = ({ user }) => {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchStoreAndItems = async () => {
      try {
        const [storeResponse, itemsResponse] = await Promise.all([
          axios.get(`https://backend-one-hazel-88.vercel.app/store/${id}`),
          axios.get(`https://backend-one-hazel-88.vercel.app/item/byStoreId/${id}`)
        ]);

        if (storeResponse.data.success) {
          const storeData = {
            ...storeResponse.data.payload,
            image: `https://backend-one-hazel-88.vercel.app/store/${id}/image`
          };
          setStore(storeData);
        } else {
          setError('Failed to fetch store details');
        }

        if (itemsResponse.data.success) {
          setItems(itemsResponse.data.payload);
        } else {
          setError('Failed to fetch store items');
        }
      } catch (err) {
        setError('Error connecting to the server');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreAndItems();
  }, [id]);

  // Get unique categories from items
  const categories = items.length > 0 
    ? ['all', ...new Set(items.map(item => item.category || 'Uncategorized'))]
    : ['all'];

  // Filter items by active category
  const filteredItems = activeCategory === 'all' 
    ? items 
    : items.filter(item => (item.category || 'Uncategorized') === activeCategory);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
        <p className="mt-4 text-purple-600 font-medium">Loading store details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-medium">{error}</p>
        </div>
        <div className="mt-4">
          <Link to="/" className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-xl shadow-inner">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p className="text-2xl font-bold text-gray-600 mt-4">Store not found</p>
        <p className="text-gray-500 mt-2">The store you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="mt-6 inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium transition duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to All Stores
        </Link>
      </div>

      {/* Store Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl shadow-xl p-8 mb-10 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">{store.name}</h1>
            <div className="flex items-center mt-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p>{store.address}</p>
            </div>
          </div>
          <div className="mt-6 md:mt-0">
            <div className="flex items-center bg-white bg-opacity-20 rounded-lg px-4 py-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Open 9:00 AM - 9:00 PM</span>
            </div>
            <div className="flex items-center mt-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2">4.9/5 from 120 reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      {categories.length > 1 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Filter by Category:</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg transition duration-200 ${
                  activeCategory === category
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700'
                }`}
              >
                {category === 'all' ? 'All Products' : category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Product Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {activeCategory === 'all' ? 'All Products' : activeCategory} 
          <span className="text-gray-500 ml-2 text-lg">({filteredItems.length} items)</span>
        </h2>
      
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
            <p className="text-xl font-medium text-gray-600 mt-4">No products available</p>
            <p className="text-gray-500 mt-2">
              {activeCategory !== 'all' 
                ? `No products found in the "${activeCategory}" category.`
                : 'This store has no products listed at the moment.'}
            </p>
            {activeCategory !== 'all' && (
              <button 
                onClick={() => setActiveCategory('all')}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200"
              >
                View All Products
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map(item => (
              <ItemCard key={item.id} item={item} userId={user?.id} />
            ))}
          </div>
        )}
      </div>

      {/* Store Info */}
      <div className="bg-white rounded-xl shadow-md p-6 mt-12">
        <h3 className="text-xl font-bold text-gray-800 mb-4">About {store.name}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Store Information</h4>
            <p className="text-gray-600 mb-4">
              {store.description || `${store.name} offers a wide range of high-quality products. Visit us today to explore our collection.`}
            </p>
            <div className="flex items-center text-gray-600 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{store.phone || 'Contact: (123) 456-7890'}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>{store.email || 'info@example.com'}</span>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Business Hours</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-gray-600">Monday - Friday:</div>
              <div className="text-gray-800">9:00 AM - 9:00 PM</div>
              <div className="text-gray-600">Saturday:</div>
              <div className="text-gray-800">10:00 AM - 8:00 PM</div>
              <div className="text-gray-600">Sunday:</div>
              <div className="text-gray-800">10:00 AM - 6:00 PM</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDetailPage;