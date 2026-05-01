import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../AuthContext'
import { setAuthToken } from '../api'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const { login, setRole } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    const res = await login(email, password)
    if (res.success) {
      const token = localStorage.getItem('token')
      setAuthToken(token)

      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        if (payload.role) setRole(payload.role)
      } catch (e) {}

      navigate('/')
    } else {
      setError(res.message || 'Login failed')
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="card mx-auto" style={{ maxWidth: 480 }}>
        <div className="card-body">
          <h3 className="auth-title">Login</h3>

          {error && <div className="alert alert-danger">{String(error)}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input 
                className="form-control" 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input 
                className="form-control" 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-primary" type="submit">Login</button>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => { setEmail(''); setPassword('') }}
              >
                Clear
              </button>
            </div>
          </form>

          <div className="mt-3 text-center">
            <Link to="/register">Don’t have an account? Register</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
