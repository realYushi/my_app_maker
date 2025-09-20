import { pluginManager } from './pluginManager';
import { ecommercePlugin } from './ecommercePlugin';
import { userManagementPlugin } from './userManagementPlugin';
import { adminPlugin } from './adminPlugin';

export function initializePlugins(): void {
  pluginManager.registerPlugin(ecommercePlugin);
  pluginManager.registerPlugin(userManagementPlugin);
  pluginManager.registerPlugin(adminPlugin);
}
