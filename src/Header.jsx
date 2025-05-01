import Theme from './Theme';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 shadow-sm">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">UI Store</span>
          </Link>

          <div className="flex items-center space-x-8">
            <Link to="/" className="nav-link">Products</Link>
            <Link to="/cart" className="nav-link">Cart</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </div>
        </div>
      </nav>
      <style jsx>{`
        .nav-link {
          position: relative;
          color: #4b5563;
          font-weight: 500;
          transition: color 0.2s;
        }
        .nav-link:hover {
          color: ${Theme.colors.primary.main};
        }
        .nav-link::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 2px;
          bottom: -4px;
          left: 0;
          background: linear-gradient(to right, ${Theme.colors.primary.light}, ${Theme.colors.primary.dark});
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }
        .nav-link:hover::after {
          transform: scaleX(1);
        }
      `}</style>
    </header>
  );
};

export default Header;