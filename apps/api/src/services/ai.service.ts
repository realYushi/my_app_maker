import { GenerationResult } from '@mini-ai-app-builder/shared-types';
import { config } from '../config';
import { errorLoggingService } from './error-logging.service';

export interface LLMRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
}

export interface LLMResponse {
  choices: Array<{
    message: {
      content: string;
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
    if (!config.openai.apiKey) {
      throw new AIServiceError('OpenAI API key is required', 500);
    }

    this.baseUrl = config.openai.baseUrl;
    this.apiKey = config.openai.apiKey;
    this.model = config.openai.model;
    this.timeout = config.openai.timeout;
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

    const requestBody: LLMRequest = {
      model: this.model,
      messages: [
        {
          role: 'system',
          content: this.getExtractionPrompt()
        },
        {
          role: 'user',
          content: userText.trim()
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new AIServiceError(
          `LLM API error: ${response.status} ${response.statusText}`,
          response.status
        );
      }

      const data = await response.json() as LLMResponse;

      if (!data.choices || data.choices.length === 0) {
        throw new AIServiceError('No response from LLM API', 500);
      }

      const content = data.choices[0].message.content;
      if (!content) {
        throw new AIServiceError('Empty response from LLM API', 500);
      }

      // Parse the JSON response
      let parsedResult: GenerationResult;
      try {
        parsedResult = JSON.parse(content.trim());
      } catch (parseError) {
        throw new AIServiceError(
          'Invalid JSON response from LLM API',
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
          throw new AIServiceError('LLM API request timeout', 504, error);
        }
        throw new AIServiceError(
          `LLM API request failed: ${error.message}`,
          500,
          error
        );
      }

      throw new AIServiceError('Unknown error occurred', 500);
    }
  }

  private validateGenerationResult(result: any): void {
    if (!result || typeof result !== 'object') {
      throw new AIServiceError('Invalid response structure from LLM', 500);
    }

    const required = ['appName', 'entities', 'userRoles', 'features'];
    for (const field of required) {
      if (!(field in result)) {
        throw new AIServiceError(`Missing required field: ${field}`, 500);
      }
    }

    if (typeof result.appName !== 'string' || result.appName.trim().length === 0) {
      throw new AIServiceError('Invalid appName in LLM response', 500);
    }

    if (!Array.isArray(result.entities) || result.entities.length === 0) {
      throw new AIServiceError('Invalid entities in LLM response', 500);
    }

    if (!Array.isArray(result.userRoles) || result.userRoles.length === 0) {
      throw new AIServiceError('Invalid userRoles in LLM response', 500);
    }

    if (!Array.isArray(result.features) || result.features.length === 0) {
      throw new AIServiceError('Invalid features in LLM response', 500);
    }
  }
}

export const aiService = new AIService();