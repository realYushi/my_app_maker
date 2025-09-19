import { GenerationResult } from "@mini-ai-app-builder/shared-types";
import { config } from "../config";
import { errorLoggingService } from "./error-logging.service";
import OpenAI from 'openai';

export class AIServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public originalError?: Error
  ) {
    super(message);
    this.name = "AIServiceError";
  }
}

export class AIService {
  private readonly openai: OpenAI | null;
  private readonly model: string;
  private readonly timeout: number;

  constructor() {
    // For development/testing, allow mock mode when API key is not set
    if (!config.gemini.apiKey || config.gemini.apiKey === "test_key") {
      console.warn("Running in mock mode - OpenRouter API key not configured");
      this.openai = null;
      this.model = "";
      this.timeout = 5000;
    } else {
      this.openai = new OpenAI({
        baseURL: config.gemini.baseUrl,
        apiKey: config.gemini.apiKey,
        defaultHeaders: {
          "HTTP-Referer": "https://my-app-maker-frontend.onrender.com",
          "X-Title": "Mini AI App Builder",
        },
      });
      this.model = config.gemini.model;
      this.timeout = config.gemini.timeout;
    }
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
    const startTime = Date.now();

    if (!userText || userText.trim().length === 0) {
      throw new AIServiceError("User text input is required", 400);
    }

    // Mock mode for testing
    if (!this.openai) {
      const result = this.getMockResponse(userText);
      const duration = Date.now() - startTime;
      console.log(`AI Service (Mock) - Request completed in ${duration}ms`);
      return result;
    }

    try {
      const completion = await this.openai.chat.completions.create({
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
        max_tokens: 2000,
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new AIServiceError("Empty response from OpenRouter API", 500);
      }

      // Parse the JSON response
      let parsedResult: GenerationResult;
      try {
        parsedResult = JSON.parse(content.trim());
      } catch (parseError) {
        throw new AIServiceError(
          "Invalid JSON response from OpenRouter API",
          500,
          parseError as Error
        );
      }

      // Validate the structure
      this.validateGenerationResult(parsedResult);

      const duration = Date.now() - startTime;
      console.log(`AI Service - Request completed in ${duration}ms`);

      return parsedResult;
    } catch (error) {
      // Log the error for analysis
      await errorLoggingService.logGenerationFailure({
        userInput: userText,
        error: error instanceof Error ? error : new Error("Unknown error"),
        llmResponseRaw: undefined,
      });

      if (error instanceof AIServiceError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new AIServiceError(
          `OpenRouter API request failed: ${error.message}`,
          500,
          error
        );
      }

      throw new AIServiceError("Unknown error occurred", 500);
    }
  }

  private getMockResponse(userText: string): GenerationResult {
    // Generate a mock response based on the user input
    const lowerText = userText.toLowerCase();

    let appName = "My App";
    let entities = [
      { name: "User", attributes: ["id", "name", "email", "createdAt"] },
      { name: "Item", attributes: ["id", "title", "description", "status"] },
    ];
    let userRoles = [
      {
        name: "Admin",
        description: "Can manage all aspects of the application",
      },
      { name: "User", description: "Can interact with their own data" },
    ];
    let features = [
      {
        name: "User Management",
        description: "Create and manage user accounts",
      },
      { name: "Data Management", description: "Add, edit, and delete items" },
      {
        name: "Authentication",
        description: "Secure login and logout functionality",
      },
    ];

    // Customize based on common keywords
    if (lowerText.includes("todo") || lowerText.includes("task")) {
      appName = "Task Manager";
      entities = [
        { name: "User", attributes: ["id", "name", "email", "createdAt"] },
        {
          name: "Task",
          attributes: [
            "id",
            "title",
            "description",
            "status",
            "dueDate",
            "priority",
          ],
        },
        {
          name: "Project",
          attributes: ["id", "name", "description", "createdAt"],
        },
      ];
      userRoles = [
        { name: "Admin", description: "Can manage all tasks and projects" },
        {
          name: "User",
          description: "Can manage their own tasks and projects",
        },
      ];
      features = [
        { name: "Task Creation", description: "Create and assign tasks" },
        {
          name: "Task Management",
          description: "Update task status and priority",
        },
        {
          name: "Project Organization",
          description: "Group tasks into projects",
        },
        {
          name: "Due Date Tracking",
          description: "Set and track task deadlines",
        },
      ];
    } else if (
      lowerText.includes("ecommerce") ||
      lowerText.includes("shop") ||
      lowerText.includes("store")
    ) {
      appName = "E-commerce Store";
      entities = [
        {
          name: "User",
          attributes: ["id", "name", "email", "address", "phone"],
        },
        {
          name: "Product",
          attributes: [
            "id",
            "name",
            "description",
            "price",
            "category",
            "inventory",
          ],
        },
        {
          name: "Order",
          attributes: ["id", "userId", "total", "status", "createdAt"],
        },
        {
          name: "OrderItem",
          attributes: ["id", "orderId", "productId", "quantity", "price"],
        },
      ];
      userRoles = [
        {
          name: "Admin",
          description: "Can manage products, orders, and users",
        },
        {
          name: "Customer",
          description: "Can browse products and place orders",
        },
      ];
      features = [
        { name: "Product Catalog", description: "Browse and search products" },
        {
          name: "Shopping Cart",
          description: "Add items to cart and checkout",
        },
        {
          name: "Order Management",
          description: "Track order status and history",
        },
        {
          name: "User Authentication",
          description: "Secure user registration and login",
        },
      ];
    }

    return {
      appName,
      entities,
      userRoles,
      features,
    };
  }

  private validateGenerationResult(result: any): void {
    if (!result || typeof result !== "object") {
      throw new AIServiceError("Invalid response structure from OpenRouter", 500);
    }

    const required = ["appName", "entities", "userRoles", "features"];
    for (const field of required) {
      if (!(field in result)) {
        throw new AIServiceError(`Missing required field: ${field}`, 500);
      }
    }

    if (
      typeof result.appName !== "string" ||
      result.appName.trim().length === 0
    ) {
      throw new AIServiceError("Invalid appName in OpenRouter response", 500);
    }

    if (!Array.isArray(result.entities) || result.entities.length === 0) {
      throw new AIServiceError("Invalid entities in OpenRouter response", 500);
    }

    if (!Array.isArray(result.userRoles) || result.userRoles.length === 0) {
      throw new AIServiceError("Invalid userRoles in OpenRouter response", 500);
    }

    if (!Array.isArray(result.features) || result.features.length === 0) {
      throw new AIServiceError("Invalid features in OpenRouter response", 500);
    }
  }
}

export const aiService = new AIService();
