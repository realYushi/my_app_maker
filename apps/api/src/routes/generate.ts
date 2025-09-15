import { Router, Request, Response } from 'express';
import { GenerationResult } from '@mini-ai-app-builder/shared-types';

export const generateRouter = Router();

generateRouter.post('/generate', (req: Request, res: Response) => {
  // Hardcoded mock response matching GenerationResult interface
  const mockResponse: GenerationResult = {
    appName: 'Sample Todo App',
    entities: [
      {
        name: 'Task',
        attributes: ['id', 'title', 'description', 'completed', 'createdAt']
      },
      {
        name: 'User',
        attributes: ['id', 'username', 'email', 'createdAt']
      }
    ],
    userRoles: [
      {
        name: 'Admin',
        description: 'Full access to all features and user management'
      },
      {
        name: 'User',
        description: 'Can create and manage their own tasks'
      }
    ],
    features: [
      {
        name: 'Task Management',
        description: 'Create, edit, delete and mark tasks as complete'
      },
      {
        name: 'User Authentication',
        description: 'Login and registration system for users'
      },
      {
        name: 'Task Filtering',
        description: 'Filter tasks by status, date, or other criteria'
      }
    ]
  };

  res.status(200).json(mockResponse);
});