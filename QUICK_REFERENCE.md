# Quick Reference Guide - FinTrack

## 🎬 How to Run

```bash
cd frontend
npm install
npm run dev           # Dev server on http://localhost:5173/
npm run build         # Production build
npm run preview       # Preview production build
```

## 📋 File-to-Feature Mapping

### Authentication (Exp 1: Tailwind CSS)
- **File**: `frontend/src/pages/Login.jsx` + `Login.css`
- **Features**: 
  - Sign In/Sign Up toggle
  - Form validation
  - Animated UI
  - 2-column responsive layout

### Dashboard (Exp 1: Tailwind CSS + Exp 2: Hooks + Exp 3: Context)
- **File**: `frontend/src/pages/Dashboard.jsx` + `Dashboard.css`
- **Tabs**:
  - Overview: Summary cards
  - Transactions: Transaction list
  - Budgets: Budget management
- **Styling**: Responsive grid, animated tabs

### Summary Cards (Exp 1: Tailwind)
- **File**: `frontend/src/components/BudgetCard.jsx` + `.css`
- **Props**: title, amount, icon, color, trend
- **Styling**: Gradient backgrounds, hover effects

### Add Transaction Form (Exp 2: React Hooks)
- **File**: `src/components/TransactionForm.jsx` + `.css`
- **Hooks Used**:
  - `useState`: Form state
  - `useCallback`: Event handlers
  - `useTransactions`: Add transaction
- **Features**:
  - Type selector (Income/Expense)
  - Category dropdown
  - Validation
  - Character counter

### Transaction List (Exp 2: Hooks)
- **File**: `src/components/TransactionList.jsx` + `.css`
- **Hooks Used**:
  - `useState`: Filter state
  - `useTransactions`: Transaction data
- **Features**:
  - Filter by type
  - Delete transaction
  - Date formatting
  - Currency formatting

### Budget Status (Exp 3: Context API)
- **File**: `src/components/BudgetStatus.jsx` + `.css`
- **Hooks Used**:
  - `useState`: Edit mode
  - `useBudgetStatus`: Budget data
- **Features**:
  - Progress bar visualization
  - Budget edit form
  - Color-coded status (normal/warning/over)
  - Detailed vs preview modes

---

### Global State Management (Exp 3: Context API)

#### Context Files
1. **`src/context/AuthContext.jsx`**
   - Stores: User authentication state
   - Used in: App.jsx (root)
   - Data: { user, setUser }

2. **`src/context/BudgetContext.jsx`**
   - Stores: All transactions and budgets
   - Used in: All dashboard components
   - Data:
     ```javascript
     {
       transactions: Transaction[],
       budgets: Budget[],
       addTransaction,
       deleteTransaction,
       updateBudget,
       getMonthlySpending,
       getBudgetStatus,
       getMonthlyTotals
     }
     ```

#### Custom Hooks (Exp 2: React Hooks)
**File**: `src/hooks/useBudget.js`
- `useTransactions()`: Get/add/delete transactions
- `useBudgetStatus()`: Get/update budgets with status
- `useMonthlyTotals()`: Calculate income/expense/balance
- `useMonthlySpending()`: Spending per category

---

## 🎯 Experiment Implementation Checklist

### ✅ Experiment 1: Tailwind CSS
- [x] Responsive grid/flex layouts
- [x] Color system with gradients
- [x] Utility classes for styling
- [x] Custom animations in CSS
- [x] Mobile-first design
- [x] Component-based styling

### ✅ Experiment 2: React Hooks
- [x] `useState` for form state
- [x] `useCallback` for optimization
- [x] `useContext` for global state
- [x] Custom hooks for logic reuse
- [x] useEffect (ready for API calls)
- [x] Form validation logic

### ✅ Experiment 3: Context API
- [x] AuthContext for user state
- [x] BudgetContext for app state
- [x] Provider components
- [x] useContext consumption
- [x] Centralized business logic
- [x] Avoiding prop drilling

---

## 🎨 Styling Architecture

### CSS Strategy
1. **Component-scoped CSS**: Each component has its own `.css` file
2. **Global styles**: `App.css` for reusable classes
3. **Animations**: Defined in respective component CSS
4. **Responsive**: Media queries in each file

