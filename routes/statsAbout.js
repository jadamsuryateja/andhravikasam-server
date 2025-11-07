import express from 'express';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import StatsAbout from '../models/StatsAbout.js';

const router = express.Router();

// Get current stats about
router.get('/', async (req, res) => {
  try {
    const stats = await StatsAbout.findOne().sort({ createdAt: -1 });
    if (!stats) {
      // If no stats exist, create default stats
      const defaultStats = new StatsAbout({
        constituencies: 0,
        activeVolunteers: 0,
        impactGenerated: 0,
        problemsSolved: 0
      });
      await defaultStats.save();
      return res.json(defaultStats);
    }
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update stats about (admin only)
router.patch('/update', authenticateToken, isAdmin, async (req, res) => {
  try {
    const {
      constituencies,
      activeVolunteers,
      impactGenerated,
      problemsSolved
    } = req.body;

    // Validate inputs
    const updates = {};
    if (constituencies !== undefined) updates.constituencies = constituencies;
    if (activeVolunteers !== undefined) updates.activeVolunteers = activeVolunteers;
    if (impactGenerated !== undefined) updates.impactGenerated = impactGenerated;
    if (problemsSolved !== undefined) updates.problemsSolved = problemsSolved;

    // Create new stats or update existing
    const stats = await StatsAbout.findOne().sort({ createdAt: -1 });
    
    if (!stats) {
      const newStats = new StatsAbout(updates);
      await newStats.save();
      return res.json(newStats);
    }

    // Update existing stats
    Object.assign(stats, updates);
    await stats.save();
    
    res.json(stats);
  } catch (error) {
    console.error('Error updating stats:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;