import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bars3Icon, 
  XMarkIcon, 
  UserIcon, 
  ShoppingCartIcon,
  ChevronDownIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userMenuClicked, setUserMenuClicked] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { items: cartItems } = useCart();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/projects' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const projectCategories = [
    { name: 'Electronics & Communication', href: '/projects?category=ece' },
    { name: 'Electrical Engineering', href: '/projects?category=eee' },
    { name: 'Mechanical Engineering', href: '/projects?category=mech' },
    { name: 'Computer Science', href: '/projects?category=cse' },
    { name: 'AI/ML', href: '/projects?category=ai/ml' },
    { name: 'Data Science', href: '/projects?category=ds' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
  <header className="bg-white shadow-soft sticky top-0 z-50 w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 w-full">
        <div className="flex justify-between items-center h-16 w-full min-w-0 flex-wrap">
          {/* Logo */}
          <div className="flex-shrink-0 min-w-0">
            <Link to="/" className="flex items-center space-x-1 group min-w-0">
              <img
                src="/logo.png"
                alt="EduTech Logo"
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain transition-transform duration-200 group-hover:scale-105 max-w-full"
                style={{ maxHeight: '48px' }}
              />
              <span className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-blue-500 via-pink-500 to-orange-400 bg-clip-text text-transparent tracking-tight ml-1 whitespace-nowrap overflow-hidden text-ellipsis">
                EduTech
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4 min-w-0">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Projects Dropdown */}
            <div className="relative group min-w-0">
              <button className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors whitespace-nowrap">
                Categories
                <ChevronDownIcon className="w-4 h-4 ml-1" />
              </button>
              <div className="absolute top-full left-0 w-56 max-w-xs bg-white shadow-large rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 overflow-x-auto">
                <div className="py-2">
                  {projectCategories.map((category) => (
                    <Link
                      key={category.name}
                      to={category.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* Right side - User menu and cart */}
          <div className="flex items-center space-x-1 min-w-0 flex-nowrap">
            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors min-w-0"
            >
              <ShoppingCartIcon className="w-6 h-6" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div
                className="relative"
                ref={userMenuRef}
              >
                <button
                  onClick={() => setIsUserMenuOpen((open) => !open)}
                  className="flex items-center space-x-2 p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                  aria-haspopup="true"
                  aria-expanded={isUserMenuOpen}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.firstName}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center min-w-0">
                      <UserIcon className="w-5 h-5 text-primary-600" />
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-medium">
                    {user.firstName}
                  </span>
                  <ChevronDownIcon className="w-4 h-4" />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-large border border-gray-100 py-1 z-50"
                    >
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                        onClick={() => { setIsUserMenuOpen(false); setUserMenuClicked(false); }}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                        onClick={() => { setIsUserMenuOpen(false); setUserMenuClicked(false); }}
                      >
                        Profile
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors border-t border-gray-100"
                          onClick={() => { setIsUserMenuOpen(false); setUserMenuClicked(false); }}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => { handleLogout(); setUserMenuClicked(false); }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="relative text-gray-700 hover:text-primary-600 font-medium transition-colors px-2 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
                  tabIndex={0}
                  aria-label="Login"
                  data-tooltip-id="login-tooltip"
                >
                  <span className="transition-transform duration-150 ease-in-out group-hover:scale-110">Login</span>
                  <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap">Sign in to your account</span>
                </Link>
                <Link
                  to="/register"
                  className="hidden xs:inline-block relative bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-full text-sm font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-400 shadow-lg"
                  tabIndex={0}
                  aria-label="Get Started"
                  data-tooltip-id="getstarted-tooltip"
                >
                  <span className="transition-transform duration-150 ease-in-out group-hover:scale-110">Get Started</span>
                  <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap">Create a free account</span>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors min-w-0"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-200 w-full overflow-x-hidden"
          >
            <div className="px-2 py-2 space-y-1 w-full">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Project Categories */}
              <div className="border-t border-gray-200 pt-2">
                <div className="px-3 py-2 text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Project Categories
                </div>
                {projectCategories.map((category) => (
                  <Link
                    key={category.name}
                    to={category.href}
                    className="block px-3 py-2 rounded-md text-base text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>

              {/* Mobile User Menu */}
              {user ? (
                <div className="border-t border-gray-200 pt-2">
                  <div className="px-3 py-2 text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Account
                  </div>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 rounded-md text-base text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 rounded-md text-base text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="block px-3 py-2 rounded-md text-base text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors border-t border-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-2 space-y-2">
                  <Link
                    to="/login"
                    className="relative block px-4 py-3 rounded-lg text-base text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
                    onClick={() => setIsMobileMenuOpen(false)}
                    tabIndex={0}
                    aria-label="Login"
                  >
                    <span className="transition-transform duration-150 ease-in-out group-hover:scale-110">Login</span>
                    <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap">Sign in to your account</span>
                  </Link>
                  <Link
                    to="/register"
                    className="relative block px-4 py-3 rounded-lg text-base bg-primary-600 text-white hover:bg-primary-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400 shadow-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                    tabIndex={0}
                    aria-label="Get Started"
                  >
                    <span className="transition-transform duration-150 ease-in-out group-hover:scale-110">Get Started</span>
                    <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap">Create a free account</span>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
