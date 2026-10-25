import { useState } from 'react'
import { useTransactions } from '../hooks/useBudget'
import './TransactionList.css'

export default function TransactionList() {
  const { transactions, deleteTransaction } = useTransactions()
  const [filter, setFilter] = useState('all')

  // Filter transactions
  const filteredTransactions = transactions.filter((t) => {
    if (filter === 'income') return t.type === 'income'
    if (filter === 'expense') return t.type === 'expense'
    return true
  })

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(date)
  }

  const formatAmount = (num) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(num)
  }

  return (
    <div className="transaction-list">
      {/* Filter Tabs */}
      <div className="transaction-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({transactions.length})
        </button>
        <button
          className={`filter-btn ${filter === 'income' ? 'active' : ''}`}
          onClick={() => setFilter('income')}
        >
          Income ({transactions.filter((t) => t.type === 'income').length})
        </button>
        <button
          className={`filter-btn ${filter === 'expense' ? 'active' : ''}`}
          onClick={() => setFilter('expense')}
        >
          Expense ({transactions.filter((t) => t.type === 'expense').length})
        </button>
      </div>

      {/* Transactions Table/List */}
      <div className="transactions-container">
        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <p>📭 No transactions yet</p>
            <p className="empty-text">Start by adding your first transaction</p>
          </div>
        ) : (
          <div className="transactions-grid">
            {filteredTransactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className={`transaction-item ${transaction.type}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="transaction-main">
                  <div className="transaction-icon">
                    {transaction.type === 'income' ? '💵' : '💸'}
                  </div>
                  <div className="transaction-details">
                    <div className="transaction-category">{transaction.category}</div>
                    {transaction.note && (
                      <div className="transaction-note">{transaction.note}</div>
                    )}
                    <div className="transaction-date">
                      {formatDate(transaction.date)}
                    </div>
                  </div>
                </div>
                <div className="transaction-amount">
                  <span className="amount">
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatAmount(transaction.amount)}
                  </span>
                  <button
                    className="delete-btn"
                    onClick={() => deleteTransaction(transaction.id)}
                    title="Delete transaction"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
