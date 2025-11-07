import mongoose from 'mongoose';

const statsTransparencySchema = new mongoose.Schema({
  transparencyScore: {
    type: String,
    required: true,
    default: '0%'
  },
  utilizationRate: {
    type: String,
    required: true,
    default: '0%'
  },
  trackingRate: {
    type: String,
    required: true,
    default: '0%'
  },
  financialStats: {
    totalIncome: {
      type: String,
      required: true,
      default: '₹0 Cr'
    },
    totalExpenses: {
      type: String,
      required: true,
      default: '₹0 Cr'
    },
    reserves: {
      type: String,
      required: true,
      default: '₹0 Cr'
    },
    efficiencyRatio: {
      type: String,
      required: true,
      default: '0%'
    }
  },
  highlightNote: {
    title: {
      type: String,
      default: '100% Transparent Operations'
    },
    description: {
      type: String,
      default: 'We maintain 100% transparency. Every rupee you contribute helps rebuild our Andhra.'
    }
  }
}, {
  timestamps: true
});

const StatsTransparency = mongoose.model('StatsTransparency', statsTransparencySchema);
export default StatsTransparency;