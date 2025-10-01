import React from 'react';
import type { Entity } from '@mini-ai-app-builder/shared-types';
import DataVisualization from './DataVisualization';

interface AdminReportDisplayProps {
  entity: Entity;
}

const AdminReportDisplay = ({ entity }: AdminReportDisplayProps): React.ReactElement => {
  return (
    <div className="rounded-lg border border-l-4 border-gray-200 border-l-indigo-500 bg-white p-6 transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center text-lg font-medium text-gray-900">
          <span className="mr-2 h-2 w-2 rounded-full bg-indigo-500"></span>
          {entity.name}
        </h3>
        <span className="inline-flex items-center rounded bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800">
          📊 Analytics & Reports
        </span>
      </div>
      <div className="mb-3 text-sm text-gray-600">
        Advanced analytics dashboard with interactive charts, data visualization, and comprehensive
        reporting capabilities.
      </div>
      <DataVisualization entity={entity} />
    </div>
  );
};

export default AdminReportDisplay;
