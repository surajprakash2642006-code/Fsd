import express from 'express';
import { Budget, Transaction, User } from '../db/database.js';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken, requireRole(['admin']));

router.get('/overview', async (req, res) => {
  try {
    const now = new Date();
    const monthStart = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
    const nextMonthStart = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 1));
    const registrationStart = new Date(Date.UTC(now.getFullYear(), now.getMonth() - 5, 1));

    const [userCount, transactionCount, currentMonthBudgetCount, monthlyTotals, recentUsers, registrationsByMonth] =
      await Promise.all([
        User.countDocuments(),
        Transaction.countDocuments(),
        Budget.countDocuments({ month: now.getMonth() + 1, year: now.getFullYear() }),
        Transaction.aggregate([
          {
            $match: {
              date: { $gte: monthStart, $lt: nextMonthStart },
            },
          },
          {
            $group: {
              _id: '$type',
              total: { $sum: '$amount' },
              count: { $sum: 1 },
            },
          },
        ]),
        User.find()
          .select('name email role createdAt')
          .sort({ createdAt: -1 })
          .limit(10)
          .lean(),
        User.aggregate([
          { $match: { createdAt: { $gte: registrationStart } } },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m', date: '$createdAt', timezone: 'UTC' } },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]),
      ]);

    const totals = {
      income: 0,
      expense: 0,
      transactions: 0,
    };

    monthlyTotals.forEach((row) => {
      totals[row._id] = row.total;
      totals.transactions += row.count;
    });

    return res.json({
      success: true,
      stats: {
        users: userCount,
        transactions: transactionCount,
        currentMonthBudgets: currentMonthBudgetCount,
        monthlyIncome: totals.income,
        monthlyExpense: totals.expense,
        monthlyTransactions: totals.transactions,
      },
      registrationsByMonth: registrationsByMonth.map((row) => ({
        month: row._id,
        count: row.count,
      })),
      recentUsers: recentUsers.map((user) => ({
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      })),
    });
  } catch (error) {
    console.error('Failed to load admin overview:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to load admin overview' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const role = typeof req.query.role === 'string' ? req.query.role : 'all';
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const pageSize = 20;
    const query = {};

    if (role === 'user' || role === 'admin') {
      query.role = role;
    }
    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { name: { $regex: escapedSearch, $options: 'i' } },
        { email: { $regex: escapedSearch, $options: 'i' } },
      ];
    }

    const [total, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query)
        .select('name email role createdAt')
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean(),
    ]);

    return res.json({
      success: true,
      users,
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    });
  } catch (error) {
    console.error('Failed to search admin users:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to search accounts' });
  }
});

export default router;
