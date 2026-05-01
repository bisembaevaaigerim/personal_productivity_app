import React, { useEffect, useState } from 'react'
import { Categories } from '../api'

export default function CategoriesPage(){
  const [cats, setCats] = useState([])
  useEffect(()=>{ Categories.list().then(r => setCats(r.data)).catch(()=>{}) }, [])
  return (
    <div>
      <h4>Categories</h4>
      <ul className="list-group">
        {cats.map(c => (
          <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
            {c.name}
            <span className="badge bg-secondary rounded-pill">{c.tasks ? c.tasks.length : 0}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}