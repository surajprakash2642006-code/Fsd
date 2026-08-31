# 🌿 Git Branches Guide - FinTrack Project

## Overview
The FinTrack project is organized into **4 separate Git branches**, each representing a complete experiment stage. This allows you to see the progression from basic UI to a full-stack application.

---

## 📦 Branch Structure

```
main (Latest - Exp 4)
├── exp4  (Backend API Integration)
├── exp3  (Context API)
├── exp2  (React Hooks)
└── exp1  (Tailwind CSS UI)
```

---

## 🔀 Branches Explained

### **exp1** - Tailwind CSS UI Design (Static Components)
**Goal:** Learn responsive design and CSS animations with Tailwind  
**What's Included:**
- ✅ Static UI components (Login, Dashboard, Cards)
- ✅ Tailwind CSS styling
- ✅ CSS animations and transitions
- ✅ Responsive layouts (mobile, tablet, desktop)
- ❌ No state management
- ❌ No hooks
- ❌ No backend

**Key Files:**
- `src/pages/Login.jsx` - Login page
- `src/pages/Dashboard.jsx` - Dashboard (static data only)
- `src/components/BudgetCard.jsx` - Card component
- `src/pages/Login.css` - Animation styles

**How to Use:**
```bash
git checkout exp1
npm install
npm run dev
```

**What You'll See:**
- Static dashboard showing mock data
- Pretty, animated UI components
- Responsive design that adapts to screen size

---

### **exp2** - React Hooks for State Management
**Goal:** Learn React Hooks (useState, useCallback) for managing component state  
**What's Included:**
- ✅ All of Exp 1 (UI components)
- ✅ Custom hooks (`useTransactions`, `useBudgetStatus`, etc.)
- ✅ useState for managing form state
- ✅ useCallback for optimized event handlers
- ✅ Form validation
- ✅ Transaction filtering logic
- ❌ No global state management (Context API)
- ❌ No backend

**Key Files:**
- `src/hooks/useBudget.js` - Custom hooks
- `src/components/TransactionForm.jsx` - Form with hooks
- `src/components/TransactionList.jsx` - Filtering with hooks
- `src/components/BudgetStatus.jsx` - Budget tracking with hooks

**How to Use:**
```bash
git checkout exp2
npm install
npm run dev
```

**What You'll Learn:**
- useState: Managing component state
- useCallback: Memoizing callbacks
- Custom hooks: Reusable logic
- Form validation patterns

---

### **exp3** - Context API for Global State Management
**Goal:** Learn Context API to avoid prop drilling and manage global state  
**What's Included:**
- ✅ All of Exp 1 & 2 (UI + Hooks)
- ✅ AuthContext - User authentication state
- ✅ BudgetContext - Transaction and budget state
- ✅ Centralized business logic
- ✅ Computed values (totals, percentages)
- ✅ useContext hook usage
- ❌ No backend (data is in-memory)
- ❌ Data doesn't persist after refresh

**Key Files:**
- `src/context/AuthContext.jsx` - User state
- `src/context/BudgetContext.jsx` - Budget/transaction state
- `src/App.jsx` - Provider setup
- All components updated to use useContext

**How to Use:**
```bash
git checkout exp3
npm install
npm run dev
```

**Login with any credentials:**
```
Email: test@example.com
Password: password123
```

**What You'll Learn:**
- Creating contexts with createContext
- Provider and consumer patterns
- useContext hook
- Avoiding prop drilling
- Separating concerns

---

### **exp4** - Backend API Integration with Express & SQLite
**Goal:** Connect frontend to a real backend server with database persistence  
**What's Included:**
- ✅ All of Exp 1, 2, & 3 (UI + Hooks + Context)
- ✅ Express.js backend server (port 5000)
- ✅ SQLite database with 3 tables
- ✅ RESTful API endpoints (Auth, Transactions, Budgets)
- ✅ Frontend API integration (fetch calls)
- ✅ Data persistence across sessions
- ✅ Multi-user support with data isolation
- ✅ CORS enabled for local development

**Key Files (Frontend):**
- `src/pages/Login.jsx` - Now calls backend auth API
- `src/context/BudgetContext.jsx` - Now fetches from API

**Key Files (Backend - in `backend/` folder):**
- `backend/server.js` - Express server
- `backend/db/database.js` - SQLite setup
- `backend/routes/auth.js` - Auth endpoints
- `backend/routes/transactions.js` - Transaction endpoints
- `backend/routes/budgets.js` - Budget endpoints

