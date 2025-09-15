// Test data fixtures for E2E tests
export const testFixtures = {
  // E-commerce test data
  ecommerce: {
    detailedPrompt: `Create an e-commerce platform for an online bookstore called "BookHaven".

Features needed:
- Product catalog with books (title, author, price, ISBN, genre, stock)
- Shopping cart with add/remove items
- User accounts with order history
- Search and filter by genre, author, price range
- Book recommendations
- Inventory management for store owners

User roles:
- Customer: Browse, search, buy books
- Store Manager: Manage inventory, view sales
- Admin: Full system access

The platform should have a modern, book-focused design with categories for Fiction, Non-Fiction, Textbooks, and Children's Books.`,

    simplePrompt: 'Make an online store',

    expectedEntities: [
      { name: 'book', type: 'product' },
      { name: 'order', type: 'transaction' },
      { name: 'customer', type: 'user' },
      { name: 'cart', type: 'container' }
    ],

    expectedComponents: ['ProductCard', 'ShoppingCart'],

    mockApiResponse: {
      entities: [
        {
          name: 'book',
          fields: ['title', 'author', 'price', 'isbn', 'genre', 'stock'],
          type: 'product'
        },
        {
          name: 'order',
          fields: ['id', 'customerId', 'total', 'items', 'status'],
          type: 'transaction'
        }
      ],
      roles: ['customer', 'store_manager', 'admin'],
      features: ['product_catalog', 'shopping_cart', 'user_accounts']
    }
  },

  // User management test data
  userManagement: {
    detailedPrompt: `Build a comprehensive user management system for a corporate environment called "CorpConnect".

Features needed:
- Employee profiles with personal info, department, role, skills
- Department organization with managers and team members
- Role-based permissions and access control
- Employee onboarding workflow
- Performance review system
- Time tracking and attendance
- Internal communication tools

User roles:
- Employee: View own profile, submit timesheets
- Manager: Manage team, approve requests, view reports
- HR: Full employee management, onboarding
- Admin: System configuration, user roles

The system should support multiple departments like Engineering, Sales, Marketing, and HR.`,

    simplePrompt: 'Create user management',

    expectedEntities: [
      { name: 'employee', type: 'user' },
      { name: 'department', type: 'organization' },
      { name: 'role', type: 'permission' }
    ],

    expectedComponents: ['UserProfile', 'UserManagementTable'],

    mockApiResponse: {
      entities: [
        {
          name: 'employee',
          fields: ['name', 'email', 'department', 'role', 'skills'],
          type: 'user'
        },
        {
          name: 'department',
          fields: ['name', 'manager', 'budget', 'members'],
          type: 'organization'
        }
      ],
      roles: ['employee', 'manager', 'hr', 'admin'],
      features: ['user_profiles', 'department_management', 'role_permissions']
    }
  },

  // Admin dashboard test data
  admin: {
    detailedPrompt: `Develop an administrative dashboard for a SaaS platform called "CloudMetrics".

Features needed:
- System analytics and performance metrics
- User activity monitoring and usage statistics
- Revenue tracking and subscription management
- Server health monitoring and alerts
- Configuration management for system settings
- Audit logs and security reports
- Backup and data management tools

User roles:
- Support Agent: View user issues, basic analytics
- System Admin: Full system access, configuration
- Finance Manager: Revenue reports, billing
- Security Officer: Audit logs, security monitoring

The dashboard should display real-time metrics, charts, and provide comprehensive system oversight.`,

    simplePrompt: 'Build admin panel',

    expectedEntities: [
      { name: 'metric', type: 'analytics' },
      { name: 'user_activity', type: 'log' },
      { name: 'system_config', type: 'setting' }
    ],

    expectedComponents: ['AdminDashboard'],

    mockApiResponse: {
      entities: [
        {
          name: 'metric',
          fields: ['name', 'value', 'timestamp', 'category'],
          type: 'analytics'
        },
        {
          name: 'user_activity',
          fields: ['userId', 'action', 'timestamp', 'details'],
          type: 'log'
        }
      ],
      roles: ['support_agent', 'system_admin', 'finance_manager', 'security_officer'],
      features: ['analytics_dashboard', 'user_monitoring', 'system_configuration']
    }
  },

  // Restaurant management (from QA validation)
  restaurant: {
    detailedPrompt: `Create a comprehensive restaurant management system for "Bistro Deluxe".

Features needed:
- Menu management with dishes, ingredients, pricing
- Table reservations and seating management
- Order processing from kitchen to service
- Inventory tracking for ingredients and supplies
- Staff scheduling and payroll
- Customer loyalty program
- Sales reporting and analytics

User roles:
- Customer: View menu, make reservations
- Waiter: Take orders, manage tables
- Chef: View orders, manage kitchen
- Manager: Full restaurant operations
- Admin: System configuration

The system should handle peak dining hours efficiently and provide real-time kitchen coordination.`,

    expectedEntities: [
      { name: 'dish', type: 'product' },
      { name: 'reservation', type: 'booking' },
      { name: 'order', type: 'transaction' }
    ]
  }
};

// Helper functions for test data
export const getFixtureByType = (type: 'ecommerce' | 'userManagement' | 'admin' | 'restaurant') => {
  return testFixtures[type];
};

export const getAllDetailedPrompts = () => {
  return Object.values(testFixtures).map(fixture => fixture.detailedPrompt);
};

export const getAllSimplePrompts = () => {
  return Object.values(testFixtures)
    .filter(fixture => fixture.simplePrompt)
    .map(fixture => fixture.simplePrompt);
};