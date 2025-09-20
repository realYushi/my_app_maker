import { AdminSystemDisplay, AdminReportDisplay } from '../features/generation/admin';
import { AdminSystemForm, AdminReportForm } from '../services/components/AdminComponents';

export const adminComponentMap = {
  admin: AdminSystemDisplay,
  administrator: AdminSystemDisplay,
  system: AdminSystemDisplay,
  configuration: AdminSystemDisplay,
  config: AdminSystemDisplay,
  settings: AdminSystemDisplay,
  control: AdminSystemDisplay,
  panel: AdminSystemDisplay,
  dashboard: AdminSystemDisplay,
  overview: AdminSystemDisplay,
  metrics: AdminSystemDisplay,
  monitoring: AdminSystemDisplay,
  health: AdminSystemDisplay,
  log: AdminReportDisplay,
  logs: AdminReportDisplay,
  report: AdminReportDisplay,
  reports: AdminReportDisplay,
  analytics: AdminReportDisplay,
  chart: AdminReportDisplay,
  visualization: AdminReportDisplay,
  data: AdminReportDisplay,
  admin_form: AdminSystemForm,
  report_form: AdminReportForm,
  monitor: AdminSystemDisplay,
};
