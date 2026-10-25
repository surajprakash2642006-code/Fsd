import { useState, useCallback } from 'react'
import { useBudgetStatus } from '../hooks/useBudget'
import './BudgetStatus.css'

export default function BudgetStatus({ detailed = false }) {
  const { budgets, getBudgetStatus, updateBudget } = useBudgetStatus()
  const budgetStatus = getBudgetStatus()
  const [showNewBudgetForm, setShowNewBudgetForm] = useState(false)
  const [newBudgetData, setNewBudgetData] = useState({
    category: '',
    limit: '',
  })

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

  const handleAddBudget = useCallback(() => {
    if (newBudgetData.category.trim() && parseFloat(newBudgetData.limit) > 0) {
      updateBudget(newBudgetData.category.trim(), parseFloat(newBudgetData.limit))
      setNewBudgetData({ category: '', limit: '' })
      setShowNewBudgetForm(false)
    }
  }, [newBudgetData, updateBudget])

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

  const getCategoryIcon = (category) => {
    const iconMap = {
      'Food': '🍔',
      'Rent': '🏠',
      'Travel': '✈️',
      'Shopping': '🛍️',
      'Entertainment': '🎬',
      'Utilities': '💡',
      'Healthcare': '🏥',
      'Education': '📚',
      'Salary': '💵',
      'Freelance': '💻',
      'Investment': '📈',
      'Bonus': '🎁',
      'Bills': '📄',
      'Other': '💰',
    }
    return iconMap[category] || '💰'
  }

  const getAvailableCategories = () => {
    const usedCategories = budgetStatus.map(b => b.category)
    return usedCategories
  }

  return (
    <div className="budget-status">
      {/* Budget List */}
      <div className="budget-list">
        {budgetStatus.length === 0 ? (
          <div className="no-budgets-message">
            <p>📋 No budgets created yet</p>
            <p className="subtitle">Create a budget to start tracking your spending limits</p>
          </div>
        ) : (
          budgetStatus.map((budget) => (
            <div
              key={budget.id}
              className={`budget-item ${getStatusColor(budget)}`}
            >
              <div className="budget-header">
                <div className="budget-title">
                  <span className="category-icon">
                    {getCategoryIcon(budget.category)}
                  </span>
                  <div className="title-info">
                    <h4>{budget.category}</h4>
                    <p className="limit-info">Limit: {formatAmount(budget.monthlyLimit)}</p>
                  </div>
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
                  <span className="spent-info">
                    Spent: {formatAmount(budget.spent)} / {formatAmount(budget.monthlyLimit)}
                  </span>
                </div>
              </div>

              <div className="budget-stats">
                <div className="stat">
                  <label>Remaining:</label>
                  <span className={budget.isOver ? 'over-text' : 'remaining-text'}>
                    {budget.isOver 
                      ? `Over by ${formatAmount(budget.spent - budget.monthlyLimit)}`
                      : formatAmount(budget.remaining)
                    }
                  </span>
                </div>
                <div className="stat">
                  <label>Utilization:</label>
                  <span>{budget.percentage}%</span>
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
                      ✏️ Edit Limit
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Budget Section - Only in detailed view */}
      {detailed && (
        <div className="add-budget-section">
          {!showNewBudgetForm ? (
            <button
              className="add-budget-btn"
              onClick={() => setShowNewBudgetForm(true)}
            >
              + Add New Budget
            </button>
          ) : (
            <div className="new-budget-form">
              <h3>Create New Budget</h3>
              <div className="form-group">
                <label>Category Name</label>
                <input
                  type="text"
                  value={newBudgetData.category}
                  onChange={(e) =>
                    setNewBudgetData({ ...newBudgetData, category: e.target.value })
                  }
                  placeholder="e.g., Food, Rent, Education, etc."
                  autoFocus
                />
                <small className="form-hint">Create a budget for any category you want to track</small>
              </div>

              <div className="form-group">
                <label>Monthly Expense Limit (₹)</label>
                <input
                  type="number"
                  value={newBudgetData.limit}
                  onChange={(e) =>
                    setNewBudgetData({ ...newBudgetData, limit: e.target.value })
                  }
                  placeholder="Enter amount"
                  min="0"
                />
              </div>

              <div className="form-actions">
                <button
                  className="create-btn"
                  onClick={handleAddBudget}
                  disabled={!newBudgetData.category.trim() || !newBudgetData.limit}
                >
                  Create Budget
                </button>
                <button
                  className="cancel-form-btn"
                  onClick={() => {
                    setShowNewBudgetForm(false)
                    setNewBudgetData({ category: '', limit: '' })
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
