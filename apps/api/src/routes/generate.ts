import { Router, Request, Response, NextFunction } from 'express';
import { GenerationResult } from '@mini-ai-app-builder/shared-types';
import { aiService, AIServiceError } from '../services/ai.service';

export const generateRouter = Router();

interface GenerateRequest extends Request {
  body: {
    text: string;
  };
}

generateRouter.post('/generate', async (req: GenerateRequest, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    if (!req.body || typeof req.body.text !== 'string') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Request body must contain a "text" field with a string value'
      });
    }

    const userText = req.body.text.trim();
    if (userText.length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Text input cannot be empty'
      });
    }

    if (userText.length > 10000) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Text input is too long (maximum 10,000 characters)'
      });
    }

    // Extract requirements using AI service
    const result: GenerationResult = await aiService.extractRequirements(userText);

    res.status(200).json(result);

  } catch (error) {
    if (error instanceof AIServiceError) {
      return res.status(error.statusCode).json({
        error: error.statusCode >= 500 ? 'Internal Server Error' : 'Bad Request',
        message: error.statusCode >= 500 ? 'Failed to process request' : error.message
      });
    }

    // Pass unexpected errors to centralized error handler
    next(error);
  }
});