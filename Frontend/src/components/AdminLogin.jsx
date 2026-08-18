// AdminLogin.jsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Stethoscope, Lock, Loader2, Eye, EyeOff, Mail } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Input } from "./ui/input"
import { useToast } from "../hooks/use-toast"
import { dashboardApi } from "../lib/api.js"


export default function AdminLogin() {
  const [code, setCode] = useState("admin@gmail.com")
  const [password, setPassword] = useState("P@ssword123")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!code || !password) {
      toast({
        title: "Error",
        description: "Please enter both code and password",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await dashboardApi.login(code, password)
      console.log("[AdminLogin] Login response:", response)
      
      // Store token and admin data
      if (response.token) {
        localStorage.setItem("adminToken", response.token)
        localStorage.setItem("adminData", JSON.stringify(response))
      }
      
      toast({
        title: "Success",
        description: "Login successful! Redirecting to dashboard...",
      })
      
      setTimeout(() => {
        navigate("/admin/dashboard")
      }, 1500)
      
    } catch (error) {
      console.error("[AdminLogin] Login error:", error)
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
            <Stethoscope className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Sign in to manage appointments</p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email / Code</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter your email"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full h-11 text-base">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}