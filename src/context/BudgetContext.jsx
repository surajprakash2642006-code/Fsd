import { createContext, useState, useCallback, useEffect, useContext } from 'react'
import AuthContext from './AuthContext'

const BudgetContext = createContext()
const API_BASE_URL = 'http://localhost:5000/api'

export function BudgetProvider({ children }) {
  const { user } = useContext(AuthContext)
  
  const [transactions, setTransactions] = useState([])
  
  const [budgets, setBudgets] = useState([])
  
  const [loading, setLoading] = useState(false)

  const fetchTransactions = useCallback(async () => {
    if (!user || !user.id || !user.token) return
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/transactions/${user.id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch transactions')
      }
      const data = await response.json()
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

  const fetchBudgets = useCallback(async () => {
    if (!user || !user.id || !user.token) return
    try {
      const response = await fetch(`${API_BASE_URL}/budgets/${user.id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch budgets')
      }
      const data = await response.json()
      setBudgets(data)
    } catch (error) {
      console.error('Failed to fetch budgets:', error)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchTransactions()
      fetchBudgets()
    } else {
      setTransactions([])
      setBudgets([])
    }
  }, [user, fetchTransactions, fetchBudgets])

  const addTransaction = useCallback(async (transaction) => {
    if (!user || !user.id || !user.token) return
    try {
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          ...transaction,
          date: new Date(transaction.date).toISOString(),
        }),
      })
      const data = await response.json()
      if (data.success) {
        await fetchTransactions()
      }
    } catch (error) {
      console.error('Failed to add transaction:', error)
    }
  }, [user, fetchTransactions])

  const deleteTransaction = useCallback(async (id) => {
    if (!user || !user.token) return
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        await fetchTransactions()
      }
    } catch (error) {
      console.error('Failed to delete transaction:', error)
    }
  }, [user, fetchTransactions])

  const updateBudget = useCallback(async (categoryName, newLimit) => {
    if (!user || !user.id || !user.token) return
    try {
      const now = new Date()
      const response = await fetch(`${API_BASE_URL}/budgets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          category: categoryName,
          monthlyLimit: newLimit,
          month: now.getMonth() + 1,
          year: now.getFullYear(),
        }),
      })
      const data = await response.json()
      if (data.success) {
        await fetchBudgets()
      }
    } catch (error) {
      console.error('Failed to update budget:', error)
    }
  }, [user, fetchBudgets])

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

  const getAllCategories = useCallback(() => {
    const categorySet = new Set()
    
    transactions.forEach((t) => {
      categorySet.add(t.category)
    })
    
    budgets.forEach((b) => {
      categorySet.add(b.category)
    })
    
    return Array.from(categorySet).sort()
  }, [transactions, budgets])

  const getExpenseCategories = useCallback(() => {
    const categorySet = new Set()
    
    transactions.forEach((t) => {
      if (t.type === 'expense') {
        categorySet.add(t.category)
      }
    })
    
    budgets.forEach((b) => {
      categorySet.add(b.category)
    })
    
    return Array.from(categorySet).sort()
  }, [transactions, budgets])

  const getIncomeCategories = useCallback(() => {
    const categorySet = new Set()
    transactions.forEach((t) => {
      if (t.type === 'income') {
        categorySet.add(t.category)
      }
    })
    return Array.from(categorySet).sort()
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
    getAllCategories,
    getExpenseCategories,
    getIncomeCategories,
    loading,
  }

  return (
    <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>
  )
}

export default BudgetContext
