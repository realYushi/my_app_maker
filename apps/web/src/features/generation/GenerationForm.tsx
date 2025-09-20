import { useAppContext } from '../../hooks/useAppContext';

const GenerationForm = () => {
  const { status, userInput, setUserInput, setError, generateApp } = useAppContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = userInput.trim();

    if (!trimmedInput) return;

    if (trimmedInput.length < 10) {
      setError('Please provide a more detailed description (at least 10 characters)');
      return;
    }

    // Prevent duplicate submissions while loading
    if (status === 'loading') {
      return;
    }

    await generateApp(trimmedInput);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-700">
            Describe your app idea
          </label>
          <textarea
            id="description"
            name="description"
            rows={6}
            className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell us about your app idea. What should it do? Who is it for? What features do you envision?"
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
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
            className="min-w-[120px] rounded-md bg-blue-600 px-8 py-3 font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === 'loading' ? (
              <div className="flex items-center justify-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                Generating...
              </div>
            ) : (
              'Generate'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GenerationForm;
