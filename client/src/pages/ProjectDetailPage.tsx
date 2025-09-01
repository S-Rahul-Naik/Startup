import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  StarIcon,
  EyeIcon,
  ShoppingCartIcon,
  HeartIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

interface Project {
  _id: string;
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  domain: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  views: number;
  orders: number;
  features: string[];
  requirements: string[];
  deliverables: string[];
  images: string[];
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  updatedAt: string;
}

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock data for development
  const mockProject: Project = {
    _id: '1',
    title: 'Smart Home Automation System',
    description: 'Complete IoT-based home automation system with mobile app control. This project demonstrates the integration of various smart home technologies including lighting control, temperature monitoring, security systems, and energy management. The system features a user-friendly mobile application that allows homeowners to control and monitor their home environment from anywhere in the world.',
    shortDescription: 'IoT-based home automation with mobile control',
    category: 'IoT Projects',
    domain: 'Electronics&Communications-(ECE)',
    price: 2999,
    originalPrice: 3999,
    discount: 25,
    rating: 4.8,
    reviewCount: 127,
    views: 2150,
    orders: 89,
    features: [
      'Mobile App Control',
      'Voice Commands',
      'Energy Monitoring',
      'Security Features',
      'Automated Scheduling',
      'Remote Access',
      'Real-time Notifications',
      'Multi-zone Control'
    ],
    requirements: [
      'Basic Electronics Knowledge',
      'Arduino Programming',
      'Mobile App Development',
      'IoT Concepts',
      'Basic Networking'
    ],
    deliverables: [
      'Complete Source Code',
      'Circuit Diagrams',
      'Component List',
      'Documentation',
      'Video Tutorial',
      'Mobile App APK',
      'Testing Guide',
      'Installation Manual'
    ],
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'
    ],
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  };

  useEffect(() => {
    const loadProject = async () => {
      try {
        // In production, this would be an API call
        // const response = await axios.get(`/api/projects/${id}`);
        // setProject(response.data.project);
        
        // Using mock data for development
        setProject(mockProject);
      } catch (error) {
        console.error('Failed to load project:', error);
        toast.error('Failed to load project');
        navigate('/projects');
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!project) return;
    
    addToCart({
      _id: project._id,
      title: project.title,
      price: project.price,
      originalPrice: project.originalPrice,
      discount: project.discount,
      image: project.images[0],
      domain: project.domain,
      category: project.category
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
      stars.push(<StarIconSolid key={i} className="w-5 h-5 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<StarIconSolid key="half" className="w-5 h-5 text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarIcon className="w-5 h-5 text-gray-300" />);
    }

    return stars;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h2>
          <p className="text-gray-600 mb-6">The project you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/projects')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Browse Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <button onClick={() => navigate('/projects')} className="hover:text-primary-600 transition-colors">
                Projects
              </button>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <span>{project.category}</span>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <span className="text-gray-900">{project.title}</span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Project Images */}
              <div className="bg-white rounded-lg shadow-soft overflow-hidden mb-8">
                <div className="relative">
                  <img
                    src={project.images[selectedImage]}
                    alt={project.title}
                    className="w-full h-96 object-cover"
                  />
                  {project.discount && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded">
                      -{project.discount}% OFF
                    </div>
                  )}
                  <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                    <HeartIcon className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                
                {/* Thumbnail Images */}
                {project.images.length > 1 && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      {project.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                            selectedImage === index ? 'border-primary-500' : 'border-gray-200'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${project.title} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Project Information */}
              <div className="bg-white rounded-lg shadow-soft p-8 mb-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {project.title}
                    </h1>
                    <p className="text-lg text-gray-600 mb-4">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-t border-gray-200">
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      {renderStars(project.rating)}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{project.rating}</div>
                    <div className="text-sm text-gray-600">({project.reviewCount} reviews)</div>
                  </div>
                  <div className="text-center">
                    <EyeIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{project.views}</div>
                    <div className="text-sm text-gray-600">Views</div>
                  </div>
                  <div className="text-center">
                    <ShoppingCartIcon className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{project.orders}</div>
                    <div className="text-sm text-gray-600">Orders</div>
                  </div>
                  <div className="text-center">
                    <AcademicCapIcon className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{project.category}</div>
                    <div className="text-sm text-gray-600">Category</div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="bg-white rounded-lg shadow-soft p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div className="bg-white rounded-lg shadow-soft p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Requirements</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <UserIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      <span className="text-gray-700">{requirement}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deliverables */}
              <div className="bg-white rounded-lg shadow-soft p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">What You'll Get</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.deliverables.map((deliverable, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <ClockIcon className="w-5 h-5 text-purple-500 flex-shrink-0" />
                      <span className="text-gray-700">{deliverable}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white rounded-lg shadow-soft p-6 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Details</h2>
                
                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(project.price)}
                    </span>
                    {project.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(project.originalPrice)}
                      </span>
                    )}
                  </div>
                  {project.discount && (
                    <span className="text-sm text-green-600 font-medium">
                      Save {formatPrice(project.originalPrice! - project.price)} ({project.discount}% off)
                    </span>
                  )}
                </div>

                {/* Project Info */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium text-gray-900">{project.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Domain:</span>
                    <span className="font-medium text-gray-900">{project.domain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={isInCart(project._id)}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                      isInCart(project._id)
                        ? 'bg-green-100 text-green-700 cursor-not-allowed'
                        : 'bg-primary-600 hover:bg-primary-700 text-white transform hover:scale-105'
                    }`}
                  >
                    <ShoppingCartIcon className="w-5 h-5 inline mr-2" />
                    {isInCart(project._id) ? 'In Cart' : 'Add to Cart'}
                  </button>
                  
                  <button className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    Contact Support
                  </button>
                </div>

                {/* Additional Info */}
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                    Quality assured
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="w-4 h-4 text-blue-500 mr-2" />
                    Instant delivery
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <UserIcon className="w-4 h-4 text-purple-500 mr-2" />
                    Expert support
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
