import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { componentFactory } from '../../../services/componentFactory'
import { DomainContext } from '../../../services/contextDetectionService'
import type { Entity } from '@mini-ai-app-builder/shared-types'

interface ContextDetectionResult {
  primaryContext: DomainContext
  contextScores: any[]
  entityDomainMap: Map<string, DomainContext>
}

const createMockContextResult = (
  entityDomainMap: Map<string, DomainContext>,
  primaryContext: DomainContext = DomainContext.GENERIC
): ContextDetectionResult => ({
  primaryContext,
  contextScores: [],
  entityDomainMap
})

describe('ComponentFactory Integration Tests', () => {
  describe('User Management Component Routing', () => {
    it('routes user entities to UserManagementDisplay', () => {
      const userEntity: Entity = { name: 'user', attributes: ['name', 'email'] }
      const contextResult = createMockContextResult(
        new Map([['user', DomainContext.USER_MANAGEMENT]])
      )

      const Component = componentFactory.getComponent(userEntity, contextResult)
      render(<Component entity={userEntity} />)

      expect(screen.getByText('👤 User Management')).toBeInTheDocument()
    })

    it('routes profile entities to UserManagementDisplay with profile context', () => {
      const profileEntity: Entity = { name: 'profile', attributes: ['avatar', 'bio'] }
      const contextResult = createMockContextResult(
        new Map([['profile', DomainContext.USER_MANAGEMENT]])
      )

      const Component = componentFactory.getComponent(profileEntity, contextResult)
      render(<Component entity={profileEntity} />)

      expect(screen.getByText('👤 User Profile')).toBeInTheDocument()
    })

    it('routes activity entities to UserManagementDisplay with activity context', () => {
      const activityEntity: Entity = { name: 'activity', attributes: ['feed', 'timeline'] }
      const contextResult = createMockContextResult(
        new Map([['activity', DomainContext.USER_MANAGEMENT]])
      )

      const Component = componentFactory.getComponent(activityEntity, contextResult)
      render(<Component entity={activityEntity} />)

      expect(screen.getByText('📊 User Activity')).toBeInTheDocument()
    })

    it('routes role entities to UserRoleDisplay', () => {
      const roleEntity: Entity = { name: 'role', attributes: ['permission', 'access'] }
      const contextResult = createMockContextResult(
        new Map([['role', DomainContext.USER_MANAGEMENT]])
      )

      const Component = componentFactory.getComponent(roleEntity, contextResult)
      render(<Component entity={roleEntity} />)

      expect(screen.getAllByText('🔐 Access Control').length).toBeGreaterThan(0)
    })

    it('routes table entities to UserManagementDisplay with table context', () => {
      const tableEntity: Entity = { name: 'users', attributes: ['table', 'list'] }
      const contextResult = createMockContextResult(
        new Map([['users', DomainContext.USER_MANAGEMENT]])
      )

      const Component = componentFactory.getComponent(tableEntity, contextResult)
      render(<Component entity={tableEntity} />)

      expect(screen.getAllByText('👥 User Directory').length).toBeGreaterThan(0)
    })
  })

  describe('Admin Component Routing', () => {
    it('routes admin entities to AdminSystemDisplay', () => {
      const adminEntity: Entity = { name: 'admin', attributes: ['dashboard', 'overview'] }
      const contextResult = createMockContextResult(
        new Map([['admin', DomainContext.ADMIN]])
      )

      const Component = componentFactory.getComponent(adminEntity, contextResult)
      render(<Component entity={adminEntity} />)

      // Look for admin dashboard content that should be rendered
      expect(screen.getByText('Total Users')).toBeInTheDocument()
      expect(screen.getByText('System Load')).toBeInTheDocument()
    })

    it('routes dashboard entities to AdminSystemDisplay with dashboard context', () => {
      const dashboardEntity: Entity = { name: 'dashboard', attributes: ['metrics', 'overview'] }
      const contextResult = createMockContextResult(
        new Map([['dashboard', DomainContext.ADMIN]])
      )

      const Component = componentFactory.getComponent(dashboardEntity, contextResult)
      render(<Component entity={dashboardEntity} />)

      expect(screen.getByText('⚙️ Admin Dashboard')).toBeInTheDocument()
    })

    it('routes metrics entities to AdminSystemDisplay with metrics context', () => {
      const metricsEntity: Entity = { name: 'metrics', attributes: ['monitoring', 'health'] }
      const contextResult = createMockContextResult(
        new Map([['metrics', DomainContext.ADMIN]])
      )

      const Component = componentFactory.getComponent(metricsEntity, contextResult)
      render(<Component entity={metricsEntity} />)

      expect(screen.getByText('📊 System Metrics')).toBeInTheDocument()
    })

    it('routes control panel entities to AdminSystemDisplay with control context', () => {
      const controlEntity: Entity = { name: 'control', attributes: ['panel', 'settings'] }
      const contextResult = createMockContextResult(
        new Map([['control', DomainContext.ADMIN]])
      )

      const Component = componentFactory.getComponent(controlEntity, contextResult)
      render(<Component entity={controlEntity} />)

      expect(screen.getByText('🎛️ Control Panel')).toBeInTheDocument()
    })

    it('routes analytics entities to AdminReportDisplay', () => {
      const analyticsEntity: Entity = { name: 'analytics', attributes: ['reports', 'data'] }
      const contextResult = createMockContextResult(
        new Map([['analytics', DomainContext.ADMIN]])
      )

      const Component = componentFactory.getComponent(analyticsEntity, contextResult)
      render(<Component entity={analyticsEntity} />)

      expect(screen.getByText('📊 Analytics & Reports')).toBeInTheDocument()
    })
  })

  describe('Fallback Behavior', () => {
    it('falls back to EntityForm for unknown entities', () => {
      const unknownEntity: Entity = { name: 'unknown', attributes: ['mystery'] }
      const contextResult = createMockContextResult(
        new Map([['unknown', DomainContext.GENERIC]])
      )

      const Component = componentFactory.getComponent(unknownEntity, contextResult)
      render(<Component entity={unknownEntity} />)

      // Should render the basic EntityForm
      expect(screen.getByText('unknown')).toBeInTheDocument()
    })

    it('handles entities without domain mapping', () => {
      const unmappedEntity: Entity = { name: 'unmapped', attributes: ['test'] }
      const contextResult = createMockContextResult(new Map())

      const Component = componentFactory.getComponent(unmappedEntity, contextResult)
      render(<Component entity={unmappedEntity} />)

      // Should fall back to EntityForm
      expect(screen.getByText('unmapped')).toBeInTheDocument()
    })
  })

  describe('Component Factory Verification', () => {
    it('verifies user management components are registered', () => {
      expect(componentFactory.verifyUserManagementComponentsRegistered()).toBe(true)
    })

    it('verifies admin components are registered', () => {
      expect(componentFactory.verifyAdminComponentsRegistered()).toBe(true)
    })

    it('verifies all enhanced components are registered', () => {
      expect(componentFactory.verifyAllEnhancedComponentsRegistered()).toBe(true)
    })

    it('counts total registered components correctly', () => {
      const totalComponents = componentFactory.getTotalRegisteredComponents()
      expect(totalComponents).toBeGreaterThan(40) // Should have many registered components
    })

    it('lists available components for each domain', () => {
      const userMgmtComponents = componentFactory.getAvailableComponents(DomainContext.USER_MANAGEMENT)
      const adminComponents = componentFactory.getAvailableComponents(DomainContext.ADMIN)

      expect(userMgmtComponents).toContain('user')
      expect(userMgmtComponents).toContain('role')
      expect(userMgmtComponents).toContain('profile')
      expect(userMgmtComponents).toContain('activity')

      expect(adminComponents).toContain('admin')
      expect(adminComponents).toContain('dashboard')
      expect(adminComponents).toContain('analytics')
      expect(adminComponents).toContain('system')
    })
  })

  describe('Specific Component Detection', () => {
    it('detects when specific components exist for entities', () => {
      const userEntity: Entity = { name: 'user', attributes: [] }
      const roleEntity: Entity = { name: 'role', attributes: [] }
      const adminEntity: Entity = { name: 'admin', attributes: [] }

      const userContext = createMockContextResult(new Map([['user', DomainContext.USER_MANAGEMENT]]))
      const roleContext = createMockContextResult(new Map([['role', DomainContext.USER_MANAGEMENT]]))
      const adminContext = createMockContextResult(new Map([['admin', DomainContext.ADMIN]]))

      expect(componentFactory.hasSpecificComponent(userEntity, userContext)).toBe(true)
      expect(componentFactory.hasSpecificComponent(roleEntity, roleContext)).toBe(true)
      expect(componentFactory.hasSpecificComponent(adminEntity, adminContext)).toBe(true)
    })

    it('returns false for entities without specific components', () => {
      const unknownEntity: Entity = { name: 'unknown_entity', attributes: [] }
      const context = createMockContextResult(new Map([['unknown_entity', DomainContext.GENERIC]]))

      expect(componentFactory.hasSpecificComponent(unknownEntity, context)).toBe(false)
    })
  })
})