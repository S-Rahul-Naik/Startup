import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  ChartBarIcon,
  UsersIcon,
  FolderIcon,
  ShoppingCartIcon,
  CogIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
// ...existing code...
import axios from 'axios';

interface DashboardStats {
  totalUsers: number;
  totalProjects: number;
  publishedProjects: number;
  pendingProjects: number;
  totalOrders: number;
  totalRevenue: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  domain?: string;
  difficulty?: string;
  creator: {
    firstName: string;
    lastName: string;
    email: string;
  };
  isPublished: boolean;
  createdAt: string;
  // ...existing code...
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface Order {
  _id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  project: {
    title: string;
  };
  amount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

const AdminDashboardPage: React.FC = () => {
  // ...existing code...

  const handleEditProject = (projectId: string) => {
    // Find the project and set it for editing
    const project = projects.find(p => p._id === projectId);
    if (project) {
      setEditingProject(project);
      setProjectForm({
        title: project.title,
        description: project.description,
        price: project.price.toString(),
        category: project.category,
        domain: project.domain || '',
        difficulty: project.difficulty || '',
        isPublished: project.isPublished
      });
  // ...existing code...
      setShowAddProject(true); // Open the add/edit modal
    } else {
      toast.error('Project not found');
    }
  };
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  // ...existing code...
  
  // Project Management State
  const [projects, setProjects] = useState<Project[]>([]);
  const [showAddProject, setShowAddProject] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    domain: 'Python',
    difficulty: 'Intermediate',
    isPublished: false
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  // User Management State
  const [users, setUsers] = useState<User[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');

  // Order Management State
  const [orders, setOrders] = useState<Order[]>([]);

  // Settings State
  const [settings, setSettings] = useState({
            siteName: 'Edu Tech',
        contactEmail: 'edutech956@gmail.com',
    requireApproval: true,
    allowSubmissions: true
  });

  // ...existing code...
  // ...existing code...

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  // ...existing code...

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5001/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || {});
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5001/api/admin/projects', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5001/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5001/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'projects') {
      fetchProjects();
    } else if (tab === 'users') {
      fetchUsers();
    } else if (tab === 'orders') {
      fetchOrders();
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', projectForm.title);
      formData.append('description', projectForm.description);
      formData.append('price', projectForm.price);
      formData.append('category', projectForm.category);
      formData.append('domain', projectForm.domain);
      formData.append('difficulty', projectForm.difficulty);
      formData.append('isPublished', projectForm.isPublished.toString());
      
      // Append images first (they will be treated as display images)
      selectedImages.forEach((file, index) => {
        formData.append(`files`, file);
      });
      
      // Append other files
      selectedFiles.forEach((file, index) => {
        formData.append(`files`, file);
      });
      
  const response = await fetch('http://localhost:5001/api/admin/projects', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: formData
      });


      if (response.ok) {
        setShowAddProject(false);
        setProjectForm({ title: '', description: '', price: '', category: '', domain: 'Python', difficulty: 'Intermediate', isPublished: false });
        setSelectedImages([]);
        setSelectedFiles([]);
        fetchProjects();
        alert('Project added successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to add project: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding project:', error);
      alert('Failed to add project');
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      const token = localStorage.getItem('token');
  const response = await fetch(`http://localhost:5001/api/admin/projects/${editingProject._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...projectForm,
          price: parseFloat(projectForm.price)
        })
      });

      if (response.ok) {
        setEditingProject(null);
        setProjectForm({ title: '', description: '', price: '', category: '', domain: 'Python', difficulty: 'Intermediate', isPublished: false });
        fetchProjects();
        alert('Project updated successfully!');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const token = localStorage.getItem('token');
  const response = await fetch(`http://localhost:5001/api/admin/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchProjects();
        alert('Project deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  const handleToggleProjectStatus = async (projectId: string, isPublished: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/projects/${projectId}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isPublished: !isPublished })
      });

      if (response.ok) {
        fetchProjects();
        alert(`Project ${!isPublished ? 'published' : 'unpublished'} successfully!`);
      }
    } catch (error) {
      console.error('Error toggling project status:', error);
      alert('Failed to toggle project status');
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });

