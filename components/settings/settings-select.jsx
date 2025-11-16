"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"

export function SettingsSelect({ 
  label,
  value, 
  onValueChange, 
  options = [],
  placeholder = "Select an option",
  disabled = false,
  className = ""
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && <Label>{label}</Label>}
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export function SettingsSelectWithStorage({ 
  storageKey,
  label,
  defaultValue = "",
  options = [],
  placeholder = "Select an option",
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
    <SettingsSelect
      label={label}
      value={value}
      onValueChange={handleChange}
      options={options}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
    />
  )
}
