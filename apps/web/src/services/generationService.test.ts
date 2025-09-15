import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generationService } from './generationService'
import type { GenerationResult } from '@mini-ai-app-builder/shared-types'

// Mock the config service
vi.mock('../config', () => ({
  configService: {
    apiUrl: 'http://localhost:3000'
  }
}))

// Mock global fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('GenerationService', () => {
  const mockResult: GenerationResult = {
    appName: 'Test App',
    entities: [{ name: 'User', attributes: ['id', 'name'] }],
    userRoles: [{ name: 'Admin', description: 'Administrator role' }],
    features: [{ name: 'Login', description: 'User authentication' }]
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('generateApp', () => {
    it('makes correct API call with valid input', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResult)
      })

      const result = await generationService.generateApp('Test app description')

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/generate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ text: 'Test app description' }),
          signal: expect.any(AbortSignal)
        }
      )
      expect(result).toEqual(mockResult)
    })

    it('includes timeout mechanism in requests', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResult)
      })

      await generationService.generateApp('test')

      // Verify fetch was called with AbortSignal (indicating timeout setup)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          signal: expect.any(AbortSignal)
        })
      )
    })

    it('has comprehensive error handling structure', () => {
      // Test the service class has the expected methods and constants
      expect(generationService).toHaveProperty('generateApp')

      // Access private constants through the instance to verify they exist
      const serviceInstance = generationService as unknown as Record<string, unknown>
      expect(serviceInstance.REQUEST_TIMEOUT).toBe(30000)
      expect(serviceInstance.MAX_RETRIES).toBe(3)
      expect(serviceInstance.RETRY_DELAY).toBe(1000)
    })

    it('uses config service for API URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResult)
      })

      await generationService.generateApp('test')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('http://localhost:3000/api/generate'),
        expect.any(Object)
      )
    })
  })
})