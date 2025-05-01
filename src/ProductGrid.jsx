import Theme from './Theme';

const ProductGrid = ({ products, getStoreName }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div 
          key={product.id} 
          className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl"
          style={{ background: 'linear-gradient(to bottom right, white, #fafafa)' }}
        >
          {/* Product Image with Overlay */}
          <div className="relative h-56 overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Product Info */}
          <div className="p-5">
            <div className="mb-3">
              <h3 className="text-lg font-semibold mb-1 truncate" style={{ color: Theme.colors.neutral.black }}>
                {product.name}
              </h3>
              <p className="text-sm line-clamp-2" style={{ color: Theme.colors.neutral.gray }}>
                {product.description}
              </p>
            </div>

            {/* Store Badge */}
            <div className="flex items-center mb-3">
              <span 
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ 
                  backgroundColor: `${Theme.colors.primary.main}15`,
                  color: Theme.colors.primary.main 
                }}
              >
                {getStoreName(product.store_id)}
              </span>
            </div>

            {/* Price and Stock */}
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs mb-1" style={{ color: Theme.colors.neutral.gray }}>Price</p>
                <p className="text-2xl font-bold" style={{ color: Theme.colors.primary.main }}>
                  ${product.price.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs mb-1" style={{ color: Theme.colors.neutral.gray }}>Stock</p>
                <p className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                </p>
              </div>
            </div>

            {/* Buy Button */}
            <button
              className="mt-4 w-full py-2.5 rounded-xl font-medium text-white transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              style={{ 
                backgroundColor: Theme.colors.primary.main,
                boxShadow: `0 4px 14px ${Theme.colors.primary.main}30`
              }}
              disabled={product.stock === 0}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;