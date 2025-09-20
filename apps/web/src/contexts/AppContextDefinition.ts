import { createContext } from 'react';
import type { GenerationResult } from '@mini-ai-app-builder/shared-types';

type AppState = 'idle' | 'loading' | 'success' | 'error';

interface AppContextState {
  status: AppState;
  userInput: string;
  generationResult: GenerationResult | null;
  error: string | null;
}

interface AppContextActions {
  setUserInput: (input: string) => void;
  setLoading: () => void;
  setSuccess: (result: GenerationResult) => void;
  setError: (error: string) => void;
  reset: () => void;
  generateApp: (description: string) => Promise<void>;
}

export type AppContextValue = AppContextState & AppContextActions;

export const AppContext = createContext<AppContextValue | undefined>(undefined);
