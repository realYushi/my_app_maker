import React, { useState } from 'react'
import type { Entity } from '@mini-ai-app-builder/shared-types'

interface AdminControlPanelProps {
  entity: Entity
}

interface SystemSetting {
  id: string
  category: string
  name: string
  description: string
  type: 'toggle' | 'select' | 'input' | 'slider'
  value: any
  options?: string[]
  min?: number
  max?: number
  unit?: string
  critical?: boolean
}

const AdminControlPanel = ({ entity }: AdminControlPanelProps): React.ReactElement => {
  const [settings, setSettings] = useState<SystemSetting[]>([
    {
      id: 'maintenance_mode',
      category: 'System',
      name: 'Maintenance Mode',
      description: 'Enable maintenance mode to prevent user access during updates',
      type: 'toggle',
      value: false,
      critical: true
    },
    {
      id: 'user_registration',
      category: 'User Management',
      name: 'User Registration',
      description: 'Allow new users to register accounts',
      type: 'toggle',
      value: true
    },
    {
      id: 'max_upload_size',
      category: 'File Management',
      name: 'Max Upload Size',
      description: 'Maximum file upload size in MB',
      type: 'slider',
      value: 50,
      min: 1,
      max: 500,
      unit: 'MB'
    },
    {
      id: 'session_timeout',
      category: 'Security',
      name: 'Session Timeout',
      description: 'User session timeout duration',
      type: 'select',
      value: '30m',
      options: ['15m', '30m', '1h', '2h', '4h', '24h']
    },
    {
      id: 'backup_frequency',
      category: 'Backup',
      name: 'Backup Frequency',
      description: 'How often to perform automated backups',
      type: 'select',
      value: 'daily',
      options: ['hourly', 'daily', 'weekly', 'monthly']
    },
    {
      id: 'api_rate_limit',
      category: 'API',
      name: 'API Rate Limit',
      description: 'API requests per minute per user',
      type: 'slider',
      value: 100,
      min: 10,
      max: 1000,
      unit: 'req/min'
    },
    {
      id: 'cache_enabled',
      category: 'Performance',
      name: 'Enable Caching',
      description: 'Enable system-wide caching for improved performance',
      type: 'toggle',
      value: true
    },
    {
      id: 'log_level',
      category: 'Logging',
      name: 'Log Level',
      description: 'System logging verbosity level',
      type: 'select',
      value: 'INFO',
      options: ['ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE']
    },
    {
      id: 'notification_email',
      category: 'Notifications',
      name: 'Admin Email',
      description: 'Email address for system notifications',
      type: 'input',
      value: 'admin@company.com'
    }
  ])

  const [pendingChanges, setPendingChanges] = useState<Set<string>>(new Set())
  const [confirmDialog, setConfirmDialog] = useState<{ setting: SystemSetting | null; action: string }>({ setting: null, action: '' })

  const handleSettingChange = (settingId: string, newValue: any) => {
    const setting = settings.find(s => s.id === settingId)

    if (setting?.critical) {
      setConfirmDialog({ setting, action: newValue ? 'enable' : 'disable' })
      return
    }

    updateSetting(settingId, newValue)
  }

  const updateSetting = (settingId: string, newValue: any) => {
    setSettings(prev => prev.map(setting =>
      setting.id === settingId ? { ...setting, value: newValue } : setting
    ))
    setPendingChanges(prev => new Set([...prev, settingId]))
  }

  const confirmCriticalChange = () => {
    if (confirmDialog.setting) {
      updateSetting(confirmDialog.setting.id, confirmDialog.action === 'enable')
    }
    setConfirmDialog({ setting: null, action: '' })
  }

  const saveChanges = () => {
    // In a real app, this would save to backend
    setPendingChanges(new Set())
    // Show success message
  }

  const resetChanges = () => {
    // In a real app, this would reload from backend
    setPendingChanges(new Set())
  }

  const groupedSettings = settings.reduce((groups, setting) => {
    if (!groups[setting.category]) {
      groups[setting.category] = []
    }
    groups[setting.category].push(setting)
    return groups
  }, {} as Record<string, SystemSetting[]>)

  const renderSettingControl = (setting: SystemSetting) => {
    const hasPendingChange = pendingChanges.has(setting.id)

    switch (setting.type) {
      case 'toggle':
        return (
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={setting.value}
              onChange={(e) => handleSettingChange(setting.id, e.target.checked)}
              className={`rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
                setting.critical ? 'border-red-300' : ''
              } ${hasPendingChange ? 'ring-2 ring-yellow-300' : ''}`}
            />
            <span className="ml-2 text-sm text-gray-900">
              {setting.value ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        )

      case 'select':
        return (
          <select
            value={setting.value}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              hasPendingChange ? 'ring-yellow-300' : ''
            }`}
          >
            {setting.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )

      case 'input':
        return (
          <input
            type="text"
            value={setting.value}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              hasPendingChange ? 'ring-yellow-300' : ''
            }`}
          />
        )

      case 'slider':
        return (
          <div className="space-y-2">
            <input
              type="range"
              min={setting.min}
              max={setting.max}
              value={setting.value}
              onChange={(e) => handleSettingChange(setting.id, parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{setting.min}{setting.unit}</span>
              <span className="font-medium text-gray-900">{setting.value}{setting.unit}</span>
              <span>{setting.max}{setting.unit}</span>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
          {entity.name} Control Panel
        </h3>
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800">
            🎛️ System Config
          </span>
          {pendingChanges.size > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
              {pendingChanges.size} pending changes
            </span>
          )}
        </div>
      </div>

      {/* Quick System Actions */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h4>
        <div className="flex flex-wrap gap-3">
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            🔄 Restart Services
          </button>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            🧹 Clear Cache
          </button>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            💾 Create Backup
          </button>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            📊 Run Diagnostics
          </button>
        </div>
      </div>

      {/* Settings by Category */}
      <div className="space-y-6">
        {Object.entries(groupedSettings).map(([category, categorySettings]) => (
          <div key={category} className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-base font-medium text-gray-900 mb-4 flex items-center">
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
              {category}
            </h4>
            <div className="space-y-4">
              {categorySettings.map(setting => (
                <div
                  key={setting.id}
                  className={`p-4 rounded-lg border transition-all ${
                    pendingChanges.has(setting.id)
                      ? 'border-yellow-300 bg-yellow-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  } ${setting.critical ? 'border-l-4 border-l-red-500' : ''}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h5 className="text-sm font-medium text-gray-900">{setting.name}</h5>
                        {setting.critical && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            ⚠️ Critical
                          </span>
                        )}
                        {pendingChanges.has(setting.id) && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            📝 Modified
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{setting.description}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    {renderSettingControl(setting)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Save Changes Section */}
      {pendingChanges.size > 0 && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-yellow-900">Unsaved Changes</h4>
              <p className="text-sm text-yellow-700 mt-1">
                You have {pendingChanges.size} pending configuration changes that need to be saved.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={resetChanges}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                ↩️ Reset
              </button>
              <button
                onClick={saveChanges}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                💾 Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Critical Action Confirmation Dialog */}
      {confirmDialog.setting && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-xl">⚠️</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Confirm Critical Action</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              You are about to {confirmDialog.action} <strong>{confirmDialog.setting.name}</strong>.
              This is a critical system setting that may affect all users. Are you sure you want to continue?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDialog({ setting: null, action: '' })}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmCriticalChange}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Confirm {confirmDialog.action}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminControlPanel