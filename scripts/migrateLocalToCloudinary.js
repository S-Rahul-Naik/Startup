// Script to migrate local file/image paths in projects to Cloudinary URLs
// Usage: node scripts/migrateLocalToCloudinary.js

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Project = require('../server/models/Project');
const cloudinary = require('../server/utils/cloudinary');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/edutech';

async function uploadToCloudinary(localPath, folder) {
  const resourceType = localPath.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? 'image' : 'raw';
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      localPath,
      {
        folder,
        resource_type: resourceType,
        use_filename: true,
        unique_filename: false,
        overwrite: false,
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result.secure_url);
      }
    );
  });
}

async function migrate() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  const projects = await Project.find({});
  let updatedCount = 0;

  for (const project of projects) {
    let changed = false;

    // Migrate files[]
    if (Array.isArray(project.files)) {
      for (const file of project.files) {
        if (file.path && !file.path.startsWith('http')) {
          const localFilePath = path.isAbsolute(file.path) ? file.path : path.join(__dirname, '..', file.path);
          if (fs.existsSync(localFilePath)) {
            try {
              const cloudUrl = await uploadToCloudinary(localFilePath, 'projects');
              file.path = cloudUrl;
              changed = true;
              // If image, also add to images[]
              if (file.mimetype && file.mimetype.startsWith('image/') && (!project.images || !project.images.includes(cloudUrl))) {
                project.images = project.images || [];
                project.images.push(cloudUrl);
              }
              console.log(`Migrated file for project ${project._id}: ${file.filename}`);
            } catch (err) {
              console.error(`Failed to upload ${localFilePath}:`, err.message);
            }
          } else {
            console.warn(`Local file not found: ${localFilePath}`);
          }
        }
      }
    }

    // Migrate images[]
    if (Array.isArray(project.images)) {
      for (let i = 0; i < project.images.length; i++) {
        const img = project.images[i];
        if (img && !img.startsWith('http')) {
          const localImgPath = path.isAbsolute(img) ? img : path.join(__dirname, '..', img);
          if (fs.existsSync(localImgPath)) {
            try {
              const cloudUrl = await uploadToCloudinary(localImgPath, 'projects');
              project.images[i] = cloudUrl;
              changed = true;
              console.log(`Migrated image for project ${project._id}`);
            } catch (err) {
              console.error(`Failed to upload ${localImgPath}:`, err.message);
            }
          } else {
            console.warn(`Local image not found: ${localImgPath}`);
          }
        }
      }
    }

    if (changed) {
      await project.save();
      updatedCount++;
    }
  }

  console.log(`Migration complete. Updated ${updatedCount} projects.`);
  mongoose.disconnect();
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  mongoose.disconnect();
});
