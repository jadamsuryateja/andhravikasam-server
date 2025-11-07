import mongoose from 'mongoose';

const statsJoinSchema = new mongoose.Schema({
  activeVolunteers: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  constituenciesCovered: {
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
  },
  fundsUtilized: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  }
}, {
  timestamps: true
});

const StatsJoin = mongoose.model('StatsJoin', statsJoinSchema);
export default StatsJoin;