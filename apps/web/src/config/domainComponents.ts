import { ecommerceComponentMap } from './ecommerceComponents';
import { userManagementComponentMap } from './userManagementComponents';
import { adminComponentMap } from './adminComponents';
import { DomainContext } from '../services/contextDetectionService';

export const domainComponentMaps = {
  [DomainContext.ECOMMERCE]: ecommerceComponentMap,
  [DomainContext.USER_MANAGEMENT]: userManagementComponentMap,
  [DomainContext.ADMIN]: adminComponentMap,
};
