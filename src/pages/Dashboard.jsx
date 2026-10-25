import { useState } from 'react'
import { useMonthlyTotals } from '../hooks/useBudget'
import BudgetCard from '../components/BudgetCard'
import TransactionForm from '../components/TransactionForm'
import TransactionList from '../components/TransactionList'
import BudgetStatus from '../components/BudgetStatus'
import Chat from '../components/Chat'
import './Dashboard.css'

export default function Dashboard({ user, onLogout }) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const totals = useMonthlyTotals()

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-branding">
            <h1>💰 FinTrack</h1>
            <p>Welcome, {user.name}!</p>
          </div>
          <button onClick={onLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="dashboard-nav">
        <button
          className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button
          className={`nav-tab ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          💳 Transactions
        </button>
        <button
          className={`nav-tab ${activeTab === 'budgets' ? 'active' : ''}`}
          onClick={() => setActiveTab('budgets')}
        >
          📈 Budgets
        </button>
        <button
          className={`nav-tab ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          💬 Live Chat
        </button>
      </nav>

      <div className="dashboard-container">
        {/* Main Content */}
        <main className="dashboard-main">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="tab-content">
              <div className="summary-section">
                <h2>This Month's Summary</h2>
                <div className="summary-grid">
                  <BudgetCard
                    title="Total Income"
                    amount={totals.income}
                    icon="💵"
                    color="green"
                    trend="+12%"
                  />
                  <BudgetCard
                    title="Total Expense"
                    amount={totals.expense}
                    icon="💸"
                    color="red"
                    trend="+5%"
                  />
                  <BudgetCard
                    title="Remaining Balance"
                    amount={totals.balance}
                    icon="💎"
                    color={totals.balance >= 0 ? 'blue' : 'orange'}
                    trend={totals.balance >= 0 ? '✓' : '⚠'}
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="quick-actions">
                <button
                  className="action-button primary"
                  onClick={() => setShowAddForm(!showAddForm)}
                >
                  {showAddForm ? '✕ Cancel' : '+ Add Transaction'}
                </button>
              </div>

              {/* Add Transaction Form */}
              {showAddForm && (
                <div className="form-section">
                  <TransactionForm onClose={() => setShowAddForm(false)} />
                </div>
              )}

              {/* Budget Status Preview */}
              <div className="budget-preview-section">
                <h2>Budget Status</h2>
                <div className="budget-preview-grid">
                  <BudgetStatus />
                </div>
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="tab-content">
              <div className="section-header">
                <h2>Transaction History</h2>
                <button
                  className="action-button secondary"
                  onClick={() => setShowAddForm(!showAddForm)}
                >
                  {showAddForm ? '✕ Cancel' : '+ Add'}
                </button>
              </div>

              {showAddForm && (
                <div className="form-section">
                  <TransactionForm onClose={() => setShowAddForm(false)} />
                </div>
              )}

              <TransactionList />
            </div>
          )}

          {/* Budgets Tab */}
          {activeTab === 'budgets' && (
            <div className="tab-content">
              <h2>Budget Management</h2>
              <div className="budget-grid">
                <BudgetStatus detailed={true} />
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="tab-content">
              <h2>Real-time Chat</h2>
              <Chat username={user.name} />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
