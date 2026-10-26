import { useCallback, useEffect, useMemo, useState } from 'react'
import { API_BASE_URL } from '../config/api'
import './AdminPanel.css'

const formatAmount = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)

const parseResponse = async (response, label) => {
  const body = await response.text()
  let data
  try {
    data = JSON.parse(body)
  } catch {
    throw new Error(`${label} returned an invalid response (HTTP ${response.status}).`)
  }
  if (!response.ok) {
    throw new Error(data.error || `${label} failed (HTTP ${response.status}).`)
  }
  return data
}

export default function AdminPanel({ user }) {
  const [overview, setOverview] = useState(null)
  const [accounts, setAccounts] = useState([])
  const [accountsFallback, setAccountsFallback] = useState(false)
  const [accountSearch, setAccountSearch] = useState('')
  const [accountRole, setAccountRole] = useState('all')
  const [accountPage, setAccountPage] = useState(1)
  const [accountTotal, setAccountTotal] = useState(0)
  const [accountTotalPages, setAccountTotalPages] = useState(1)
  const [accountsLoading, setAccountsLoading] = useState(true)
  const [accountsError, setAccountsError] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadOverview = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/admin/overview`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      const overviewData = await parseResponse(response, 'Admin overview')
      setOverview(overviewData)
    } catch (loadError) {
      setError(loadError.message || 'Unable to load admin panel.')
    } finally {
      setLoading(false)
    }
  }, [user.token])

  useEffect(() => {
    loadOverview()
  }, [loadOverview])

  const loadAccounts = useCallback(async (signal) => {
    setAccountsLoading(true)
    setAccountsError('')
    const params = new URLSearchParams({
      search: accountSearch,
      role: accountRole,
      page: String(accountPage),
    })

    try {
      const response = await fetch(`${API_BASE_URL}/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${user.token}` },
        signal,
      })
      if (response.status === 404) {
        const overviewResponse = await fetch(`${API_BASE_URL}/admin/overview`, {
          headers: { Authorization: `Bearer ${user.token}` },
          signal,
        })
        const overviewData = await parseResponse(overviewResponse, 'Admin overview')
        const normalizedSearch = accountSearch.trim().toLocaleLowerCase()
        const fallbackUsers = (overviewData.recentUsers || []).filter((account) => {
          const matchesRole = accountRole === 'all' || account.role === accountRole
          const matchesSearch =
            !normalizedSearch ||
            account.name.toLocaleLowerCase().includes(normalizedSearch) ||
            account.email.toLocaleLowerCase().includes(normalizedSearch)
          return matchesRole && matchesSearch
        })
        setAccounts(fallbackUsers)
        setAccountTotal(fallbackUsers.length)
        setAccountTotalPages(1)
        setAccountsFallback(true)
        setAccountsError('')
        return
      }
      const data = await parseResponse(response, 'Account search')
      setAccounts(data.users)
      setAccountTotal(data.total)
      setAccountTotalPages(data.totalPages)
      setAccountsFallback(false)
    } catch (loadError) {
      if (loadError.name !== 'AbortError') {
        setAccountsError(loadError.message || 'Unable to load accounts.')
      }
    } finally {
      if (!signal.aborted) {
        setAccountsLoading(false)
      }
    }
  }, [accountPage, accountRole, accountSearch, user.token])

  useEffect(() => {
    const controller = new AbortController()
    const timer = window.setTimeout(() => loadAccounts(controller.signal), 250)
    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [loadAccounts])

  const registrationMonths = useMemo(() => {
    const counts = new Map((overview?.registrationsByMonth || []).map((row) => [row.month, row.count]))
    const now = new Date()
    return Array.from({ length: 6 }, (_, index) => {
      const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5 + index, 1))
      const key = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
      return {
        key,
        label: date.toLocaleDateString(undefined, { month: 'short', timeZone: 'UTC' }),
        count: counts.get(key) || 0,
      }
    })
  }, [overview])

  if (loading && !overview) {
    return <p className="admin-panel-message">Loading admin overview...</p>
  }

  if (!overview) {
    return (
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <h2>Admin Overview</h2>
            <p>Platform-level totals and recently registered accounts.</p>
          </div>
          <button className="admin-refresh-button" onClick={loadOverview} disabled={loading}>
            {loading ? 'Loading...' : 'Try again'}
          </button>
        </div>
        <p className="admin-panel-error" role="alert">{error}</p>
      </section>
    )
  }

  const { stats } = overview
  const statCards = [
    { label: 'Registered users', value: stats.users.toLocaleString() },
    { label: 'All transactions', value: stats.transactions.toLocaleString() },
    { label: 'This month’s budgets', value: stats.currentMonthBudgets.toLocaleString() },
    { label: 'Transactions this month', value: stats.monthlyTransactions.toLocaleString() },
    { label: 'Income this month', value: formatAmount(stats.monthlyIncome) },
    { label: 'Expenses this month', value: formatAmount(stats.monthlyExpense) },
  ]

  return (
    <section className="admin-panel">
      <div className="admin-panel-heading">
        <div>
          <h2>Admin Overview</h2>
          <p>Platform-level totals and recently registered accounts.</p>
        </div>
        <button className="admin-refresh-button" onClick={loadOverview} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && <p className="admin-panel-error" role="alert">{error}</p>}

      <div className="admin-stats-grid">
        {statCards.map((stat) => (
          <article className="admin-stat-card" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </div>

      <section className="admin-registrations-section">
        <h3>Account registrations · last 6 months</h3>
        {!overview.registrationsByMonth && (
          <p className="admin-panel-notice" role="status">
            Registration trend data is available after the backend is redeployed.
          </p>
        )}
        <div className="admin-registration-chart" role="img" aria-label="New accounts registered each month over the last six months">
          {registrationMonths.map((month) => (
            <div className="admin-registration-column" key={month.key}>
              <strong>{month.count}</strong>
              <div className="admin-registration-track">
                <span
                  style={{
                    height: `${month.count === 0 ? 3 : Math.max(
                      8,
                      (month.count / Math.max(...registrationMonths.map((item) => item.count), 1)) * 100
                    )}%`,
                  }}
                />
              </div>
              <span>{month.label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="admin-users-section">
        <div className="admin-accounts-heading">
          <div>
            <h3>Accounts</h3>
            <p>{accountTotal.toLocaleString()} matching account{accountTotal === 1 ? '' : 's'}</p>
          </div>
          <div className="admin-account-filters">
            <label className="sr-only" htmlFor="admin-account-search">Search accounts</label>
            <input
              id="admin-account-search"
              type="search"
              value={accountSearch}
              placeholder="Search name or email"
              onChange={(event) => {
                setAccountSearch(event.target.value)
                setAccountPage(1)
              }}
            />
            <label className="sr-only" htmlFor="admin-account-role">Filter by role</label>
            <select
              id="admin-account-role"
              value={accountRole}
              onChange={(event) => {
                setAccountRole(event.target.value)
                setAccountPage(1)
              }}
            >
              <option value="all">All roles</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>
        {accountsFallback && (
          <p className="admin-panel-notice" role="status">
            Full account search is not available on the deployed backend yet. Showing matching accounts from its latest 10 instead; redeploy the backend for full search and pagination.
          </p>
        )}
        {accountsError && <p className="admin-panel-error" role="alert">{accountsError}</p>}
        {accountsLoading ? (
          <p className="admin-panel-message">Loading accounts...</p>
        ) : accounts.length === 0 ? (
          <p className="admin-panel-message">No accounts match your search.</p>
        ) : (
          <div className="admin-table-scroll">
            <table className="admin-users-table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Role</th>
                  <th scope="col">Joined</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.email}>
                    <td>{account.name}</td>
                    <td>{account.email}</td>
                    <td>
                      <span className={`admin-role-badge ${account.role}`}>
                        {account.role}
                      </span>
                    </td>
                    <td>{new Date(account.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="admin-pagination">
          <button
            className="admin-refresh-button"
            onClick={() => setAccountPage((page) => Math.max(1, page - 1))}
            disabled={accountPage <= 1 || accountsLoading}
          >
            Previous
          </button>
          <span>Page {accountPage} of {accountTotalPages}</span>
          <button
            className="admin-refresh-button"
            onClick={() => setAccountPage((page) => Math.min(accountTotalPages, page + 1))}
            disabled={accountPage >= accountTotalPages || accountsLoading}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  )
}
