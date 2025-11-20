import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  longDescription: {
    type: String,
    required: true,
  },
  technologies: [{
    type: String,
  }],
  imageUrl: {
    type: String,
    required: true,
  },
  bannerUrl: String,
  githubUrl: String,
  liveUrl: String,
  category: {
    type: String,
    enum: ['web', 'ai', 'data', 'embedded', 'other'],
    default: 'other',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  interactive: {
    type: Boolean,
    default: false,
  },
  interactivePath: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Project', projectSchema);
