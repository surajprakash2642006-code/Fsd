# 💰 FinTrack - Personal Finance & Budget Tracker

**A modern, dynamic web application built with React, Tailwind CSS, and Context API** (Experiments 1-3)

## 🎯 Overview

FinTrack is a personal finance management application designed to help users:
- Track income and expenses
- Set monthly budgets by category
- Monitor spending with visual alerts
- View detailed transaction history

## 📁 Project Structure

```
Budget-Tracker/
├── index.html                 # Main HTML entry point
├── package.json              # Dependencies and scripts
├── vite.config.js           # Vite configuration with React + Tailwind
├── src/
│   ├── main.jsx             # React entry point
│   ├── App.jsx              # Main App component
│   ├── App.css              # Global styles
│   ├── pages/
│   │   ├── Login.jsx        # Authentication page (Exp 1)
│   │   ├── Login.css        # Login styling with animations
│   │   ├── Dashboard.jsx    # Main dashboard (Exp 1, 2, 3)
│   │   └── Dashboard.css    # Dashboard styling
│   ├── components/
│   │   ├── BudgetCard.jsx   # Summary card component
│   │   ├── BudgetCard.css
│   │   ├── TransactionForm.jsx      # Add transaction form (Exp 2)
│   │   ├── TransactionForm.css
│   │   ├── TransactionList.jsx      # Transaction history display
│   │   ├── TransactionList.css
│   │   ├── BudgetStatus.jsx         # Budget tracking (Exp 3)
│   │   └── BudgetStatus.css
│   ├── context/              # Context API (Exp 3)
│   │   ├── AuthContext.jsx   # User authentication context
│   │   └── BudgetContext.jsx # Budget and transaction context
│   ├── hooks/               # Custom React Hooks (Exp 2)
│   │   └── useBudget.js    # useTransactions, useBudgetStatus, etc.
│   ├── assets/             # Static images
│   │   ├── hero.png
│   │   ├── vite.svg
│   │   └── javascript.svg
│   └── style.css          # (Legacy file, superseded by App.css)
└── public/               # Static assets served as-is
```

## 🚀 Getting Started

### Installation
```bash
cd Budget-Tracker
npm install
npm run dev
```

The app will be available at **http://localhost:5173/**

### Build for Production
```bash
npm run build
npm run preview
```

## 🎨 Experiment 1: Tailwind CSS

### Implementation
- **Responsive Design**: Grid and flexbox layouts using Tailwind utilities
- **Color System**: Gradient backgrounds (purple to blue theme)
- **Components**: Styled cards, buttons, inputs with Tailwind classes
- **Animations**: Smooth transitions and hover effects

### Key Pages
1. **Login Page** (`pages/Login.jsx`)
   - Two-column layout (branding + form)
   - Form validation with error display
   - Toggle between Sign In/Sign Up
   - Animated elements (bouncing icon, sliding text)

2. **Dashboard** (`pages/Dashboard.jsx`)
   - Header with user greeting
   - Three navigation tabs
   - Responsive grid layouts
   - Summary cards and status indicators

### Styling Approach
- Custom CSS with Tailwind utilities
- CSS animations for modern feel
- Mobile-first responsive design
- Consistent spacing and typography

## ⚛️ Experiment 2: React Hooks

### Custom Hooks (`hooks/useBudget.js`)
```javascript
// Transaction management
useTransactions() → { transactions, addTransaction, deleteTransaction }

// Budget tracking
useBudgetStatus() → { budgets, updateBudget, getBudgetStatus }

// Financial calculations
useMonthlyTotals() → { income, expense, balance }
useMonthlySpending() → { category: amount, ... }
```

### Components Using Hooks

**TransactionForm.jsx** - Demonstrates useState, useCallback:
```javascript
const [formData, setFormData] = useState(initialForm)
const handleChange = useCallback((e) => {...}, [errors])
const validateForm = useCallback(() => {...}, [formData])
```

**TransactionList.jsx** - Uses hook for data, filter logic with useState

**BudgetStatus.jsx** - Edit mode toggle with useState, useCallback

### Key Hook Features
- Form state management
- Validation and error handling
- Optimized callbacks with useCallback
- useContext for accessing global state

## 📊 Experiment 3: Context API

### AuthContext
```javascript
{
  user: { name, email },
  setUser: (userData) => void
}
```
**Purpose**: Track logged-in user across the app

### BudgetContext
```javascript
{
  // State
  transactions: [],
  budgets: [],
  
  // Actions
  addTransaction: (transaction) => void,
  deleteTransaction: (id) => void,
  updateBudget: (category, limit) => void,
  
  // Selectors
  getBudgetStatus: () => BudgetStatus[],
  getMonthlyTotals: () => { income, expense, balance },
  getMonthlySpending: () => { category: amount }
}
```

**Purpose**: 
- Manage all budget and transaction data
- Avoid prop drilling across components
- Centralize business logic
- Provide computed values (totals, percentages, alerts)

### Data Models

**Transaction**
```javascript
{
  id: number,
  type: 'income' | 'expense',
  category: string,
  amount: number,
  note: string,
  date: Date
}
```

