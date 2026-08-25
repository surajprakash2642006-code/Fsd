# Getting Started - Step by Step

## Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

## Installation & Running

### Step 1: Navigate to project directory
```bash
cd Budget-Tracker
```

### Step 2: Install dependencies
```bash
npm install
```

**Expected Output:**
```
added 3 packages, and audited 36 packages in ~10s
found 0 vulnerabilities
```

### Step 3: Start development server
```bash
npm run dev
```

**Expected Output:**
```
  VITE v8.2.2  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 4: Open in browser
- Visit: **http://localhost:5173/**
- You should see the Login page

---

## User Flow

### 1️⃣ Login
```
Input any email and password (minimum 6 characters)
↓
Click "Sign In" or "Sign Up"
↓
You're logged in! Welcome screen with user's name
```

### 2️⃣ Dashboard Overview Tab
```
See three summary cards:
- Total Income (💵) - Shows all income this month
- Total Expense (💸) - Shows all expenses this month  
- Remaining Balance (💎) - Income minus expenses
```

### 3️⃣ Add Your First Transaction
```
Click "+ Add Transaction"
↓
Choose Transaction Type:
   💵 Income
   💸 Expense
↓
Select Category (e.g., Food, Rent, Travel)
↓
Enter Amount (₹)
↓
Choose Date
↓
Add optional Note
↓
Click "✓ Add Transaction"
↓
See transaction appear in list immediately!
```

### 4️⃣ View Transactions
```
Click "💳 Transactions" tab
↓
See all transactions in list format
↓
Filter by clicking:
   - "All" → All transactions
   - "Income" → Only income
   - "Expense" → Only expenses
↓
Click "✕" to delete any transaction
```

### 5️⃣ Monitor Budgets
```
Click "📈 Budgets" tab
↓
See budget status for each category:
   🟢 Green = Within budget (< 80%)
   🟠 Orange = Getting close (80-99%)
   🔴 Red = Over budget (100%+)
↓
Click "✏️ Edit" to change monthly limit
↓
Progress bar shows spending / limit
```

### 6️⃣ Logout
```
Click "Logout" button in header
↓
Back to Login page
↓
All data persists (in-memory for now)
```

---

## Features to Explore

### ✨ Modern Animations
- Smooth gradient backgrounds
- Bouncing emoji icons
- Card hover effects
- Form slide-in animations
- Tab transitions

### 🎨 Responsive Design
- Try resizing browser window
- Mobile layout: stacked single column
- Desktop layout: multi-column grid
- Try on phone/tablet

### 🔔 Budget Alerts
- Add transaction that exceeds budget
- Watch progress bar turn orange/red
- See warning badge appear

### 📊 Real-time Updates
- Add transaction in one tab
- Summary cards update immediately
- No page refresh needed!

---

## Pre-loaded Sample Data

The app comes with this data:

### Transactions
| Type | Category | Amount | Date |
|------|----------|---------|------|
| Income | Salary | ₹50,000 | Aug 1 |
| Expense | Food | ₹1,500 | Aug 5 |
| Expense | Rent | ₹15,000 | Aug 1 |
| Expense | Travel | ₹2,000 | Aug 10 |

### Budget Limits
| Category | Monthly Limit |
|----------|---------------|
| Food | ₹5,000 |
| Rent | ₹15,000 |
| Travel | ₹3,000 |
| Shopping | ₹4,000 |
| Entertainment | ₹2,000 |

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `h + Enter` | Show Vite help (in terminal) |
| `q + Enter` | Quit dev server (in terminal) |
| `Ctrl+C` | Force quit dev server |

---

## Troubleshooting

### Port 5173 already in use
```bash
# Kill the process using port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or start on different port:
npm run dev -- --port 3000
```

### Module not found errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Vite showing JSX errors
```bash
# Make sure file is .jsx not .js
# And vite.config.js has React plugin
npm install @vitejs/plugin-react
```

### Styles not loading
```bash
# Clear browser cache
# Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

---

## Build for Production

### Create optimized build
```bash
npm run build
```

**Output:**
```
✓ built in 1.23s
dist/
  ├── index.html
  ├── assets/
  │   ├── index-xxx.js
  │   └── index-xxx.css
```

### Preview production build
```bash
npm run preview
```

Opens on **http://localhost:4173/**

---

## What's Happening Under the Hood?

### Experiment 1: Tailwind CSS
- Responsive layouts using grid/flex
- Utility-first CSS approach
- Custom animations in CSS files
- Component-scoped styling

### Experiment 2: React Hooks
- Form state with `useState`
- Optimized callbacks with `useCallback`
- Transaction management with custom hooks
- Real-time validation

### Experiment 3: Context API
- Global state in BudgetContext
- User state in AuthContext
- No prop drilling between components
- All data flows through context

---

## File Changes During Session

```
Created:
✓ src/App.jsx
✓ src/App.css
✓ src/main.jsx
✓ src/context/AuthContext.jsx
✓ src/context/BudgetContext.jsx
✓ src/hooks/useBudget.js
✓ src/pages/Login.jsx
✓ src/pages/Login.css
✓ src/pages/Dashboard.jsx
✓ src/pages/Dashboard.css
✓ src/components/BudgetCard.jsx
✓ src/components/BudgetCard.css
✓ src/components/TransactionForm.jsx
✓ src/components/TransactionForm.css
✓ src/components/TransactionList.jsx
✓ src/components/TransactionList.css
✓ src/components/BudgetStatus.jsx
✓ src/components/BudgetStatus.css
✓ vite.config.js

Modified:
✓ index.html (updated title and script reference)
✓ package.json (installed React dependencies)
```

---

## Next Steps

### For Experiments 4-10, you'll add:
- **Exp 4**: Connect to real backend API (Node.js + Express)
- **Exp 5**: Server-side validation
- **Exp 6**: JWT authentication
- **Exp 7**: Docker containerization
- **Exp 8**: WebSocket for real-time alerts
- **Exp 9**: Docker Compose
- **Exp 10**: GitHub Actions CI/CD

---

## Questions? Check These Files

- **Full Documentation**: See `README.md`
- **Quick Reference**: See `QUICK_REFERENCE.md`
- **Component Guide**: Check `src/components/` folder
- **Styling Guide**: Check each `.css` file

---

**Enjoy building with FinTrack! 🚀💰**
