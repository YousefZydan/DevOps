// DoctorDetailsPage.jsx
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { 
  Star, 
  MapPin, 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  Award,
  Users,
  Heart,
  Loader2,
  ChevronLeft,
  CheckCircle,
  XCircle,
  Globe,
  Briefcase,
  GraduationCap
} from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { useToast } from "../hooks/use-toast"
import { doctorApi, bookingApi, favouriteApi } from "../lib/api"
import { useAuth } from "../lib/auth-context"

export default function DoctorDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()
  
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFavourite, setIsFavourite] = useState(false)
  const [favouriteId, setFavouriteId] = useState(null)
  const [togglingFavourite, setTogglingFavourite] = useState(false)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [nonAvailableTimes, setNonAvailableTimes] = useState([])
  const [bookingLoading, setBookingLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("about")

  // Available time slots
  const availableTimeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30"
  ]

  useEffect(() => {
    loadDoctorDetails()
  }, [id])

  useEffect(() => {
    if (isAuthenticated && doctor) {
      checkFavouriteStatus()
    }
  }, [isAuthenticated, doctor])

  useEffect(() => {
    if (selectedDate && doctor) {
      loadNonAvailableTimes()
    }
  }, [selectedDate, doctor])

  const loadDoctorDetails = async () => {
    setLoading(true)
    try {
      const data = await doctorApi.getDoctorById(id)
      console.log("[DoctorDetails] Loaded doctor:", data)
      setDoctor(data)
    } catch (error) {
      console.error("[DoctorDetails] Error loading doctor:", error)
      toast({
        title: "Error",
        description: "Failed to load doctor details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const checkFavouriteStatus = async () => {
    try {
      const data = await favouriteApi.getUserFavourites()
      const favouritesList = Array.isArray(data) ? data : data?.data || []
      const favourite = favouritesList.find(fav => 
        (fav.doctorId === id || fav.doctor?.id === id)
      )
      if (favourite) {
        setIsFavourite(true)
        setFavouriteId(favourite.id || favourite.favouriteId)
      }
    } catch (error) {
      console.error("[DoctorDetails] Error checking favourite:", error)
    }
  }

  const loadNonAvailableTimes = async () => {
    try {
      const data = await doctorApi.getNonAvailableTimes(id, selectedDate)
      console.log("[DoctorDetails] Non-available times:", data)
      setNonAvailableTimes(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("[DoctorDetails] Error loading non-available times:", error)
      setNonAvailableTimes([])
    }
  }

  const handleFavouriteToggle = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to add doctors to favourites",
        variant: "destructive",
      })
      navigate("/signin")
      return
    }

    setTogglingFavourite(true)
    try {
      if (isFavourite) {
        await favouriteApi.removeFavourite(favouriteId)
        setIsFavourite(false)
        setFavouriteId(null)
        toast({
          title: "Removed from Favourites",
          description: `${doctor.name} has been removed from your favourites`,
        })
      } else {
        const response = await favouriteApi.addFavourite(id)
        setIsFavourite(true)
        setFavouriteId(response?.id || response?.favouriteId)
        toast({
          title: "Added to Favourites",
          description: `${doctor.name} has been added to your favourites`,
        })
      }
    } catch (error) {
      console.error("[DoctorDetails] Error toggling favourite:", error)
      toast({
        title: "Error",
        description: "Failed to update favourites. Please try again.",
        variant: "destructive",
      })
    } finally {
      setTogglingFavourite(false)
    }
  }

  // const handleBooking = async () => {
  //   if (!isAuthenticated) {
  //     toast({
  //       title: "Sign In Required",
  //       description: "Please sign in to book an appointment",
  //       variant: "destructive",
  //     })
  //     navigate("/signin")
  //     return
  //   }

  //   if (!selectedDate) {
  //     toast({
  //       title: "Date Required",
  //       description: "Please select a date for your appointment",
  //       variant: "destructive",
  //     })
  //     return
  //   }

  //   if (!selectedTime) {
  //     toast({
  //       title: "Time Required",
  //       description: "Please select a time for your appointment",
  //       variant: "destructive",
  //     })
  //     return
  //   }

  //   setBookingLoading(true)
  //   try {
  //     const bookingData = {
  //       date: selectedDate,
  //       hour: selectedTime
  //     }

  //     await bookingApi.createBooking(id, bookingData)
      
  //     toast({
  //       title: "Appointment Booked!",
  //       description: `Your appointment with ${doctor.name} has been scheduled for ${selectedDate} at ${selectedTime}`,
  //     })

  //     // Reset form
  //     setSelectedDate("")
  //     setSelectedTime("")
      
  //     // Refresh non-available times
  //     await loadNonAvailableTimes()
      
  //     // Navigate to bookings page
  //     setTimeout(() => {
  //       navigate("/bookings")
  //     }, 2000)
  //   } catch (error) {
  //     console.error("[DoctorDetails] Error booking appointment:", error)
  //     toast({
  //       title: "Booking Failed",
  //       description: error.message || "Failed to book appointment. Please try again.",
  //       variant: "destructive",
  //     })
  //   } finally {
  //     setBookingLoading(false)
  //   }
  // }
