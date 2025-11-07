import express from 'express';
import StatsTransparency from '../models/StatsTransparency.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get current stats
router.get('/', async (req, res) => {
  try {
    const stats = await StatsTransparency.findOne().sort({ createdAt: -1 });
    if (!stats) {
      // Return default values if no stats exist
      const defaultStats = {
        transparencyScore: '0%',
        utilizationRate: '0%',
        trackingRate: '0%',
        financialStats: {
          totalIncome: '₹0 Cr',
          totalExpenses: '₹0 Cr',
          reserves: '₹0 Cr',
          efficiencyRatio: '0%'
        }
      };
      return res.json(defaultStats);
    }
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update stats (admin only)
router.patch('/update', authenticateToken, isAdmin, async (req, res) => {
  try {
    const {
      transparencyScore,
      utilizationRate,
      trackingRate,
      financialStats
    } = req.body;

    const updates = {};
    
    // Validate and update main metrics
    if (transparencyScore !== undefined) updates.transparencyScore = transparencyScore;
    if (utilizationRate !== undefined) updates.utilizationRate = utilizationRate;
    if (trackingRate !== undefined) updates.trackingRate = trackingRate;
    
    // Validate and update financial stats
    if (financialStats) {
      updates.financialStats = {};
      if (financialStats.totalIncome !== undefined) 
        updates.financialStats.totalIncome = financialStats.totalIncome;
      if (financialStats.totalExpenses !== undefined) 
        updates.financialStats.totalExpenses = financialStats.totalExpenses;
      if (financialStats.reserves !== undefined) 
        updates.financialStats.reserves = financialStats.reserves;
      if (financialStats.efficiencyRatio !== undefined) 
        updates.financialStats.efficiencyRatio = financialStats.efficiencyRatio;
    }

    // Find and update or create new stats
    let stats = await StatsTransparency.findOne().sort({ createdAt: -1 });
    
    if (stats) {
      Object.assign(stats, updates);
      stats = await stats.save();
    } else {
      stats = await StatsTransparency.create(updates);
    }

    res.json(stats);
  } catch (error) {
    console.error('Stats update error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;