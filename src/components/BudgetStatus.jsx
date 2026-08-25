import { useState, useCallback } from 'react'
import { useBudgetStatus } from '../hooks/useBudget'
import './BudgetStatus.css'

export default function BudgetStatus({ detailed = false }) {
  const { budgets, getBudgetStatus, updateBudget } = useBudgetStatus()
  const budgetStatus = getBudgetStatus()

  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')

  const handleEditClick = useCallback((budget) => {
    setEditingId(budget.id)
    setEditValue(budget.monthlyLimit.toString())
  }, [])

  const handleSave = useCallback(
    (categoryName) => {
      const newLimit = parseFloat(editValue)
      if (newLimit > 0) {
        updateBudget(categoryName, newLimit)
        setEditingId(null)
      }
    },
    [editValue, updateBudget]
  )

  const formatAmount = (num) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(num)
  }

  const getStatusColor = (status) => {
    if (status.isOver) return 'over'
    if (status.isWarning) return 'warning'
    return 'normal'
  }

  return (
    <div className="budget-status">
      {budgetStatus.map((budget) => (
        <div
          key={budget.id}
          className={`budget-item ${getStatusColor(budget)}`}
        >
          <div className="budget-header">
            <div className="budget-title">
              <span className="category-icon">
                {budget.category === 'Food'
                  ? '🍔'
                  : budget.category === 'Rent'
                  ? '🏠'
                  : budget.category === 'Travel'
                  ? '✈️'
                  : budget.category === 'Shopping'
                  ? '🛍️'
                  : budget.category === 'Entertainment'
                  ? '🎬'
                  : '💰'}
              </span>
              <h4>{budget.category}</h4>
            </div>
            <div className="budget-info">
              <span className="percentage">{budget.percentage}%</span>
              {budget.isOver && <span className="status-badge over">Over</span>}
              {budget.isWarning && !budget.isOver && (
                <span className="status-badge warning">⚠️ Warning</span>
              )}
            </div>
          </div>

          <div className="budget-progress">
            <div className="progress-bar">
              <div
                className={`progress-fill ${getStatusColor(budget)}`}
                style={{
                  width: `${Math.min(budget.percentage, 100)}%`,
                }}
              ></div>
            </div>
            <div className="progress-text">
              <span>
                {formatAmount(budget.spent)} / {formatAmount(budget.monthlyLimit)}
              </span>
            </div>
          </div>

          {detailed && (
            <div className="budget-edit">
              {editingId === budget.id ? (
                <div className="edit-form">
                  <input
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    placeholder="New limit"
                    min="0"
                  />
                  <button
                    className="save-btn"
                    onClick={() => handleSave(budget.category)}
                  >
                    Save
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  className="edit-btn"
                  onClick={() => handleEditClick(budget)}
                >
                  ✏️ Edit
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
