import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getAsync, runAsync, allAsync } from '../db/database.js';

const router = express.Router();

// Sign Up
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const userId = uuidv4();
    await runAsync(
      'INSERT INTO users (id, email, password, name) VALUES (?, ?, ?, ?)',
      [userId, email, password, name]
    );

    res.json({
      success: true,
      user: { id: userId, email, name }
    });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      res.status(400).json({ error: 'Email already registered' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Sign In
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    const user = await getAsync(
      'SELECT id, email, name FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
