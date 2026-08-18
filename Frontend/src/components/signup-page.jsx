// SignUpPage.jsx - Updated to show backend validation errors
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { User, Mail, Lock, Phone, Loader2, Calendar, Camera, AlertCircle } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent } from "./ui/card"
import { useAuth } from "../lib/auth-context"
import { authApi } from "../lib/api"

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [nickname, setNickname] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [gender, setGender] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [generalError, setGeneralError] = useState("")
  const { register } = useAuth()
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {}

    if (!name.trim()) {
      newErrors.name = "Full name is required"
    } else if (name.trim().length < 2) {
      newErrors.name = "Full name must be at least 2 characters"
    }

    if (!username.trim()) {
      newErrors.username = "Username is required"
    } else if (username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters"
    } else if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      newErrors.username = "Username can only contain letters, numbers, and underscores"
    }

    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Password must contain at least one uppercase letter"
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = "Password must contain at least one lowercase letter"
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Password must contain at least one number"
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (password && confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!gender) {
      newErrors.gender = "Please select your gender"
    }

    if (!dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Helper to map backend field names to form field names
  const mapBackendFieldToFormField = (fieldName) => {
    const mapping = {
      "Name": "name",
      "UserName": "username",
      "Email": "email",
      "Phone": "phone",
      "Password": "password",
      "ConfirmPassword": "confirmPassword",
      "DateOfBirth": "dateOfBirth",
      "Gender": "gender"
    }
    return mapping[fieldName] || fieldName
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          photo: "Photo must be less than 5MB"
        }))
        return
      }
      
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          photo: "Please upload an image file"
        }))
        return
      }
      
      setPhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result)
      }
      reader.readAsDataURL(file)
      setErrors(prev => ({ ...prev, photo: null }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setGeneralError("")

    if (!validateForm()) {
      const firstError = document.querySelector('[data-error="true"]')
      if (firstError) {
        firstError.focus()
      }
      return
    }

    setIsLoading(true)

    try {
      await register({
        name: name.trim(),
        nickname: nickname.trim() || name.trim(),
        email: email.trim(),
        userName: username.trim(),
        password,
        confirmPassword,
        phone: phone.trim(),
        gender: Number.parseInt(gender),
        dateOfBirth,
        photo: photo || undefined,
      })
      navigate("/")
    } catch (err) {
      console.error("[v0] Registration error:", err)
      
      // Check if the error has details (from backend validation)
      if (err.details && typeof err.details === 'object') {
        // Map backend validation errors to form fields
        const fieldErrors = {}
        let generalMsg = ""
        
        for (const [field, messages] of Object.entries(err.details)) {
          const formField = mapBackendFieldToFormField(field)
          const errorMsg = Array.isArray(messages) ? messages.join('. ') : messages
          
          // Check if it's a general error or field-specific
          if (formField === field && !['name', 'username', 'email', 'phone', 'password', 'confirmPassword', 'dateOfBirth', 'gender'].includes(formField)) {
            generalMsg += `${field}: ${errorMsg}. `
          } else {
            fieldErrors[formField] = errorMsg
          }
        }
        
        if (Object.keys(fieldErrors).length > 0) {
          setErrors(fieldErrors)
        }
        if (generalMsg) {
          setGeneralError(generalMsg)
        }
      } else if (err.message) {
        // Try to parse common error messages
        if (err.message.includes("already exists") || err.message.includes("already registered")) {
          if (err.message.includes("Email")) {
            setErrors({ email: "This email is already registered. Please use a different email." })
          } else if (err.message.includes("UserName") || err.message.includes("Username")) {
            setErrors({ username: "This username is already taken. Please choose a different one." })
          } else if (err.message.includes("Phone")) {
            setErrors({ phone: "This phone number is already registered." })
          } else {
            setGeneralError(err.message)
          }
        } else {
          setGeneralError(err.message)
        }
      } else {
        setGeneralError("Failed to create account. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = () => {
    window.location.href = authApi.getGoogleSignInUrl()
  }

  const renderError = (field) => {
    if (errors[field]) {
      return (
        <div className="flex items-center gap-1 mt-1 text-xs text-destructive">
          <AlertCircle className="h-3 w-3" />
          <span>{errors[field]}</span>
        </div>
      )
    }
    return null
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
            <h1 className="text-2xl font-bold text-foreground mb-2">Create Account</h1>
            <p className="text-muted-foreground">We are here to help you!</p>
          </div>

          {generalError && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{generalError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col items-center gap-2 mb-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border">
                  {photoPreview ? (
                    <img
                      src={photoPreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="h-10 w-10 text-muted-foreground" />
                  )}
                </div>
                <label
                  htmlFor="photo-upload"
                  className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              </div>
              {renderError('photo')}
              <p className="text-xs text-muted-foreground">Upload your photo (optional)</p>
            </div>

            <div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`pl-10 h-12 ${errors.name ? 'border-destructive' : ''}`}
                  data-error={!!errors.name}
                  required
                />
              </div>
              {renderError('name')}
            </div>

            <div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`pl-10 h-12 ${errors.username ? 'border-destructive' : ''}`}
                  data-error={!!errors.username}
                  required
                />
              </div>
              {renderError('username')}
            </div>

            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 h-12 ${errors.email ? 'border-destructive' : ''}`}
                  data-error={!!errors.email}
                  required
                />
              </div>
              {renderError('email')}
            </div>

            <div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`pl-10 h-12 ${errors.phone ? 'border-destructive' : ''}`}
                  data-error={!!errors.phone}
                  required
                />
              </div>
              {renderError('phone')}
            </div>

            <div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="date"
                  placeholder="Date of Birth"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className={`pl-10 h-12 ${errors.dateOfBirth ? 'border-destructive' : ''}`}
                  data-error={!!errors.dateOfBirth}
                  required
                />
              </div>
              {renderError('dateOfBirth')}
            </div>

            <div>
              <div className="relative">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className={`w-full h-12 pl-10 pr-4 rounded-md border ${errors.gender ? 'border-destructive' : 'border-input'} bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none`}
                  data-error={!!errors.gender}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="1">Male</option>
                  <option value="2">Female</option>
                  <option value="3">Other</option>
                </select>
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {renderError('gender')}
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-10 h-12 ${errors.password ? 'border-destructive' : ''}`}
                  data-error={!!errors.password}
                  required
                />
              </div>
              {renderError('password')}
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`pl-10 h-12 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                  data-error={!!errors.confirmPassword}
                  required
                />
              </div>
              {renderError('confirmPassword')}
            </div>

            <Button type="submit" className="w-full h-12" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="my-6 text-center text-sm text-muted-foreground">or</div>

          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 flex items-center justify-center gap-2 bg-transparent"
              onClick={handleGoogleSignUp}
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
              Continue with Google
            </Button>
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Do you have an account?{" "}
            <a href="/signin" className="text-primary hover:underline font-medium">
              Sign In
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}