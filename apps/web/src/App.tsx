import GenerationForm from './features/generation/GenerationForm';
import GenerationResult from './features/generation/GenerationResult';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-4xl">
            <header className="mb-8 text-center">
              <h1 className="mb-2 text-3xl font-bold text-gray-900">AI App Builder</h1>
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
  );
}

export default App;
