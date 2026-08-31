import BudgetCard from '../components/BudgetCard'
import './Dashboard.css'

export default function Dashboard({ user }) {
  // Static data for Exp 1 (UI only)
  const mockTotals = {
    income: 50000,
    expense: 18500,
    balance: 31500
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-branding">
            <h1>💰 FinTrack</h1>
            <p>Welcome, {user.name}!</p>
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        {/* Main Content */}
        <main className="dashboard-main">
          <div className="tab-content">
            <div className="summary-section">
              <h2>This Month's Summary</h2>
              <div className="summary-grid">
                <BudgetCard
                  title="Total Income"
                  amount={mockTotals.income}
                  icon="💵"
                  color="green"
                  trend="+12%"
                />
                <BudgetCard
                  title="Total Expense"
                  amount={mockTotals.expense}
                  icon="💸"
                  color="red"
                  trend="+5%"
                />
                <BudgetCard
                  title="Remaining Balance"
                  amount={mockTotals.balance}
                  icon="💎"
                  color="blue"
                  trend="✓"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )

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
        </main>
      </div>
    </div>
  )
}
