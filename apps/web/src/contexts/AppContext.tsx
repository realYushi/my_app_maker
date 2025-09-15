import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { GenerationResult } from '@mini-ai-app-builder/shared-types'
import { generationService } from '../services/generationService'

type AppState = 'idle' | 'loading' | 'success' | 'error'

interface AppContextState {
  status: AppState
  userInput: string
  generationResult: GenerationResult | null
  error: string | null
}

interface AppContextActions {
  setUserInput: (input: string) => void
  setLoading: () => void
  setSuccess: (result: GenerationResult) => void
  setError: (error: string) => void
  reset: () => void
  generateApp: (description: string) => Promise<void>
}

type AppContextValue = AppContextState & AppContextActions

type AppAction =
  | { type: 'SET_USER_INPUT'; payload: string }
  | { type: 'SET_LOADING' }
  | { type: 'SET_SUCCESS'; payload: GenerationResult }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'RESET' }

const initialState: AppContextState = {
  status: 'idle',
  userInput: '',
  generationResult: null,
  error: null
}

const appReducer = (state: AppContextState, action: AppAction): AppContextState => {
  switch (action.type) {
    case 'SET_USER_INPUT':
      return {
        ...state,
        userInput: action.payload,
        error: null
      }
    case 'SET_LOADING':
      return {
        ...state,
        status: 'loading',
        error: null
      }
    case 'SET_SUCCESS':
      return {
        ...state,
        status: 'success',
        generationResult: action.payload,
        error: null
      }
    case 'SET_ERROR':
      return {
        ...state,
        status: 'error',
        error: action.payload,
        generationResult: null
      }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

interface AppProviderProps {
  children: ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const actions: AppContextActions = {
    setUserInput: (input: string) => dispatch({ type: 'SET_USER_INPUT', payload: input }),
    setLoading: () => dispatch({ type: 'SET_LOADING' }),
    setSuccess: (result: GenerationResult) => dispatch({ type: 'SET_SUCCESS', payload: result }),
    setError: (error: string) => dispatch({ type: 'SET_ERROR', payload: error }),
    reset: () => dispatch({ type: 'RESET' }),
    generateApp: async (description: string) => {
      try {
        dispatch({ type: 'SET_LOADING' });
        const result = await generationService.generateApp(description);
        dispatch({ type: 'SET_SUCCESS', payload: result });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
      }
    }
  }

  const value: AppContextValue = {
    ...state,
    ...actions
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}