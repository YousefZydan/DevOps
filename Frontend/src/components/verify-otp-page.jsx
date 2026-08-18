"use client"

import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent } from "./ui/card"
import { authApi } from "../lib/api"

export default function VerifyOtpPage() {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setEmail(emailParam)
    } else {
      navigate("/forgot-password")
    }
  }, [searchParams, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await authApi.verifyOtp(email, code)
      navigate(`/reset-password?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`)
    } catch (err) {
      console.error("[v0] OTP verification error:", err)
      setError(err.message || "Invalid code. Please try again.")
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
            <h1 className="text-2xl font-bold text-foreground mb-2">Verify OTP</h1>
            <p className="text-muted-foreground">Enter the code sent to {email}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Enter OTP Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="h-12 text-center text-2xl tracking-widest"
                maxLength={6}
                required
              />
            </div>

            <Button type="submit" className="w-full h-12" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Didn't receive a code?{" "}
            <a href="/forgot-password" className="text-primary hover:underline font-medium">
              Resend
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
