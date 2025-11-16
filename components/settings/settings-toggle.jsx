"use client"

import { Switch } from "@/components/ui/switch"
import { useState, useEffect } from "react"

export function SettingsToggle({ 
  checked, 
  onCheckedChange, 
  disabled = false,
  className = "" 
}) {
  return (
    <Switch
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={className}
    />
  )
}

export function SettingsToggleWithStorage({ 
  storageKey, 
  defaultValue = false, 
  onToggle,
  disabled = false,
  className = "" 
}) {
  const [checked, setChecked] = useState(defaultValue)

  useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored !== null) {
      setChecked(JSON.parse(stored))
    }
  }, [storageKey])

  const handleToggle = (value) => {
    setChecked(value)
    localStorage.setItem(storageKey, JSON.stringify(value))
    if (onToggle) onToggle(value)
  }

  return (
    <SettingsToggle
      checked={checked}
      onCheckedChange={handleToggle}
      disabled={disabled}
      className={className}
    />
  )
}
