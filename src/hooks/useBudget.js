import { useContext } from 'react'
import BudgetContext from '../context/BudgetContext'

export function useTransactions() {
  const context = useContext(BudgetContext)
  if (!context) {
    throw new Error('useTransactions must be used within BudgetProvider')
  }

  return {
    transactions: context.transactions,
    addTransaction: context.addTransaction,
    deleteTransaction: context.deleteTransaction,
  }
}

export function useBudgetStatus() {
  const context = useContext(BudgetContext)
  if (!context) {
    throw new Error('useBudgetStatus must be used within BudgetProvider')
  }

  return {
    budgets: context.budgets,
    updateBudget: context.updateBudget,
    getBudgetStatus: context.getBudgetStatus,
  }
}

export function useMonthlyTotals() {
  const context = useContext(BudgetContext)
  if (!context) {
    throw new Error('useMonthlyTotals must be used within BudgetProvider')
  }

  return context.getMonthlyTotals()
}

export function useMonthlySpending() {
  const context = useContext(BudgetContext)
  if (!context) {
    throw new Error('useMonthlySpending must be used within BudgetProvider')
  }

  return context.getMonthlySpending()
}
