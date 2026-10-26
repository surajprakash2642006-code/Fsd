import { useState, useCallback, useContext } from 'react'
import { useTransactions } from '../hooks/useBudget'
import BudgetContext from '../context/BudgetContext'
import './TransactionForm.css'

export default function TransactionForm({ onClose }) {
  // Use React Hooks (Experiment 2)
  const { addTransaction } = useTransactions()
  const { getExpenseCategories, getIncomeCategories } = useContext(BudgetContext)

  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    amount: '',
    note: '',
    date: new Date().toISOString().split('T')[0],
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customCategory, setCustomCategory] = useState('')
  const [useCustomCategory, setUseCustomCategory] = useState(false)

  // Keep generic options available alongside categories already used by the user.
  const defaultCategories = {
    income: ['Salary', 'Freelance', 'Business', 'Investment', 'Bonus', 'Gift', 'Interest', 'Other'],
    expense: [
      'Food',
      'Groceries',
      'Rent',
      'Utilities',
      'Transport',
      'Healthcare',
      'Education',
      'Travel',
      'Shopping',
      'Entertainment',
      'Bills',
      'Other',
    ],
  }

  const expenseCategories = [
    ...new Set([...defaultCategories.expense, ...getExpenseCategories()]),
  ]
  const incomeCategories = [
    ...new Set([...defaultCategories.income, ...getIncomeCategories()]),
  ]

  // Handle input changes with useCallback to optimize re-renders
  const handleChange = useCallback((e) => {
    const { name, value } = e.target

    // Reset category when changing type
    if (name === 'type') {
      const catList = value === 'income' ? incomeCategories : expenseCategories
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        category: catList.length > 0 ? catList[0] : '',
      }))
      setUseCustomCategory(false)
      setCustomCategory('')
    } else if (name === 'category') {
      if (value === 'custom') {
        setUseCustomCategory(true)
      } else {
        setUseCustomCategory(false)
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }))
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }

    // Clear errors for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }, [errors, expenseCategories, incomeCategories])

  // Validation function
  const validateForm = useCallback(() => {
    const newErrors = {}

    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid positive amount'
    }

    if (!formData.date) {
      newErrors.date = 'Please select a date'
    }

    if (formData.note && formData.note.length > 200) {
      newErrors.note = 'Note cannot exceed 200 characters'
    }

    return newErrors
  }, [formData])

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      const finalCategory = useCustomCategory ? customCategory : formData.category
      const newErrors = validateForm()

      if (!finalCategory.trim()) {
        newErrors.category = 'Please select or enter a category'
      }

      if (Object.keys(newErrors).length === 0) {
        setIsSubmitting(true)
        try {
          // Simulate API call delay
          await new Promise((resolve) => setTimeout(resolve, 300))

          addTransaction({
            type: formData.type,
            category: finalCategory.trim(),
            amount: parseFloat(formData.amount),
            note: formData.note,
            date: formData.date,
          })

          // Reset form
          const defaultCat = formData.type === 'income' ? incomeCategories[0] : expenseCategories[0]
          setFormData({
            type: 'expense',
            category: defaultCat || '',
            amount: '',
            note: '',
            date: new Date().toISOString().split('T')[0],
          })
          setCustomCategory('')
          setUseCustomCategory(false)

          // Close form after short delay for user feedback
          setTimeout(() => {
            onClose()
          }, 500)
        } finally {
          setIsSubmitting(false)
        }
      } else {
        setErrors(newErrors)
      }
    },
    [formData, validateForm, addTransaction, onClose, customCategory, useCustomCategory, incomeCategories, expenseCategories]
  )

  return (
    <div className="transaction-form">
      <h3>Add New Transaction</h3>

      <form onSubmit={handleSubmit}>
        {/* Type Selection */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="type">Transaction Type</label>
            <div className="type-selector">
              <button
                type="button"
                className={`type-button ${formData.type === 'income' ? 'active' : ''}`}
                onClick={() => handleChange({ target: { name: 'type', value: 'income' } })}
              >
                💵 Income
              </button>
              <button
                type="button"
                className={`type-button ${formData.type === 'expense' ? 'active' : ''}`}
                onClick={() => handleChange({ target: { name: 'type', value: 'expense' } })}
              >
                💸 Expense
              </button>
            </div>
          </div>
        </div>

        {/* Category and Amount */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            {useCustomCategory ? (
              <div className="custom-category-input">
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter custom category"
                  autoFocus
                  className="custom-input"
                />
                <button
                  type="button"
                  className="use-existing-btn"
                  onClick={() => {
                    setUseCustomCategory(false)
                    setCustomCategory('')
                  }}
                >
                  Use Existing
                </button>
              </div>
            ) : (
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={errors.category ? 'error' : ''}
              >
                <option value="">Select Category</option>
                {(formData.type === 'income' ? incomeCategories : expenseCategories).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="custom">+ Add Custom Category</option>
              </select>
            )}
            {errors.category && <span className="error-text">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount (₹)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              className={errors.amount ? 'error' : ''}
            />
            {errors.amount && <span className="error-text">{errors.amount}</span>}
          </div>
        </div>

        {/* Date */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={errors.date ? 'error' : ''}
            />
            {errors.date && <span className="error-text">{errors.date}</span>}
          </div>
        </div>

        {/* Note */}
        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="note">
              Note ({formData.note.length}/200)
            </label>
            <textarea
              id="note"
              name="note"
              placeholder="Add a note (optional)..."
              value={formData.note}
              onChange={handleChange}
              maxLength="200"
              rows="3"
              className={errors.note ? 'error' : ''}
            ></textarea>
            {errors.note && <span className="error-text">{errors.note}</span>}
          </div>
        </div>

        {/* Buttons */}
        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : '✓ Add Transaction'}
          </button>
        </div>
      </form>
    </div>
  )
}
