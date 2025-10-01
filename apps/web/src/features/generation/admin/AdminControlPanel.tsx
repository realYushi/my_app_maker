import React, { useState } from 'react';
import type { Entity } from '@mini-ai-app-builder/shared-types';

interface AdminControlPanelProps {
  entity: Entity;
}

interface SystemSetting {
  id: string;
  category: string;
  name: string;
  description: string;
  type: 'toggle' | 'select' | 'input' | 'slider';
  value: string | number | boolean;
  options?: string[];
  min?: number;
  max?: number;
  unit?: string;
  critical?: boolean;
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
      critical: true,
    },
    {
      id: 'user_registration',
      category: 'User Management',
      name: 'User Registration',
      description: 'Allow new users to register accounts',
      type: 'toggle',
      value: true,
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
      unit: 'MB',
    },
    {
      id: 'session_timeout',
      category: 'Security',
      name: 'Session Timeout',
      description: 'User session timeout duration',
      type: 'select',
      value: '30m',
      options: ['15m', '30m', '1h', '2h', '4h', '24h'],
    },
    {
      id: 'backup_frequency',
      category: 'Backup',
      name: 'Backup Frequency',
      description: 'How often to perform automated backups',
      type: 'select',
      value: 'daily',
      options: ['hourly', 'daily', 'weekly', 'monthly'],
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
      unit: 'req/min',
    },
    {
      id: 'cache_enabled',
      category: 'Performance',
      name: 'Enable Caching',
      description: 'Enable system-wide caching for improved performance',
      type: 'toggle',
      value: true,
    },
    {
      id: 'log_level',
      category: 'Logging',
      name: 'Log Level',
      description: 'System logging verbosity level',
      type: 'select',
      value: 'INFO',
      options: ['ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE'],
    },
    {
      id: 'notification_email',
      category: 'Notifications',
      name: 'Admin Email',
      description: 'Email address for system notifications',
      type: 'input',
      value: 'admin@company.com',
    },
  ]);

  const [pendingChanges, setPendingChanges] = useState<Set<string>>(new Set());
  const [confirmDialog, setConfirmDialog] = useState<{
    setting: SystemSetting | null;
    action: string;
  }>({ setting: null, action: '' });

  const handleSettingChange = (settingId: string, newValue: string | number | boolean) => {
    const setting = settings.find(s => s.id === settingId);

    if (setting?.critical) {
      setConfirmDialog({ setting, action: newValue ? 'enable' : 'disable' });
      return;
    }

    updateSetting(settingId, newValue);
  };

  const updateSetting = (settingId: string, newValue: string | number | boolean) => {
    setSettings(prev =>
      prev.map(setting => (setting.id === settingId ? { ...setting, value: newValue } : setting)),
    );
    setPendingChanges(prev => new Set([...prev, settingId]));
  };

  const confirmCriticalChange = () => {
    if (confirmDialog.setting) {
      updateSetting(confirmDialog.setting.id, confirmDialog.action === 'enable');
    }
    setConfirmDialog({ setting: null, action: '' });
  };

  const saveChanges = () => {
    // In a real app, this would save to backend
    setPendingChanges(new Set());
    // Show success message
  };

  const resetChanges = () => {
    // In a real app, this would reload from backend
    setPendingChanges(new Set());
  };

  const groupedSettings = settings.reduce(
    (groups, setting) => {
      if (!groups[setting.category]) {
        groups[setting.category] = [];
      }
      groups[setting.category].push(setting);
      return groups;
    },
    {} as Record<string, SystemSetting[]>,
  );

  const renderSettingControl = (setting: SystemSetting) => {
    const hasPendingChange = pendingChanges.has(setting.id);

    switch (setting.type) {
      case 'toggle':
        return (
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={setting.value as boolean}
              onChange={e => handleSettingChange(setting.id, e.target.checked)}
              className={`rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
                setting.critical ? 'border-red-300' : ''
              } ${hasPendingChange ? 'ring-2 ring-yellow-300' : ''}`}
            />
            <span className="ml-2 text-sm text-gray-900">
              {setting.value ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        );

      case 'select':
        return (
          <select
            value={setting.value as string}
            onChange={e => handleSettingChange(setting.id, e.target.value)}
            className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              hasPendingChange ? 'ring-yellow-300' : ''
            }`}
          >
            {setting.options?.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'input':
        return (
          <input
            type="text"
            value={setting.value as string}
            onChange={e => handleSettingChange(setting.id, e.target.value)}
            className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              hasPendingChange ? 'ring-yellow-300' : ''
            }`}
          />
        );

      case 'slider':
        return (
          <div className="space-y-2">
            <input
              type="range"
              min={setting.min}
              max={setting.max}
              value={setting.value as number}
              onChange={e => handleSettingChange(setting.id, parseInt(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>
                {setting.min}
                {setting.unit}
              </span>
              <span className="font-medium text-gray-900">
                {setting.value}
                {setting.unit}
              </span>
              <span>
                {setting.max}
                {setting.unit}
              </span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="flex items-center text-lg font-medium text-gray-900">
          <span className="mr-2 h-2 w-2 rounded-full bg-orange-500"></span>
          {entity.name} Control Panel
        </h3>
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center rounded bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800">
            🎛️ System Config
          </span>
          {pendingChanges.size > 0 && (
            <span className="inline-flex items-center rounded bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
              {pendingChanges.size} pending changes
            </span>
          )}
        </div>
      </div>

      {/* Quick System Actions */}
      <div className="mb-6 rounded-lg bg-gray-50 p-4">
        <h4 className="mb-3 text-sm font-medium text-gray-900">Quick Actions</h4>
        <div className="flex flex-wrap gap-3">
          <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            🔄 Restart Services
          </button>
          <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            🧹 Clear Cache
          </button>
          <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            💾 Create Backup
          </button>
          <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            📊 Run Diagnostics
          </button>
        </div>
      </div>

      {/* Settings by Category */}
      <div className="space-y-6">
        {Object.entries(groupedSettings).map(([category, categorySettings]) => (
          <div key={category} className="rounded-lg border border-gray-200 p-4">
            <h4 className="mb-4 flex items-center text-base font-medium text-gray-900">
              <span className="mr-2 h-1.5 w-1.5 rounded-full bg-orange-500"></span>
              {category}
            </h4>
            <div className="space-y-4">
              {categorySettings.map(setting => (
                <div
                  key={setting.id}
                  className={`rounded-lg border p-4 transition-all ${
                    pendingChanges.has(setting.id)
                      ? 'border-yellow-300 bg-yellow-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  } ${setting.critical ? 'border-l-4 border-l-red-500' : ''}`}
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h5 className="text-sm font-medium text-gray-900">{setting.name}</h5>
                        {setting.critical && (
                          <span className="ml-2 inline-flex items-center rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                            ⚠️ Critical
                          </span>
                        )}
                        {pendingChanges.has(setting.id) && (
                          <span className="ml-2 inline-flex items-center rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                            📝 Modified
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{setting.description}</p>
                    </div>
                  </div>
                  <div className="mt-3">{renderSettingControl(setting)}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Save Changes Section */}
      {pendingChanges.size > 0 && (
        <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-yellow-900">Unsaved Changes</h4>
              <p className="mt-1 text-sm text-yellow-700">
                You have {pendingChanges.size} pending configuration changes that need to be saved.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={resetChanges}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                ↩️ Reset
              </button>
              <button
                onClick={saveChanges}
                className="inline-flex items-center rounded-md border border-transparent bg-yellow-600 px-3 py-2 text-sm font-medium leading-4 text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              >
                💾 Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Critical Action Confirmation Dialog */}
      {confirmDialog.setting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center">
              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <span className="text-xl">⚠️</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Confirm Critical Action</h3>
            </div>
            <p className="mb-6 text-sm text-gray-600">
              You are about to {confirmDialog.action} <strong>{confirmDialog.setting.name}</strong>.
              This is a critical system setting that may affect all users. Are you sure you want to
              continue?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDialog({ setting: null, action: '' })}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmCriticalChange}
                className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm font-medium leading-4 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Confirm {confirmDialog.action}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminControlPanel;
