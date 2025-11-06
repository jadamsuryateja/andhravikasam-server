import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['Volunteer', 'Village Incharge', 'Mandal Incharge', 'Constituency Incharge', 'District Incharge']
  },
  district: {
    type: String,
    required: true
  },
  mandal: {
    type: String,
    required: true
  },
  village: {
    type: String,
    required: true
  },
  collegeProfession: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  motivation: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Member', memberSchema);
