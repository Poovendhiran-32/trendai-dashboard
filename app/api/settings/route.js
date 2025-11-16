import { NextResponse } from "next/server"

// GET /api/settings - Get user settings
export async function GET(request) {
  try {
    // In a real app, you would fetch settings from a database
    // For now, we'll return default settings
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

    return NextResponse.json(defaultSettings)
  } catch (error) {
    console.error("[API] Error fetching settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

// POST /api/settings - Update user settings
export async function POST(request) {
  try {
    const settings = await request.json()
    
    // In a real app, you would save settings to a database
    // For now, we'll just validate the settings structure
    const validKeys = [
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

    const validatedSettings = {}
    validKeys.forEach(key => {
      if (settings[key] !== undefined) {
        validatedSettings[key] = settings[key]
      }
    })

    // Here you would save to database
    console.log("Settings updated:", validatedSettings)

    return NextResponse.json({ 
      success: true, 
      message: "Settings updated successfully",
      settings: validatedSettings
    })
  } catch (error) {
    console.error("[API] Error updating settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}

// DELETE /api/settings - Reset settings to defaults
export async function DELETE(request) {
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

    // Here you would reset in database
    console.log("Settings reset to defaults")

    return NextResponse.json({ 
      success: true, 
      message: "Settings reset to defaults",
      settings: defaultSettings
    })
  } catch (error) {
    console.error("[API] Error resetting settings:", error)
    return NextResponse.json({ error: "Failed to reset settings" }, { status: 500 })
  }
}
