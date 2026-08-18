"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Mail, Loader2 } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent } from "./ui/card"
import { authApi } from "../lib/api"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await authApi.forgotPassword(email)
      setSuccess(true)
      setTimeout(() => {
        navigate(`/verify-otp?email=${encodeURIComponent(email)}`)
      }, 2000)
    } catch (err) {
      setError(err.message || "Failed to send reset code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="flex justify-center mb-8">
            <svg className="h-12 w-12" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="8" fill="currentColor" className="text-primary" />
              <path d="M20 10v20M10 20h20M16 16h8v8h-8z" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Forgot Password?</h1>
            <p className="text-muted-foreground">Enter your email to receive a reset code</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">Reset code sent! Redirecting to verification...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12"
                required
              />
            </div>

            <Button type="submit" className="w-full h-12" size="lg" disabled={isLoading || success}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Code...
                </>
              ) : (
                "Send Reset Code"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <a href="/signin" className="text-primary hover:underline font-medium">
              Sign In
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
