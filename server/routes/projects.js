const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Project = require('../models/Project');
const { auth } = require('../middleware/auth');

// Get all projects (public)
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    
    let query = { isPublished: true };
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const projects = await Project.find(query)
      .populate('creator', 'firstName lastName email')
      .populate('category', 'name')
      .select('title description shortDescription price category domain difficulty creator isPublished files images rating views orders createdAt')
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

// Get single project by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('creator', 'firstName lastName email')
      .populate('category', 'name')
      .select('title description shortDescription price category domain difficulty creator isPublished files images rating views orders createdAt');
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    if (!project.isPublished && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json({ project });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Create new project (authenticated users)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, price, category, tags, features, images } = req.body;
    
    if (!title || !description || !price) {
      return res.status(400).json({ error: 'Title, description, and price are required' });
    }
    
    const project = new Project({
      title,
      description,
      price,
      category,
      tags: tags || [],
      features: features || [],
      images: images || [],
      creator: req.user.id,
      isPublished: false // Default to unpublished
    });
    
    await project.save();
    
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update project (creator or admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Check if user is creator or admin
    if (project.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this project' });
    }
    
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project (creator or admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Check if user is creator or admin
    if (project.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this project' });
    }
    
    await Project.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Publish/unpublish project (creator or admin only)
router.patch('/:id/publish', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Check if user is creator or admin
    if (project.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to modify this project' });
    }
    
    project.isPublished = !project.isPublished;
    await project.save();
    
    res.json({ 
      message: `Project ${project.isPublished ? 'published' : 'unpublished'} successfully`,
      isPublished: project.isPublished
    });
  } catch (error) {
    console.error('Error updating project status:', error);
    res.status(500).json({ error: 'Failed to update project status' });
  }
});

// Handle CORS preflight for file routes
router.options('/files/:filename', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.status(200).end();
});

// Serve uploaded files (public access)
router.get('/files/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, '../../uploads/projects', filename);
  
  if (fs.existsSync(filepath)) {
    // Set appropriate headers for file download/viewing
    const ext = path.extname(filename).toLowerCase();
    if (ext === '.pdf') {
      res.setHeader('Content-Type', 'application/pdf');
    } else if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
      res.setHeader('Content-Type', `image/${ext.slice(1)}`);
    } else if (['.doc', '.docx'].includes(ext)) {
      res.setHeader('Content-Type', 'application/msword');
    } else {
      res.setHeader('Content-Type', 'application/octet-stream');
    }
    
    res.sendFile(filepath);
  } else {
    console.log(`File not found: ${filepath}`);
    res.status(404).json({ 
      error: 'File not found',
      message: 'The requested file does not exist on the server.',
      filename: filename
    });
  }
});

module.exports = router;
