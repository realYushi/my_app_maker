interface AppConfig {
  apiUrl: string;
}

class ConfigService {
  private config: AppConfig;

  constructor() {
    this.config = {
      apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
    };
  }

  get apiUrl(): string {
    return this.config.apiUrl;
  }
}

export const configService = new ConfigService();
