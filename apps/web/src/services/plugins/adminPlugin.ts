import { createDomainPlugin } from './pluginManager';
import { DomainContext } from '../contextDetectionService';
import { adminComponentMap } from '../../config/adminComponents';

export const adminPlugin = createDomainPlugin(DomainContext.ADMIN, adminComponentMap);
