import express from 'express';
import { createServer } from 'node:http';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { initializeDatabase } from './db/database.js';
import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transactions.js';
import budgetRoutes from './routes/budgets.js';

dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5000;
const io = new Server(server, {
  cors: { origin: true, credentials: true },
  maxHttpBufferSize: 1e4,
});
app.set('io', io);

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (typeof token !== 'string' || !token) {
    return next(new Error('Authentication required'));
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || 'fintrack-dev-secret');
    if (!user || typeof user !== 'object' || typeof user.id !== 'string') {
      return next(new Error('Invalid authentication token'));
    }
    socket.data.user = user;
    return next();
  } catch {
    return next(new Error('Invalid or expired token'));
  }
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use('/api', apiLimiter);

initializeDatabase().catch((error) => {
  console.error('Failed to initialize database:', error.message);
  process.exit(1);
});

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'Backend API is running' });
});

io.on('connection', (socket) => {
  socket.join(`user:${socket.data.user.id}`);

  socket.on('chat:send', (payload) => {
    if (!payload || typeof payload !== 'object') {
      socket.emit('chat:error', 'A username and message are required.');
      return;
    }

    const username = typeof payload.username === 'string' ? payload.username.trim() : '';
    const text = typeof payload.text === 'string' ? payload.text.trim() : '';

    if (!username || username.length > 40 || !text || text.length > 500) {
      socket.emit('chat:error', 'Use a username up to 40 characters and a message up to 500 characters.');
      return;
    }

    io.emit('chat:message', {
      id: uuidv4(),
      username,
      text,
      sentAt: new Date().toISOString(),
    });
  });

  socket.on('disconnect', () => {
    console.log(`Chat client disconnected: ${socket.id}`);
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ success: false, error: 'Something went wrong on the server.' });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
