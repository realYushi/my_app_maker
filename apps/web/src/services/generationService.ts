import type { GenerationResult } from '../types'

interface GenerationRequest {
  description: string
}

class GenerationService {
  private baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

  async generateApp(description: string): Promise<GenerationResult> {
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description } as GenerationRequest)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      return response.json()
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to the server. Please check your connection.')
      }
      throw error
    }
  }
}

export const generationService = new GenerationService()