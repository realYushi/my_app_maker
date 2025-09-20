import { createDomainPlugin } from './pluginManager';
import { DomainContext } from '../contextDetectionService';
import { ecommerceComponentMap } from '../../config/ecommerceComponents';

export const ecommercePlugin = createDomainPlugin(DomainContext.ECOMMERCE, ecommerceComponentMap);
