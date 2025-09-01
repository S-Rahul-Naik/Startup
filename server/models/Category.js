const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    unique: true,
    maxlength: [100, 'Category name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  icon: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    default: '#3B82F6',
    validate: {
      validator: function(v) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
      },
      message: 'Color must be a valid hex color code'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  subcategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
categorySchema.index({ name: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ sortOrder: 1 });
categorySchema.index({ parentCategory: 1 });

// Virtual for project count (will be populated when needed)
categorySchema.virtual('projectCount', {
  ref: 'Project',
  localField: '_id',
  foreignField: 'category',
  count: true
});

// Method to check if category can be deleted
categorySchema.methods.canDelete = async function() {
  const Project = require('./Project');
  const count = await Project.countDocuments({ category: this._id });
  return count === 0;
};

// Method to get all subcategories recursively
categorySchema.methods.getAllSubcategories = async function() {
  const subcategories = [];
  
  const getSubs = async (categoryId) => {
    const subs = await this.model('Category').find({ parentCategory: categoryId });
    for (const sub of subs) {
      subcategories.push(sub._id);
      await getSubs(sub._id);
    }
  };
  
  await getSubs(this._id);
  return subcategories;
};

// Pre-save middleware to ensure unique name
categorySchema.pre('save', async function(next) {
  if (this.isModified('name')) {
    const existingCategory = await this.constructor.findOne({
      name: { $regex: new RegExp(`^${this.name}$`, 'i') },
      _id: { $ne: this._id }
    });
    
    if (existingCategory) {
      throw new Error('Category with this name already exists');
    }
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);
