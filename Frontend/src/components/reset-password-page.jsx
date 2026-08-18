// "use client"

// import { useState, useEffect } from "react"
// import { useNavigate, useSearchParams } from "react-router-dom"
// import { Lock, Loader2 } from "lucide-react"
// import { Button } from "./ui/button"
// import { Input } from "./ui/input"
// import { Card, CardContent } from "./ui/card"
// import { authApi } from "../lib/api"

// export default function ResetPasswordPage() {
//   const [newPassword, setNewPassword] = useState("")
//   const [confirmPassword, setConfirmPassword] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState("")
//   const [success, setSuccess] = useState(false)
//   const [email, setEmail] = useState("")
//   const [code, setCode] = useState("")
//   const navigate = useNavigate()
//   const [searchParams] = useSearchParams()

//   useEffect(() => {
//     const emailParam = searchParams.get("email")
//     const codeParam = searchParams.get("code")

//     if (emailParam && codeParam) {
//       setEmail(emailParam)
//       setCode(codeParam)
//     } else {
//       navigate("/forgot-password")
//     }
//   }, [searchParams, navigate])

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError("")

//     if (newPassword !== confirmPassword) {
//       setError("Passwords do not match")
//       return
//     }

//     setIsLoading(true)

//     try {
//       await authApi.resetPassword(email, code, newPassword, confirmPassword)
//       setSuccess(true)
//       setTimeout(() => {
//         navigate("/signin")
//       }, 2000)
//     } catch (err) {
//       console.error("[v0] Reset password error:", err)
//       setError(err.message || "Failed to reset password. Please try again.")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
//       <Card className="w-full max-w-md">
//         <CardContent className="p-8">
//           <div className="flex justify-center mb-8">
//             <svg className="h-12 w-12" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <rect width="40" height="40" rx="8" fill="currentColor" className="text-primary" />
//               <path d="M20 10v20M10 20h20M16 16h8v8h-8z" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
//             </svg>
//           </div>

//           <div className="text-center mb-8">
//             <h1 className="text-2xl font-bold text-foreground mb-2">Reset Password</h1>
//             <p className="text-muted-foreground">Enter your new password</p>
//           </div>

//           {error && (
//             <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
//               <p className="text-sm text-destructive">{error}</p>
//             </div>
//           )}

//           {success && (
//             <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
//               <p className="text-sm text-green-700">Password reset successful! Redirecting to sign in...</p>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="relative">
//               <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
//               <Input
//                 type="password"
//                 placeholder="New Password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 className="pl-10 h-12"
//                 required
//               />
//             </div>

//             <div className="relative">
//               <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
//               <Input
//                 type="password"
//                 placeholder="Confirm New Password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 className="pl-10 h-12"
//                 required
//               />
//             </div>

//             <Button type="submit" className="w-full h-12" size="lg" disabled={isLoading || success}>
//               {isLoading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Resetting Password...
//                 </>
//               ) : (
//                 "Reset Password"
//               )}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
"use client"

