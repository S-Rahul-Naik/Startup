const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../utils/cloudinary');

// Use memory storage; then upload to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper to upload a single file buffer to Cloudinary
async function uploadBufferToCloudinary(file, folder) {
  const resourceType = file.mimetype.startsWith('image/') ? 'image' : 'raw';
  const options = {
    folder,
    resource_type: resourceType,
    public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
    overwrite: false,
  };
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
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
          const folder = field === 'blockDiagram' ? 'projects' : 'custom-requests';
          req.uploads[field] = [];
          for (const file of files) {
            const result = await uploadBufferToCloudinary(file, folder);
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
