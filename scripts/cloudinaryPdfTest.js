// Minimal Cloudinary PDF upload test
// Place a test PDF in the same folder and set the filename below

const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: 'ddonclcfu',
  api_key: '836552511869134',
  api_secret: 'rclVDuFLNcGUd2LyRgL1-7Q01XY'
});

const path = require('path');
const filePath = path.join(__dirname, 'test.pdf'); // Place your test PDF here

cloudinary.uploader.upload(filePath, {
  resource_type: 'raw',
  use_filename: true,
  unique_filename: false,
  filename_override: 'test.pdf',
  folder: 'docs/projects'
}, (err, result) => {
  if (err) {
    console.error('Upload error:', err);
  } else {
    console.log('Upload result:', result);
    console.log('Download URL:', result.secure_url + '?fl_attachment=' + encodeURIComponent('test.pdf'));
  }
});
