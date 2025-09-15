import { useEffect } from 'react'
import { useAppContext } from '../../contexts/AppContext'
import { generationService } from '../../services/generationService'

const GenerationForm = () => {
  const {
    status,
    userInput,
    setUserInput,
    setLoading,
    setSuccess,
    setError
  } = useAppContext()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedInput = userInput.trim()

    if (!trimmedInput) return

    if (trimmedInput.length < 10) {
      setError('Please provide a more detailed description (at least 10 characters)')
      return
    }

    setLoading()
    try {
      const result = await generationService.generateApp(trimmedInput)
      setSuccess(result)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Describe your app idea
          </label>
          <textarea
            id="description"
            name="description"
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Tell us about your app idea. What should it do? Who is it for? What features do you envision?"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={status === 'loading'}
          />
          <p className="mt-2 text-sm text-gray-500">
            Be as detailed as possible to get the best results
          </p>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={!userInput.trim() || status === 'loading'}
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
          >
            {status === 'loading' ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </div>
            ) : (
              'Generate'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default GenerationForm