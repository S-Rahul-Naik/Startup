const fs = require('fs');
console.log('ENV FILE EXISTS:', fs.existsSync('./.env'));
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
// const rateLimit = require('express-rate-limit');
require('dotenv').config();
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASS:', process.env.SMTP_PASS ? '***' : 'NOT SET');

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const adminRoutes = require('./routes/admin');
const orderRoutes = require('./routes/orders');
const categoryRoutes = require('./routes/categories');
const fileRoutes = require('./routes/files');
const contactRoutes = require('./routes/contact');
const upiRoutes = require('./routes/upi');

// CORS configuration (MUST come before helmet to work properly)
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? [
        'https://edutech-2k25.netlify.app',
        'https://edutech-2k25.onrender.com'
      ]
    : ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false
}));
app.use(compression());

// Rate limiting removed

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edutech', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Serve uploaded custom request files statically (must be before API and 404 handlers)
const path = require('path');


// Serve uploaded project images (block diagrams) statically
const projectsUploadsPath = path.join(__dirname, '../uploads/projects');
console.log('Serving project uploads from:', projectsUploadsPath);
app.use('/uploads/projects', express.static(projectsUploadsPath));

// Serve uploaded custom request files statically
const customRequestsPath = path.join(__dirname, '../uploads/custom-requests');
console.log('Serving custom requests from:', customRequestsPath);
app.use('/uploads/custom-requests', express.static(customRequestsPath));

// Serve receipts statically
const receiptsPath = path.join(__dirname, '../uploads/receipts');
console.log('Serving receipts from:', receiptsPath);
app.use('/uploads/receipts', express.static(receiptsPath));

// Force download for receipts
// Force download for receipts with original filename if possible
const Order = require('./models/Order');
app.get('/download/receipts/:filename', async (req, res) => {
  const file = path.join(receiptsPath, req.params.filename);
  try {
    // Try to find the order with this receipt filename
    const order = await Order.findOne({ receipt: `/uploads/receipts/${req.params.filename}` });
    let downloadName = req.params.filename;
    if (order && order.receiptOriginalName) {
      downloadName = order.receiptOriginalName;
    }
    res.download(file, downloadName, err => {
      if (err) {
        res.status(404).json({ error: 'File not found' });
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upi', upiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Edu Tech API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('ERROR:', err); // Improved error logging
  if (err && err.stack) console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📱 API available at: http://localhost:${PORT}/api`);
});

module.exports = app;