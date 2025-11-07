import express from 'express';
import StatsJoin from '../models/StatsJoin.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get current stats
router.get('/', async (req, res) => {
  try {
    const stats = await StatsJoin.findOne().sort({ createdAt: -1 });
    if (!stats) {
      const defaultStats = {
        activeVolunteers: 0,
        constituenciesCovered: 0,
        problemsSolved: 0,
        fundsUtilized: 0
      };
      return res.json(defaultStats);
    }
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update stats
router.patch('/update', authenticateToken, isAdmin, async (req, res) => {
  try {
    const {
      activeVolunteers,
      constituenciesCovered,
      problemsSolved,
      fundsUtilized
    } = req.body;

    const statsData = {
      activeVolunteers: Number(activeVolunteers) || 0,
      constituenciesCovered: Number(constituenciesCovered) || 0,
      problemsSolved: Number(problemsSolved) || 0,
      fundsUtilized: Number(fundsUtilized) || 0
    };

    let stats = await StatsJoin.findOne().sort({ createdAt: -1 });
    
    if (stats) {
      Object.assign(stats, statsData);
      stats = await stats.save();
    } else {
      stats = await StatsJoin.create(statsData);
    }

    res.json(stats);
  } catch (error) {
    console.error('Stats update error:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to update statistics' 
    });
  }
});

export default router;