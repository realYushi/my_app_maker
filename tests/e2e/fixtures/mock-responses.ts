// Mock API responses for testing
export const mockApiResponses = {
  // Successful responses for different contexts
  ecommerceSuccess: {
    entities: [
      {
        name: 'book',
        fields: ['title', 'author', 'price', 'isbn', 'genre', 'stock'],
        type: 'product',
      },
      {
        name: 'order',
        fields: ['id', 'customerId', 'total', 'items', 'status', 'createdAt'],
        type: 'transaction',
      },
      {
        name: 'customer',
        fields: ['id', 'name', 'email', 'address', 'loyaltyPoints'],
        type: 'user',
      },
      {
        name: 'cart',
        fields: ['id', 'customerId', 'items', 'total'],
        type: 'container',
      },
    ],
    roles: ['customer', 'store_manager', 'admin'],
    features: ['product_catalog', 'shopping_cart', 'user_accounts', 'order_management'],
    navigation: [
      { name: 'Products', path: '/products' },
      { name: 'Cart', path: '/cart' },
      { name: 'Orders', path: '/orders' },
      { name: 'Account', path: '/account' },
    ],
  },

  userManagementSuccess: {
    entities: [
      {
        name: 'employee',
        fields: ['id', 'name', 'email', 'department', 'role', 'skills', 'hireDate'],
        type: 'user',
      },
      {
        name: 'department',
        fields: ['id', 'name', 'manager', 'budget', 'members'],
        type: 'organization',
      },
      {
        name: 'role',
        fields: ['id', 'name', 'permissions', 'level'],
        type: 'permission',
      },
    ],
    roles: ['employee', 'manager', 'hr', 'admin'],
    features: ['user_profiles', 'department_management', 'role_permissions', 'performance_reviews'],
    navigation: [
      { name: 'Employees', path: '/employees' },
      { name: 'Departments', path: '/departments' },
      { name: 'Roles', path: '/roles' },
      { name: 'Reports', path: '/reports' },
    ],
  },

  adminSuccess: {
    entities: [
      {
        name: 'metric',
        fields: ['id', 'name', 'value', 'timestamp', 'category', 'unit'],
        type: 'analytics',
      },
      {
        name: 'user_activity',
        fields: ['id', 'userId', 'action', 'timestamp', 'details', 'ipAddress'],
        type: 'log',
      },
      {
        name: 'system_config',
        fields: ['id', 'key', 'value', 'description', 'updatedAt'],
        type: 'setting',
      },
    ],
    roles: ['support_agent', 'system_admin', 'finance_manager', 'security_officer'],
    features: ['analytics_dashboard', 'user_monitoring', 'system_configuration', 'audit_logs'],
    navigation: [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Analytics', path: '/analytics' },
      { name: 'Users', path: '/users' },
      { name: 'Settings', path: '/settings' },
    ],
  },

  restaurantSuccess: {
    entities: [
      {
        name: 'dish',
        fields: ['id', 'name', 'description', 'price', 'category', 'ingredients'],
        type: 'product',
      },
      {
        name: 'reservation',
        fields: ['id', 'customerName', 'tableNumber', 'dateTime', 'partySize'],
        type: 'booking',
      },
      {
        name: 'order',
        fields: ['id', 'tableNumber', 'items', 'total', 'status', 'createdAt'],
        type: 'transaction',
      },
    ],
    roles: ['customer', 'waiter', 'chef', 'manager', 'admin'],
    features: ['menu_management', 'reservations', 'order_processing', 'inventory'],
    navigation: [
      { name: 'Menu', path: '/menu' },
      { name: 'Reservations', path: '/reservations' },
      { name: 'Orders', path: '/orders' },
      { name: 'Kitchen', path: '/kitchen' },
    ],
  },

  // Error responses
  apiError: {
    error: 'Internal Server Error',
    message: 'Failed to process the request',
  },

  timeoutError: {
    error: 'Request Timeout',
    message: 'The AI service took too long to respond',
  },

  validationError: {
    error: 'Validation Error',
    message: 'Input exceeds maximum length of 10000 characters',
  },

  aiServiceError: {
    error: 'AI Service Error',
    message: 'Failed to extract structured data from prompt',
  },
};

// Response delay configurations for testing
export const responseDelays = {
  fast: 100,
  normal: 500,
  slow: 2000,
  timeout: 31000, // Above the 30s timeout
};

// Helper function to create mock responses with delays
export const createMockResponse = (responseData: any, delay: number = responseDelays.normal) => {
  return {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(responseData),
    delay,
  };
};

export const createErrorResponse = (
  errorData: any,
  status: number = 500,
  delay: number = responseDelays.normal,
) => {
  return {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(errorData),
    delay,
  };
};
