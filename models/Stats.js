import mongoose from 'mongoose';

const statsSchema = new mongoose.Schema({
  villages: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  problems: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  funds: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  volunteers: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  }
}, {
  timestamps: true
});

const Stats = mongoose.model('Stats', statsSchema);
export default Stats;