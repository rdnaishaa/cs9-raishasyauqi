import Theme from './Theme';

const StoreFilter = ({ stores, selectedStore, onStoreChange }) => {
  return (
    <div className="mb-8 bg-white rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
         style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.9), rgba(255,255,255,0.95))' }}>
      <h2 className="text-xl font-semibold mb-4" style={{ color: Theme.colors.neutral.black }}>Browse by Store</h2>
      
      <div className="flex flex-wrap gap-3">
        <button
          className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 transform hover:scale-105 ${
            selectedStore === 'all' ? 'shadow-lg' : 'hover:shadow'
          }`}
          style={{ 
            backgroundColor: selectedStore === 'all' ? Theme.colors.primary.main : '#f8fafc',
            color: selectedStore === 'all' ? 'white' : Theme.colors.neutral.darkGray,
          }}
          onClick={() => onStoreChange('all')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          All Stores
          <span className="ml-1 px-2 py-0.5 text-sm rounded-full bg-opacity-20 backdrop-blur-sm"
                style={{ backgroundColor: selectedStore === 'all' ? 'rgba(255,255,255,0.3)' : Theme.colors.primary.main + '20' }}>
            {stores.length}
          </span>
        </button>
        
        {stores.map(store => (
          <button
            key={store.id}
            className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 transform hover:scale-105 ${
              selectedStore === store.id.toString() ? 'shadow-lg' : 'hover:shadow'
            }`}
            style={{ 
              backgroundColor: selectedStore === store.id.toString() ? Theme.colors.primary.main : '#f8fafc',
              color: selectedStore === store.id.toString() ? 'white' : Theme.colors.neutral.darkGray,
            }}
            onClick={() => onStoreChange(store.id.toString())}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {store.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StoreFilter;