import express from 'express';
import Member from '../models/Member.js';
import Project from '../models/Project.js';
import Fund from '../models/Fund.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const totalMembers = await Member.countDocuments({ status: 'approved' });

    const projectsSolved = await Project.countDocuments({ status: 'Solved' });

    const fundsResult = await Fund.aggregate([
      {
        $group: {
          _id: null,
          collected: { $sum: '$amount' }
        }
      }
    ]);

    const fundsCollected = fundsResult.length > 0 ? fundsResult[0].collected : 0;

    const totalProjects = await Project.countDocuments();

    res.json({
      totalMembers,
      projectsSolved,
      fundsCollected,
      fundsSpent: 0,
      totalProjects
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
