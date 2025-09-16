import GenerationForm from './features/generation/GenerationForm'
import GenerationResult from './features/generation/GenerationResult'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <header className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                AI App Builder
              </h1>
              <p className="text-gray-600">
                Describe your app idea and let AI generate the structure for you
              </p>
            </header>
            <GenerationForm />
            <GenerationResult />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default App
