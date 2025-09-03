const multer = require('multer');
const path = require('path');

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Save blockDiagram files to /uploads/projects, others to /uploads/custom-requests
    let dest;
    if (file.fieldname === 'blockDiagram') {
      dest = path.join(__dirname, '../../uploads/projects');
    } else {
      dest = path.join(__dirname, '../../uploads/custom-requests');
    }
    console.log('[MULTER] Saving file to:', dest);
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + '-' + file.originalname;
    console.log('[MULTER] Saving as filename:', filename);
    cb(null, filename);
  }
});

const upload = multer({ storage });

module.exports = upload;
