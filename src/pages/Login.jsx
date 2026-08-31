import { useState } from 'react'
import './Login.css'

export default function Login({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    if (isSignup && !formData.name) {
      newErrors.name = 'Name is required'
    }
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validateForm()

    if (Object.keys(newErrors).length === 0) {
      onLogin({
        name: formData.name || formData.email.split('@')[0],
        email: formData.email,
      })
    } else {
      setErrors(newErrors)
    }
  }

  return (
    <div className="login-container">
      <div className="login-grid">
        {/* Left side - Branding */}
        <div className="login-branding">
          <div className="branding-content">
            <div className="branding-icon">💰</div>
            <h1>FinTrack</h1>
            <p>Your Personal Finance Companion</p>
            <div className="branding-features">
              <div className="feature">✓ Track Expenses</div>
              <div className="feature">✓ Set Budgets</div>
              <div className="feature">✓ Get Alerts</div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="login-form-container">
          <div className="login-form-wrapper">
            <div className="form-header">
              <h2>{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
              <p>{isSignup ? 'Join FinTrack today' : 'Sign in to your account'}</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {isSignup && (
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                />
                {errors.password && (
                  <span className="error-text">{errors.password}</span>
                )}
              </div>

              <button type="submit" className="login-button">
                {isSignup ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <div className="form-divider">
              <span>or</span>
            </div>

            <div className="form-footer">
              <p>
                {isSignup ? 'Already have an account?' : "Don't have an account?"}
              </p>
              <button
                type="button"
                className="toggle-button"
                onClick={() => {
                  setIsSignup(!isSignup)
                  setFormData({ name: '', email: '', password: '' })
                  setErrors({})
                }}
              >
                {isSignup ? 'Sign In' : 'Sign Up'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
