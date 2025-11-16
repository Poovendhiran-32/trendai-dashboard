# Settings Page Documentation

## Overview
The Settings page provides a comprehensive interface for users to manage their dashboard preferences, account settings, and system configurations. It's built with a modular component architecture and includes local storage persistence.

## Features

### 🎯 **User Profile Management**
- **Name & Email**: Editable user information with role display
- **Password Management**: Secure password change functionality
- **Last Login**: Display of user's last access time
- **Account Status**: Visual indicators for account state

### 📊 **Dashboard Preferences**
- **Auto-refresh Data**: Automatic data refresh every 5 minutes
- **Real-time Alerts**: Toggle for live notifications
- **Default Time Range**: Set default chart time periods (7d, 30d, 90d, 1y)
- **Chart Animation**: Enable/disable smooth chart animations

### 🔔 **Notification Settings**
- **Email Notifications**: Receive updates via email
- **Browser Notifications**: Desktop notification alerts
- **Low Stock Alerts**: Product inventory warnings
- **Trend Alerts**: Trending product notifications

### 💾 **Data Management**
- **Refresh Interval**: Configurable data update frequency
- **Auto Export**: Automatic report generation
- **Data Retention**: Historical data storage duration
- **Export Tools**: Manual data export and refresh buttons

### 🎨 **Appearance Customization**
- **Theme Selection**: Light, Dark, or System theme
- **Compact Mode**: Dense layout for more information
- **Sidebar Position**: Left, Right, or Hidden sidebar

### 🔒 **Security Settings**
- **Two-Factor Authentication**: Enhanced account security
- **Session Timeout**: Automatic logout configuration
- **Data Privacy**: Control data usage and sharing

## Component Architecture

### Core Components

#### `SettingsSection`
```jsx
<SettingsSection 
  title="Section Title" 
  description="Section description"
  className="border-l-4 border-l-blue-500"
>
  {/* Settings items */}
</SettingsSection>
```

#### `SettingsItem`
```jsx
<SettingsItem 
  label="Setting Label" 
  description="Setting description"
>
  {/* Input component */}
</SettingsItem>
```

### Input Components

#### `SettingsToggleWithStorage`
- Toggle switch with automatic localStorage persistence
- Handles boolean settings with default values

#### `SettingsInputWithStorage`
- Text input with automatic localStorage persistence
- Supports different input types (text, email, etc.)

#### `SettingsSelectWithStorage`
- Dropdown select with automatic localStorage persistence
- Configurable options array

## State Management

### Settings Context
The `SettingsContext` provides global state management for all settings:

```jsx
import { useSettings } from "@/lib/contexts/settings-context"

const { settings, updateSetting, resetSettings, getSetting } = useSettings()
```

### Settings Hook
The `useSettings` hook provides convenient helper functions:

```jsx
import { useSettingsHook } from "@/hooks/use-settings"

const {
  isAutoRefreshEnabled,
  toggleAutoRefresh,
  getTheme,
  // ... more helpers
} = useSettingsHook()
```

## Data Persistence

### Local Storage
All settings are automatically persisted to localStorage with the following keys:
- `user_name`, `user_email`
- `auto_refresh`, `show_alerts`
- `default_time_range`, `chart_animation`
- `email_notifications`, `browser_notifications`
- `low_stock_alerts`, `trend_alerts`
- `data_refresh_interval`, `auto_export`
- `data_retention`, `theme`
- `compact_mode`, `sidebar_position`
- `two_factor_auth`, `session_timeout`
- `data_privacy`

### API Integration
Settings can be synchronized with the server via:
- `GET /api/settings` - Fetch user settings
- `POST /api/settings` - Update settings
- `DELETE /api/settings` - Reset to defaults

## Usage Examples

### Basic Toggle Setting
```jsx
<SettingsItem 
  label="Auto-refresh Data" 
  description="Automatically refresh dashboard data"
>
  <SettingsToggleWithStorage 
    storageKey="auto_refresh" 
    defaultValue={true} 
  />
</SettingsItem>
```

### Select Dropdown
```jsx
<SettingsItem 
  label="Default Time Range" 
  description="Default time range for charts"
>
  <SettingsSelectWithStorage
    storageKey="default_time_range"
    defaultValue="30d"
    options={[
      { value: "7d", label: "Last 7 days" },
      { value: "30d", label: "Last 30 days" },
      { value: "90d", label: "Last 90 days" }
    ]}
  />
</SettingsItem>
```

### Text Input
```jsx
<SettingsItem 
  label="Name" 
  description="Your display name"
>
  <SettingsInputWithStorage
    storageKey="user_name"
    defaultValue={user?.name || ""}
    placeholder="Enter your name"
  />
</SettingsItem>
```

## Styling

### Color-coded Sections
Each settings section has a unique left border color:
- **User Profile**: Blue (`border-l-blue-500`)
- **Dashboard Preferences**: Green (`border-l-green-500`)
- **Notifications**: Yellow (`border-l-yellow-500`)
- **Data Management**: Purple (`border-l-purple-500`)
- **Appearance**: Pink (`border-l-pink-500`)
- **Security**: Red (`border-l-red-500`)

### Responsive Design
- Mobile-first approach
- Flexible grid layout
- Adaptive spacing and typography
- Touch-friendly controls

## Future Enhancements

### Planned Features
- [ ] **Settings Import/Export**: Backup and restore settings
- [ ] **Role-based Settings**: Different settings for different user roles
- [ ] **Settings Validation**: Real-time validation and error handling
- [ ] **Settings History**: Track changes over time
- [ ] **Bulk Operations**: Apply settings to multiple users
- [ ] **Settings Templates**: Predefined setting configurations

### Integration Points
- [ ] **Theme System**: Integration with global theme context
- [ ] **Notification System**: Real-time notification preferences
- [ ] **Analytics**: Track settings usage and patterns
- [ ] **A/B Testing**: Test different default settings

## Testing

### Unit Tests
```bash
npm test -- settings
```

### Integration Tests
```bash
npm run test:integration -- settings
```

### Manual Testing Checklist
- [ ] All toggles work correctly
- [ ] Settings persist across page reloads
- [ ] Default values load properly
- [ ] Reset functionality works
- [ ] Responsive design on mobile
- [ ] Accessibility compliance

## Troubleshooting

### Common Issues

#### Settings Not Persisting
- Check browser localStorage is enabled
- Verify storage key names match
- Check for JavaScript errors in console

#### Settings Not Loading
- Verify localStorage has data
- Check for JSON parsing errors
- Ensure default values are set

#### UI Not Updating
- Check React state updates
- Verify component re-renders
- Check for prop drilling issues

## Contributing

### Adding New Settings
1. Add the setting key to the context
2. Create appropriate input component
3. Add to the settings page
4. Update API endpoints
5. Add tests

### Modifying Existing Settings
1. Update the component
2. Maintain backward compatibility
3. Update documentation
4. Test thoroughly

## License
This settings system is part of the TrendAI Dashboard project and follows the same licensing terms.
