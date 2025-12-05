export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-zinc-900 dark:text-white">
          404
        </h1>
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">
          The page you are looking for does not exist. Please check the URL or
          go back to the homepage.
        </p>
      </div>
    </div>
  );
}
