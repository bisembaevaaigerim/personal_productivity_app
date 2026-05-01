import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../AuthContext'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user') 
  const [error, setError] = useState(null)

  const { register } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    const res = await register(name, email, password, role)

    if (res.success) {
      navigate('/login')
    } else {
      setError(res.message || 'Registration failed')
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="card mx-auto" style={{ maxWidth: 480 }}>
        <div className="card-body">
          <h3 className="auth-title">Register</h3>

          {error && <div className="alert alert-danger">{String(error)}</div>}

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                className="form-control"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                className="form-control"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-success" type="submit">Register</button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setName('')
                  setEmail('')
                  setPassword('')
                  setRole('user')
                }}
              >
                Clear
              </button>
            </div>
          </form>

          <div className="mt-3 text-center">
            <Link to="/login">Already have an account? Login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
