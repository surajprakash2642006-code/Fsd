import { useState } from 'react'
import { BudgetProvider } from './context/BudgetContext'
import AuthContext from './context/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import './App.css'

export default function App() {
  const [user, setUser] = useState(null)

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <BudgetProvider>
        {user ? (
          <Dashboard user={user} onLogout={handleLogout} />
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </BudgetProvider>
    </AuthContext.Provider>
  )
}
