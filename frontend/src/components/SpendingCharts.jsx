import './SpendingCharts.css'

const CHART_COLORS = ['#667eea', '#ed8936', '#48bb78', '#f56565', '#38b2ac', '#9f7aea', '#d69e2e']

const formatAmount = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)

export default function SpendingCharts({ transactions, totals }) {
  const now = new Date()
  const categoryTotals = transactions.reduce((result, transaction) => {
    const date = new Date(transaction.date)
    if (
      transaction.type === 'expense' &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    ) {
      result[transaction.category] = (result[transaction.category] || 0) + transaction.amount
    }
    return result
  }, {})

  const categories = Object.entries(categoryTotals).sort((first, second) => second[1] - first[1])
  const totalSpending = categories.reduce((sum, [, amount]) => sum + amount, 0)
  let cumulativePercentage = 0
  const pieSegments = categories.map(([, amount], index) => {
    const percentage = (amount / totalSpending) * 100
    const segment = `${CHART_COLORS[index % CHART_COLORS.length]} ${cumulativePercentage}% ${cumulativePercentage + percentage}%`
    cumulativePercentage += percentage
    return segment
  })
  const maxTotal = Math.max(totals.income, totals.expense, 1)

  return (
    <section className="spending-charts" aria-label="Monthly financial charts">
      <article className="chart-card">
        <div className="chart-heading">
          <div>
            <h2>Spending by Category</h2>
            <p>This month&apos;s expenses</p>
          </div>
          <strong>{formatAmount(totalSpending)}</strong>
        </div>
        {categories.length === 0 ? (
          <p className="chart-empty">Add expenses to see your category breakdown.</p>
        ) : (
          <div className="pie-chart-layout">
            <div
              className="spending-pie-chart"
              style={{ backgroundImage: `conic-gradient(${pieSegments.join(', ')})` }}
              role="img"
              aria-label={`Spending by category, total ${formatAmount(totalSpending)}`}
            >
              <div className="pie-chart-center">
                <span>Spent</span>
                <strong>{formatAmount(totalSpending)}</strong>
              </div>
            </div>
            <ul className="chart-legend">
              {categories.map(([category, amount], index) => (
                <li key={category}>
                  <span className="legend-label">
                    <i style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
                    {category}
                  </span>
                  <span>{formatAmount(amount)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>

      <article className="chart-card">
        <div className="chart-heading">
          <div>
            <h2>Income vs Expense</h2>
            <p>This month&apos;s cash flow</p>
          </div>
        </div>
        <div className="comparison-chart" role="img" aria-label={`Income ${formatAmount(totals.income)} compared with expenses ${formatAmount(totals.expense)}`}>
          {[
            { label: 'Income', amount: totals.income, color: 'income' },
            { label: 'Expense', amount: totals.expense, color: 'expense' },
          ].map((item) => (
            <div className="comparison-bar-column" key={item.label}>
              <strong>{formatAmount(item.amount)}</strong>
              <div className="comparison-bar-track">
                <div
                  className={`comparison-bar ${item.color}`}
                  style={{ height: `${(item.amount / maxTotal) * 100}%` }}
                />
              </div>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}
