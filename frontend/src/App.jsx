import React, { useContext } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'
import UsersPage from './components/UsersPage'
import CategoriesPage from './components/CategoriesPage'
import Login from './components/Login'
import Register from './components/Register'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthContext } from './AuthContext'

function AdminRoute({ children }) {
  const { token, role } = useContext(AuthContext)
  if (!token) return <Navigate to="/login" />
  if (role !== 'admin') return <div className="alert alert-danger">Admin only</div>
  return children
}

export default function App() {
  const { token, logout, role } = useContext(AuthContext)

  return (
    <div className="container py-4">
      {!token && (
        <nav className="navbar navbar-light bg-light mb-4 rounded shadow-sm px-3">
          <div className="container-fluid d-flex justify-content-between">
            <Link className="navbar-brand" to="/login">
              <strong>TaskManager</strong>
            </Link>

            <div>
              <Link className="btn btn-outline-primary me-2" to="/login">
                Login
              </Link>
              <Link className="btn btn-outline-success" to="/register">
                Register
              </Link>
            </div>
          </div>
        </nav>
      )}

      {token && (
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4 rounded">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">TaskManager</Link>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item"><Link className="nav-link" to="/">Tasks</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/create">Create</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/categories">Categories</Link></li>
                {role === 'admin' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/users">Users</Link>
                  </li>
                )}
              </ul>
              <div className="d-flex align-items-center">
                <span className="me-3">Role: <strong>{role || 'user'}</strong></span>
                <button className="btn btn-outline-secondary btn-sm" onClick={logout}>Logout</button>
              </div>
            </div>
          </div>
        </nav>
      )}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <TaskList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <TaskForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <TaskForm editMode />
            </ProtectedRoute>
          }
        />

        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <CategoriesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <AdminRoute>
              <UsersPage />
            </AdminRoute>
          }
        />
      </Routes>
    </div>
  )
}
