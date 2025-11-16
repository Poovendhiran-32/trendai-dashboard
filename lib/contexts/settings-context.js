"use client"

import { createContext, useContext, useState, useEffect } from "react"

const SettingsContext = createContext()

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  // Load settings from localStorage on mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedSettings = {}
        const keys = [
          'user_name',
          'user_email',
          'auto_refresh',
          'show_alerts',
          'default_time_range',
          'chart_animation',
          'email_notifications',
          'browser_notifications',
          'low_stock_alerts',
          'trend_alerts',
          'data_refresh_interval',
          'auto_export',
          'data_retention',
          'theme',
          'compact_mode',
          'sidebar_position',
          'two_factor_auth',
          'session_timeout',
          'data_privacy'
        ]

        keys.forEach(key => {
          const value = localStorage.getItem(key)
          if (value !== null) {
            try {
              savedSettings[key] = JSON.parse(value)
            } catch {
              savedSettings[key] = value
            }
          }
        })

        setSettings(savedSettings)
      } catch (error) {
        console.error('Error loading settings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [])

  const updateSetting = (key, value) => {
    try {
      const newSettings = { ...settings, [key]: value }
      setSettings(newSettings)
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error updating setting:', error)
    }
  }

  const resetSettings = () => {
    try {
      const defaultSettings = {
        user_name: "",
        user_email: "",
        auto_refresh: true,
        show_alerts: true,
        default_time_range: "30d",
        chart_animation: true,
        email_notifications: true,
        browser_notifications: false,
        low_stock_alerts: true,
        trend_alerts: true,
        data_refresh_interval: "5m",
        auto_export: false,
        data_retention: "1y",
        theme: "system",
        compact_mode: false,
        sidebar_position: "left",
        two_factor_auth: false,
        session_timeout: "30m",
        data_privacy: true
      }

      setSettings(defaultSettings)
      
      // Clear localStorage and set defaults
      Object.keys(defaultSettings).forEach(key => {
        localStorage.setItem(key, JSON.stringify(defaultSettings[key]))
      })
    } catch (error) {
      console.error('Error resetting settings:', error)
    }
  }

  const getSetting = (key, defaultValue = null) => {
    return settings[key] !== undefined ? settings[key] : defaultValue
  }

  const value = {
    settings,
    updateSetting,
    resetSettings,
    getSetting,
    isLoading
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
