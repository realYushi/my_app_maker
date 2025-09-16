import { useAppContext } from '../../contexts/AppContext'
import GeneratedApp from './GeneratedApp'
import ErrorDisplay from './ErrorDisplay'
import { GenerationErrorBoundary } from '../../components'

const GenerationResult = () => {
  const { status, generationResult } = useAppContext()

  if (status === 'idle' || status === 'loading') {
    return null
  }

  if (status === 'error') {
    return <ErrorDisplay />
  }

  if (status === 'success' && generationResult) {
    return (
      <GenerationErrorBoundary>
        <GeneratedApp generationResult={generationResult} />
      </GenerationErrorBoundary>
    )
  }

  return null
}

export default GenerationResult