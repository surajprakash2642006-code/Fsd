import { createContext, useState, useCallback } from 'react'

const BudgetContext = createContext()

export function BudgetProvider({ children }) {
  // State for transactions
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: 'income',
      category: 'Salary',
      amount: 50000,
      note: 'Monthly salary',
      date: new Date(2024, 7, 1),
    },
    {
      id: 2,
      type: 'expense',
      category: 'Food',
      amount: 1500,
      note: 'Groceries',
      date: new Date(2024, 7, 5),
    },
    {
      id: 3,
      type: 'expense',
      category: 'Rent',
      amount: 15000,
      note: 'Monthly rent',
      date: new Date(2024, 7, 1),
    },
    {
      id: 4,
      type: 'expense',
      category: 'Travel',
      amount: 2000,
      note: 'Uber rides',
      date: new Date(2024, 7, 10),
    },
  ])

  // State for budgets
  const [budgets, setBudgets] = useState([
    { id: 1, category: 'Food', monthlyLimit: 5000, month: 8, year: 2024 },
    { id: 2, category: 'Rent', monthlyLimit: 15000, month: 8, year: 2024 },
    { id: 3, category: 'Travel', monthlyLimit: 3000, month: 8, year: 2024 },
    { id: 4, category: 'Shopping', monthlyLimit: 4000, month: 8, year: 2024 },
    { id: 5, category: 'Entertainment', monthlyLimit: 2000, month: 8, year: 2024 },
  ])

  // Add transaction
  const addTransaction = useCallback((transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now(),
      date: new Date(transaction.date),
    }
    setTransactions((prev) => [newTransaction, ...prev])
  }, [])

  // Delete transaction
  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // Update budget
  const updateBudget = useCallback((categoryName, newLimit) => {
    setBudgets((prev) =>
      prev.map((b) =>
        b.category === categoryName ? { ...b, monthlyLimit: newLimit } : b
      )
    )
  }, [])

  // Get current month spending by category
  const getMonthlySpending = useCallback(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const spending = {}
    transactions.forEach((t) => {
      if (
        t.type === 'expense' &&
        t.date.getMonth() === currentMonth &&
        t.date.getFullYear() === currentYear
      ) {
        spending[t.category] = (spending[t.category] || 0) + t.amount
      }
    })
    return spending
  }, [transactions])

  // Get budget status
  const getBudgetStatus = useCallback(() => {
    const spending = getMonthlySpending()
    return budgets.map((budget) => ({
      ...budget,
      spent: spending[budget.category] || 0,
      percentage: Math.round(
        ((spending[budget.category] || 0) / budget.monthlyLimit) * 100
      ),
      isWarning: (spending[budget.category] || 0) / budget.monthlyLimit >= 0.8,
      isOver: (spending[budget.category] || 0) > budget.monthlyLimit,
    }))
  }, [budgets, getMonthlySpending])

  // Get total income and expense for current month
  const getMonthlyTotals = useCallback(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    let totalIncome = 0
    let totalExpense = 0

    transactions.forEach((t) => {
      if (
        t.date.getMonth() === currentMonth &&
        t.date.getFullYear() === currentYear
      ) {
        if (t.type === 'income') {
          totalIncome += t.amount
        } else {
          totalExpense += t.amount
        }
      }
    })

    return {
      income: totalIncome,
      expense: totalExpense,
      balance: totalIncome - totalExpense,
    }
  }, [transactions])

  const value = {
    transactions,
    budgets,
    addTransaction,
    deleteTransaction,
    updateBudget,
    getMonthlySpending,
    getBudgetStatus,
    getMonthlyTotals,
  }

  return (
    <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>
  )
}

export default BudgetContext
