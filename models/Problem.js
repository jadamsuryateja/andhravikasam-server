import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['infrastructure', 'water', 'electricity', 'healthcare', 'education', 'environment', 'transportation', 'other']
  },
  location: {
    gpsLocation: String,
    village: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pinCode: {
      type: String,
      required: true
    },
    landmark: String
  },
  details: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    peopleAffected: String,
    urgencyLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    }
  },
  contact: {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: String
  },
  images: [String],
  status: {
    type: String,
    enum: ['Pending', 'Under Review', 'In Progress', 'Resolved', 'Rejected'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Problem', problemSchema);