// In DoctorDetailsPage.jsx, update the handleBooking function
const handleBooking = async () => {
  if (!isAuthenticated) {
    toast({
      title: "Sign In Required",
      description: "Please sign in to book an appointment",
      variant: "destructive",
    })
    navigate("/signin")
    return
  }

  if (!selectedDate) {
    toast({
      title: "Date Required",
      description: "Please select a date for your appointment",
      variant: "destructive",
    })
    return
  }

  if (!selectedTime) {
    toast({
      title: "Time Required",
      description: "Please select a time for your appointment",
      variant: "destructive",
    })
    return
  }

  setBookingLoading(true)
  try {
    // Format data as expected by the API
    const bookingData = {
      date: selectedDate,  // Format: YYYY-MM-DD
      hour: selectedTime    // Format: HH:MM
    }

    console.log("[DoctorDetails] Sending booking data:", bookingData)
    const response = await bookingApi.createBooking(id, bookingData)
    console.log("[DoctorDetails] Booking response:", response)
    
    toast({
      title: "Appointment Booked!",
      description: `Your appointment with ${doctor.name} has been scheduled for ${selectedDate} at ${selectedTime}`,
    })

    // Reset form
    setSelectedDate("")
    setSelectedTime("")
    
    // Navigate to bookings page
    setTimeout(() => {
      navigate("/bookings")
    }, 2000)
  } catch (error) {
    console.error("[DoctorDetails] Error booking appointment:", error)
    toast({
      title: "Booking Failed",
      description: error.message || "Failed to book appointment. Please try again.",
      variant: "destructive",
    })
  } finally {
    setBookingLoading(false)
  }
}
  const isTimeSlotAvailable = (timeSlot) => {
    return !nonAvailableTimes.includes(timeSlot)
  }

  const getAvailableTimeSlots = () => {
    return availableTimeSlots.filter(slot => isTimeSlotAvailable(slot))
  }

  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Doctor Not Found</h2>
          <Button onClick={() => navigate("/doctors")}>Back to Doctors</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/doctors")}
          className="mb-6 hover:bg-primary/10"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Doctors
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Doctor Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Doctor Profile Card */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <img
                        src={doctor.photoUrl || "/placeholder.svg?height=160&width=160"}
                        alt={doctor.name}
                        className="w-40 h-40 rounded-2xl object-cover shadow-md"
                        onError={(e) => {
                          e.target.src = "/placeholder.svg?height=160&width=160"
                        }}
                      />
                      <button
                        onClick={handleFavouriteToggle}
                        disabled={togglingFavourite}
                        className={`absolute -top-2 -right-2 p-2 rounded-full shadow-lg transition-all ${
                          isFavourite 
                            ? "bg-red-500 text-white hover:bg-red-600" 
                            : "bg-white text-gray-600 hover:bg-red-50 hover:text-red-500"
                        }`}
                      >
                        {togglingFavourite ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Heart className={`h-4 w-4 ${isFavourite ? "fill-current" : ""}`} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h1 className="text-2xl font-bold text-foreground mb-1">
                          {doctor.name}
                        </h1>
                        <p className="text-lg text-primary font-medium">
                          {doctor.specialty || doctor.specialization}
                        </p>
                      </div>
                    </div>

                    {doctor.rating && (
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="font-medium ml-1">{doctor.rating}</span>
                        </div>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">
                          {doctor.reviews || 0} Reviews
                        </span>
                      </div>
                    )}

                    <div className="space-y-2">
                      {doctor.location && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">{doctor.location}</span>
                        </div>
                      )}
                      {doctor.experience && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Briefcase className="h-4 w-4" />
                          <span className="text-sm">{doctor.experience}+ years of experience</span>
                        </div>
                      )}
                      {doctor.patients && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span className="text-sm">{doctor.patients}+ happy patients</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs for About, Education, Reviews */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="border-b">
                  <div className="flex gap-6 px-6">
                    <button
                      onClick={() => setActiveTab("about")}
                      className={`py-4 text-sm font-medium transition-colors relative ${
                        activeTab === "about"
                          ? "text-primary border-b-2 border-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      About
                    </button>
                    <button
                      onClick={() => setActiveTab("education")}
                      className={`py-4 text-sm font-medium transition-colors relative ${
                        activeTab === "education"
                          ? "text-primary border-b-2 border-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Education
                    </button>
                    <button
                      onClick={() => setActiveTab("reviews")}
                      className={`py-4 text-sm font-medium transition-colors relative ${
                        activeTab === "reviews"
                          ? "text-primary border-b-2 border-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Reviews
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {activeTab === "about" && (
                    <div className="space-y-4">
                      <p className="text-foreground leading-relaxed">
                        {doctor.about || `${doctor.name} is a highly skilled and experienced ${doctor.specialty} dedicated to providing the best possible care to patients. With over ${doctor.experience || 10} years of experience in the field, they have helped numerous patients achieve better health outcomes through personalized treatment plans and compassionate care.`}
                      </p>
                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Award className="h-4 w-4 text-primary" />
                            Specialties
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {doctor.specialties || [doctor.specialty, "General Medicine", "Patient Care"]?.map((spec, idx) => (
                              <span key={idx} className="px-3 py-1 bg-primary/10 rounded-full text-sm text-primary">
                                {spec}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Globe className="h-4 w-4 text-primary" />
                            Languages
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-primary/10 rounded-full text-sm text-primary">English</span>
                            <span className="px-3 py-1 bg-primary/10 rounded-full text-sm text-primary">Arabic</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "education" && (
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-3 h-3 mt-2 rounded-full bg-primary"></div>
                        </div>
                        <div>
                          <h4 className="font-semibold flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-primary" />
                            Medical Degree
                          </h4>
                          <p className="text-muted-foreground text-sm">
                            {doctor.education || "Harvard Medical School, Boston, MA"}
                          </p>
                          <p className="text-xs text-muted-foreground">2010 - 2014</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-3 h-3 mt-2 rounded-full bg-primary"></div>
                        </div>
                        <div>
                          <h4 className="font-semibold">Residency</h4>
                          <p className="text-muted-foreground text-sm">
                            {doctor.residency || "Mayo Clinic, Rochester, MN"}
                          </p>
                          <p className="text-xs text-muted-foreground">2014 - 2018</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-3 h-3 mt-2 rounded-full bg-primary"></div>
                        </div>
                        <div>
                          <h4 className="font-semibold">Fellowship</h4>
                          <p className="text-muted-foreground text-sm">
                            {doctor.fellowship || "Johns Hopkins Hospital, Baltimore, MD"}
                          </p>
                          <p className="text-xs text-muted-foreground">2018 - 2020</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "reviews" && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 pb-4 border-b">
                        <div className="text-center">
                          <div className="text-3xl font-bold">{doctor.rating || 4.8}</div>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">Based on {doctor.reviews || 128} reviews</div>
                        </div>
                      </div>
                      
                      {/* Sample reviews */}
                      <div className="space-y-4">
                        <div className="border-b pb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">Sarah Johnson</span>
                            <span className="text-sm text-muted-foreground">2 weeks ago</span>
                          </div>
                          <div className="flex items-center mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Excellent doctor! Very knowledgeable and caring. Made me feel comfortable throughout the entire process.
                          </p>
                        </div>
                        <div className="border-b pb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">Michael Chen</span>
                            <span className="text-sm text-muted-foreground">1 month ago</span>
                          </div>
                          <div className="flex items-center mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Dr. {doctor.name} is amazing! Very thorough examination and explanation of my condition.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 border-0 shadow-lg bg-gradient-to-br from-primary/5 to-background">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Book Appointment
                </h2>
                
                {/* Contact Info */}
                <div className="space-y-3 mb-6 pb-6 border-b">
                  {doctor.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>{doctor.phone}</span>
                    </div>
                  )}
                  {doctor.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-primary" />
                      <span>{doctor.email}</span>
                    </div>
                  )}
                </div>

                {/* Date Selection */}
                <div className="mb-4">
                  <label className="text-sm font-medium mb-2 block">Select Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => {
                        setSelectedDate(e.target.value)
                        setSelectedTime("")
                      }}
                      min={getMinDate()}
                      className="w-full pl-10 pr-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Time Selection */}
                {selectedDate && (
                  <div className="mb-6">
                    <label className="text-sm font-medium mb-2 block">Select Time</label>
                    <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                      {getAvailableTimeSlots().map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`px-3 py-2 text-sm rounded-md transition-all ${
                            selectedTime === time
                              ? "bg-primary text-primary-foreground shadow-md scale-105"
                              : "bg-muted hover:bg-primary/20 text-foreground"
                          }`}
                        >
                          <Clock className="h-3 w-3 inline mr-1" />
                          {time}
                        </button>
                      ))}
                    </div>
                    {getAvailableTimeSlots().length === 0 && (
                      <div className="text-center py-4 bg-muted rounded-md">
                        <p className="text-sm text-muted-foreground">
                          No available time slots for this date
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Booking Button */}
                <Button
                  onClick={handleBooking}
                  disabled={!selectedDate || !selectedTime || bookingLoading}
                  className="w-full"
                  size="lg"
                >
                  {bookingLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Booking...
                    </>
                  ) : (
                    "Book Appointment"
                  )}
                </Button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Free cancellation up to 24 hours before appointment</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}