import './BudgetCard.css'

export default function BudgetCard({ title, amount, icon, color, trend }) {
  const formatAmount = (num) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(num)
  }

  return (
    <div className={`budget-card ${color}`}>
      <div className="card-content">
        <div className="card-header">
          <span className="card-icon">{icon}</span>
          <span className="card-trend">{trend}</span>
        </div>
        <div className="card-title">{title}</div>
        <div className="card-amount">{formatAmount(amount)}</div>
      </div>
      <div className="card-background"></div>
    </div>
  )
}
