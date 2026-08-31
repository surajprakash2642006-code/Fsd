import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getAsync, runAsync, allAsync } from '../db/database.js';

const router = express.Router();

// Get budgets for user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const budgets = await allAsync(
      'SELECT * FROM budgets WHERE userId = ? ORDER BY createdAt DESC',
      [userId]
    );
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get monthly spending for user
router.get('/:userId/spending/:month/:year', async (req, res) => {
  try {
    const { userId, month, year } = req.params;
    const spending = await allAsync(`
      SELECT category, SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as spent
      FROM transactions
      WHERE userId = ? AND strftime('%m', date) = ? AND strftime('%Y', date) = ?
      GROUP BY category
    `, [userId, String(month).padStart(2, '0'), year]);

    const result = {};
    spending.forEach(row => {
      result[row.category] = row.spent || 0;
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create or update budget
router.post('/', async (req, res) => {
  try {
    const { userId, category, monthlyLimit, month, year } = req.body;

    if (!userId || !category || monthlyLimit === undefined || month === undefined || year === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existing = await getAsync(
      'SELECT id FROM budgets WHERE userId = ? AND category = ? AND month = ? AND year = ?',
      [userId, category, month, year]
    );

    if (existing) {
      await runAsync(
        'UPDATE budgets SET monthlyLimit = ? WHERE id = ?',
        [monthlyLimit, existing.id]
      );
      res.json({ success: true, id: existing.id });
    } else {
      const id = uuidv4();
      await runAsync(
        'INSERT INTO budgets (id, userId, category, monthlyLimit, month, year) VALUES (?, ?, ?, ?, ?, ?)',
        [id, userId, category, monthlyLimit, month, year]
      );
      res.json({ success: true, id });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