      if (response.ok) {
        fetchUsers();
        alert('User role updated successfully!');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchOrders();
        alert('Order status updated successfully!');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const handleSaveSettings = async () => {
    try {
      // In a real app, you'd save to backend
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Failed to save settings');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {user?.role}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.firstName}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: ChartBarIcon },
              { id: 'projects', name: 'Projects', icon: FolderIcon },
              { id: 'users', name: 'Users', icon: UsersIcon },
              { id: 'orders', name: 'Orders', icon: ShoppingCartIcon },
              { id: 'settings', name: 'Settings', icon: CogIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="inline-block w-5 h-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <UsersIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats?.totalUsers || 0}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FolderIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Projects</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats?.totalProjects || 0}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CheckCircleIcon className="h-6 w-6 text-green-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Published Projects</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats?.publishedProjects || 0}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ShoppingCartIcon className="h-6 w-6 text-blue-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                        <dd className="text-lg font-medium text-gray-900">${stats?.totalRevenue || '0.00'}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Add New Project */}
              <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center cursor-pointer hover:shadow-lg transition" onClick={() => handleTabChange('projects')}>
                <div className="bg-blue-100 rounded-full p-3 mb-4">
                  <PlusIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Add New Project</h3>
                <p className="text-gray-600 text-sm text-center">Create and publish new projects to the marketplace</p>
              </div>
      {/* Manage Users */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center cursor-pointer hover:shadow-lg transition" onClick={() => handleTabChange('users')}>
        <div className="bg-green-100 rounded-full p-3 mb-4">
          <UsersIcon className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="font-bold text-lg mb-2">Manage Users</h3>
                <p className="text-gray-600 text-sm text-center">View and manage user accounts and permissions</p>
              </div>
              {/* Process Orders */}
              <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center cursor-pointer hover:shadow-lg transition" onClick={() => handleTabChange('orders')}>
                <div className="bg-yellow-100 rounded-full p-3 mb-4">
                  <ShoppingCartIcon className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Process Orders</h3>
                <p className="text-gray-600 text-sm text-center">Review and process pending project orders</p>
              </div>
            </div>

            {/* Featured Project Form Modal */}
            {/* Removed Add Featured Project modal */}
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-6">
            {/* Project Management Header */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Project Management</h3>
                  <button
                    onClick={() => setShowAddProject(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    <PlusIcon className="h-5 w-5 inline mr-2" />
                    Add New Project
                  </button>
                </div>

                {/* Projects Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creator</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {projects.map((project) => (
                        <tr key={project._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{project.title}</div>
                              <div className="text-sm text-gray-500">{project.description.substring(0, 50)}...</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {project.creator?.firstName} {project.creator?.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{project.creator?.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${project.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              project.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {project.isPublished ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setEditingProject(project);
                                                                   setProjectForm({
                                   title: project.title,
                                   description: project.description,
                                   price: project.price.toString(),
                                   category: project.category,
                                   domain: project.domain || 'Python',
                                   difficulty: project.difficulty || 'Intermediate',
                                   isPublished: project.isPublished
                                 });
                                }}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Edit Project"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleToggleProjectStatus(project._id, project.isPublished)}
                                className={`${
                                  project.isPublished ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'
                                }`}
                                title={project.isPublished ? 'Unpublish Project' : 'Publish Project'}
                              >
                                {project.isPublished ? <XCircleIcon className="h-4 w-4" /> : <CheckCircleIcon className="h-4 w-4" />}
                              </button>
                              <button
                                onClick={() => handleDeleteProject(project._id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete Project"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Add/Edit Project Modal */}
            {(showAddProject || editingProject) && (
              <div className="fixed inset-0 bg-gradient-to-br from-indigo-400 via-purple-300 to-pink-200 bg-opacity-80 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
                <div className="relative mx-auto p-[2px] w-full max-w-2xl shadow-2xl rounded-2xl bg-gradient-to-br from-indigo-400 via-purple-300 to-pink-200 max-h-[90vh] overflow-y-auto scrollbar-hide">
                  <div className="rounded-2xl bg-white/30 backdrop-blur-md p-8">
                    <h3 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 drop-shadow">
                      {editingProject ? 'Edit Project' : 'Add New Project'}
                    </h3>
                    <form onSubmit={(e) => {
                      if (editingProject) {
                        handleUpdateProject(e);
                      } else {
                        handleAddProject(e);
                      }
                    }}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Title</label>
                          <input
                            type="text"
                            value={projectForm.title}
                            onChange={(e) => {
                              setProjectForm({ ...projectForm, title: e.target.value });
                            }}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Description</label>
                          <textarea
                            value={projectForm.description}
                            onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                            rows={3}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Price</label>
                          <input
                            type="number"
                            step="0.01"
                            value={projectForm.price}
                            onChange={(e) => setProjectForm({ ...projectForm, price: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Category</label>
                          <select
                            value={projectForm.category}
                            onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                            className="mt-1 block w-full border-2 border-primary-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
                            required
                          >
                            <option value="">All Categories</option>
                            <option value="Electronics & Communication">Electronics & Communication</option>
                            <option value="Electrical Engineering">Electrical Engineering</option>
                            <option value="Mechanical Engineering">Mechanical Engineering</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="AI/ML">AI/ML</option>
                            <option value="Data Science">Data Science</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Domain</label>
                          <select
                            value={projectForm.domain}
                            onChange={(e) => setProjectForm({ ...projectForm, domain: e.target.value })}
                            className="mt-1 block w-full border-2 border-primary-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
                            required
                          >
                            {(() => {
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
                              const domains = branchDomains[projectForm.category || 'All Categories'] || branchDomains['All Categories'];
                              return domains.map((domain: string) => (
                                <option key={domain} value={domain}>{domain}</option>
                              ));
                            })()}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Difficulty</label>
                          <select
                            value={projectForm.difficulty}
                            onChange={(e) => setProjectForm({ ...projectForm, difficulty: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Expert">Expert</option>
                          </select>
                        </div>
                                                 <div className="flex items-center">
                           <input
                             type="checkbox"
                             checked={projectForm.isPublished}
                             onChange={(e) => setProjectForm({ ...projectForm, isPublished: e.target.checked })}
                             className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                           />
                           <label className="ml-2 block text-sm text-gray-900">Publish immediately</label>
                         </div>
                         
                         {/* Project Image Upload Section */}
                         <div>
                           <label className="block text-sm font-semibold text-gray-700 mb-2">
                             Project Images (Main Display Images)
                           </label>
                           <div className="mt-1 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-dashed border-primary-300 rounded-2xl bg-primary-50">
                             <div className="space-y-2 text-center">
                               <svg
                                 className="mx-auto h-12 w-12 text-primary-400"
                                 stroke="currentColor"
                                 fill="none"
                                 viewBox="0 0 48 48"
                                 aria-hidden="true"
                               >
                                 <path
                                   d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                   strokeWidth={2}
                                   strokeLinecap="round"
                                   strokeLinejoin="round"
                                 />
                               </svg>
                               <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-gray-600">
                                 <label
                                   htmlFor="image-upload"
                                   className="relative cursor-pointer bg-white rounded-full font-semibold text-primary-700 hover:text-primary-900 px-4 py-2 border border-primary-200 shadow-sm transition-colors"
                                 >
                                   <span>Upload images</span>
                                   <input
                                     id="image-upload"
                                     name="image-upload"
                                     type="file"
                                     multiple
                                     accept="image/*"
                                     className="sr-only"
                                     onChange={(e) => {
                                       const files = Array.from(e.target.files || []);
                                       setSelectedImages(prev => [...prev, ...files]);
                                     }}
                                   />
                                 </label>
                                 <span className="text-gray-400">or drag and drop</span>
                               </div>
                               <p className="text-xs text-primary-700 mt-1">Recommended: <span className="font-semibold">3:2 aspect ratio (e.g. 900x600px)</span>, JPG/PNG, max 10MB each. First image will be the main display image.</p>
                             </div>
                           </div>
                           {/* Selected Images Preview */}
                           {selectedImages.length > 0 && (
                             <div className="mt-3">
                               <h4 className="text-xs font-semibold text-gray-700 mb-2">Selected Images:</h4>
                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                 {selectedImages.map((file, index) => (
                                   <div key={index} className="relative w-60 h-40 bg-white shadow-lg rounded-2xl border border-primary-200 flex items-center justify-center overflow-hidden">
                                     <img
                                       src={URL.createObjectURL(file)}
                                       alt={file.name}
                                       className="w-full h-full object-cover object-center rounded-2xl"
                                     />
                                     <button
                                       type="button"
                                       onClick={() => setSelectedImages(selectedImages.filter((_, i) => i !== index))}
                                       className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-base shadow-lg"
                                     >
                                       ×
                                     </button>
                                   </div>
                                 ))}
                               </div>
                             </div>
                           )}
                         </div>
                         
                         {/* File Upload Section */}
                         <div>
                           <label className="block text-sm font-semibold text-gray-700 mb-2">
                             Project Files (PDFs, Documents)
                           </label>
                           <div className="mt-1 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-dashed border-primary-300 rounded-2xl bg-primary-50">
                             <div className="space-y-2 text-center">
                               <svg
                                 className="mx-auto h-12 w-12 text-primary-400"
                                 stroke="currentColor"
                                 fill="none"
                                 viewBox="0 0 48 48"
                                 aria-hidden="true"
                               >
                                 <path
                                   d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                   strokeWidth={2}
                                   strokeLinecap="round"
                                   strokeLinejoin="round"
                                 />
                               </svg>
                               <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-gray-600">
                                 <label
                                   htmlFor="file-upload"
                                   className="relative cursor-pointer bg-white rounded-full font-semibold text-primary-700 hover:text-primary-900 px-4 py-2 border border-primary-200 shadow-sm transition-colors"
                                 >
                                   <span>Upload files</span>
                                   <input
                                     id="file-upload"
                                     name="file-upload"
                                     type="file"
                                     multiple
                                     accept=".pdf,.doc,.docx,.txt"
                                     className="sr-only"
                                     onChange={(e) => {
                                       const files = Array.from(e.target.files || []);
                                       // Only add non-image files
                                       const nonImageFiles = files.filter(file => !file.type.startsWith('image/'));
                                       setSelectedFiles(prev => [...prev, ...nonImageFiles]);
                                     }}
                                   />
                                 </label>
                                 <span className="text-gray-400">or drag and drop</span>
                               </div>
                               <p className="text-xs text-primary-700 mt-1">PDF, DOC, DOCX, TXT up to 10MB each.</p>
                             </div>
                           </div>
                           
                           {/* Selected Files List */}
                           {selectedFiles.length > 0 && (
                             <div className="mt-2">
                               <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                 {selectedFiles.map((file, index) => (
                                   <div key={index} className="relative w-60 h-40 bg-white shadow-lg rounded-2xl border border-primary-200 flex items-center justify-center overflow-hidden">
                                     <div className="flex flex-col items-center justify-center w-full h-full px-2">
                                       <span className="text-lg font-semibold text-primary-700 truncate w-full">{file.name}</span>
                                       <span className="text-xs text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                     </div>
                                     <button
                                       type="button"
                                       onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))}
                                       className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-base shadow-lg"
                                     >
                                       ×
                                     </button>
                                   </div>
                                 ))}
                               </div>
                             </div>
                           )}
                         </div>
                      </div>
                      <div className="mt-6 flex justify-end space-x-3">
                        <button
                          type="button"
                                                     onClick={() => {
                             setShowAddProject(false);
                             setEditingProject(null);
                             setProjectForm({ title: '', description: '', price: '', category: '', domain: 'Python', difficulty: 'Intermediate', isPublished: false });
                             setSelectedImages([]);
                             setSelectedFiles([]);
                           }}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                        >
                          {editingProject ? 'Update Project' : 'Add Project'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">User Management</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users
                      .filter(user => 
                        user.firstName.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                        user.lastName.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                        user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
                      )
                      .map((user) => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                  <span className="text-sm font-medium text-gray-700">
                                    {user.firstName?.charAt(0) || ''}{user.lastName?.charAt(0) || ''}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.firstName} {user.lastName}
                                </div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold 
                                ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : user.role === 'mentor' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                              title={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            >
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold 
                                ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                              title={user.isActive ? 'Active' : 'Inactive'}
                            >
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-indigo-600 hover:text-indigo-900" title="View User Details">
                              <span className="sr-only">View User Details</span>
                              <EyeIcon className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">Order Management</h3>

              {/* Orders Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          #{order._id.slice(-6)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {order.user?.firstName} {order.user?.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{order.user?.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.project?.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${order.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">Site Settings</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">General Settings</h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Site Name</label>
                      <input
                        type="text"
                        value={settings.siteName}
                        onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                      <input
                        type="email"
                        value={settings.contactEmail}
                        onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Project Settings</h4>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.requireApproval}
                        onChange={(e) => setSettings({ ...settings, requireApproval: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">Require admin approval for new projects</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.allowSubmissions}
                        onChange={(e) => setSettings({ ...settings, allowSubmissions: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">Allow public project submissions</label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button 
                    onClick={handleSaveSettings}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Add Featured Project Section */}
        <div className="my-8">
           {/* ...existing code... */}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
