"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader } from 'lucide-react'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { app } from '../firebaseConfig'

export default function SignInPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const auth = getAuth(app)

  async function onSubmit(event) {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email")
    const password = formData.get("password")

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/search")  
    } catch (error) {
      setError("Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black py-20 flex justify-center items-center">
      <div className="w-full max-w-sm bg-zinc-900/50 text-white border border-zinc-800 rounded-lg shadow-lg">
        <div className="px-6 py-4">
          <h2 className="text-2xl font-semibold">Sign in</h2>
        </div>
        <form onSubmit={onSubmit}>
          <div className="px-6 py-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                className="w-full p-3 rounded-lg border border-zinc-700 bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full p-3 rounded-lg border border-zinc-700 bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            {error && <div className="text-sm text-red-500">{error}</div>}
          </div>
          <div className="px-6 py-4">
            <button 
              type="submit" 
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              disabled={isLoading}
            >
              {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin inline-block" />}
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
