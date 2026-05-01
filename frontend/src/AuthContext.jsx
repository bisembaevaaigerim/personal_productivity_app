import React, { createContext, useState, useEffect } from 'react'
import { setAuthToken, Auth } from './api'

export const AuthContext = createContext()

export function AuthProvider({ children }) {

  const [token, setToken] = useState(() => localStorage.getItem('token') || null)
  const [userRole, setUserRole] = useState(() => localStorage.getItem('role') || null)
  const [userId, setUserId] = useState(() => localStorage.getItem('user_id') || null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setAuthToken(token)
  }, [token])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const res = await Auth.login({ email, password })
      const tokenStr = res.data.token
      if (!tokenStr) throw new Error('No token received')

      setToken(tokenStr)
      localStorage.setItem('token', tokenStr)
      setAuthToken(tokenStr)

      try {
        const payload = JSON.parse(atob(tokenStr.split('.')[1]))

        if (payload.role) {
          setUserRole(payload.role)
          localStorage.setItem('role', payload.role)
        }

        if (payload.user_id) {
          setUserId(payload.user_id)
          localStorage.setItem('user_id', payload.user_id)
        }

      } catch (e) {
        console.log("Failed to decode JWT", e)
      }

      return { success: true }
    } catch (err) {
      console.error(err)
      return { success: false, message: err.response?.data || err.message }
    } finally {
      setLoading(false)
    }
  }

  const register = async (name, email, password, role = 'user') => {
    setLoading(true)
    try {
      const res = await Auth.register({ name, email, password, role })
      return { success: true, user: res.data }
    } catch (err) {
      return { success: false, message: err.response?.data || err.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setToken(null)
    setUserRole(null)
    setUserId(null)

    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('user_id')

    setAuthToken(null)
  }

  return (
    <AuthContext.Provider value={{
      token,
      role: userRole,
      userId,     
      loading,
      login,
      logout,
      register,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
