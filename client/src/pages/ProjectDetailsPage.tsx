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
  // Tab state (must be at top level)
  const [activeTab, setActiveTab] = useState('abstract');
  const tabList = [
    { key: 'abstract', label: 'Abstract' },
    { key: 'blockDiagram', label: 'Block Diagram' },
    { key: 'specifications', label: 'Specifications' },
    { key: 'learningOutcomes', label: 'Learning Outcomes' },
    { key: 'files', label: 'Project Files' },
  ];

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/projects/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProject(data.project);
        } else {
          setError('Project not found');
        }
      } catch (error) {
        setError('Failed to load project');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchProject();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">{error || 'Project Not Found'}</h2>
          <button
            onClick={() => navigate('/projects')}
            className="mt-4 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-semibold shadow transition-colors"
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

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabList.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none transition-all duration-150 ${
                    activeTab === tab.key
                      ? 'border-primary-600 text-primary-700'
                      : 'border-transparent text-gray-500 hover:text-primary-700 hover:border-primary-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Panels */}
          {activeTab === 'abstract' && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Abstract</h3>
              <p className="text-gray-700 whitespace-pre-line">{project.abstract || 'No abstract provided.'}</p>
            </div>
          )}
          {activeTab === 'blockDiagram' && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Block Diagram</h3>
              {project.blockDiagram ? (
                <img
                  src={project.blockDiagram.startsWith('http') ? project.blockDiagram : `${project.blockDiagram}`}
                  alt="Block Diagram"
                  className="max-w-full h-auto rounded shadow border"
                  onError={e => { e.currentTarget.style.display = 'none'; }}
                />
              ) : (
                <p className="text-gray-500">No block diagram available.</p>
              )}
            </div>
          )}
          {activeTab === 'specifications' && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Specifications</h3>
              <p className="text-gray-700 whitespace-pre-line">{project.specifications || 'No specifications provided.'}</p>
            </div>
          )}
          {activeTab === 'learningOutcomes' && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Learning Outcomes</h3>
              {project.learningOutcomes && Array.isArray(project.learningOutcomes) ? (
                <ul className="list-disc pl-6 space-y-1">
                  {project.learningOutcomes.map((outcome: string, idx: number) => (
                    <li key={idx}>{outcome}</li>
                  ))}
                </ul>
              ) : project.learningOutcomes ? (
                <ul className="list-disc pl-6 space-y-1">
                  {project.learningOutcomes.split('\n').map((outcome: string, idx: number) => (
                    <li key={idx}>{outcome}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No learning outcomes provided.</p>
              )}
            </div>
          )}
          {activeTab === 'files' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Project Files</h3>
              {project.files && project.files.length > 0 ? (
                <ul className="space-y-2">
                  {project.files.map((file: any, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <a
                        href={file.path?.startsWith('http') ? file.path : `http://localhost:5001/api/projects/files/${file.filename}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline"
                        download
                      >
                        {file.originalname || file.filename}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No files available for this project.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
