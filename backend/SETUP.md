# Backend Setup Instructions - Exp 4

## Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

## Installation

### Step 1: Navigate to backend directory
```bash
cd backend
```

### Step 2: Install dependencies
```bash
npm install
```

**Expected Output:**
```
added 8 packages, and audited XX packages in ~Xs
found 0 vulnerabilities
```

### Step 3: Start backend server
```bash
npm start
```

**Expected Output:**
```
✓ Connected to SQLite database
✓ Database tables initialized
🚀 Server running on http://localhost:5000
```

## Running Frontend & Backend Together

### Terminal 1 - Start Backend
```bash
cd backend
npm start
```

### Terminal 2 - Start Frontend (from project root)
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/signin` - Log in user

### Transactions
- `GET /api/transactions/:userId` - Get all transactions
- `POST /api/transactions` - Add new transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Budgets
- `GET /api/budgets/:userId` - Get all budgets
- `POST /api/budgets` - Create/update budget
- `GET /api/budgets/:userId/spending/:month/:year` - Get monthly spending

## Database
- Database file: `backend/db/fintrack.db` (SQLite)
- Tables: users, transactions, budgets
- Auto-created on first run

## Troubleshooting

**Error: "Cannot find module 'express'"**
- Run `npm install` in the backend directory

**Error: "Port 5000 already in use"**
- Change PORT in server.js or kill existing process on port 5000

**Error: "Connect ECONNREFUSED" in frontend**
- Make sure backend is running on http://localhost:5000
- Check that CORS is enabled in server.js