### Color Scheme
- **Primary**: Purple to Blue gradient (#667eea → #764ba2)
- **Success**: Green (#48bb78) - Income
- **Danger**: Red (#f56565) - Expense
- **Warning**: Orange (#ed8936) - Budget alerts
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Font**: 'Sora' (Google Fonts)
- **Sizes**: 12px (small) → 48px (hero)
- **Weights**: 400 (regular) → 700 (bold)

---

## 🔄 Data Flow Diagram

```
User Input (Form)
    ↓
Component State (useState)
    ↓
Custom Hook (useTransactions/useBudgetStatus)
    ↓
Context (BudgetContext)
    ↓
Global State (transactions, budgets)
    ↓
All Components (via useContext)
```

---

## 🧪 Testing Scenarios

### Test 1: Login Flow
```
1. Visit app → Shows Login page
2. Enter email + password
3. Click Sign In → Dashboard appears
4. Click Logout → Back to Login
```

### Test 2: Add Transaction
```
1. On Dashboard → Transactions tab
2. Click "+ Add Transaction"
3. Select type (Income/Expense)
4. Choose category
5. Enter amount, date, note
6. Click "✓ Add Transaction"
7. See it in list immediately
```

### Test 3: Budget Alerts
```
1. Go to Budgets tab
2. Check progress bars
3. If > 80%: Orange warning
4. If > 100%: Red over indicator
5. Click "✏️ Edit" to change limit
```

### Test 4: Filters
```
1. Transactions tab
2. Click "Income" filter
3. See only income transactions
4. Click "Expense" filter
5. See only expense transactions
```

---

## 💡 Key Concepts

### Tailwind CSS (Exp 1)
- Utility classes: `bg-white`, `rounded-lg`, `shadow-md`
- Responsive modifiers: `md:grid-cols-2`, `lg:flex-row`
- Hover states: `hover:bg-blue`, `hover:shadow-lg`
- Transitions: Built-in with `transition-all`

### React Hooks (Exp 2)
- State hooks manage component data
- Effect hooks (ready for API calls)
- Custom hooks encapsulate logic
- Callback hooks optimize performance
- Rules: Only in function components, at top level

### Context API (Exp 3)
- Create: `createContext(defaultValue)`
- Provide: `<Context.Provider value={data}>`
- Consume: `useContext(Context)`
- Benefits: Avoid prop drilling, centralize logic

---

## 📊 Component Hierarchy

```
App
├─ AuthContext.Provider
│  └─ BudgetProvider (BudgetContext.Provider)
│     ├─ Login (if not authenticated)
│     │  └─ Form with validation
│     └─ Dashboard (if authenticated)
│        ├─ Header + Tabs
│        └─ Dynamic Tab Content
│           ├─ Overview
│           │  ├─ BudgetCard (3x)
│           │  ├─ TransactionForm
│           │  └─ BudgetStatus
│           ├─ Transactions
│           │  ├─ TransactionForm
│           │  └─ TransactionList
│           └─ Budgets
│              └─ BudgetStatus (detailed)
```

---

## 🚀 Performance Tips

1. **useCallback**: Used in forms to prevent re-renders
2. **Component Splitting**: Each feature is separate component
3. **CSS Optimization**: Inline styles only for dynamic values
4. **Memo Ready**: Can wrap components with React.memo if needed

---

## 🔗 Dependencies

```json
{
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "@vitejs/plugin-react": "latest",
  "tailwindcss": "^4.3.3",
  "@tailwindcss/vite": "^4.3.3",
  "vite": "^8.2.0"
}
```

---

## 📖 Study Guide for Exam

### Explain Experiment 1: Tailwind CSS
> "We used Tailwind CSS to build responsive layouts using utility classes. The Login page has a 2-column grid, the Dashboard uses flex layouts, and all components are styled with Tailwind's color system and custom CSS animations."

### Explain Experiment 2: React Hooks
> "We used useState for form state, useCallback to optimize event handlers, and useContext to access global state. Custom hooks like useTransactions encapsulate the logic for managing transactions."

### Explain Experiment 3: Context API
> "We created BudgetContext to store global state (transactions and budgets) and AuthContext for user data. This eliminates prop drilling and makes it easy for any component to access or modify data."

---

**💪 Ready for your exam! Good luck!**
