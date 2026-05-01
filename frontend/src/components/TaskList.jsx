import React, { useEffect, useState } from 'react'
import { Tasks } from '../api'
import { Link } from 'react-router-dom'

export default function TaskList(){
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTasks = async ()=>{
    try{
      setLoading(true)
      const res = await Tasks.list()
      setTasks(res.data)
    }catch(e){
      setError(e.message)
    }finally{ 
      setLoading(false) 
    }
  }

  useEffect(()=>{ 
    fetchTasks() 
  }, [])

  const handleDelete = async (id)=>{
    if(!window.confirm('Delete this task?')) return
    try{
      await Tasks.remove(id)
      setTasks(prev => prev.filter(t => t.id !== id))
    }catch(e){
      const status = e.response?.status
      if(status === 401) {
        alert('Unauthorized. Please login to delete tasks.')
        window.location.href = '/login'
        return
      }
      alert('Failed to delete')
    }
  }

  const toggleCompleted = async (task)=>{
    try{
      const updated = { ...task, completed: !task.completed }
      await Tasks.update(task.id, updated)
      setTasks(prev => prev.map(t => t.id === task.id ? updated : t))
    }catch(e){
      const status = e.response?.status
      if(status === 401) {
        alert('Unauthorized. Please login to update tasks.')
        window.location.href = '/login'
        return
      }
      alert('Failed to update')
    }
  }

  if(loading) return <div>Loading tasks...</div>
  if(error) return <div className="text-danger">{error}</div>

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Tasks</h3>
        <Link className="btn btn-primary" to="/create">New Task</Link>
      </div>

      <div className="list-group">
        {tasks.length === 0 && <div className="text-muted">No tasks found</div>}
        {tasks.map(task => (
          <div 
            key={task.id} 
            className={`list-group-item d-flex justify-content-between align-items-center ${task.completed ? 'completed-task' : ''}`}
          >
            <div>
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  checked={task.completed} 
                  onChange={()=>toggleCompleted(task)} 
                  id={`chk-${task.id}`} 
                />
                <label className="form-check-label ms-2" htmlFor={`chk-${task.id}`}>
                  <strong>{task.title}</strong> 
                  <small className="text-muted">
                    {task.user?.name ? ` — ${task.user.name}` : ''}
                  </small>
                </label>
              </div>
              <div className="small text-muted">{task.category?.name || 'No category'}</div>
              <div>{task.description}</div>
            </div>
            <div>
              <Link to={`/edit/${task.id}`} className="btn btn-sm btn-outline-secondary me-2">Edit</Link>
              <button className="btn btn-sm btn-outline-danger" onClick={()=>handleDelete(task.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
