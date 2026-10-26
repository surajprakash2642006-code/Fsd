import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Transaction } from '../db/database.js';
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
      return res.status(403).json({ error: 'Forbidden: you can only access your own transactions' });
    }

    const transactions = await Transaction.find({ userId }).sort({ date: -1 });
    return res.json(transactions.map((transaction) => ({ ...transaction.toObject() })));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { type, category, amount, note, date } = req.body;
    const userId = req.user.id;

    if (!type || !['income', 'expense'].includes(type)) {
      return res.status(400).json({ error: 'Transaction type must be income or expense' });
    }

    if (!category || String(category).trim().length < 2) {
      return res.status(400).json({ error: 'Category is required' });
    }

    if (amount === undefined || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than zero' });
    }

    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    const transactionDate = new Date(date);
    const transaction = await Transaction.create({
      id: uuidv4(),
      userId,
      type,
      category: String(category).trim(),
      amount: Number(amount),
      note: note ? String(note).trim() : '',
      date: transactionDate,
    });

    const io = req.app.get('io');
    io.to(`user:${userId}`).emit('data:changed');

    return res.json({
      success: true,
      transaction: { ...transaction.toObject() },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findOne({ id });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (req.user.role !== 'admin' && transaction.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: you can only delete your own transactions' });
    }

    await Transaction.deleteOne({ id });
    req.app.get('io').to(`user:${transaction.userId}`).emit('data:changed');
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
