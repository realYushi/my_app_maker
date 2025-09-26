import React, { useState, useEffect } from 'react';
import type { Entity } from '@mini-ai-app-builder/shared-types';

interface SystemMetricsProps {
  entity: Entity;
}

interface SystemStat {
  label: string;
  value: string;
  rawValue: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  history: number[];
}

const SystemMetrics = ({ entity }: SystemMetricsProps): React.ReactElement => {
  const [refreshInterval, setRefreshInterval] = useState('30s');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Mock system metrics that update over time
  const [metrics, setMetrics] = useState<SystemStat[]>([
    {
      label: 'CPU Usage',
      value: '67%',
      rawValue: 67,
      unit: '%',
      status: 'healthy',
      trend: 'stable',
      history: [65, 68, 70, 67, 65, 67],
    },
    {
      label: 'Memory Usage',
      value: '8.2 GB',
      rawValue: 82,
      unit: '%',
      status: 'warning',
      trend: 'up',
      history: [75, 78, 80, 82, 84, 82],
    },
    {
      label: 'Disk Usage',
      value: '234 GB',
      rawValue: 45,
      unit: '%',
      status: 'healthy',
      trend: 'up',
      history: [40, 42, 43, 44, 45, 45],
    },
    {
      label: 'Network I/O',
      value: '127 MB/s',
      rawValue: 127,
      unit: 'MB/s',
      status: 'healthy',
      trend: 'down',
      history: [140, 135, 130, 128, 125, 127],
    },
    {
      label: 'Active Connections',
      value: '1,847',
      rawValue: 1847,
      unit: 'conn',
      status: 'healthy',
      trend: 'up',
      history: [1820, 1835, 1840, 1845, 1850, 1847],
    },
    {
      label: 'Response Time',
      value: '245ms',
      rawValue: 245,
      unit: 'ms',
      status: 'healthy',
      trend: 'down',
      history: [280, 270, 260, 250, 240, 245],
    },
    {
      label: 'Error Rate',
      value: '0.12%',
      rawValue: 0.12,
      unit: '%',
      status: 'healthy',
      trend: 'stable',
      history: [0.15, 0.13, 0.11, 0.12, 0.11, 0.12],
    },
    {
      label: 'Queue Depth',
      value: '23',
      rawValue: 23,
      unit: 'jobs',
      status: 'healthy',
      trend: 'down',
      history: [30, 28, 26, 24, 22, 23],
    },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setMetrics(prevMetrics =>
        prevMetrics.map(metric => {
          // Simulate small random changes
          const change = (Math.random() - 0.5) * 10;
          const newValue = Math.max(0, metric.rawValue + change);
          const newHistory = [...metric.history.slice(1), newValue];

          // Determine status based on metric type and value
          let status: 'healthy' | 'warning' | 'critical' = 'healthy';
          if (metric.label === 'CPU Usage' && newValue > 80) status = 'warning';
          if (metric.label === 'CPU Usage' && newValue > 95) status = 'critical';
          if (metric.label === 'Memory Usage' && newValue > 85) status = 'warning';
          if (metric.label === 'Memory Usage' && newValue > 95) status = 'critical';
          if (metric.label === 'Error Rate' && newValue > 1) status = 'warning';
          if (metric.label === 'Error Rate' && newValue > 5) status = 'critical';
          if (metric.label === 'Response Time' && newValue > 500) status = 'warning';
          if (metric.label === 'Response Time' && newValue > 1000) status = 'critical';

          // Determine trend
          const prevValue = metric.history[metric.history.length - 1];
          let trend: 'up' | 'down' | 'stable' = 'stable';
          if (newValue > prevValue + 2) trend = 'up';
          if (newValue < prevValue - 2) trend = 'down';

          return {
            ...metric,
            rawValue: newValue,
            value: formatValue(metric.label, newValue, metric.unit),
            status,
            trend,
            history: newHistory,
          };
        }),
      );
    }, getRefreshIntervalMs(refreshInterval));

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const formatValue = (label: string, value: number, unit: string): string => {
    if (label === 'Memory Usage') return `${(value / 10).toFixed(1)} GB`;
    if (label === 'Disk Usage') return `${Math.round(value * 5)} GB`;
    if (label === 'Network I/O') return `${Math.round(value)} MB/s`;
    if (label === 'Active Connections') return `${Math.round(value).toLocaleString()}`;
    if (label === 'Response Time') return `${Math.round(value)}ms`;
    if (label === 'Error Rate') return `${value.toFixed(2)}%`;
    if (label === 'Queue Depth') return `${Math.round(value)}`;
    return `${Math.round(value)}${unit}`;
  };

  const getRefreshIntervalMs = (interval: string): number => {
    switch (interval) {
      case '5s':
        return 5000;
      case '10s':
        return 10000;
      case '30s':
        return 30000;
      case '1m':
        return 60000;
      default:
        return 30000;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '↗️';
      case 'down':
        return '↘️';
      default:
        return '➡️';
    }
  };

  const getProgressBarColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="flex items-center text-lg font-medium text-gray-900">
          <span className="mr-2 h-2 w-2 rounded-full bg-blue-500"></span>
          {entity.name} Metrics
        </h3>
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
            📊 System Monitor
          </span>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Auto-refresh:</label>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={e => setAutoRefresh(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <select
              value={refreshInterval}
              onChange={e => setRefreshInterval(e.target.value)}
              disabled={!autoRefresh}
              className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="5s">5s</option>
              <option value="10s">10s</option>
              <option value="30s">30s</option>
              <option value="1m">1m</option>
            </select>
          </div>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="mb-6 rounded-lg bg-gray-50 p-4">
        <h4 className="mb-3 text-sm font-medium text-gray-900">System Health Overview</h4>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-600">
              {metrics.filter(m => m.status === 'healthy').length} Healthy
            </span>
          </div>
          <div className="flex items-center">
            <div className="mr-2 h-3 w-3 rounded-full bg-yellow-500"></div>
            <span className="text-sm text-gray-600">
              {metrics.filter(m => m.status === 'warning').length} Warning
            </span>
          </div>
          <div className="flex items-center">
            <div className="mr-2 h-3 w-3 rounded-full bg-red-500"></div>
            <span className="text-sm text-gray-600">
              {metrics.filter(m => m.status === 'critical').length} Critical
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-sm"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{metric.label}</span>
              <span className={`rounded-full px-2 py-1 text-xs ${getStatusColor(metric.status)}`}>
                {getTrendIcon(metric.trend)}
              </span>
            </div>

            <div className="mb-2 text-xl font-bold text-gray-900">{metric.value}</div>

            {/* Progress bar for percentage metrics */}
            {metric.unit === '%' && (
              <div className="mb-3">
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className={`${getProgressBarColor(metric.status)} h-2 rounded-full transition-all`}
                    style={{ width: `${Math.min(100, metric.rawValue)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Mini sparkline chart */}
            <div className="flex h-8 items-end space-x-1">
              {metric.history.map((value, historyIndex) => {
                const maxValue = Math.max(...metric.history);
                const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
                return (
                  <div
                    key={historyIndex}
                    className={`flex-1 ${getProgressBarColor(metric.status)} opacity-60 transition-all`}
                    style={{ height: `${height}%`, minHeight: '2px' }}
                  />
                );
              })}
            </div>

            <div className={`mt-2 rounded px-2 py-1 text-xs ${getStatusColor(metric.status)}`}>
              {metric.status.toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      {/* System Actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={() =>
            setMetrics(prev => prev.map(m => ({ ...m, history: m.history.map(() => m.rawValue) })))
          }
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          🔄 Refresh Metrics
        </button>
        <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          📈 View Detailed Charts
        </button>
        <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          📊 Export Data
        </button>
        <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          ⚠️ Set Alerts
        </button>
      </div>
    </div>
  );
};

export default SystemMetrics;
