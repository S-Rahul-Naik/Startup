import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  AdjustmentsHorizontalIcon,
  StarIcon,
  EyeIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

interface Project {
  _id: string;
  title: string;
  description: string;
  shortDescription?: string;
  category: any; // Can be string or ObjectId
  domain?: string;
  difficulty?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating?: number | { average: number; count: number };
  reviewCount?: number;
  views?: number;
  orders?: number;
  features?: string[];
  requirements?: string[];
  deliverables?: string[];
  images?: string[];
  files?: Array<{
    filename: string;
    originalname: string;
    path: string;
    mimetype: string;
    size: number;
  }>;
  isPublished?: boolean;
  isApproved?: boolean;
  creator?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

const ProjectsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const { addToCart, isInCart } = useCart();

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching projects from API...');
  const response = await fetch('http://localhost:5001/api/projects?t=' + Date.now());
      console.log('API Response status:', response.status);
      
             if (response.ok) {
         const data = await response.json();
         console.log('Projects data received:', data);
         console.log('First project structure:', data.projects?.[0]);
         setProjects(data.projects || []);
         setFilteredProjects(data.projects || []);
       } else {
        console.error('Failed to fetch projects, status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        // Fallback to empty array
        setProjects([]);
        setFilteredProjects([]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      // Fallback to empty array
      setProjects([]);
      setFilteredProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch projects when component mounts
  useEffect(() => {
    fetchProjects();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Set category from URL query param if present
    const urlCategory = searchParams.get('category');
    if (urlCategory && urlCategory !== selectedCategory) {
      setSelectedCategory(urlCategory);
    }
  }, []);

  const categories = [
    'All Categories',
    'Electronics & Communication',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Computer Science',
    'AI/ML',
    'Data Science'
  ];

  const branchDomains: { [key: string]: string[] } = {
    'Electronics & Communication': [
      'All Domains',
      'VLSI',
      'Embedded Systems',
      'Signal Processing',
      'Communication Systems',
      'Others'
    ],
    'Electrical Engineering': [
      'All Domains',
      'Power Systems',
      'Control Systems',
      'Electrical Machines',
      'Renewable Energy',
      'Others'
    ],
    'Mechanical Engineering': [
      'All Domains',
      'Thermal Engineering',
      'Design',
      'Manufacturing',
      'Robotics',
      'Others'
    ],
    'Computer Science': [
      'All Domains',
      'Web Development',
      'App Development',
      'Cloud Computing',
      'Cybersecurity',
      'Others'
    ],
    'AI/ML': [
      'All Domains',
      'Deep Learning',
      'Natural Language Processing',
      'Computer Vision',
      'Reinforcement Learning',
      'Others'
    ],
    'Data Science': [
      'All Domains',
      'Big Data',
      'Data Analytics',
      'Visualization',
      'Business Intelligence',
      'Others'
    ],
    'All Categories': [
      'All Domains',
      'Others'
    ]
  };

  const domains = branchDomains[selectedCategory || 'All Categories'] || branchDomains['All Categories'];



  // Apply filters and search
  useEffect(() => {
    let filtered = [...projects];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (typeof project.category === 'object' ? project.category.name : project.category || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory && selectedCategory !== 'All Categories') {
      filtered = filtered.filter(project => {
        const categoryName = typeof project.category === 'object' ? project.category.name : project.category;
        return categoryName === selectedCategory;
      });
    }

    // Apply domain filter
    if (selectedDomain && selectedDomain !== 'All Domains') {
      filtered = filtered.filter(project => (project.domain || 'Not specified') === selectedDomain);
    }

    // Apply price range filter
    filtered = filtered.filter(project => 
      project.price >= priceRange[0] && project.price <= priceRange[1]
    );

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => {
          const ratingA = typeof a.rating === 'object' ? a.rating.average || 0 : a.rating || 0;
          const ratingB = typeof b.rating === 'object' ? b.rating.average || 0 : b.rating || 0;
          return ratingB - ratingA;
        });
        break;
      case 'popularity':
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, selectedCategory, selectedDomain, priceRange, sortBy]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory && selectedCategory !== 'All Categories') params.set('category', selectedCategory);
    if (selectedDomain && selectedDomain !== 'All Domains') params.set('domain', selectedDomain);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    
    setSearchParams(params);
  }, [searchTerm, selectedCategory, selectedDomain, sortBy, setSearchParams]);

