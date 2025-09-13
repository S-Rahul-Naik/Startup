// Script to clean up Cloudinary file paths in MongoDB
// Removes any /fl_attachment:.../ from the path and ensures only base URL is stored
// Usage: node fixCloudinaryPaths.js

const mongoose = require('mongoose');

// Replace with your MongoDB connection string
const MONGO_URI = 'mongodb+srv://coder6456:Startup2025@edutech.wuu9ici.mongodb.net/?retryWrites=true&w=majority&appName=EduTech';

// Replace with your actual Project model path if needed
const Project = require('../server/models/Project');

async function fixCloudinaryPaths() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const projects = await Project.find({ 'files.path': { $regex: '/fl_attachment:' } });
  let updatedCount = 0;

  for (const project of projects) {
    let changed = false;
    for (const file of project.files) {
      if (file.path && file.path.includes('/fl_attachment:')) {
        // Remove /fl_attachment:.../ from the path
        const parts = file.path.split('/upload/');
        if (parts.length === 2) {
          // Remove everything after /upload/ up to the next /
          const afterUpload = parts[1].replace(/^fl_attachment:[^/]+\//, '');
          file.path = parts[0] + '/upload/' + afterUpload;
          changed = true;
        }
      }
    }
    if (changed) {
      await project.save();
      updatedCount++;
    }
  }
  console.log(`Updated ${updatedCount} project(s).`);
  mongoose.disconnect();
}

fixCloudinaryPaths().catch(console.error);