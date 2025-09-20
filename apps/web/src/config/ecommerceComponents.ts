import {
  EcommerceProductDisplay,
  EcommerceCartDisplay,
  EcommerceCheckoutDisplay,
} from '../features/generation/ecommerce';
import {
  EcommerceOrderForm,
  EcommerceCustomerForm,
} from '../services/components/EcommerceComponents';

export const ecommerceComponentMap = {
  product: EcommerceProductDisplay,
  products: EcommerceProductDisplay,
  item: EcommerceProductDisplay,
  items: EcommerceProductDisplay,
  catalog: EcommerceProductDisplay,
  inventory: EcommerceProductDisplay,
  cart: EcommerceCartDisplay,
  basket: EcommerceCartDisplay,
  shopping_cart: EcommerceCartDisplay,
  order: EcommerceOrderForm,
  orders: EcommerceOrderForm,
  purchase: EcommerceOrderForm,
  checkout: EcommerceCheckoutDisplay,
  payment: EcommerceCheckoutDisplay,
  billing: EcommerceCheckoutDisplay,
  customer: EcommerceCustomerForm,
  customers: EcommerceCustomerForm,
  client: EcommerceCustomerForm,
  buyer: EcommerceCustomerForm,
  shopper: EcommerceCustomerForm,
};
