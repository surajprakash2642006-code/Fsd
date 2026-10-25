import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Budget, Transaction } from '../db/database.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

const assertUserAccess = (req, userId) => {
  if (req.user.role === 'admin' || req.user.id === userId) {
    return true;
  }

  return false;
};

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!assertUserAccess(req, userId)) {
      return res.status(403).json({ error: 'Forbidden: you can only access your own budgets' });
    }

    const budgets = await Budget.find({ userId }).sort({ createdAt: -1 });
    return res.json(budgets.map((budget) => ({ ...budget.toObject() })));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/:userId/spending/:month/:year', async (req, res) => {
  try {
    const { userId, month, year } = req.params;

    if (!assertUserAccess(req, userId)) {
      return res.status(403).json({ error: 'Forbidden: you can only access your own budget spending' });
    }

    const monthNumber = Number(month);
    const yearNumber = Number(year);

    if (Number.isNaN(monthNumber) || Number.isNaN(yearNumber) || monthNumber < 1 || monthNumber > 12) {
      return res.status(400).json({ error: 'Month and year must be valid numbers' });
    }

    const spending = await Transaction.aggregate([
      {
        $match: {
          userId,
          type: 'expense',
          date: {
            $gte: new Date(yearNumber, monthNumber - 1, 1),
            $lt: new Date(yearNumber, monthNumber, 1),
          },
        },
      },
      {
        $group: {
          _id: '$category',
          spent: { $sum: '$amount' },
        },
      },
    ]);

    const result = {};
    spending.forEach((row) => {
      result[row._id] = row.spent || 0;
    });

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { category, monthlyLimit, month, year } = req.body;
    const userId = req.user.id;

    if (!category || String(category).trim().length < 2) {
      return res.status(400).json({ error: 'Category is required' });
    }

    if (monthlyLimit === undefined || Number(monthlyLimit) <= 0) {
      return res.status(400).json({ error: 'Monthly limit must be greater than zero' });
    }

    if (month === undefined || year === undefined) {
      return res.status(400).json({ error: 'Month and year are required' });
    }

    const existing = await Budget.findOne({ userId, category: String(category).trim(), month: Number(month), year: Number(year) });

    if (existing) {
      existing.monthlyLimit = Number(monthlyLimit);
      await existing.save();
      return res.json({ success: true, id: existing.id });
    }

    const budget = await Budget.create({
      id: uuidv4(),
      userId,
      category: String(category).trim(),
      monthlyLimit: Number(monthlyLimit),
      month: Number(month),
      year: Number(year),
    });

    return res.json({ success: true, id: budget.id });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(400).json({ error: 'Budget already exists for this month' });
    }

    return res.status(500).json({ error: error.message });
  }
});

export default router;