**Budget**
```javascript
{
  id: number,
  category: string,
  monthlyLimit: number,
  month: number,
  year: number
}
```

**BudgetStatus** (computed)
```javascript
{
  ...budget,
  spent: number,
  percentage: number,    // (spent / monthlyLimit) * 100
  isWarning: boolean,    // spent >= 80% of limit
  isOver: boolean        // spent > limit
}
```

## ✨ Features Implemented

### Dashboard Overview
- **Summary Cards**: Total income, expense, remaining balance
- **Budget Status**: Visual progress bars for each budget
- **Transaction History**: Filterable list of all transactions

### Transaction Management
- Add income or expense with category, amount, date, note
- Delete transactions with confirmation
- Filter by type (All, Income, Expense)
- Real-time validation

### Budget Tracking
- Set monthly budget limits per category
- Visual progress bar with color coding:
  - 🟢 Normal (< 80%)
  - 🟠 Warning (80-99%)
  - 🔴 Over (≥ 100%)
- Edit budget limits
- Automatic alert system

### Authentication
- Login/Sign Up forms
- Email validation
- Password requirements
- Session persistence ready

## 🎬 Animations & Effects

### Implemented Animations
- **Fade In/Up**: Page load transitions
- **Slide**: Form and card entrances
- **Bounce**: Icon animations
- **Shimmer**: Progress bar effect
- **Pulse**: Over-budget indicator
- **Wiggle**: Warning states

### CSS Classes
All animations defined in respective CSS files:
- `Login.css`: Form animations
- `Dashboard.css`: Tab and layout animations
- Component CSS files: Specific component animations

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px (single column, stacked layout)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px (multi-column grid)

### Mobile Optimizations
- Full-width buttons and forms
- Vertical navigation tabs
- Single-column transaction list
- Adjusted font sizes

## 🔄 Data Flow

```
App
├── AuthContext (user state)
│   └── Login (if not authenticated)
│       ├── Sign In/Sign Up form
│       └── onLogin → setUser
│   └── Dashboard (if authenticated)
│       └── BudgetProvider
│           ├── Overview Tab
│           │   ├── BudgetCard (useMonthlyTotals)
│           │   ├── TransactionForm (addTransaction)
│           │   └── BudgetStatus (getBudgetStatus)
│           ├── Transactions Tab
│           │   ├── TransactionForm
│           │   └── TransactionList (useTransactions)
│           └── Budgets Tab
│               └── BudgetStatus (detailed mode)
```

## 🧪 Testing the App

### Mock Data
The app comes with pre-loaded sample data:
- **Transactions**: Salary, groceries, rent, travel
- **Budgets**: Food, Rent, Travel, Shopping, Entertainment

### Test Scenarios

1. **Login**
   - Email: test@example.com
   - Password: password123
   - Try Sign Up to create account

2. **Add Transaction**
   - Switch between Income/Expense
   - Select category
   - Enter amount and note
   - Observe real-time validation

3. **Monitor Budgets**
   - Check progress bars
   - See warning at 80%
   - Edit budget limits

4. **Filter Transactions**
   - Click filter buttons
   - View income/expense separately

## 💻 Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 18+ |
| Build Tool | Vite 8.2 |
| Styling | Tailwind CSS 4.3 + Custom CSS |
| State Management | Context API + React Hooks |
| Authentication | React Context (Mock) |
| Data Storage | In-memory (ready for Backend) |

## 📚 Learning Points

### Experiment 1: Tailwind CSS
- Utility-first CSS approach
- Responsive design patterns
- CSS animations and transitions
- Component-based styling strategy

### Experiment 2: React Hooks
- `useState`: Form state management
- `useCallback`: Optimization for event handlers
- `useContext`: Accessing global state
- Custom hooks: Reusable logic composition
- Best practices: Dependency arrays, cleanup

### Experiment 3: Context API
- Creating contexts for global state
- Context providers and consumers
- Using `useContext` hook
- Avoiding prop drilling
- Separating business logic from UI

## 🎯 Next Steps (Experiments 4-10)

This foundation is ready for:
- **Exp 4**: REST API integration (backend)
- **Exp 5**: Input validation and error handling
- **Exp 6**: JWT authentication
- **Exp 7**: Docker containerization
- **Exp 8**: WebSocket real-time alerts
- **Exp 9**: Docker Compose
- **Exp 10**: CI/CD with GitHub Actions

## 📝 Code Quality

- ✅ Organized component structure
- ✅ Reusable custom hooks
- ✅ Centralized state management
- ✅ Clear separation of concerns
- ✅ Responsive design
- ✅ Accessible HTML structure
- ✅ Error handling and validation

## 🚨 Error Handling

- Form validation with error messages
- Missing transaction handling
- Budget limit validation (must be > 0)
- Empty state messages
- Try-catch for async operations (ready for API)

## 🔐 Security Ready

- Password field (masked input)
- Email validation
- Ready for JWT implementation
- Context-based access control
- Input sanitization ready

---

**Made with ❤️ for learning React fundamentals through a real-world project!**
#   F s d  
 #   F s d  
 #   F s d  
 #   F s d  
 