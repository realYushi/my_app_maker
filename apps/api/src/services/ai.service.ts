import { GenerationResult } from '@mini-ai-app-builder/shared-types';
import { config } from '../config';
import { errorLoggingService } from './error-logging.service';

export interface GeminiRequest {
  contents: Array<{
    parts: Array<{
      text: string;
    }>;
  }>;
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
  };
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export class AIServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'AIServiceError';
  }
}

export class AIService {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly model: string;
  private readonly timeout: number;

  constructor() {
    if (!config.gemini.apiKey) {
      throw new AIServiceError('Gemini API key is required', 500);
    }

    this.baseUrl = config.gemini.baseUrl;
    this.apiKey = config.gemini.apiKey;
    this.model = config.gemini.model;
    this.timeout = config.gemini.timeout;
  }

  private getExtractionPrompt(): string {
    return `You are an expert system analyst. Extract structured requirements from user text descriptions.

IMPORTANT: You must respond with ONLY a valid JSON object in the exact format specified below. Do not include any explanatory text, markdown formatting, or code blocks.

Required JSON format:
{
  "appName": "string - descriptive name for the application",
  "entities": [
    {
      "name": "string - entity name (e.g., User, Product, Order)",
      "attributes": ["array of string attributes for this entity"]
    }
  ],
  "userRoles": [
    {
      "name": "string - role name (e.g., Admin, Customer, Manager)",
      "description": "string - what this role can do"
    }
  ],
  "features": [
    {
      "name": "string - feature name",
      "description": "string - what this feature does"
    }
  ]
}

Guidelines:
- Extract 2-5 main entities with 3-7 attributes each
- Identify 2-4 user roles with clear descriptions
- Define 3-8 key features that the app should have
- If information is missing, make reasonable assumptions based on common patterns
- Use clear, professional naming conventions

Respond with only the JSON object, no other text.`;
  }

  async extractRequirements(userText: string): Promise<GenerationResult> {
    if (!userText || userText.trim().length === 0) {
      throw new AIServiceError('User text input is required', 400);
    }

    const requestBody: GeminiRequest = {
      contents: [
        {
          parts: [{
            text: `${this.getExtractionPrompt()}\n\nUser Request: ${userText.trim()}`
          }]
        }
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2000
      }
    };

    let timeoutId: NodeJS.Timeout | undefined;

    try {
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new AIServiceError(
          `Gemini API error: ${response.status} ${response.statusText}`,
          response.status
        );
      }

      const data = await response.json() as GeminiResponse;

      if (!data.candidates || data.candidates.length === 0) {
        throw new AIServiceError('No response from Gemini API', 500);
      }

      const content = data.candidates[0].content.parts[0].text;
      if (!content) {
        throw new AIServiceError('Empty response from Gemini API', 500);
      }

      // Parse the JSON response
      let parsedResult: GenerationResult;
      try {
        parsedResult = JSON.parse(content.trim());
      } catch (parseError) {
        throw new AIServiceError(
          'Invalid JSON response from Gemini API',
          500,
          parseError as Error
        );
      }

      // Validate the structure
      this.validateGenerationResult(parsedResult);

      return parsedResult;

    } catch (error) {
      // Log the error for analysis
      await errorLoggingService.logGenerationFailure({
        userInput: userText,
        error: error instanceof Error ? error : new Error('Unknown error'),
        llmResponseRaw: undefined
      });

      if (error instanceof AIServiceError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new AIServiceError('Gemini API request timeout', 504, error);
        }
        throw new AIServiceError(
          `Gemini API request failed: ${error.message}`,
          500,
          error
        );
      }

      throw new AIServiceError('Unknown error occurred', 500);
    } finally {
      // Always clear the timeout to prevent Jest open handles
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }

  private validateGenerationResult(result: any): void {
    if (!result || typeof result !== 'object') {
      throw new AIServiceError('Invalid response structure from Gemini', 500);
    }

    const required = ['appName', 'entities', 'userRoles', 'features'];
    for (const field of required) {
      if (!(field in result)) {
        throw new AIServiceError(`Missing required field: ${field}`, 500);
      }
    }

    if (typeof result.appName !== 'string' || result.appName.trim().length === 0) {
      throw new AIServiceError('Invalid appName in Gemini response', 500);
    }

    if (!Array.isArray(result.entities) || result.entities.length === 0) {
      throw new AIServiceError('Invalid entities in Gemini response', 500);
    }

    if (!Array.isArray(result.userRoles) || result.userRoles.length === 0) {
      throw new AIServiceError('Invalid userRoles in Gemini response', 500);
    }

    if (!Array.isArray(result.features) || result.features.length === 0) {
      throw new AIServiceError('Invalid features in Gemini response', 500);
    }
  }
}

export const aiService = new AIService();