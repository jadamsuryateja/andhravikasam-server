import mongoose from 'mongoose';

const statsAboutSchema = new mongoose.Schema({
  constituencies: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  activeVolunteers: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  impactGenerated: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  problemsSolved: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  }
}, {
  timestamps: true
});

const StatsAbout = mongoose.model('StatsAbout', statsAboutSchema);
export default StatsAbout;