import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  titleFr: String,
  description: {
    type: String,
    required: true,
  },
  descriptionFr: String,
  longDescription: {
    type: String,
    required: true,
  },
  longDescriptionFr: String,
  details: {
    context: String,
    duration: String,
    team: String,
    role: String,
    why: String,
    learnings: [String],
    improvements: [String],
  },
  detailsFr: {
    context: String,
    duration: String,
    team: String,
    role: String,
    why: String,
    learnings: [String],
    improvements: [String],
  },
  technologies: [{
    type: String,
  }],
  technologiesFr: [{
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
  healthCheckUrl: String,
  maturity: {
    type: String,
    enum: ['stable', 'beta', 'alpha'],
    default: 'stable',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const collectionName = (process.env.PROJECTS_COLLECTION || 'projects').trim();

export default mongoose.model('Project', projectSchema, collectionName);
