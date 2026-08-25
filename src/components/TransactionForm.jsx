import { useState, useCallback } from 'react'
import { useTransactions } from '../hooks/useBudget'
import './TransactionForm.css'

export default function TransactionForm({ onClose }) {
  // Use React Hooks (Experiment 2)
  const { addTransaction } = useTransactions()

  const [formData, setFormData] = useState({
    type: 'expense',
    category: 'Food',
    amount: '',
    note: '',
    date: new Date().toISOString().split('T')[0],
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = {
    income: ['Salary', 'Freelance', 'Investment', 'Bonus', 'Other'],
    expense: ['Food', 'Rent', 'Travel', 'Shopping', 'Entertainment', 'Bills', 'Other'],
  }

  // Handle input changes with useCallback to optimize re-renders
  const handleChange = useCallback((e) => {
    const { name, value } = e.target

    // Reset category when changing type
    if (name === 'type') {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        category: categories[value][0],
      }))
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
  }, [errors])

  // Validation function
  const validateForm = useCallback(() => {
    const newErrors = {}

    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid positive amount'
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category'
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
      const newErrors = validateForm()

      if (Object.keys(newErrors).length === 0) {
        setIsSubmitting(true)
        try {
          // Simulate API call delay
          await new Promise((resolve) => setTimeout(resolve, 300))

          addTransaction({
            type: formData.type,
            category: formData.category,
            amount: parseFloat(formData.amount),
            note: formData.note,
            date: formData.date,
          })

          // Reset form
          setFormData({
            type: 'expense',
            category: 'Food',
            amount: '',
            note: '',
            date: new Date().toISOString().split('T')[0],
          })

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
    [formData, validateForm, addTransaction, onClose]
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
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={errors.category ? 'error' : ''}
            >
              {categories[formData.type].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
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
