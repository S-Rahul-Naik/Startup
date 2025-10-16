const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../utils/cloudinary');

// Use memory storage; then upload to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper to upload a single file buffer to Cloudinary
async function uploadBufferToCloudinary(file, folder) {
  // Determine folder and resource type based on file type and form context
  let resourceType = 'raw';
  let uploadFolder = folder;
  // If uploading from contact/custom-request form, use custom-requests folders
  const isCustomRequest = folder === 'images' || folder === 'documents';
  // If uploading a payment receipt, use receipts folders
  const isReceipt = folder === 'receipt';
  if (file.mimetype.startsWith('image/')) {
    resourceType = 'image';
    if (isReceipt) {
      uploadFolder = 'images/receipts';
    } else if (isCustomRequest) {
      uploadFolder = 'images/custom-requests';
    } else {
      uploadFolder = 'images/projects';
    }
  } else if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('application/')) {
    resourceType = 'raw';
    if (isReceipt) {
      uploadFolder = 'docs/receipts';
    } else if (isCustomRequest) {
      uploadFolder = 'docs/custom-requests';
    } else {
      uploadFolder = 'docs/projects';
    }
  } else {
    // fallback for other types
    if (isReceipt) {
      uploadFolder = 'docs/receipts';
    } else if (isCustomRequest) {
      uploadFolder = 'docs/custom-requests';
    } else {
      uploadFolder = 'docs/projects';
    }
  }
  // Special case: blockDiagram should always go to images/projects
  if (folder === 'blockDiagram') {
    resourceType = 'image';
    uploadFolder = 'images/projects';
  }
  const options = {
    folder: uploadFolder,
    resource_type: resourceType,
    use_filename: true,
    unique_filename: false,
    filename_override: file.originalname,
    type: resourceType === 'raw' ? 'upload' : undefined // Ensure raw files (PDF/docs) are always accessible
  };

  if (resourceType === 'raw') {
    // Save buffer to a temp file, then upload
    const fs = require('fs');
    const os = require('os');
    const path = require('path');
    const tmpFilePath = path.join(os.tmpdir(), file.originalname);
    fs.writeFileSync(tmpFilePath, file.buffer);
    try {
      const result = await cloudinary.uploader.upload(tmpFilePath, options);
      fs.unlinkSync(tmpFilePath); // Clean up temp file
      return result;
    } catch (err) {
      fs.unlinkSync(tmpFilePath);
      throw err;
    }
  } else {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(options, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}

// Middleware to handle fields and push Cloudinary URLs into req.uploads
function handleUploads(fields) {
  return [
    upload.fields(fields),
    async (req, res, next) => {
      try {
        req.uploads = {};
        if (!req.files) return next();
        const entries = Object.entries(req.files);
        for (const [field, files] of entries) {
          req.uploads[field] = [];
          for (const file of files) {
            // Pass field name to uploadBufferToCloudinary to handle blockDiagram special case
            const result = await uploadBufferToCloudinary(file, field);
            req.uploads[field].push({
              url: result.secure_url,
              public_id: result.public_id,
              resource_type: result.resource_type,
              bytes: result.bytes,
              format: result.format,
              originalname: file.originalname // Add original filename
            });
          }
        }
        next();
      } catch (err) {
        console.error('Cloudinary upload error:', err);
        next(err);
      }
    }
  ];
}

module.exports = { upload, handleUploads };
