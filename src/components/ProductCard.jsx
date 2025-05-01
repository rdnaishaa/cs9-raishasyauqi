const ProductCard = ({ product }) => {
  return (
    <div className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden rounded-t-xl">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-semibold mb-2 text-gray-900">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-indigo-600">
            ${product.price.toFixed(2)}
          </span>
          <button 
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg 
                     transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
            onClick={() => handleAddToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
      
      {product.isNew && (
        <div className="absolute top-4 left-4">
          <span className="bg-indigo-500 text-white text-sm font-medium px-3 py-1 rounded-full">
            New
          </span>
        </div>
      )}
      
      {product.discount > 0 && (
        <div className="absolute top-4 right-4">
          <span className="bg-red-500 text-white text-sm font-medium px-3 py-1 rounded-full">
            -{product.discount}%
          </span>
        </div>
      )}
    </div>
  );
};