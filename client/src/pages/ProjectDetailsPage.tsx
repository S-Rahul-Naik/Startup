import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart, isInCart } = useCart();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        console.log('Fetching project with ID:', id);
  const response = await fetch(`http://localhost:5001/api/projects/${id}`);
        console.log('Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Project data received:', data);
          setProject(data.project);
        } else {
          const errorData = await response.text();
          console.error('Error response:', errorData);
          setError('Project not found');
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        setError('Failed to load project');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The project you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/projects')}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Projects
        </button>

        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
          <p className="text-gray-700 mb-6">{project.description}</p>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="text-2xl font-bold">₹{project.price}</span>
            <button
              onClick={() => {
                addToCart({
                  _id: project._id,
                  title: project.title,
                  price: project.price,
                  image: project.images?.[0] || '',
                  domain: project.domain || 'Not specified',
                  category: typeof project.category === 'object' ? project.category.name : project.category || 'General'
                });
                toast.success('Added to cart!');
              }}
              disabled={isInCart(project._id)}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg disabled:bg-gray-300"
            >
              <ShoppingCartIcon className="w-5 h-5 mr-2 inline" />
              {isInCart(project._id) ? 'In Cart' : 'Add to Cart'}
            </button>
          </div>

          {project.files && project.files.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Project Files</h3>
              <div className="space-y-2">
                {project.files.map((file: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span>{file.originalname}</span>
                                                  <a
                                href={`http://localhost:5001/api/projects/files/${file.filename}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-600 hover:text-primary-700"
                                onClick={(e) => {
                                  // Add error handling for file viewing
                                  const link = e.currentTarget;
                                  fetch(link.href)
                                    .then(response => {
                                      if (!response.ok) {
                                        e.preventDefault();
                                        alert('File not found or not accessible. Please contact the administrator.');
                                      }
                                    })
                                    .catch(error => {
                                      e.preventDefault();
                                      alert('Error accessing file. Please try again later.');
                                    });
                                }}
                              >
                                View File
                              </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
