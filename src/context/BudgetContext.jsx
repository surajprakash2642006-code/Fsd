import { createContext, useState, useCallback, useEffect, useContext } from 'react'
import AuthContext from './AuthContext'

const BudgetContext = createContext()
const API_BASE_URL = 'http://localhost:5000/api'

export function BudgetProvider({ children }) {
  const { user } = useContext(AuthContext)
  
  // State for transactions
  const [transactions, setTransactions] = useState([])
  
  // State for budgets
  const [budgets, setBudgets] = useState([])
  
  // Loading state
  const [loading, setLoading] = useState(false)

  // Fetch transactions from backend
  const fetchTransactions = useCallback(async () => {
    if (!user || !user.id) return
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/transactions/${user.id}`)
      const data = await response.json()
      // Convert date strings to Date objects
      const txns = data.map(t => ({
        ...t,
        date: new Date(t.date)
      }))
      setTransactions(txns)
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  // Fetch budgets from backend
  const fetchBudgets = useCallback(async () => {
    if (!user || !user.id) return
    try {
      const response = await fetch(`${API_BASE_URL}/budgets/${user.id}`)
      const data = await response.json()
      setBudgets(data)
    } catch (error) {
      console.error('Failed to fetch budgets:', error)
    }
  }, [user])

  // Fetch data when user changes
  useEffect(() => {
    if (user) {
      fetchTransactions()
      fetchBudgets()
    } else {
      setTransactions([])
      setBudgets([])
    }
  }, [user, fetchTransactions, fetchBudgets])

  // Add transaction
  const addTransaction = useCallback(async (transaction) => {
    if (!user || !user.id) return
    try {
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...transaction,
          userId: user.id,
          date: new Date(transaction.date).toISOString(),
        }),
      })
      const data = await response.json()
      if (data.success) {
        // Refresh transactions
        await fetchTransactions()
      }
    } catch (error) {
      console.error('Failed to add transaction:', error)
    }
  }, [user, fetchTransactions])

  // Delete transaction
  const deleteTransaction = useCallback(async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.success) {
        // Refresh transactions
        await fetchTransactions()
      }
    } catch (error) {
      console.error('Failed to delete transaction:', error)
    }
  }, [fetchTransactions])

  // Update budget
  const updateBudget = useCallback(async (categoryName, newLimit) => {
    if (!user || !user.id) return
    try {
      const now = new Date()
      const response = await fetch(`${API_BASE_URL}/budgets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          category: categoryName,
          monthlyLimit: newLimit,
          month: now.getMonth() + 1,
          year: now.getFullYear(),
        }),
      })
      const data = await response.json()
      if (data.success) {
        // Refresh budgets
        await fetchBudgets()
      }
    } catch (error) {
      console.error('Failed to update budget:', error)
    }
  }, [user, fetchBudgets])

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
    return budgets.map((budget) => {
      const spent = spending[budget.category] || 0
      const remaining = budget.monthlyLimit - spent
      return {
        ...budget,
        spent,
        remaining: remaining > 0 ? remaining : 0,
        percentage: Math.round(
          ((spent / budget.monthlyLimit) * 100)
        ),
        isWarning: spent / budget.monthlyLimit >= 0.8,
        isOver: spent > budget.monthlyLimit,
      }
    })
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
    loading,
  }

  return (
    <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>
  )
}

export default BudgetContext
