import express from 'express';
import Fund from '../models/Fund.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const fund = new Fund(req.body);
    await fund.save();
    res.status(201).json(fund);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const funds = await Fund.find().populate('memberId', 'name role').sort({ date: -1 });
    res.json(funds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/total', async (req, res) => {
  try {
    const result = await Fund.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const total = result.length > 0 ? result[0].total : 0;
    res.json({ total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
