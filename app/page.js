import Link from "next/link";
import { Play } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">

      <div className="relative h-screen">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-black" />
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url('/placeholder.svg?height=1080&width=1920')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="relative flex h-full flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Discover Your Next
            <span className="block bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Favorite Movie
            </span>
          </h1>
          <p className="mb-8 max-w-[600px] text-zinc-400 md:text-xl">
            Search through thousands of movies, filter by genre, rating, and year. Find the perfect movie for your next watch.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/sign-up">
              <button
                className="flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-lg font-medium text-white shadow-md hover:bg-purple-700 focus:outline-none focus:ring focus:ring-purple-400"
              >
                <Play className="h-5 w-5" /> Get Started
              </button>
            </Link>
            <Link href="/sign-in">
              <button
                className="rounded-lg border border-purple-600 px-6 py-3 text-lg font-medium text-purple-600 hover:bg-purple-600 hover:text-white focus:outline-none focus:ring focus:ring-purple-400"
              >
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </div>


      <div className="bg-zinc-950 py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border border-purple-900/10 bg-purple-900/5 p-6">
              <div className="mb-4 text-purple-400">
                <svg
                  className=" h-10 w-10"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">Smart Search</h3>
              <p className="text-zinc-400">
                Find movies instantly with our powerful search engine. Search by title, actor, or director.
              </p>
            </div>
            <div className="rounded-lg border border-purple-900/10 bg-purple-900/5 p-6">
              <div className="mb-4 text-purple-400">
                <svg
                  className=" h-10 w-10"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313-12.454z" />
                  <path d="m17 4 3 3" />
                  <path d="m19 4 1 3" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">Advanced Filters</h3>
              <p className="text-zinc-400">
                Filter movies by genre, release year, rating, and more to find exactly what you're looking for.
              </p>
            </div>
            <div className="rounded-lg border border-purple-900/10 bg-purple-900/5 p-6">
              <div className="mb-4 text-purple-400">
                <svg
                  className=" h-10 w-10"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z" />
                  <path d="M5 3v4" />
                  <path d="M19 17v4" />
                  <path d="M3 5h4" />
                  <path d="M17 19h4" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">Curated Collections</h3>
              <p className="text-zinc-400">
                Discover hand-picked movie collections and themed recommendations for every mood.
              </p>
            </div>
          </div>
        </div>
      </div>


      <div className="border-t border-zinc-800 bg-black py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Find Your Next Movie?</h2>
          <p className="mb-8 text-zinc-400">
            Join thousands of movie enthusiasts who have found their perfect watch.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href="/sign-up">
              <button
                className="rounded-lg bg-purple-600 px-6 py-3 text-lg font-medium text-white shadow-md hover:bg-purple-700 focus:outline-none focus:ring focus:ring-purple-400"
              >
                Create Account
              </button>
            </Link>
            <Link href="/sign-in">
              <button
                className="rounded-lg border border-purple-600 px-6 py-3 text-lg font-medium text-purple-600 hover:bg-purple-600 hover:text-white focus:outline-none focus:ring focus:ring-purple-400"
              >
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
