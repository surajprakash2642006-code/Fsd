import Dashboard from './pages/Dashboard'
import './App.css'

export default function App() {
  // Mock user for Exp 1 (just UI, no state management)
  const user = { name: 'John Doe', email: 'john@example.com' }

  return (
    <Dashboard user={user} onLogout={() => {}} />
  )
}
