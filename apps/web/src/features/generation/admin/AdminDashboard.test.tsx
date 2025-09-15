import { describe, it, expect } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdminDashboard from './AdminDashboard'
import type { Entity } from '@mini-ai-app-builder/shared-types'

const mockEntity: Entity = {
  name: 'System Admin',
  attributes: ['dashboard', 'metrics', 'admin', 'overview']
}

// Mock Math.random for consistent test results
const mockMath = Object.create(global.Math)
mockMath.random = () => 0.5
global.Math = mockMath

describe('AdminDashboard', () => {
  it('renders dashboard with title and badge', () => {
    render(<AdminDashboard entity={mockEntity} />)
    expect(screen.getByText('System Admin Dashboard')).toBeInTheDocument()
    expect(screen.getByText('⚙️ System Admin')).toBeInTheDocument()
  })

  it('displays time range selector', () => {
    render(<AdminDashboard entity={mockEntity} />)
    const timeRangeSelect = screen.getByRole('combobox')
    expect(timeRangeSelect).toBeInTheDocument()
    expect(screen.getByText('Last 7 Days')).toBeInTheDocument()
  })

  it('shows key metrics cards', () => {
    render(<AdminDashboard entity={mockEntity} />)
    expect(screen.getByText('Total Users')).toBeInTheDocument()
    expect(screen.getByText('Active Sessions')).toBeInTheDocument()
    expect(screen.getByText('System Load')).toBeInTheDocument()
    expect(screen.getByText('Error Rate')).toBeInTheDocument()
    expect(screen.getByText('Revenue')).toBeInTheDocument()
    expect(screen.getByText('Storage Used')).toBeInTheDocument()
  })

  it('displays metric values and trends', () => {
    render(<AdminDashboard entity={mockEntity} />)
    expect(screen.getByText('12,847')).toBeInTheDocument() // Total Users
    expect(screen.getByText('2,341')).toBeInTheDocument() // Active Sessions
    expect(screen.getByText('67%')).toBeInTheDocument() // System Load
  })

  it('shows trend indicators', () => {
    render(<AdminDashboard entity={mockEntity} />)
    expect(screen.getByText('+12.3%')).toBeInTheDocument()
    expect(screen.getByText('+5.2%')).toBeInTheDocument()
    expect(screen.getByText('-3.1%')).toBeInTheDocument()
  })

  it('displays user growth chart section', () => {
    render(<AdminDashboard entity={mockEntity} />)
    expect(screen.getByText('📊 User Growth Trend')).toBeInTheDocument()
  })

  it('shows system health chart', () => {
    render(<AdminDashboard entity={mockEntity} />)
    expect(screen.getByText('🏥 System Health')).toBeInTheDocument()
    expect(screen.getByText('CPU')).toBeInTheDocument()
    expect(screen.getByText('Memory')).toBeInTheDocument()
    expect(screen.getByText('Disk')).toBeInTheDocument()
    expect(screen.getByText('Network')).toBeInTheDocument()
  })

  it('displays recent activity feed', () => {
    render(<AdminDashboard entity={mockEntity} />)
    expect(screen.getByText('⚡ Recent System Activity')).toBeInTheDocument()
    expect(screen.getAllByText(/Database backup completed|New user registered|Failed login attempt/).length).toBeGreaterThan(0)
  })

  it('shows quick action buttons', () => {
    render(<AdminDashboard entity={mockEntity} />)
    expect(screen.getByText('🔄 Refresh Data')).toBeInTheDocument()
    expect(screen.getByText('📊 Export Report')).toBeInTheDocument()
    expect(screen.getByText('⚙️ System Settings')).toBeInTheDocument()
    expect(screen.getByText('🚨 Emergency Actions')).toBeInTheDocument()
  })

  it('handles time range selection', async () => {
    const user = userEvent.setup()
    render(<AdminDashboard entity={mockEntity} />)

    const timeRangeSelect = screen.getByRole('combobox')

    await act(async () => {
      await user.selectOptions(timeRangeSelect, '30d')
    })

    expect(timeRangeSelect).toHaveValue('30d')
  })

  it('displays activity timestamps', () => {
    render(<AdminDashboard entity={mockEntity} />)
    expect(screen.getAllByText(/\d+ min ago/).length).toBeGreaterThan(0)
  })

  it('shows activity types with proper styling', () => {
    render(<AdminDashboard entity={mockEntity} />)
    // Should show activity type badges
    expect(screen.getAllByText(/success|info|warning|error/).length).toBeGreaterThan(0)
  })

  it('displays metric icons', () => {
    render(<AdminDashboard entity={mockEntity} />)
    expect(screen.getByText('👥')).toBeInTheDocument() // Users icon
    expect(screen.getByText('🟢')).toBeInTheDocument() // Active sessions icon
    expect(screen.getByText('⚡')).toBeInTheDocument() // System load icon
    expect(screen.getByText('💰')).toBeInTheDocument() // Revenue icon
  })

  it('renders correctly with different entity names', () => {
    const customEntity: Entity = {
      name: 'Custom Dashboard',
      attributes: ['admin']
    }
    render(<AdminDashboard entity={customEntity} />)
    expect(screen.getByText('Custom Dashboard Dashboard')).toBeInTheDocument()
  })
})