import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Lock, Loader2 } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent } from "./ui/card"
import { authApi } from "../lib/api"

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // useEffect(() => {
  //   const emailParam = searchParams.get("email")
  //   const codeParam = searchParams.get("code")

  //   if (emailParam && codeParam) {
  //     setEmail(emailParam)
  //     setCode(codeParam)
  //   } else {
  //     // Try to get from localStorage as fallback (if coming from verify-otp page)
  //     const storedEmail = localStorage.getItem('resetEmail')
  //     const storedCode = localStorage.getItem('resetCode')
      
  //     if (storedEmail && storedCode) {
  //       setEmail(storedEmail)
  //       setCode(storedCode)
  //     } else {
  //       navigate("/forgot-password")
  //     }
  //   }
  // }, [searchParams, navigate])

  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   setError("")

  //   if (newPassword !== confirmPassword) {
  //     setError("Passwords do not match")
  //     return
  //   }

  //   if (newPassword.length < 6) {
  //     setError("Password must be at least 6 characters long")
  //     return
  //   }

  //   setIsLoading(true)

  //   try {
  //     console.log("Sending reset password request with:", {
  //       email,
  //       code: code.substring(0, 3) + "...", // Log partial code for security
  //       newPasswordLength: newPassword.length
  //     })

  //     await authApi.resetPassword(email, code, newPassword, confirmPassword)
  //     setSuccess(true)
      
  //     // Clear any stored reset data
  //     localStorage.removeItem('resetEmail')
  //     localStorage.removeItem('resetCode')
      
  //     setTimeout(() => {
  //       navigate("/signin")
  //     }, 2000)
  //   } catch (err) {
  //     console.error("[v0] Reset password error:", err)
      
  //     // Better error messages
  //     if (err.message.includes("500")) {
  //       setError("Server error. Please try again or contact support.")
  //     } else if (err.message.includes("400")) {
  //       setError("Invalid request. Please check the reset code and try again.")
  //     } else if (err.message.includes("401") || err.message.includes("403")) {
  //       setError("Reset code has expired or is invalid. Please request a new one.")
  //     } else if (err.message.includes("Failed to fetch")) {
  //       setError("Network error. Please check your connection and try again.")
  //     } else {
  //       setError(err.message || "Failed to reset password. Please try again.")
  //     }
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }
// In your ResetPasswordPage component, update the useEffect and handleSubmit:

useEffect(() => {
  const emailParam = searchParams.get("email")
  const codeParam = searchParams.get("code")

  if (emailParam && codeParam) {
    setEmail(emailParam)
    // TRIM the code to remove any leading/trailing spaces
    setCode(codeParam.trim())
  } else {
    // Try to get from localStorage as fallback
    const storedEmail = localStorage.getItem('resetEmail')
    const storedCode = localStorage.getItem('resetCode')
    
    if (storedEmail && storedCode) {
      setEmail(storedEmail)
      setCode(storedCode.trim()) // TRIM here too
    } else {
      navigate("/forgot-password")
    }
  }
}, [searchParams, navigate])

const handleSubmit = async (e) => {
  e.preventDefault()
  setError("")

  if (newPassword !== confirmPassword) {
    setError("Passwords do not match")
    return
  }

  if (newPassword.length < 6) {
    setError("Password must be at least 6 characters long")
    return
  }

  setIsLoading(true)

  try {
    // Log the cleaned code
    console.log("Sending reset password request with:", {
      email,
      code: code, // Show full code in logs (for debugging)
      codeLength: code.length,
      codeTrimmed: code.trim(),
      newPasswordLength: newPassword.length
    })

    // Use trimmed code
    await authApi.resetPassword(email, code.trim(), newPassword, confirmPassword)
    setSuccess(true)
    
    // Clear any stored reset data
    localStorage.removeItem('resetEmail')
    localStorage.removeItem('resetCode')
    
    setTimeout(() => {
      navigate("/signin")
    }, 2000)
  } catch (err) {
    console.error("[v0] Reset password error:", err)
    console.error("Error details:", {
      email,
      code: code,
      codeTrimmed: code.trim(),
      codeLength: code.length,
      hasLeadingSpace: code.startsWith(' '),
      hasTrailingSpace: code.endsWith(' ')
    })
    
    setError(err.message || "Invalid reset code. Please check and try again.")
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
            <h1 className="text-2xl font-bold text-foreground mb-2">Reset Password</h1>
            <p className="text-muted-foreground">Enter your new password for {email}</p>
            {code && (
              <p className="text-xs text-muted-foreground mt-1">
                Using reset code
              </p>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">Password reset successful! Redirecting to sign in...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="password"
                placeholder="New Password (min. 6 characters)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pl-10 h-12"
                required
                minLength={6}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 h-12"
                required
                minLength={6}
              />
            </div>

            <Button type="submit" className="w-full h-12" size="lg" disabled={isLoading || success}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                "Reset Password"
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
