const express = require('express');
const router = express.Router();
const path = require('path');
const fsp = require('fs').promises;
const fs = require('fs');
const { auth } = require('../middleware/auth');
const { upload: multerUpload } = require('../middleware/customUpload');
const cloudinary = require('../utils/cloudinary');

// File filter (kept for safety, applied via Cloudinary resource type selection)
const allowedTypes = new Set([
  'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
  'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed'
]);

// Upload files (authenticated users)
router.post('/upload', auth, multerUpload.array('files', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    // Validate mime types
    for (const f of req.files) {
      if (!allowedTypes.has(f.mimetype)) {
        return res.status(400).json({ error: `Invalid file type: ${f.mimetype}` });
      }
    }
    // Upload each file buffer to Cloudinary under 'uploads'
    const results = [];
    const streamifier = require('streamifier');
    for (const file of req.files) {
      const resourceType = file.mimetype.startsWith('image/') ? 'image' : 'raw';
      const folder = 'uploads';
      const public_id = `${Date.now()}-${Math.round(Math.random()*1e9)}`;
      const resUpload = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({
          folder, resource_type: resourceType, public_id, overwrite: false
        }, (err, result) => err ? reject(err) : resolve(result));
        streamifier.createReadStream(file.buffer).pipe(stream);
      });
      results.push({
        originalName: file.originalname,
        url: resUpload.secure_url,
        public_id: resUpload.public_id,
        resource_type: resUpload.resource_type,
        bytes: resUpload.bytes,
        format: resUpload.format,
        uploadedBy: req.user.id,
        uploadedAt: new Date()
      });
    }

    res.json({
      message: `${results.length} file(s) uploaded successfully`,
      files: results
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ error: 'Failed to upload files' });
  }
});

// Get file info (authenticated users)
router.get('/:filename', auth, async (req, res) => {
  try {
    const filename = req.params.filename;
  const filePath = path.join('uploads', filename);
    
    // Check if file exists
    try {
  await fsp.access(filePath);
    } catch (error) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Get file stats
  const stats = await fsp.stat(filePath);
    
    res.json({
      filename,
      size: stats.size,
      createdAt: stats.birthtime,
      modifiedAt: stats.mtime
    });
  } catch (error) {
    console.error('Error getting file info:', error);
    res.status(500).json({ error: 'Failed to get file info' });
  }
});

// Download file (authenticated users)
router.get('/download/:filename', auth, async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join('uploads', filename);
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Get file stats
    const stats = await fs.stat(filePath);
    
    // Set headers for download
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Stream the file
  const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ error: 'Failed to download file' });
  }
});

// Delete file (authenticated users - their own files or admin)
router.delete('/:filename', auth, async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join('uploads', filename);
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // For now, allow deletion of any file by authenticated users
    // In a production app, you might want to track file ownership
    // and only allow users to delete their own files
    
    await fs.unlink(filePath);
    
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// Get all files (admin only, Cloudinary URLs from all projects)
const Project = require('../models/Project');
router.get('/admin/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    // Aggregate all files from all projects
    const projects = await Project.find({}, 'title files');
    let allFiles = [];
    for (const project of projects) {
      if (Array.isArray(project.files)) {
        allFiles = allFiles.concat(project.files.map(f => ({
          project: project.title,
          filename: f.filename,
          originalname: f.originalname,
          url: f.path,
          mimetype: f.mimetype,
          size: f.size
        })));
      }
    }
    res.json({ files: allFiles });
  } catch (error) {
    console.error('Error getting all files:', error);
    res.status(500).json({ error: 'Failed to get files' });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files. Maximum is 5 files per request.' });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: 'Unexpected file field.' });
    }
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({ error: error.message });
  }
  
  console.error('File upload error:', error);
  res.status(500).json({ error: 'File upload failed' });
});

module.exports = router;
