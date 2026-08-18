// ProfilePage.jsx
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Camera, 
  Loader2, 
  Save, 
  X,
  Edit2,
  UserCircle,
  CalendarDays,
  Heart,
  Clock,
  Activity,
  ChevronRight
} from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { useAuth } from "../lib/auth-context"
import { userApi } from "../lib/api"

export default function ProfilePage() {
  const navigate = useNavigate()
  const { isAuthenticated, user: authUser, logout } = useAuth()
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    email: "",
    userName: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
  })
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin")
      return
    }
    fetchProfile()
  }, [isAuthenticated, navigate])

  const fetchProfile = async () => {
    setIsLoading(true)
    setError("")
    try {
      const data = await userApi.getProfile()
      console.log("[Profile] Fetched profile:", data)
      setProfile(data)
      
      // Format date for input (YYYY-MM-DD)
      let formattedDate = ""
      if (data.dateOfBirth) {
        const date = new Date(data.dateOfBirth)
        formattedDate = date.toISOString().split('T')[0]
      }
      
      // Initialize form data
      setFormData({
        name: data.name || "",
        nickname: data.nickname || "",
        email: data.email || "",
        userName: data.userName || "",
        phoneNumber: data.phoneNumber || "",
        dateOfBirth: formattedDate,
        gender: data.gender?.toString() || "",
      })
      
      if (data.photoUrl) {
        setPhotoPreview(data.photoUrl)
      }
    } catch (err) {
      console.error("[Profile] Error fetching profile:", err)
      setError("Failed to load profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Photo size should be less than 5MB")
        return
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError("Please select an image file")
        return
      }
      
      setSelectedPhoto(file)
      const previewUrl = URL.createObjectURL(file)
      setPhotoPreview(previewUrl)
      setError("")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setError("")
    setSuccessMessage("")
    
    try {
      const submitData = new FormData()
      submitData.append("Name", formData.name)
      submitData.append("Nickname", formData.nickname)
      submitData.append("Email", formData.email)
      submitData.append("UserName", formData.userName)
      submitData.append("PhoneNumber", formData.phoneNumber)
      
      if (formData.dateOfBirth) {
        const dateObj = new Date(formData.dateOfBirth)
        submitData.append("DateOfBirth", dateObj.toISOString())
      }
      
      if (formData.gender) {
        submitData.append("Gender", parseInt(formData.gender))
      }
      
      if (selectedPhoto) {
        submitData.append("Photo", selectedPhoto)
      }
      
      await userApi.editProfile(submitData)
      
      // Refresh profile data
      await fetchProfile()
      setIsEditing(false)
      setSelectedPhoto(null)
      setSuccessMessage("Profile updated successfully!")
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000)
      
    } catch (err) {
      console.error("[Profile] Error updating profile:", err)
      setError(err.message || "Failed to update profile. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setSelectedPhoto(null)
    setError("")
    // Reset form data to original profile
    if (profile) {
      let formattedDate = ""
      if (profile.dateOfBirth) {
        const date = new Date(profile.dateOfBirth)
        formattedDate = date.toISOString().split('T')[0]
      }
      setFormData({
        name: profile.name || "",
        nickname: profile.nickname || "",
        email: profile.email || "",
        userName: profile.userName || "",
        phoneNumber: profile.phoneNumber || "",
        dateOfBirth: formattedDate,
        gender: profile.gender?.toString() || "",
      })
      setPhotoPreview(profile.photoUrl)
    }
  }

  const getGenderLabel = (gender) => {
    const genderNum = parseInt(gender)
    switch(genderNum) {
      case 1: return "Male"
      case 2: return "Female"
      case 3: return "Other"
      default: return "Not specified"
    }
  }

  if (!isAuthenticated) {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your personal information</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600 text-sm">{successMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Image & Stats */}
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4 ring-4 ring-white shadow-lg">
                      {photoPreview ? (
                        <img
                          src={photoPreview}
                          alt={profile?.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-500">
                          <UserCircle className="w-20 h-20 text-white" />
                        </div>
                      )}
                    </div>
                    {isEditing && (
                      <label className="absolute bottom-2 right-0 p-2 bg-primary rounded-full cursor-pointer hover:bg-primary/90 transition-colors shadow-lg">
                        <Camera className="w-4 h-4 text-white" />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handlePhotoChange}
                        />
                      </label>
                    )}
                  </div>
                  
                  <h2 className="text-xl font-bold text-center mt-2">
                    {profile?.name || "User"}
                  </h2>
                  <p className="text-sm text-muted-foreground text-center">
                    @{profile?.userName || "username"}
                  </p>
                  
                  {profile?.nickname && (
                    <p className="text-sm text-muted-foreground text-center mt-1">
                      "{profile.nickname}"
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5 text-red-500" />
                    <span className="text-sm text-muted-foreground">Favourites</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate("/favourites")}
                    className="text-primary hover:text-primary/80 gap-1"
                  >
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <span className="text-sm text-muted-foreground">Appointments</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate("/appointments")}
                    className="text-primary hover:text-primary/80 gap-1"
                  >
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-muted-foreground">Health Records</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate("/health-records")}
                    className="text-primary hover:text-primary/80 gap-1"
                  >
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-muted-foreground">Notiifcations</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate("/notifications")}
                    className="text-primary hover:text-primary/80 gap-1"
                  >
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Profile Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Personal Information</h3>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                      className="gap-2"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={cancelEdit}
                        disabled={isSaving}
                        className="gap-2"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="gap-2"
                      >
                        {isSaving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div>
                      <Label htmlFor="name">
                        <User className="h-4 w-4" />
                        Full Name
                      </Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your full name"
                          className="mt-2"
                        />
                      ) : (
                        <p className="text-foreground py-2 mt-1">{profile?.name || "Not set"}</p>
                      )}
                    </div>

                    {/* Nickname */}
                    <div>
                      <Label htmlFor="nickname">
                        <UserCircle className="h-4 w-4" />
                        Nickname
                      </Label>
                      {isEditing ? (
                        <Input
                          id="nickname"
                          name="nickname"
                          value={formData.nickname}
                          onChange={handleInputChange}
                          placeholder="Enter your nickname"
                          className="mt-2"
                        />
                      ) : (
                        <p className="text-foreground py-2 mt-1">{profile?.nickname || "Not set"}</p>
                      )}
                    </div>

                    {/* Username */}
                    <div>
                      <Label htmlFor="userName">
                        <User className="h-4 w-4" />
                        Username
                      </Label>
                      {isEditing ? (
                        <Input
                          id="userName"
                          name="userName"
                          value={formData.userName}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your username"
                          className="mt-2"
                        />
                      ) : (
                        <p className="text-foreground py-2 mt-1">@{profile?.userName || "Not set"}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <Label htmlFor="email">
                        <Mail className="h-4 w-4" />
                        Email
                      </Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your email"
                          className="mt-2"
                        />
                      ) : (
                        <p className="text-foreground py-2 mt-1">{profile?.email || "Not set"}</p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <Label htmlFor="phoneNumber">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </Label>
                      {isEditing ? (
                        <Input
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your phone number"
                          className="mt-2"
                        />
                      ) : (
                        <p className="text-foreground py-2 mt-1">{profile?.phoneNumber || "Not set"}</p>
                      )}
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <Label htmlFor="dateOfBirth">
                        <Calendar className="h-4 w-4" />
                        Date of Birth
                      </Label>
                      {isEditing ? (
                        <Input
                          id="dateOfBirth"
                          name="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                          className="mt-2"
                        />
                      ) : (
                        <p className="text-foreground py-2 mt-1">
                          {profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : "Not set"}
                        </p>
                      )}
                    </div>

                    {/* Gender */}
                    <div>
                      <Label htmlFor="gender">
                        <User className="h-4 w-4" />
                        Gender
                      </Label>
                      {isEditing ? (
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 mt-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        >
                          <option value="">Select gender</option>
                          <option value="1">Male</option>
                          <option value="2">Female</option>
                          <option value="3">Other</option>
                        </select>
                      ) : (
                        <p className="text-foreground py-2 mt-1">{getGenderLabel(profile?.gender) || "Not set"}</p>
                      )}
                    </div>
                  </div>

                  {/* Member Since */}
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                      <span>Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "Recently"}</span>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Additional Information Card */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Account Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Account Status</span>
                    <span className="text-green-600 font-medium">Active</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Account Type</span>
                    <span className="text-foreground">Patient</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Email Verification</span>
                    <span className="text-green-600 font-medium">Verified</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}