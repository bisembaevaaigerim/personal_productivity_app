import React, { useEffect, useState, useContext } from 'react' 
import { useNavigate, useParams } from 'react-router-dom'
import { Tasks, Categories } from '../api'
import { AuthContext } from '../AuthContext'

export default function TaskForm() {
  const navigate = useNavigate()
  const { id } = useParams()

  const { userId } = useContext(AuthContext)

  const [task, setTask] = useState({
    title: '',
    description: '',
    completed: false,
    category_id: null
  })

  const [categories, setCategories] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    Categories.list()
      .then(res => setCategories(res.data))
      .catch(err => console.log(err))

    if (id) {
      Tasks.get(id)
        .then(r => {
          const t = r.data
          setTask({
            id: t.id,
            title: t.title || '',
            description: t.description || '',
            completed: t.completed || false,
            category_id: t.category?.id || null
          })
        })
        .catch(() => {
          setError("Failed to load task")
        })
    }
  }, [id])


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setTask(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (value === '' ? null : value)
    }))
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload = {
        title: task.title,
        description: task.description,
        completed: !!task.completed,
        user_id: Number(userId),   
        category_id: task.category_id ? Number(task.category_id) : null
      }

      if (id) {
        await Tasks.update(id, { ...payload, id: Number(id) })
      } else {
        await Tasks.create(payload)
      }

      navigate('/')
    } catch (e) {
      const status = e.response?.status
      if(status === 401){
        alert("Unauthorized — please login")
        navigate('/login')
        return
      }
      setError("Ошибка при сохранении")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{id ? 'Edit Task' : 'Create Task'}</h5>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input 
              name="title" 
              className="form-control" 
              value={task.title} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea 
              name="description" 
              className="form-control" 
              value={task.description} 
              onChange={handleChange} 
              rows={3} 
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Category</label>
            <select 
              name="category_id" 
              className="form-select" 
              value={task.category_id ?? ''} 
              onChange={handleChange}
            >
              <option value="">-- None --</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-check mb-3">
            <input 
              className="form-check-input" 
              type="checkbox" 
              name="completed" 
              id="completed" 
              checked={task.completed} 
              onChange={handleChange} 
            />
            <label className="form-check-label" htmlFor="completed">Completed</label>
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => window.history.back()}>
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
