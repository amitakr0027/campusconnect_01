"use client"

import type React from "react"
import { useState } from "react"
import { BookOpen, Mail, Lock, AlertCircle } from "lucide-react"
import { useFirebaseAuth } from "@/contexts/FirebaseAuthContext"

interface SigninFormProps {
  onSigninSuccess: () => void
  onToggleForm: () => void
}

export default function SigninForm({ onSigninSuccess, onToggleForm }: SigninFormProps) {
  const { signin, error, clearError } = useFirebaseAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    clearError()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await signin(formData.email, formData.password)
      onSigninSuccess()
    } catch (err) {
      console.error("Signin error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center p-8 animate-fade-in">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">CampusConnect</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <span className="text-sm text-red-600 dark:text-red-300">{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="you@university.edu"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold rounded-lg transition-colors shadow-md"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <button onClick={onToggleForm} className="text-indigo-600 hover:text-indigo-700 font-semibold">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  )
}
