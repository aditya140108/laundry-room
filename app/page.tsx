export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 bg-white min-h-screen">
      <div className="w-full max-w-sm flex gap-2">
        <input
          type="text"
          placeholder="Enter bag number"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Submit
        </button>
      </div>
    </main>
  );
}