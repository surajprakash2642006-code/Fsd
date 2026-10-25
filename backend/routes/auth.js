import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../db/database.js';

const router = express.Router();

const createToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    process.env.JWT_SECRET || 'fintrack-dev-secret',
    { expiresIn: '7d' }
  );

const validateSignup = ({ name, email, password }) => {
  const trimmedName = String(name || '').trim();
  const normalizedEmail = String(email || '').trim().toLowerCase();

  if (!trimmedName || trimmedName.length < 2) {
    return 'Name must be at least 2 characters long';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return 'Please enter a valid email address';
  }

  if (!password || String(password).length < 6) {
    return 'Password must be at least 6 characters long';
  }

  return null;
};

router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const trimmedName = String(name || '').trim();
    const normalizedEmail = String(email || '').trim().toLowerCase();

    const validationError = validateSignup({ name, email, password });
    if (validationError) {
      return res.status(400).json({ success: false, error: validationError });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ success: false, error: 'Email already registered' });
    }

    const userId = uuidv4();
    const userRole = normalizedEmail === (process.env.ADMIN_EMAIL || '').toLowerCase() ? 'admin' : 'user';
    const user = await User.create({
      id: userId,
      email: normalizedEmail,
      password,
      name: trimmedName,
      role: userRole,
    });

    const token = createToken(user);

    return res.status(201).json({
      success: true,
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ success: false, error: 'Email already registered' });
    }

    return res.status(500).json({ success: false, error: 'Server error while creating user' });
  }
});

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(String(password), user.password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const token = createToken(user);

    return res.json({
      success: true,
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Server error while signing in' });
  }
});

export default router;
