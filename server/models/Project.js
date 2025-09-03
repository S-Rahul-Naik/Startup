const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  abstract: {
    type: String,
    trim: true,
    maxlength: [5000, 'Abstract cannot exceed 5000 characters']
  },
  blockDiagram: {
    type: String, // URL or description
    trim: true,
    maxlength: [1000, 'Block diagram info cannot exceed 1000 characters']
  },
  specifications: {
    type: String,
    trim: true,
    maxlength: [3000, 'Specifications cannot exceed 3000 characters']
  },
  learningOutcomes: [{
    type: String,
    trim: true,
    maxlength: [500, 'Learning outcome cannot exceed 500 characters']
  }],
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [500, 'Short description cannot exceed 500 characters']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Project category is required']
  },
  domain: {
    type: String,
    enum: [
      'All Domains',
      'VLSI',
      'Embedded Systems',
      'Signal Processing',
      'Communication Systems',
      'IoT',
      'Others',
      'Power Systems',
      'Control Systems',
      'Electrical Machines',
      'Renewable Energy',
      'Thermal Engineering',
      'Design',
      'Manufacturing',
      'Robotics',
      'Web Development',
      'App Development',
      'Cloud Computing',
      'Cybersecurity',
      'Deep Learning',
      'Natural Language Processing',
      'Computer Vision',
      'Reinforcement Learning',
      'Big Data',
      'Data Analytics',
      'Visualization',
      'Business Intelligence',
      'Python'
    ],
    required: [true, 'Project domain is required']
  },
  subDomain: {
    type: String,
    trim: true,
    maxlength: [100, 'Sub-domain cannot exceed 100 characters']
  },
  controller: {
    type: String,
    enum: [
      'Raspberry Pi', 'ARM7', 'PIC16F77A', 'Arduino', '8051', 'Jetson Nano', 'NodeMCU'
    ]
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Intermediate'
  },
  price: {
    type: Number,
    required: [true, 'Project price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  discount: {
    type: Number,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  },
  features: [{
    type: String,
    trim: true,
    maxlength: [200, 'Feature cannot exceed 200 characters']
  }],
  requirements: [{
    type: String,
    trim: true,
    maxlength: [200, 'Requirement cannot exceed 200 characters']
  }],
  deliverables: [{
    type: String,
    trim: true,
    maxlength: [200, 'Deliverable cannot exceed 200 characters']
  }],
  images: [{
    type: String,
    trim: true
  }],
  videos: [{
    type: String,
    trim: true
  }],
  documents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  }],
  files: [{
    filename: String,
    originalname: String,
    path: String,
    mimetype: String,
    size: Number
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // ...existing code...
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  orders: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  estimatedDuration: {
    type: String,
    trim: true
  },
  support: {
    type: String,
    enum: ['Basic', 'Standard', 'Premium', '24/7'],
    default: 'Standard'
  },
  warranty: {
    type: String,
    trim: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  rejectionReason: {
    type: String,
    trim: true,
    maxlength: [500, 'Rejection reason cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Indexes for better query performance
projectSchema.index({ title: 'text', description: 'text', tags: 'text' });
projectSchema.index({ category: 1 });
projectSchema.index({ domain: 1 });
projectSchema.index({ status: 1 });
// ...existing code...
projectSchema.index({ price: 1 });
projectSchema.index({ createdAt: -1 });

// Virtual for discounted price
projectSchema.virtual('discountedPrice').get(function() {
  if (this.discount && this.discount > 0) {
    return this.price - (this.price * this.discount / 100);
  }
  return this.price;
});

// Virtual for isDiscounted
projectSchema.virtual('isDiscounted').get(function() {
  return this.discount && this.discount > 0;
});

// Method to increment views
projectSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to increment likes
projectSchema.methods.incrementLikes = function() {
  this.likes += 1;
  return this.save();
};

// Method to increment orders
projectSchema.methods.incrementOrders = function() {
  this.orders += 1;
  return this.save();
};

// Method to update rating
projectSchema.methods.updateRating = function(newRating) {
  const currentTotal = this.rating.average * this.rating.count;
  this.rating.count += 1;
  this.rating.average = (currentTotal + newRating) / this.rating.count;
  return this.save();
};

// Pre-save middleware to set original price if not set
projectSchema.pre('save', function(next) {
  if (!this.originalPrice) {
    this.originalPrice = this.price;
  }
  next();
});

module.exports = mongoose.model('Project', projectSchema);