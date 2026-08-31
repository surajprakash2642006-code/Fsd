import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getAsync, runAsync, allAsync } from '../db/database.js';

const router = express.Router();

// Get all transactions for user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await allAsync(
      'SELECT * FROM transactions WHERE userId = ? ORDER BY date DESC',
      [userId]
    );
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add transaction
router.post('/', async (req, res) => {
  try {
    const { userId, type, category, amount, note, date } = req.body;

    if (!userId || !type || !category || amount === undefined || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const id = uuidv4();
    await runAsync(
      'INSERT INTO transactions (id, userId, type, category, amount, note, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, userId, type, category, amount, note || '', date]
    );

    res.json({
      success: true,
      transaction: { id, userId, type, category, amount, note, date }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete transaction
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await runAsync('DELETE FROM transactions WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
