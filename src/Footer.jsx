import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeAnimation, setActiveAnimation] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const footerElement = document.getElementById('fancy-footer');
      if (footerElement) {
        const position = footerElement.getBoundingClientRect();
        if (position.top < window.innerHeight) {
          setActiveAnimation(true);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim() !== '' && email.includes('@')) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };
  
  const SocialIcon = ({ icon, delay }) => {
    const Icon = icon;
    return (
      <a 
        href="#" 
        className={`relative overflow-hidden group bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all duration-300 transform hover:scale-110 ${activeAnimation ? 'animate-fade-up' : 'opacity-0'}`}
        style={{ animationDelay: `${delay}ms` }}
      >
        <Icon size={18} className="text-gray-300 group-hover:text-white" />
        <span className="absolute inset-0 bg-indigo-500 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></span>
      </a>
    );
  };
  
  const FooterLink = ({ to, children, delay }) => (
    <li 
      className={`transform ${activeAnimation ? 'animate-fade-right' : 'opacity-0'}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <Link 
        to={to} 
        className="text-gray-300 hover:text-white transition-colors relative inline-block group"
      >
        {children}
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-400 group-hover:w-full transition-all duration-300"></span>
      </Link>
    </li>
  );
  
  const stars = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: 1 + Math.random() * 2,
    duration: 3 + Math.random() * 7
  }));
  
  return (
    <footer id="fancy-footer" className="bg-gradient-to-br from-indigo-900 to-gray-900 mt-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-y-6"></div>
      
      {stars.map(star => (
        <div 
          key={star.id}
          className="absolute bg-white rounded-full animate-pulse"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: 0.6,
            animationDuration: `${star.duration}s`
          }}
        ></div>
      ))}
      
      <div className="absolute top-1/4 -right-20 w-64 h-64 bg-indigo-600/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 -left-20 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className={`mb-6 md:mb-0 max-w-xs transform ${activeAnimation ? 'animate-fade-in' : 'opacity-0'}`}>
            <div className="flex items-center mb-4 group">
              <div className="bg-gradient-to-br from-indigo-400 to-purple-600 p-3 rounded-xl mr-3 shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </div>
              <div>
                <span className="font-bold text-2xl text-white tracking-tight">UI Store</span>
                <span className="block text-xs text-indigo-300 mt-0.5">Premium Shopping Experience</span>
              </div>
            </div>
            <p className="text-gray-300 mb-6">
              Your premier destination for curated online shopping with exclusive designs and unmatched quality.
            </p>
            
            <div className="mt-4">
              <h4 className="text-white font-medium mb-3">Join Our Newsletter</h4>
              <form onSubmit={handleSubscribe} className="relative">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full bg-white/10 text-white placeholder-gray-400 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md px-3 py-1 text-sm transition-all"
                >
                  {isSubscribed ? <Heart size={16} className="animate-bounce" /> : 'Subscribe'}
                </button>
              </form>
              
              {isSubscribed && (
                <p className="text-green-400 text-xs mt-2 animate-fade-in">Thanks for subscribing!</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
            <div>
              <h4 className={`font-semibold text-xl text-white mb-4 relative ${activeAnimation ? 'animate-fade-in' : 'opacity-0'}`}>
                Shop
                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></span>
              </h4>
              <ul className="space-y-2">
                <FooterLink to="/" delay={100}>All Products</FooterLink>
                <FooterLink to="/" delay={200}>New Arrivals</FooterLink>
                <FooterLink to="/" delay={300}>Popular</FooterLink>
                <FooterLink to="/" delay={400}>Discounts</FooterLink>
              </ul>
            </div>
            
            <div>
              <h4 className={`font-semibold text-xl text-white mb-4 relative ${activeAnimation ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '100ms' }}>
                Support
                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></span>
              </h4>
              <ul className="space-y-2">
                <FooterLink to="/" delay={150}>Help Center</FooterLink>
                <FooterLink to="/" delay={250}>Contact Us</FooterLink>
                <FooterLink to="/" delay={350}>Shipping Info</FooterLink>
                <FooterLink to="/" delay={450}>Returns & Refunds</FooterLink>
              </ul>
            </div>
            
            <div>
              <h4 className={`font-semibold text-xl text-white mb-4 relative ${activeAnimation ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '200ms' }}>
                Contact
                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></span>
              </h4>
              <ul className="space-y-3">
                <li className={`flex items-center text-gray-300 ${activeAnimation ? 'animate-fade-right' : 'opacity-0'}`} style={{ animationDelay: '200ms' }}>
                  <Phone size={14} className="mr-2 text-indigo-400" />
                  <span>(123) 456-7890</span>
                </li>
                <li className={`flex items-center text-gray-300 ${activeAnimation ? 'animate-fade-right' : 'opacity-0'}`} style={{ animationDelay: '300ms' }}>
                  <Mail size={14} className="mr-2 text-indigo-400" />
                  <span>support@uistore.com</span>
                </li>
                <li className={`flex items-start text-gray-300 ${activeAnimation ? 'animate-fade-right' : 'opacity-0'}`} style={{ animationDelay: '400ms' }}>
                  <MapPin size={14} className="mr-2 mt-1 text-indigo-400" />
                  <span>123 Web Street, Digital City, Internet 10101</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className={`text-sm text-gray-400 mb-6 md:mb-0 ${activeAnimation ? 'animate-fade-up' : 'opacity-0'}`}>
              © {currentYear} UI Store. All rights reserved.
              <span className="block md:inline md:ml-2">R. Aisha Syauqi Ramadhani - 2306250554.</span>
            </p>
            
            <div className="flex space-x-3">
              <SocialIcon icon={Facebook} delay={0} />
              <SocialIcon icon={Instagram} delay={100} />
              <SocialIcon icon={Twitter} delay={200} />
              <SocialIcon icon={Mail} delay={300} />
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-right {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animate-fade-up {
          animation: fade-up 0.8s ease-out forwards;
        }
        
        .animate-fade-right {
          animation: fade-right 0.8s ease-out forwards;
        }
      `}</style>
    </footer>
  );
};

export default Footer;