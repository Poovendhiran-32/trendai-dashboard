"use client"

import { useSettings } from "@/lib/contexts/settings-context"

export function useSettingsHook() {
  const { settings, updateSetting, resetSettings, getSetting, isLoading } = useSettings()

  // Helper functions for common settings
  const isAutoRefreshEnabled = () => getSetting('auto_refresh', true)
  const isAlertsEnabled = () => getSetting('show_alerts', true)
  const getDefaultTimeRange = () => getSetting('default_time_range', '30d')
  const isChartAnimationEnabled = () => getSetting('chart_animation', true)
  const getTheme = () => getSetting('theme', 'system')
  const isCompactMode = () => getSetting('compact_mode', false)
  const getSidebarPosition = () => getSetting('sidebar_position', 'left')
  const getDataRefreshInterval = () => getSetting('data_refresh_interval', '5m')
  const isEmailNotificationsEnabled = () => getSetting('email_notifications', true)
  const isBrowserNotificationsEnabled = () => getSetting('browser_notifications', false)
  const isLowStockAlertsEnabled = () => getSetting('low_stock_alerts', true)
  const isTrendAlertsEnabled = () => getSetting('trend_alerts', true)

  // Toggle functions
  const toggleAutoRefresh = () => updateSetting('auto_refresh', !isAutoRefreshEnabled())
  const toggleAlerts = () => updateSetting('show_alerts', !isAlertsEnabled())
  const toggleChartAnimation = () => updateSetting('chart_animation', !isChartAnimationEnabled())
  const toggleCompactMode = () => updateSetting('compact_mode', !isCompactMode())
  const toggleEmailNotifications = () => updateSetting('email_notifications', !isEmailNotificationsEnabled())
  const toggleBrowserNotifications = () => updateSetting('browser_notifications', !isBrowserNotificationsEnabled())
  const toggleLowStockAlerts = () => updateSetting('low_stock_alerts', !isLowStockAlertsEnabled())
  const toggleTrendAlerts = () => updateSetting('trend_alerts', !isTrendAlertsEnabled())

  return {
    settings,
    updateSetting,
    resetSettings,
    getSetting,
    isLoading,
    // Helper getters
    isAutoRefreshEnabled,
    isAlertsEnabled,
    getDefaultTimeRange,
    isChartAnimationEnabled,
    getTheme,
    isCompactMode,
    getSidebarPosition,
    getDataRefreshInterval,
    isEmailNotificationsEnabled,
    isBrowserNotificationsEnabled,
    isLowStockAlertsEnabled,
    isTrendAlertsEnabled,
    // Toggle functions
    toggleAutoRefresh,
    toggleAlerts,
    toggleChartAnimation,
    toggleCompactMode,
    toggleEmailNotifications,
    toggleBrowserNotifications,
    toggleLowStockAlerts,
    toggleTrendAlerts
  }
}