**How to Use:**
```bash
git checkout exp4
npm install
cd backend
npm install
cd ..
```

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Expected: 🚀 Server running on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
# Expected: ➜ Local: http://localhost:5173/
```

**What You'll Learn:**
- REST API design
- Express.js basics
- SQLite database
- Frontend-backend communication
- Async/await patterns
- Error handling

---

### **main** - Latest (Production)
**Status:** Same as exp4 (most recent state)  
**Contains:** Full-stack application with backend integration  

**Use this branch for:**
- Running the complete application
- Deploying to production
- Starting new features

---

## 🚀 How to Switch Between Branches

### View All Branches
```bash
git branch -a
```

### Switch to a Branch
```bash
git checkout exp1   # Exp 1: UI only
git checkout exp2   # Exp 2: Hooks
git checkout exp3   # Exp 3: Context API
git checkout exp4   # Exp 4: Backend (latest)
git checkout main   # Main: Production
```

### Create a New Branch (Don't Edit Existing Ones)
```bash
git checkout -b my-feature main
# This creates a new branch based on main for your changes
```

---

## 📊 Comparison Table

| Feature | exp1 | exp2 | exp3 | exp4 |
|---------|------|------|------|------|
| UI Components | ✅ | ✅ | ✅ | ✅ |
| Tailwind CSS | ✅ | ✅ | ✅ | ✅ |
| React Hooks | ❌ | ✅ | ✅ | ✅ |
| Context API | ❌ | ❌ | ✅ | ✅ |
| Form Validation | ❌ | ✅ | ✅ | ✅ |
| Backend Server | ❌ | ❌ | ❌ | ✅ |
| SQLite Database | ❌ | ❌ | ❌ | ✅ |
| API Endpoints | ❌ | ❌ | ❌ | ✅ |
| Data Persistence | ❌ | ❌ | ❌ | ✅ |
| Multi-User | ❌ | ❌ | ❌ | ✅ |

---

## 🎓 Learning Path

Follow this sequence to learn full-stack development:

1. **Start with exp1** - Understand UI design and Tailwind CSS
   ```bash
   git checkout exp1 && npm run dev
   ```

2. **Move to exp2** - Learn React Hooks
   ```bash
   git checkout exp2 && npm run dev
   ```

3. **Progress to exp3** - Understand Context API
   ```bash
   git checkout exp3 && npm run dev
   ```

4. **Complete with exp4** - Learn backend integration
   ```bash
   git checkout exp4
   cd backend && npm install && npm start  # Terminal 1
   npm run dev                              # Terminal 2
   ```

---

## 💾 Git Commands Reference

### Check Current Branch
```bash
git branch
git status
```

### View Branch History
```bash
git log --oneline --graph --all
```

### Switch to a Branch
```bash
git checkout exp3
```

### Create New Branch (from exp4)
```bash
git checkout -b feature/my-feature
```

### Merge Branches (from main)
```bash
git checkout main
git merge exp4
```

### Push Changes
```bash
git push origin branch-name
```

### Pull Latest Changes
```bash
git pull origin branch-name
```

---

## ⚠️ Important Notes

### Don't Edit exp1-4 Branches Directly
These branches represent stable experiment stages. If you want to make changes:

```bash
# Create a new feature branch instead
git checkout -b bugfix/your-fix exp4
# Make changes
git push origin bugfix/your-fix
```

### Switching Branches
When you switch branches, make sure to:
1. Commit any changes: `git add . && git commit -m "message"`
2. Check for missing node_modules: `npm install`
3. For exp4, make sure backend is running in separate terminal

### Database Reset (exp4)
If you want to reset the database:
```bash
rm backend/db/fintrack.db
# Restart backend: it will recreate the database
```

---

## 🐛 Troubleshooting

### "Cannot find module" Error
```bash
npm install
```

### "Port already in use" Error
```bash
# Kill process on port 5000 (backend)
lsof -ti :5000 | xargs kill -9

# Or change PORT in backend/server.js
```

### Branch Conflicts
```bash
git status  # Check conflicts
# Resolve conflicts manually
git add .
git commit -m "Resolved conflicts"
```

---

## 📁 File Differences Between Branches

### exp1 vs exp2
- ➕ Adds: `src/hooks/useBudget.js`
- ➕ Adds: State management to components

### exp2 vs exp3
- ➕ Adds: `src/context/AuthContext.jsx`
- ➕ Adds: `src/context/BudgetContext.jsx`
- ➖ Removes: Props drilling
- 🔄 Updates: Component structure

### exp3 vs exp4
- ➕ Adds: `backend/` folder (entire backend)
- ➕ Adds: Database integration
- 🔄 Updates: API calls in components

---

## 🎯 Next Steps

### For Learning
1. Review each branch's code
2. Compare implementations
3. Run each branch locally
4. Modify and experiment

### For Development
1. Create feature branches from `main`
2. Make changes and test
3. Push to your fork
4. Create pull requests

### For Production
1. Use `main` branch
2. Ensure all tests pass
3. Deploy to server
4. Monitor performance

---

## 📞 Quick Reference

| Task | Command |
|------|---------|
| List branches | `git branch -v` |
| Switch branch | `git checkout exp3` |
| View current | `git status` |
| See history | `git log --oneline` |
| Create branch | `git checkout -b name` |
| Delete branch | `git branch -d name` |
| Sync with remote | `git pull origin` |
| Push changes | `git push origin` |

---

**Happy Learning! 🚀 Each branch is a complete, working example of its experiment stage.**
