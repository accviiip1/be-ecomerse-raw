import React, { createContext, useCallback, useContext, useMemo, useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import axiosClient from '../lib/axiosClient'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => Cookies.get('admin_token') || null)
  const [user, setUser] = useState(null)
  const isAuthenticated = Boolean(token)
  const isAdmin = user?.isAdmin || user?.role === 'admin'

  const login = useCallback(async (credentials) => {
    const res = await axiosClient.post('/login', credentials)
    const accessToken = res?.data?.accessToken || res?.data?.token
    const refreshToken = res?.data?.refreshToken
    const currentUser = res?.data?.user || null
    if (!accessToken || !refreshToken) throw new Error('Đăng nhập thất bại')
    
    // Save to cookies
    Cookies.set('admin_token', accessToken)
    Cookies.set('admin_refreshToken', refreshToken)
    if (currentUser?.id) Cookies.set('admin_userId', currentUser.id)
    if (currentUser?.isAdmin !== undefined) Cookies.set('admin_isAdmin', currentUser.isAdmin.toString())
    if (currentUser?.role) Cookies.set('admin_userRole', currentUser.role)
    
    setToken(accessToken)
    setUser(currentUser)
    return currentUser
  }, [])

  const logout = useCallback(() => {
    Cookies.remove('admin_token')
    Cookies.remove('admin_refreshToken')
    Cookies.remove('admin_userId')
    Cookies.remove('admin_isAdmin')
    Cookies.remove('admin_userRole')
    setToken(null)
    setUser(null)
  }, [])

  // Load user info when token exists
  useEffect(() => {
    const loadUserInfo = async () => {
      if (token && !user) {
        try {
          // Try to get user info from token or make a request to get user details
          const userId = Cookies.get('admin_userId')
          if (userId) {
            // You can make an API call here to get user details
            // For now, we'll create a basic user object
            const userInfo = {
              id: userId,
              isAdmin: Cookies.get('admin_isAdmin') === 'true',
              role: Cookies.get('admin_userRole') || 'user'
            }
            setUser(userInfo)
          }
        } catch (error) {
          console.error('Failed to load user info:', error)
          // If failed to load user info, clear token
          logout()
        }
      }
    }

    loadUserInfo()
  }, [token, user, logout])

  const value = useMemo(() => ({ 
    token, 
    user, 
    isAuthenticated, 
    isAdmin,
    login, 
    logout 
  }), [token, user, isAuthenticated, isAdmin, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


