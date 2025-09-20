import { createDomainPlugin } from './pluginManager';
import { DomainContext } from '../contextDetectionService';
import { userManagementComponentMap } from '../../config/userManagementComponents';

export const userManagementPlugin = createDomainPlugin(
  DomainContext.USER_MANAGEMENT,
  userManagementComponentMap,
);
