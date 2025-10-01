/**
 * Logger service for consistent logging across the application
 * Implements different log levels for development vs production
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  duration?: number;
  error?: Error;
  metadata?: Record<string, unknown>;
}

class Logger {
  private isDev: boolean;

  constructor() {
    this.isDev = process.env['NODE_ENV'] !== 'production';
  }

  private shouldLog(level: LogLevel): boolean {
    if (this.isDev) return true;

    // In production, only log warnings and errors
    return level === 'warn' || level === 'error';
  }

  private formatMessage(entry: LogEntry): string {
    const timestamp = entry.timestamp.toISOString();
    const duration = entry.duration ? ` (${entry.duration}ms)` : '';
    const metadata = entry.metadata ? ` ${JSON.stringify(entry.metadata)}` : '';

    return `[${timestamp}] ${entry.level.toUpperCase()}: ${entry.message}${duration}${metadata}`;
  }

  private log(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) return;

    const formattedMessage = this.formatMessage(entry);

    switch (entry.level) {
      case 'info':
        if (this.isDev) console.info(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'error':
        console.error(formattedMessage, entry.error || '');
        break;
      case 'debug':
        if (this.isDev) console.debug(formattedMessage);
        break;
    }
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    this.log({
      level: 'info',
      message,
      timestamp: new Date(),
      metadata,
    });
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    this.log({
      level: 'warn',
      message,
      timestamp: new Date(),
      metadata,
    });
  }

  error(message: string, error?: Error, metadata?: Record<string, unknown>): void {
    this.log({
      level: 'error',
      message,
      timestamp: new Date(),
      error,
      metadata,
    });
  }

  debug(message: string, metadata?: Record<string, unknown>): void {
    this.log({
      level: 'debug',
      message,
      timestamp: new Date(),
      metadata,
    });
  }

  // Performance logging
  performance(message: string, duration: number, metadata?: Record<string, unknown>): void {
    this.log({
      level: 'info',
      message,
      timestamp: new Date(),
      duration,
      metadata,
    });
  }
}

export const logger = new Logger();
