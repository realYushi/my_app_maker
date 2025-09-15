import { useAppContext } from '../../contexts/AppContext'
import GeneratedApp from './GeneratedApp'
import ErrorDisplay from './ErrorDisplay'

const GenerationResult = () => {
  const { status, generationResult } = useAppContext()

  if (status === 'idle' || status === 'loading') {
    return null
  }

  if (status === 'error') {
    return <ErrorDisplay />
  }

  if (status === 'success' && generationResult) {
    return <GeneratedApp generationResult={generationResult} />
  }

  return null
}

export default GenerationResult