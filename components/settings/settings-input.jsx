"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"

export function SettingsInput({ 
  label,
  value, 
  onChange, 
  placeholder = "",
  type = "text",
  disabled = false,
  className = ""
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && <Label htmlFor={label.toLowerCase().replace(/\s+/g, '-')}>{label}</Label>}
      <Input
        id={label?.toLowerCase().replace(/\s+/g, '-')}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  )
}

export function SettingsInputWithStorage({ 
  storageKey,
  label,
  defaultValue = "",
  placeholder = "",
  type = "text",
  disabled = false,
  onChange,
  className = ""
}) {
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored !== null) {
      setValue(stored)
    }
  }, [storageKey])

  const handleChange = (newValue) => {
    setValue(newValue)
    localStorage.setItem(storageKey, newValue)
    if (onChange) onChange(newValue)
  }

  return (
    <SettingsInput
      label={label}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      type={type}
      disabled={disabled}
      className={className}
    />
  )
}
