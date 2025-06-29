const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  gradeLevel: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    trim: true
  },
  series: {
    type: String,
    trim: true
  },
  isbn: {
    type: String,
    trim: true
  },
  publisher: {
    type: String,
    trim: true
  },
  publishYear: {
    type: Number,
    min: 1000,
    max: new Date().getFullYear() + 10
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['available', 'checked-out', 'maintenance', 'lost'],
    default: 'available'
  },
  location: {
    type: String,
    trim: true
  },
  quantity: {
    type: Number,
    default: 1,
    min: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  extractedByAI: {
    type: Boolean,
    default: false
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    default: null
  },
  imageUrl: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for better search performance
bookSchema.index({ title: 'text', author: 'text', subject: 'text', description: 'text' });
bookSchema.index({ gradeLevel: 1 });
bookSchema.index({ subject: 1 });
bookSchema.index({ status: 1 });
bookSchema.index({ createdAt: -1 });
bookSchema.index({ extractedByAI: 1 });

module.exports = mongoose.model('Book', bookSchema);