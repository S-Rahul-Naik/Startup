const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const Project = require('../models/Project');
const { auth } = require('../middleware/auth');
const { handleUploads } = require('../middleware/customUpload');

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
      .select('title description shortDescription price category domain difficulty creator isPublished files images rating views orders createdAt abstract blockDiagram specifications learningOutcomes');
    
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

// Create new project (authenticated users, with image, document, blockDiagram, and files upload)
router.post('/', auth, handleUploads([
  { name: 'images', maxCount: 10 },
  { name: 'documents', maxCount: 10 },
  { name: 'blockDiagram', maxCount: 1 },
  { name: 'files', maxCount: 10 }
]), async (req, res) => {
  try {
    const { title, description, price, category, tags, features } = req.body;
    if (!title || !description || !price) {
      return res.status(400).json({ error: 'Title, description, and price are required' });
    }
    // Collect image URLs and original names from Cloudinary uploads
    let imageUrls = [];
    let imagesArr = [];
    if (req.uploads && req.uploads['images']) {
      imagesArr = req.uploads['images'].map(f => ({
        url: f.url,
        originalname: f.originalname || '',
        filename: f.public_id,
        mimetype: f.format,
        size: f.bytes
      }));
      imageUrls = req.uploads['images'].map(f => f.url);
    } else if (req.body.images) {
      imageUrls = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }
    // Collect document URLs and original names from Cloudinary uploads
    let documentUrls = [];
    let documentsArr = [];
    if (req.uploads && req.uploads['documents']) {
      documentsArr = req.uploads['documents'].map(f => ({
        url: f.url,
        originalname: f.originalname || '',
        filename: f.public_id,
        mimetype: f.format,
        size: f.bytes
      }));
      documentUrls = req.uploads['documents'].map(f => f.url);
    } else if (req.body.documents) {
      documentUrls = Array.isArray(req.body.documents) ? req.body.documents : [req.body.documents];
    }
    // Handle blockDiagram upload (single file, store Cloudinary URL and original name)
    let blockDiagramObj = null;
    let blockDiagramUrl = req.body.blockDiagram || '';
    if (req.uploads && req.uploads['blockDiagram'] && req.uploads['blockDiagram'][0]) {
      const f = req.uploads['blockDiagram'][0];
      blockDiagramUrl = f.url;
      blockDiagramObj = {
        url: f.url,
        originalname: f.originalname || '',
        filename: f.public_id,
        mimetype: f.format,
        size: f.bytes
      };
    }
    // Handle files[] upload (store Cloudinary URLs and metadata, with fl_attachment for download)
    let filesArr = [];
    if (req.uploads && req.uploads['files']) {
      filesArr = req.uploads['files'].map(f => {
        // If file is an image, add its Cloudinary URL to imageUrls
        if (f.resource_type === 'image' && f.url && !imageUrls.includes(f.url)) {
          imageUrls.push(f.url);
        }
        // Build download URL with fl_attachment query param for both images and documents
        let downloadUrl = f.url;
        if (f.url && f.originalname) {
          downloadUrl = f.url + '?fl_attachment=' + encodeURIComponent(f.originalname);
        }
        return {
          filename: f.public_id,
          originalname: f.originalname || f.public_id,
          path: downloadUrl,
          mimetype: f.format,
          size: f.bytes
        };
      });
    }
    const project = new Project({
      title,
      description,
      price,
      category,
      tags: tags || [],
      features: features || [],
      images: imagesArr.length > 0 ? imagesArr : imageUrls,
      documents: documentsArr.length > 0 ? documentsArr : documentUrls,
      blockDiagram: blockDiagramObj || blockDiagramUrl,
      files: filesArr,
      creator: req.user.id,
      isPublished: false
    });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update project (creator or admin only, with image, document, blockDiagram, and files upload)
router.put('/:id', auth, handleUploads([
  { name: 'images', maxCount: 10 },
  { name: 'documents', maxCount: 10 },
  { name: 'blockDiagram', maxCount: 1 },
  { name: 'files', maxCount: 10 }
]), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    // Check if user is creator or admin
    if (project.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this project' });
    }
    // If new images uploaded, append to or replace images array (with originalname)
    let imageObjs = Array.isArray(project.images) ? [...project.images] : [];
    if (req.uploads && req.uploads['images']) {
      imageObjs = imageObjs.concat(req.uploads['images'].map(f => ({
        url: f.url,
        originalname: f.originalname || '',
        filename: f.public_id,
        mimetype: f.format,
        size: f.bytes
      })));
    } else if (req.body.images) {
      // If images are just URLs, keep as is
      imageObjs = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }
    // If new documents uploaded, append to or replace documents array (with originalname)
    let documentObjs = Array.isArray(project.documents) ? [...project.documents] : [];
    if (req.uploads && req.uploads['documents']) {
      documentObjs = documentObjs.concat(req.uploads['documents'].map(f => ({
        url: f.url,
        originalname: f.originalname || '',
        filename: f.public_id,
        mimetype: f.format,
        size: f.bytes
      })));
    } else if (req.body.documents) {
      documentObjs = Array.isArray(req.body.documents) ? req.body.documents : [req.body.documents];
    }
    // Handle blockDiagram upload (single file, store Cloudinary URL and originalname)
    let blockDiagramObj = project.blockDiagram || null;
    if (req.uploads && req.uploads['blockDiagram'] && req.uploads['blockDiagram'][0]) {
      const f = req.uploads['blockDiagram'][0];
      blockDiagramObj = {
        url: f.url,
        originalname: f.originalname || '',
        filename: f.public_id,
        mimetype: f.format,
        size: f.bytes
      };
    }
    // Handle files[] upload (append Cloudinary URLs and metadata, with fl_attachment)
    let filesArr = Array.isArray(project.files) ? [...project.files] : [];
    if (req.uploads && req.uploads['files']) {
      filesArr = filesArr.concat(req.uploads['files'].map(f => {
        let downloadUrl = f.url;
        if (f.url && f.originalname) {
          const urlParts = f.url.split('/upload/');
          if (urlParts.length === 2) {
            downloadUrl = urlParts[0] + '/upload/fl_attachment:' + encodeURIComponent(f.originalname) + '/' + urlParts[1];
          }
        }
        return {
          filename: f.public_id,
          originalname: f.originalname || f.public_id,
          path: downloadUrl,
          mimetype: f.format,
          size: f.bytes
        };
      }));
    }
    // Update project fields
    const updateFields = { ...req.body, images: imageObjs, documents: documentObjs, blockDiagram: blockDiagramObj, files: filesArr };
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      updateFields,
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

// Handle CORS preflight for file routes (align with global CORS)
router.options('/files/:filename', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).end();
});

// Serve uploaded files (Cloudinary only, public access)
router.get('/files/:filename', async (req, res) => {
  const filename = req.params.filename;
  // Search all projects for a file with this filename in files[]
  const project = await Project.findOne({ 'files.filename': filename });
  if (!project) {
    return res.status(404).json({ error: 'File not found in any project', filename });
  }
  const fileObj = project.files.find(f => f.filename === filename);
  if (!fileObj || !fileObj.path) {
    return res.status(404).json({ error: 'File not found in project', filename });
  }
  // Redirect to Cloudinary URL
  return res.redirect(fileObj.path);
});

module.exports = router;
