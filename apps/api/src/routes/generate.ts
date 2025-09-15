import { Router, Request, Response, NextFunction } from 'express';
import { GenerationResult } from '@mini-ai-app-builder/shared-types';
import { aiService, AIServiceError } from '../services/ai.service';

export const generateRouter = Router();

interface GenerateRequest extends Request {
  body: {
    text: string;
  };
}

// Detect the app domain/type from user input
function detectAppDomain(text: string): string {
  const lowercaseText = text.toLowerCase();

  // Restaurant/Food Service
  if (/restaurant|food|cafe|coffee|menu|order|kitchen|dine|eat|cook|chef|recipe/.test(lowercaseText)) {
    return 'restaurant';
  }

  // E-commerce/Shopping
  if (/shop|store|ecommerce|e-commerce|sell|buy|product|cart|checkout|payment/.test(lowercaseText)) {
    return 'ecommerce';
  }

  // Healthcare/Medical
  if (/health|medical|doctor|patient|clinic|hospital|appointment|prescription/.test(lowercaseText)) {
    return 'healthcare';
  }

  // Pet/Animal Care
  if (/pet|animal|vet|dog|cat|grooming|veterinary/.test(lowercaseText)) {
    return 'pet';
  }

  // Education/Learning
  if (/school|education|learn|student|teacher|course|class|quiz/.test(lowercaseText)) {
    return 'education';
  }

  // Real Estate
  if (/real estate|property|house|apartment|rent|lease|mortgage/.test(lowercaseText)) {
    return 'realestate';
  }

  // Fitness/Gym
  if (/gym|fitness|workout|exercise|trainer|muscle|sport/.test(lowercaseText)) {
    return 'fitness';
  }

  // Travel/Booking
  if (/travel|hotel|booking|flight|vacation|trip|tourism/.test(lowercaseText)) {
    return 'travel';
  }

  // User Management
  if (/user|admin|management|dashboard|login|auth/.test(lowercaseText)) {
    return 'user_management';
  }

  return 'general';
}

