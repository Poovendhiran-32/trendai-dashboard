"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing auth data on mount
    const checkAuth = () => {
      try {
        const authData = localStorage.getItem('trendai_auth')
        if (authData) {
          const parsed = JSON.parse(authData)
          setUser(parsed.user)
        }
      } catch (error) {
        console.error('Error checking auth:', error)
        localStorage.removeItem('trendai_auth')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email, password) => {
    console.log('Login attempt:', { email, password })
    try {
      // Try backend API first
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (response.ok) {
        const data = await response.json()
        const authData = {
          user: data.user,
          token: data.access_token,
          refreshToken: data.refresh_token
        }
        
        localStorage.setItem('trendai_auth', JSON.stringify(authData))
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('refresh_token', data.refresh_token)
        setUser(data.user)
        console.log('Login successful via backend:', data.user)
        return { success: true }
      } else {
        const errorData = await response.json()
        console.log('Backend login failed, trying Next.js API:', errorData.detail)
        
        // Fallback to Next.js API route
        const fallbackResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        })

        if (fallbackResponse.ok) {
          const data = await fallbackResponse.json()
          const authData = {
            user: data.user,
            token: data.token
          }
          
          localStorage.setItem('trendai_auth', JSON.stringify(authData))
          setUser(data.user)
          console.log('Login successful via Next.js API:', data.user)
          return { success: true }
        } else {
          const fallbackError = await fallbackResponse.json()
          return { success: false, error: fallbackError.error || 'Login failed' }
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  const logout = () => {
    localStorage.removeItem('trendai_auth')
    setUser(null)
    router.push('/login')
  }

  const signup = async (userData) => {
    try {
      // Try backend API first
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${backendUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })

      if (response.ok) {
        const data = await response.json()
        return { success: true, user: data.user }
      } else {
        const errorData = await response.json()
        console.log('Backend signup failed, trying Next.js API:', errorData.detail)
        
        // Fallback to Next.js API route
        const fallbackResponse = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        })

        if (fallbackResponse.ok) {
          const data = await fallbackResponse.json()
          return { success: true, user: data.user }
        } else {
          const error = await fallbackResponse.json()
          return { success: false, error: error.error || 'Registration failed' }
        }
      }
    } catch (error) {
      console.error('Signup error:', error)
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  const value = {
    user,
    loading,
    login,
    logout,
    signup,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
