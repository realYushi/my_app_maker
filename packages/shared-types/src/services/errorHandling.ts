/**
 * Centralized Error Handling Service
 * Provides standardized error handling across the application
 */

export enum ErrorType {
  NETWORK = 'NETWORK',
  API = 'API',
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  AI_SERVICE = 'AI_SERVICE',
  COMPONENT = 'COMPONENT',
  UNKNOWN = 'UNKNOWN',
}

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface ErrorContext {
  component?: string | undefined;
  action?: string | undefined;
  timestamp: number;
  userAgent?: string | undefined;
  environment: string;
  additionalData?: Record<string, unknown> | undefined;
}

export interface AppError {
  id: string;
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  originalError?: Error | unknown;
  context: ErrorContext;
  stack?: string | undefined;
  retryable: boolean;
  userMessage: string;
}

export interface ErrorHandler {
  handleError(error: AppError): void;
  canHandle(error: AppError): boolean;
}

export interface ErrorLogger {
  log(error: AppError): void;
  getErrors(limit?: number): AppError[];
  clearErrors(): void;
}

export interface ErrorNotifier {
  notify(error: AppError): void;
  canNotify(error: AppError): boolean;
}

class ErrorHandlingService implements ErrorLogger {
  private errors: AppError[] = [];
  private handlers: ErrorHandler[] = [];
  private notifiers: ErrorNotifier[] = [];
  private maxErrors = 1000;

  addHandler(handler: ErrorHandler): void {
    this.handlers.push(handler);
  }

  removeHandler(handler: ErrorHandler): void {
    const index = this.handlers.indexOf(handler);
    if (index > -1) {
      this.handlers.splice(index, 1);
    }
  }

  addNotifier(notifier: ErrorNotifier): void {
    this.notifiers.push(notifier);
  }

  removeNotifier(notifier: ErrorNotifier): void {
    const index = this.notifiers.indexOf(notifier);
    if (index > -1) {
      this.notifiers.splice(index, 1);
    }
  }

  createError(
    error: Error | unknown,
    type: ErrorType = ErrorType.UNKNOWN,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    context: Partial<ErrorContext> = {},
    userMessage?: string,
  ): AppError {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    const appError: AppError = {
      id: this.generateErrorId(),
      type,
      severity,
      message: errorMessage,
      originalError: error,
      context: {
        timestamp: Date.now(),
        environment: process.env['NODE_ENV'] || 'development',
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
        ...context,
      },
      stack: errorStack,
      retryable: this.isRetryable(type),
      userMessage: userMessage || this.getDefaultUserMessage(type),
    };

    return appError;
  }

  handleError(error: AppError): void {
    // Add to error log
    this.log(error);

    // Handle with registered handlers
    for (const handler of this.handlers) {
      if (handler.canHandle(error)) {
        handler.handleError(error);
      }
    }

    // Notify if needed
    for (const notifier of this.notifiers) {
      if (notifier.canNotify(error)) {
        notifier.notify(error);
      }
    }

    // Console error in development
    if (process.env['NODE_ENV'] === 'development') {
      console.error('ErrorHandlingService:', error);
    }
  }

  log(error: AppError): void {
    this.errors.push(error);

    // Keep only recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }
  }

  getErrors(limit?: number): AppError[] {
    if (limit) {
      return this.errors.slice(-limit);
    }
    return [...this.errors];
  }

  clearErrors(): void {
    this.errors = [];
  }

  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private isRetryable(type: ErrorType): boolean {
    const retryableTypes = [ErrorType.NETWORK, ErrorType.API, ErrorType.AI_SERVICE];
    return retryableTypes.includes(type);
  }

  private getDefaultUserMessage(type: ErrorType): string {
    const messages: Record<ErrorType, string> = {
      [ErrorType.NETWORK]: 'Network connection issue. Please check your internet connection.',
      [ErrorType.API]: 'Service temporarily unavailable. Please try again later.',
      [ErrorType.VALIDATION]: 'Invalid input data. Please check your entries.',
      [ErrorType.AUTHENTICATION]: 'Authentication required. Please log in.',
      [ErrorType.AUTHORIZATION]: "You don't have permission to perform this action.",
      [ErrorType.AI_SERVICE]: 'AI service unavailable. Please try again later.',
      [ErrorType.COMPONENT]: 'Component error. Please refresh the page.',
      [ErrorType.UNKNOWN]: 'An unexpected error occurred. Please try again.',
    };

    return messages[type] || 'An error occurred. Please try again.';
  }
}

// Global error handling service instance
export const errorHandlingService = new ErrorHandlingService();

// Default console handler
export const consoleErrorHandler: ErrorHandler = {
  handleError(error: AppError): void {
    console.error(`[${error.type}] ${error.message}`, error.context);
  },
  canHandle(error: AppError): boolean {
    return error.severity === ErrorSeverity.CRITICAL || process.env['NODE_ENV'] === 'development';
  },
};

// Default development notifier
export const developmentNotifier: ErrorNotifier = {
  notify(error: AppError): void {
    if (process.env['NODE_ENV'] === 'development') {
      // Could show toast notifications or dev tools integration
      console.warn(`DEV NOTIFICATION: ${error.type} - ${error.message}`);
    }
  },
  canNotify(error: AppError): boolean {
    return error.severity >= ErrorSeverity.MEDIUM;
  },
};

// Register default handlers and notifiers
errorHandlingService.addHandler(consoleErrorHandler);
errorHandlingService.addNotifier(developmentNotifier);

// Utility functions
export function handleAsyncError<T>(
  fn: () => Promise<T>,
  errorType: ErrorType = ErrorType.UNKNOWN,
  context?: Partial<ErrorContext>,
): Promise<T> {
  return fn().catch(error => {
    const appError = errorHandlingService.createError(
      error,
      errorType,
      ErrorSeverity.MEDIUM,
      context,
    );
    errorHandlingService.handleError(appError);
    throw appError;
  });
}

export function handleSyncError<T>(
  fn: () => T,
  errorType: ErrorType = ErrorType.UNKNOWN,
  context?: Partial<ErrorContext>,
): T {
  try {
    return fn();
  } catch (error) {
    const appError = errorHandlingService.createError(
      error,
      errorType,
      ErrorSeverity.MEDIUM,
      context,
    );
    errorHandlingService.handleError(appError);
    throw appError;
  }
}

export function createComponentError(
  error: Error | unknown,
  componentName: string,
  action?: string | undefined,
): AppError {
  return errorHandlingService.createError(error, ErrorType.COMPONENT, ErrorSeverity.MEDIUM, {
    component: componentName,
    action: action || undefined,
  });
}
