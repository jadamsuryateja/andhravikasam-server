import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  village: {
    type: String,
    required: [true, 'Village is required']
  },
  mandal: {
    type: String,
    required: [true, 'Mandal is required']
  },
  constituency: {
    type: String,
    required: [true, 'Constituency is required']
  },
  sponsor: String,
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Solved'],
    default: 'Pending'
  },
  images: [String],
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: [true, 'Project must be uploaded by an admin']
  }
}, {
  timestamps: true
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