  // Load filters from URL on mount
  useEffect(() => {
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const domain = searchParams.get('domain');
    const sort = searchParams.get('sort');

    if (search) setSearchTerm(search);
    if (category) setSelectedCategory(category);
    if (domain) setSelectedDomain(domain);
    if (sort) setSortBy(sort);
  }, [searchParams]);

  const handleAddToCart = (project: Project) => {
    addToCart({
      _id: project._id,
      title: project.title,
      price: project.price,
      originalPrice: project.originalPrice,
      discount: project.discount,
      image: project.images?.[0] || '',
      domain: project.domain || 'Not specified',
      category: typeof project.category === 'object' ? project.category.name : project.category || 'General'
    });
    toast.success(`${project.title} added to cart!`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIconSolid key={i} className="w-4 h-4 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<StarIconSolid key="half" className="w-4 h-4 text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarIcon className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Academic Projects
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover cutting-edge projects across various engineering domains. 
            From embedded systems to machine learning, find the perfect project for your academic journey.
          </p>
        </div>

        {/* Search and Filters */}
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-center px-4 py-3 border border-gray-200 rounded-full text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <FunnelIcon className="w-5 h-5 mr-2" />
              Filters
            </button>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="popularity">Most Popular</option>
            </select>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 pt-6 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-primary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
                    >
                      <option value="All Categories">All Categories</option>
                      <option value="Electronics & Communication">Electronics & Communication</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="AI/ML">AI/ML</option>
                      <option value="Data Science">Data Science</option>
                    </select>
                  </div>

                  {/* Domain Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Domain
                    </label>
                    <select
                      value={selectedDomain}
                      onChange={(e) => setSelectedDomain(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
                    >
                      {domains.map((domain) => (
                        <option key={domain} value={domain}>
                          {domain}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                                         <label className="block text-sm font-medium text-gray-700 mb-2">
                       Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                     </label>
                     <div className="flex gap-2">
                       <input
                         type="range"
                         min="0"
                         max="100000"
                         step="1000"
                         value={priceRange[0]}
                         onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                         className="flex-1"
                       />
                       <input
                         type="range"
                         min="0"
                         max="100000"
                         step="1000"
                         value={priceRange[1]}
                         onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                         className="flex-1"
                       />
                     </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {filteredProjects.length} of {projects.length} projects
          </p>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="hidden lg:flex items-center text-gray-600 hover:text-primary-600 transition-colors"
          >
            <AdjustmentsHorizontalIcon className="w-5 h-5 mr-2" />
            {showFilters ? 'Hide' : 'Show'} Filters
          </button>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center justify-center">
            <img src="/images/hero-illustration.svg" alt="No projects" className="w-40 h-40 mx-auto mb-6 opacity-80" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">We couldn't find any projects matching your criteria. Try adjusting your filters or search terms, or explore all projects.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All Categories');
                setSelectedDomain('All Domains');
                setPriceRange([0, 100000]);
              }}
              className="mt-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-semibold shadow transition-colors"
            >
              Reset Filters
            </button>
            <p className="text-xs text-gray-400 mt-4">Still can't find what you need? <a href="/contact" className="underline text-primary-600 hover:text-primary-700">Contact us</a> for help!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-soft overflow-hidden transition-shadow duration-300 hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.025] transform-gpu"
              >
                {/* Project Image */}
                <div className="relative bg-gray-200 overflow-hidden flex items-center justify-center" style={{ aspectRatio: '3/2' }}>
                  {/* Reduce image height for a more compact card */}
                  {(() => {
                    // Debug: Log project data
                    console.log('Project:', project.title, 'Files:', project.files);
                    
                    // Check for uploaded image files first
                    const imageFiles = project.files?.filter((file: any) => 
                      file.mimetype?.startsWith('image/') || 
                      file.originalname?.match(/\.(jpg|jpeg|png|gif|webp)$/i)
                    );
                    
                    console.log('Image files found:', imageFiles);
                    
                    if (imageFiles && imageFiles.length > 0) {
                      return (
                        <img
                          src={`http://localhost:5001/api/projects/files/${imageFiles[0].filename}`}
                          alt={project.title}
                          className="absolute inset-0 w-full h-full object-cover object-center"
                          onError={(e) => {
                            // Fallback to placeholder if image fails to load
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      );
                    } else if (project.images && project.images.length > 0) {
                      return (
                        <img
                          src={project.images[0]}
                          alt={project.title}
                          className="absolute inset-0 w-full h-full object-cover object-center"
                        />
                      );
                                         } else {
                       return (
                         <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gradient-to-br from-gray-100 to-gray-200">
                           <svg className="w-16 h-16 mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                           </svg>
                           <span className="text-sm font-medium">No Image</span>
                           <span className="text-xs text-gray-400">Upload an image</span>
                         </div>
                       );
                     }
                  })()}
                                     {/* Fallback placeholder (hidden by default) */}
                   <div className="absolute inset-0 w-full h-full flex-col items-center justify-center text-gray-400 bg-gradient-to-br from-gray-100 to-gray-200 hidden">
                     <svg className="w-16 h-16 mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                     </svg>
                     <span className="text-sm font-medium">No Image</span>
                     <span className="text-xs text-gray-400">Upload an image</span>
                   </div>
                  {project.discount && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      -{project.discount}%
                    </div>
                  )}
                  {/* Removed Heart Icon */}
                </div>

                {/* Project Content */}
                <div className="p-4" style={{ minHeight: 0 }}>
                  {/* Category and Domain */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-block text-xs font-semibold text-primary-700 bg-primary-100 px-3 py-1 rounded-full shadow-sm border border-primary-200">
                      {typeof project.category === 'object' ? project.category.name : project.category || 'General'}
                    </span>
                    {project.domain && project.domain !== 'All Domains' && (
                      <span className="inline-block text-xs font-semibold text-blue-700 bg-blue-100 px-3 py-1 rounded-full shadow-sm border border-blue-200">
                        {project.domain}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {project.shortDescription || project.description.substring(0, 100) + '...'}
                  </p>

                  {/* Card Header: Price (left) and Stars (right) */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-gray-900">
                        {formatPrice(project.price)}
                      </span>
                      {project.originalPrice && project.originalPrice > project.price && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          {formatPrice(project.originalPrice)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <div className="flex mr-2">
                        {renderStars(typeof project.rating === 'object' ? project.rating.average || 4.5 : project.rating || 4.5)}
                      </div>
                      <span className="text-sm text-gray-600">
                        {typeof project.rating === 'object' ? project.rating.average || 4.5 : project.rating || 4.5} ({typeof project.rating === 'object' ? project.rating.count || 0 : project.reviewCount || 0})
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 w-full mb-2">
                    <button
                      onClick={() => handleAddToCart(project)}
                      disabled={isInCart(project._id)}
                      className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors ${
                        isInCart(project._id)
                          ? 'bg-green-100 text-green-700 cursor-not-allowed'
                          : 'bg-primary-600 hover:bg-primary-700 text-white'
                      }`}
                    >
                      <ShoppingCartIcon className="w-4 h-4 mr-2" />
                      {isInCart(project._id) ? 'In Cart' : 'Add to Cart'}
                    </button>
                    <button 
                      onClick={() => navigate(`/projects/${project._id}`)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
