import React, { useEffect, useState, useContext } from 'react'
import { Users } from '../api'
import { AuthContext } from '../AuthContext'
import { useNavigate } from 'react-router-dom'

export default function UsersPage(){
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { token } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(()=>{
    if (!token) {
      setError('You must be logged in as admin to view users')
      setLoading(false)
      return
    }
    setLoading(true)
    Users.list()
      .then(r => { setUsers(r.data); setError(null) })
      .catch(err => {
        console.error(err)
        const status = err.response?.status
        if (status === 401) {
          setError('Unauthorized — please login')
          navigate('/login')
        } else if (status === 403) {
          setError('Forbidden — insufficient role')
        } else {
          setError('Failed to load users')
        }
      })
      .finally(()=> setLoading(false))
  }, [token, navigate])

  if (loading) return <div>Loading users...</div>
  if (error) return <div className="text-danger">{error}</div>

  return (
    <div>
      <h4>Users</h4>
      <ul className="list-group">
        {users.map(u => (
          <li key={u.id} className="list-group-item">
            <strong>{u.name}</strong> <div className="small text-muted">{u.email}</div>
            <div className="mt-2">Tasks: {u.tasks ? u.tasks.length : 0}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
