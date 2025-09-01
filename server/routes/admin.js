const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Project = require('../models/Project');
const Order = require('../models/Order');
const Category = require('../models/Category');
const { auth } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads/projects');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
  // Allow all file types
  cb(null, true);
  }
});

// Admin middleware - check if user is admin
const adminAuth = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

// Apply admin auth to all admin routes
router.use(auth, adminAuth);

// Get all users (admin only)
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    
    let query = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await User.countDocuments(query);
    
    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID (admin only)
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user role (admin only)
router.patch('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be "user" or "admin"' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// Delete user (admin only)
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    
    await User.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Get all projects (including unpublished) - admin only
router.get('/projects', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, category } = req.query;
    
    let query = {};
    
    if (status === 'published') query.isPublished = true;
    else if (status === 'unpublished') query.isPublished = false;
    
    if (category) query.category = category;
    
    const skip = (page - 1) * limit;
    
    const projects = await Project.find(query)
      .populate('creator', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Project.countDocuments(query);
    
    res.json({
      projects,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalProjects: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Create new project (admin only)
router.post('/projects', upload.array('files', 10), async (req, res) => {
  try {
    const { title, description, price, category, domain, difficulty, isPublished } = req.body;
    
    // Handle category - create if it doesn't exist
    let categoryId = category;
    if (category && typeof category === 'string' && category.trim()) {
      // Check if category exists, if not create it
      let existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${category}$`, 'i') } });
      if (!existingCategory) {
        existingCategory = new Category({
          name: category,
          description: `Category for ${category} projects`,
          createdBy: req.user.id
        });
        await existingCategory.save();
      }
      categoryId = existingCategory._id;
    } else {
      // Use default category
      let defaultCategory = await Category.findOne({ name: 'General' });
      if (!defaultCategory) {
        defaultCategory = new Category({
          name: 'General',
          description: 'General projects category',
          createdBy: req.user.id
        });
        await defaultCategory.save();
      }
      categoryId = defaultCategory._id;
    }
    
    // Process uploaded files
    const uploadedFiles = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        uploadedFiles.push({
          filename: file.filename,
          originalname: file.originalname,
          path: file.path,
          mimetype: file.mimetype,
          size: file.size
        });
      });
    }
    
    // Create a simplified project with required fields
    const project = new Project({
      title,
      description,
      shortDescription: description.substring(0, 500), // Auto-generate short description
      price: parseFloat(price),
      category: categoryId,
      domain: domain || 'Python', // Use provided domain or default
      difficulty: difficulty || 'Intermediate', // Use provided difficulty or default
      creator: req.user.id,
      isPublished: isPublished || false,
      isApproved: true, // Admin projects are auto-approved
      approvedBy: req.user.id,
      approvedAt: new Date(),
      status: isPublished ? 'published' : 'draft',
      files: uploadedFiles // Add uploaded files to project
    });
    
    await project.save();
    
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update project (admin only)
router.put('/projects/:id', async (req, res) => {
  try {
    const { title, description, price, category, domain, difficulty, isPublished } = req.body;
    
    // Handle category - create if it doesn't exist
    let categoryId = category;
    if (category && typeof category === 'string' && category.trim()) {
      // Check if category exists, if not create it
      let existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${category}$`, 'i') } });
      if (!existingCategory) {
        existingCategory = new Category({
          name: category,
          description: `Category for ${category} projects`,
          createdBy: req.user.id
        });
        await existingCategory.save();
      }
      categoryId = existingCategory._id;
    }
    
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        shortDescription: description.substring(0, 500),
        price,
        category: categoryId,
        domain,
        difficulty,
        isPublished,
        updatedBy: req.user.id
      },
      { new: true, runValidators: true }
    );
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project (admin only)
router.delete('/projects/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle project publish status (admin only)
router.patch('/projects/:id/toggle-status', async (req, res) => {
  try {
    const { isPublished } = req.body;
    
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    project.isPublished = isPublished;
    project.updatedBy = req.user.id;
    
    await project.save();
    
    res.json(project);
  } catch (error) {
    console.error('Error toggling project status:', error);
    res.status(500).json({ error: 'Failed to toggle project status' });
  }
});

// Approve/reject project (admin only)
router.patch('/projects/:id/approve', async (req, res) => {
  try {
    const { isApproved, rejectionReason } = req.body;
    
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    project.isApproved = isApproved;
    project.rejectionReason = rejectionReason || '';
    project.approvedBy = req.user.id;
    project.approvedAt = new Date();
    
    if (isApproved) {
      project.isPublished = true;
    }
    
    await project.save();
    
    res.json(project);
  } catch (error) {
    console.error('Error approving project:', error);
    res.status(500).json({ error: 'Failed to approve project' });
  }
});

// Get all orders (admin only)
router.get('/orders', async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    
    let query = {};
    if (status) query.status = status;
    
    const skip = (page - 1) * limit;
    
    const orders = await Order.find(query)
      .populate('user', 'firstName lastName email')
      .populate('project', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Order.countDocuments(query);
    
    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order status (admin only)
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Get dashboard stats (admin only)
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProjects = await Project.countDocuments();
    const publishedProjects = await Project.countDocuments({ isPublished: true });
    const pendingProjects = await Project.countDocuments({ isPublished: false, isApproved: { $ne: false } });
    
    // Recent activity
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('firstName lastName email role createdAt');
    
    const recentProjects = await Project.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('creator', 'firstName lastName email')
      .select('title creator createdAt isPublished');
    
    res.json({
      stats: {
        totalUsers,
        totalProjects,
        publishedProjects,
        pendingProjects,
        totalOrders: 0, // Will be updated when Order model is available
        totalRevenue: '0.00' // Will be updated when Order model is available
      },
      recentActivity: {
        users: recentUsers,
        projects: recentProjects
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Serve uploaded files
router.get('/files/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, '../../uploads/projects', filename);
  
  if (fs.existsSync(filepath)) {
    res.sendFile(filepath);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

// ...existing code...

module.exports = router;
