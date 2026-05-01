import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' }
})

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

export const Tasks = {
  list: () => api.get('/tasks'),
  get: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  remove: (id) => api.delete(`/tasks/${id}`)
}

export const Users = {
  list: () => api.get('/admin/users')
}

export const Categories = {
  list: () => api.get('/categories'),
  create: (data) => api.post('/categories', data)
}

export const Auth = {
  login: (payload) => api.post('/login', payload),
  register: (payload) => api.post('/register', payload)
}
