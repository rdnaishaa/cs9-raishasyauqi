import { useState, useEffect } from 'react';
import axios from 'axios';
import Theme from './Theme';

const ItemCard = ({ item, onAddToCart }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentItem, setItem] = useState(item);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`https://backend-one-hazel-88.vercel.app/item/${item.id}`);
        if (response.data.success) {
          setItem({
            ...response.data.payload,
            image_url: `https://backend-one-hazel-88.vercel.app/item/${item.id}/image`
          });
        }
      } catch (error) {
        console.error('Error fetching item:', error);
      }
    };
    fetchItem();
  }, [item.id]);

  return (
    <div className="p-6 bg-gray-100 flex justify-center">
      <div 
        className={`w-full max-w-xs bg-white rounded-xl overflow-hidden ${isHovered ? 'shadow-2xl transform -translate-y-2' : 'shadow-md'}`}
        style={{ 
          borderRadius: '16px',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isHovered ? '0 20px 30px -10px rgba(0, 188, 212, 0.4), 0 10px 20px -5px rgba(0, 188, 212, 0.2)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: `2px solid ${isHovered ? Theme.colors.secondary.main : 'transparent'}`
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          <div className="relative h-52 overflow-hidden">
            <div 
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10"
              style={{ opacity: isHovered ? '80%' : '60%', transition: 'all 0.4s ease' }}
            ></div>
            <img 
              src={currentItem.image_url}
              alt={currentItem.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out"
              style={{ transform: isHovered ? 'scale(1.08)' : 'scale(1)' }}
            />
          </div>

          {/* Price Tag with animation */}
          <div 
            className="absolute top-3 right-3 px-4 py-1.5 font-bold text-sm z-20"
            style={{ 
              backgroundColor: Theme.colors.secondary.main,
              color: Theme.colors.secondary.contrast,
              borderRadius: Theme.borderRadius.full,
              boxShadow: '0 3px 8px rgba(0, 0, 0, 0.2)',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.3s ease'
            }}
          >
            ${currentItem.price.toFixed(2)}
          </div>

          {/* Enhanced Rating Badge */}
          <div 
            className="absolute top-3 left-3 px-3 py-1.5 flex items-center space-x-1.5 z-20"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: Theme.borderRadius.full,
              boxShadow: '0 3px 8px rgba(0, 0, 0, 0.15)',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.3s ease'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={Theme.colors.secondary.main} className="w-4 h-4">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-semibold" style={{ color: Theme.colors.neutral.black }}>
              {currentItem.rating} ({currentItem.reviews})
            </span>
          </div>

          {/* Enhanced Stock Badge */}
          <div 
            className="absolute bottom-3 left-3 z-20"
            style={{ 
              transition: 'all 0.3s ease',
              transform: isHovered ? 'translateY(-5px) scale(1.05)' : 'translateY(0) scale(1)'
            }}
          >
            <span 
              className="text-xs px-3 py-1 font-medium"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: currentItem.stock > 0 ? Theme.colors.semantic.success : Theme.colors.semantic.error,
                borderRadius: Theme.borderRadius.full,
                boxShadow: Theme.shadows.sm
              }}
            >
              {currentItem.stock > 0 ? `${currentItem.stock} in stock` : 'Out of Stock'}
            </span>
          </div>
        </div>

        <div className="p-5">
          <h3 
            className="text-lg font-semibold truncate"
            style={{ 
              color: isHovered ? Theme.colors.secondary.dark : Theme.colors.neutral.black,
              transition: 'color 0.3s ease',
              transform: isHovered ? 'translateY(-2px)' : 'translateY(0)'
            }}
          >
            {currentItem.name}
          </h3>

          {/* Info Row */}
          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center">
              <div 
                className="p-1 rounded-full"
                style={{ 
                  backgroundColor: isHovered ? Theme.colors.secondary.light : 'transparent',
                  transition: 'background-color 0.3s ease'
                }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  style={{ color: Theme.colors.secondary.main }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span className="text-sm ml-1" style={{ color: Theme.colors.neutral.gray }}>
                Premium Product
              </span>
            </div>

            <div className="flex items-center">
              <span 
                className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${isHovered ? 'animate-pulse' : ''}`}
                style={{ 
                  backgroundColor: isHovered ? Theme.colors.secondary.light : 'transparent',
                  color: Theme.colors.secondary.main,
                  transition: 'background-color 0.3s ease'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
              </span>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div 
            className="mt-4 overflow-hidden space-y-2"
            style={{ height: isHovered ? '80px' : '0px', transition: 'height 0.3s ease' }}
          >
            <button 
              className="w-full py-2 font-medium text-sm text-center transition-all duration-300 hover:opacity-90"
              style={{ 
                backgroundColor: Theme.colors.secondary.main,
                color: Theme.colors.secondary.contrast,
                borderRadius: Theme.borderRadius.md,
                boxShadow: '0 3px 8px rgba(0, 188, 212, 0.3)'
              }}
            >
              View Details
            </button>
            <button 
              className="w-full py-2 font-medium text-sm text-center transition-all duration-300 hover:bg-opacity-90"
              style={{ 
                backgroundColor: Theme.colors.primary.main,
                color: Theme.colors.primary.contrast,
                borderRadius: Theme.borderRadius.md,
                boxShadow: '0 3px 8px rgba(0, 0, 0, 0.1)'
              }}
              onClick={onAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;