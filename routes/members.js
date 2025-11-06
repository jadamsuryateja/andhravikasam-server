import express from 'express';
import Member from '../models/Member.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const member = new Member(req.body);
    await member.save();
    res.status(201).json({
      message: "You've successfully joined Andhra Vikasam. Together, let's build our Andhra.",
      member
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status, district } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (district) filter.district = district;

    const members = await Member.find(filter).sort({ createdAt: -1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/:id/status', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Check if status is already set to prevent unnecessary updates
    if (member.status === status) {
      return res.json(member);
    }

    member.status = status;
    await member.save();

    res.json(member);
  } catch (error) {
    console.error('Status update error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid member ID' });
    }
    res.status(500).json({ message: 'Server error while updating status' });
  }
});

router.get('/count', async (req, res) => {
  try {
    const total = await Member.countDocuments({ status: 'approved' });
    res.json({ count: total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
