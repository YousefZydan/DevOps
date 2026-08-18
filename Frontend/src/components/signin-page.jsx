// SignInPage.jsx - Updated
"use client"

import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Mail, Lock, Loader2 } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent } from "./ui/card"
import { useAuth } from "../lib/auth-context"
import { useToast } from "../hooks/use-toast"
import { authApi } from "../lib/api"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { login, isAuthenticated, isAdmin } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const token = searchParams.get("token")
    const oauthError = searchParams.get("error")

    if (token) {
      console.log("[v0] OAuth token received, logging in...")
      // For OAuth, we don't set admin
      localStorage.setItem("authToken", token)
      localStorage.setItem("isAdmin", "false")
      navigate("/")
    } else if (oauthError) {
      console.error("[v0] OAuth error:", oauthError)
      setError("Google sign-in failed. Please try again.")
    }
  }, [searchParams, navigate])

  // Redirect based on authentication status
  useEffect(() => {
    if (isAuthenticated) {
      console.log("[SignIn] User authenticated, isAdmin:", isAdmin)
      
      if (isAdmin) {
        console.log("[SignIn] Redirecting to admin dashboard")
        navigate("/admin/dashboard")
      } else {
        console.log("[SignIn] Redirecting to home page")
        navigate("/")
      }
    }
  }, [isAuthenticated, isAdmin, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await login(email, password)
      console.log("[SignIn] Login response:", response)
      
      toast({
        title: "Login Successful",
        description: response?.isAdmin ? "Welcome Admin!" : "Welcome back!",
      })
      
      // The useEffect will handle redirect based on isAdmin
      
    } catch (err) {
      console.error("[v0] Login error:", err)
      setError(err.message || "Invalid email or password. Please try again.")
      toast({
        title: "Login Failed",
        description: err.message || "Invalid email or password",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    window.location.href = authApi.getGoogleSignInUrl()
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
            <h1 className="text-2xl font-bold text-foreground mb-2">Hi, Welcome Back!</h1>
            <p className="text-muted-foreground">Hope you're doing fine.</p>
          </div>

          {/* Admin Login Hint */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Admin Login:</strong> admin@gmail.com / P@ssword123
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Admin users will be redirected to the Admin Dashboard
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
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

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-12"
                required
              />
            </div>

            <Button type="submit" className="w-full h-12" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="my-6 text-center text-sm text-muted-foreground">or</div>

          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 flex items-center justify-center gap-2 bg-transparent"
              onClick={handleGoogleSignIn}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </Button>
          </div>

          <div className="mt-6 text-center">
            <a href="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </a>
          </div>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account yet?{" "}
            <a href="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}