// Get context-specific error message
function getContextSpecificMessage(domain: string): string {
  const baseMessage = 'Your description needs more specific details to generate a quality app. Please include:\n\n';

  const domainSpecific: Record<string, {
    features: string;
    users: string;
    actions: string;
    example: string;
  }> = {
    restaurant: {
      features: '• What restaurant features do you need (menu management, ordering, reservations, kitchen operations)?',
      users: '• Who will use it (customers, waitstaff, kitchen staff, managers)?',
      actions: '• What should users be able to do (view menu, place orders, make reservations, track orders)?',
      example: 'Create a restaurant management system with digital menu display, online ordering, table reservations, kitchen order tracking, inventory management, and customer loyalty program.'
    },
    ecommerce: {
      features: '• What e-commerce features do you need (product catalog, shopping cart, payments, inventory)?',
      users: '• Who will use it (customers, sellers, administrators)?',
      actions: '• What should users be able to do (browse products, make purchases, track orders, manage inventory)?',
      example: 'Create an e-commerce platform with product catalog, shopping cart, secure payments, order tracking, inventory management, and customer reviews.'
    },
    healthcare: {
      features: '• What healthcare features do you need (appointments, patient records, prescriptions, billing)?',
      users: '• Who will use it (patients, doctors, nurses, administrators)?',
      actions: '• What should users be able to do (book appointments, view records, prescribe medication, manage billing)?',
      example: 'Create a healthcare management system with appointment scheduling, electronic health records, prescription management, and patient communication portal.'
    },
    pet: {
      features: '• What pet care features do you need (appointments, pet profiles, grooming, veterinary records)?',
      users: '• Who will use it (pet owners, veterinarians, groomers, staff)?',
      actions: '• What should users be able to do (book services, track pet health, manage appointments, view records)?',
      example: 'Create a pet care management system with appointment scheduling, pet health records, grooming services booking, and veterinary care tracking.'
    },
    education: {
      features: '• What educational features do you need (courses, assignments, grading, communication)?',
      users: '• Who will use it (students, teachers, administrators, parents)?',
      actions: '• What should users be able to do (enroll in courses, submit assignments, track progress, communicate)?',
      example: 'Create an educational platform with course management, assignment submission, grade tracking, and student-teacher communication tools.'
    },
    realestate: {
      features: '• What real estate features do you need (property listings, search, virtual tours, documents)?',
      users: '• Who will use it (buyers, sellers, agents, property managers)?',
      actions: '• What should users be able to do (search properties, schedule viewings, submit offers, manage documents)?',
      example: 'Create a real estate platform with property listings, advanced search filters, virtual tours, and transaction management.'
    },
    fitness: {
      features: '• What fitness features do you need (workout tracking, class scheduling, trainer profiles, progress monitoring)?',
      users: '• Who will use it (gym members, trainers, staff, administrators)?',
      actions: '• What should users be able to do (book classes, track workouts, view progress, communicate with trainers)?',
      example: 'Create a fitness management system with class scheduling, workout tracking, trainer profiles, and member progress monitoring.'
    },
    travel: {
      features: '• What travel features do you need (booking, itineraries, payments, reviews)?',
      users: '• Who will use it (travelers, travel agents, hotel staff, administrators)?',
      actions: '• What should users be able to do (search destinations, make bookings, manage itineraries, leave reviews)?',
      example: 'Create a travel booking platform with destination search, hotel reservations, itinerary planning, and customer review system.'
    },
    user_management: {
      features: '• What user management features do you need (authentication, roles, permissions, profiles)?',
      users: '• Who will use it (end users, administrators, managers)?',
      actions: '• What should users be able to do (login, manage profiles, access resources, administer users)?',
      example: 'Create a user management system with role-based authentication, user profiles, permission management, and administrative dashboard.'
    },
    general: {
      features: '• What features should your app have?',
      users: '• Who will use it (customers, staff, managers)?',
      actions: '• What should users be able to do?',
      example: 'Create a comprehensive application with specific features like user management, data processing, reporting, and administrative tools.'
    }
  };

  const spec = domainSpecific[domain as keyof typeof domainSpecific] || domainSpecific.general;

  return baseMessage +
         spec.features + '\n' +
         spec.users + '\n' +
         spec.actions + '\n\n' +
         `Example: "${spec.example}"`;
}

// Simple prompt detection - identifies prompts that lack sufficient detail
function isSimplePrompt(text: string): boolean {
  const words = text.trim().split(/\s+/);
  const wordCount = words.length;

  // Too short (less than 8 words)
  if (wordCount < 8) {
    return true;
  }

  // Common simple prompt patterns
  const simplePatterns = [
    /^(i want|i wanna|make|create|build|design|help.*make)\s+(a|an)?\s*\w+(\s+\w+){0,3}$/i,
    /^(online store|e-commerce|shop|website|app|system|platform|tool)$/i,
    /^(user management|admin panel|dashboard|cms|blog)$/i
  ];

  // Check against patterns
  for (const pattern of simplePatterns) {
    if (pattern.test(text.trim())) {
      return true;
    }
  }

  // Check for lack of detail indicators
  const hasDetails = [
    'features', 'functionality', 'users', 'customers', 'staff', 'roles',
    'should', 'need', 'want', 'include', 'manage', 'track', 'allow',
    'profile', 'account', 'order', 'payment', 'inventory', 'booking'
  ].some(keyword => text.toLowerCase().includes(keyword));

  // Short text without detail indicators
  if (wordCount < 15 && !hasDetails) {
    return true;
  }

  return false;
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

    // Check for simple prompts that typically fail
    if (isSimplePrompt(userText)) {
      const domain = detectAppDomain(userText);
      const contextMessage = getContextSpecificMessage(domain);

      return res.status(400).json({
        error: 'Insufficient Details',
        message: contextMessage
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