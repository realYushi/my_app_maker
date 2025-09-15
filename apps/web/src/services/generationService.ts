import type { GenerationResult } from '@mini-ai-app-builder/shared-types'
import { configService } from '../config'

interface GenerationRequest {
  prompt: string
}

class GenerationService {
  private readonly REQUEST_TIMEOUT = 30000; // 30 seconds
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // 1 second

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async generateApp(description: string): Promise<GenerationResult> {
    let lastError: Error = new Error('Unknown error occurred');

    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        const response = await this.fetchWithTimeout(
          `${configService.apiUrl}/api/generate`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: description } as GenerationRequest)
          },
          this.REQUEST_TIMEOUT
        );

        if (!response.ok) {
          // Handle specific HTTP status codes
          if (response.status === 429) {
            throw new Error('Rate limit exceeded. Please wait a moment and try again.');
          }
          if (response.status >= 500) {
            throw new Error('Server error occurred. Please try again later.');
          }

          // Try to get error message from response
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Request failed with status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error occurred');

        // Don't retry on client errors (4xx) except 429
        if (error instanceof Error && error.message.includes('status: 4') && !error.message.includes('429')) {
          throw lastError;
        }

        // Network/timeout errors - retry with exponential backoff
        if (attempt < this.MAX_RETRIES) {
          const delay = this.RETRY_DELAY * Math.pow(2, attempt - 1);
          await this.delay(delay);
          continue;
        }
      }
    }

    // All retries failed
    if (lastError.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection and try again.');
    }
    if (lastError instanceof TypeError && lastError.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the server. Please check your connection.');
    }
    throw lastError;
  }
}

export const generationService = new GenerationService()