// bookings-page.jsx
import { useState, useEffect } from "react"
import { MapPin, Calendar, Loader2, X } from "lucide-react"
import { Button } from "./ui/button.jsx"
import { Card, CardContent } from "./ui/card.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs.jsx"
import { useToast } from ".././hooks/use-toast.js"
import { bookingApi } from "../lib/api.js"

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("UpComming")
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(null)
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [newDate, setNewDate] = useState("")
  const [newTime, setNewTime] = useState("")
  const { toast } = useToast()

  // Map tab to API status values
  const getStatusForTab = (tab) => {
    switch (tab) {
      case "UpComming":
        return "UpComming"
      case "Completed":
        return "Completed"
      case "Cancelled":
        return "Cancelled"
      default:
        return "UpComming"
    }
  }

  // Fetch bookings based on status
  const fetchBookings = async (tab) => {
    setLoading(true)
    try {
      const statusValue = getStatusForTab(tab)
      console.log("[BookingsPage] Fetching with status:", statusValue)
      
      const data = await bookingApi.getMyBookings(statusValue)
      console.log("[BookingsPage] Response:", data)
      
      // Parse response
      let bookingsData = []
      if (Array.isArray(data)) {
        bookingsData = data
      } else if (data?.data && Array.isArray(data.data)) {
        bookingsData = data.data
      } else if (data?.$values && Array.isArray(data.$values)) {
        bookingsData = data.$values
      } else {
        bookingsData = []
      }
      
      setBookings(bookingsData)
    } catch (error) {
      console.error("[BookingsPage] Error fetching bookings:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to load bookings. Please try again.",
        variant: "destructive",
      })
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  // Cancel booking
  const cancelBooking = async (bookingId) => {
    setActionLoading(bookingId)
    try {
      await bookingApi.cancelBooking(bookingId)
      
      toast({
        title: "Success",
        description: "Booking cancelled successfully",
      })

      // Refresh the current tab's bookings
      await fetchBookings(activeTab)
    } catch (error) {
      console.error("[BookingsPage] Error cancelling booking:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to cancel booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  // Open reschedule modal
  const openRescheduleModal = (booking) => {
    setSelectedBooking(booking)
    const existingDate = new Date(booking.date)
    setNewDate(existingDate.toISOString().split('T')[0])
    setNewTime(existingDate.toTimeString().slice(0, 5))
    setShowRescheduleModal(true)
  }

  // Close reschedule modal
  const closeRescheduleModal = () => {
    setShowRescheduleModal(false)
    setSelectedBooking(null)
    setNewDate("")
    setNewTime("")
  }

  // Reschedule booking
  const handleReschedule = async () => {
    if (!newDate || !newTime) {
      toast({
        title: "Error",
        description: "Please select both date and time",
        variant: "destructive",
      })
      return
    }

    const newDateTime = new Date(`${newDate}T${newTime}:00`).toISOString()
    
    setActionLoading(selectedBooking.id)
    try {
      const updateData = {
        date: newDateTime,
        doctorId: selectedBooking.doctor?.id,
      }

      await bookingApi.rescheduleBooking(selectedBooking.id, updateData)

      toast({
        title: "Success",
        description: "Booking rescheduled successfully",
      })

      closeRescheduleModal()
      await fetchBookings(activeTab)
    } catch (error) {
      console.error("[BookingsPage] Error rescheduling booking:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to reschedule booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  // Fetch bookings when tab changes
  useEffect(() => {
    fetchBookings(activeTab)
  }, [activeTab])

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Date not available"
    try {
      const date = new Date(dateString)
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      return "Invalid date"
    }
  }

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">My Bookings</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="UpComming">Upcoming</TabsTrigger>
            <TabsTrigger value="Completed">Completed</TabsTrigger>
            <TabsTrigger value="Cancelled">Cancelled</TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <TabsContent value="UpComming" className="space-y-4">
                {bookings.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No upcoming appointments
                  </div>
                ) : (
                  bookings.map((booking) => (
                    <Card key={booking.id} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                          <Calendar className="h-4 w-4" />
                          {formatDate(booking.date)}
                        </div>
                        <div className="flex gap-4 mb-4">
                          <img
                            src={booking.doctor?.image || "/placeholder.svg?height=80&width=80"}
                            alt={booking.doctor?.name}
                            className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-foreground mb-1">
                              {booking.doctor?.name || "Doctor"}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {booking.doctor?.specialty || "General"}
                            </p>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              {booking.doctor?.location || "Location not specified"}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            className="flex-1 bg-transparent"
                            onClick={() => cancelBooking(booking.id)}
                            disabled={actionLoading === booking.id}
                          >
                            {actionLoading === booking.id ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : null}
                            Cancel
                          </Button>
                          <Button
                            className="flex-1"
                            onClick={() => openRescheduleModal(booking)}
                            disabled={actionLoading === booking.id}
                          >
                            {actionLoading === booking.id ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : null}
                            Reschedule
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="Completed">
                {bookings.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No completed appointments
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <Card key={booking.id} className="overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                            <Calendar className="h-4 w-4" />
                            {formatDate(booking.date)}
                          </div>
                          <div className="flex gap-4">
                            <img
                              src={booking.doctor?.image || "/placeholder.svg?height=80&width=80"}
                              alt={booking.doctor?.name}
                              className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-foreground mb-1">
                                {booking.doctor?.name || "Doctor"}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                {booking.doctor?.specialty || "General"}
                              </p>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                {booking.doctor?.location || "Location not specified"}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="Cancelled">
                {bookings.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No cancelled appointments
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <Card key={booking.id} className="overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                            <Calendar className="h-4 w-4" />
                            {formatDate(booking.date)}
                          </div>
                          <div className="flex gap-4">
                            <img
                              src={booking.doctor?.image || "/placeholder.svg?height=80&width=80"}
                              alt={booking.doctor?.name}
                              className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-foreground mb-1">
                                {booking.doctor?.name || "Doctor"}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                {booking.doctor?.specialty || "General"}
                              </p>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                {booking.doctor?.location || "Location not specified"}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-foreground">Reschedule Appointment</h2>
              <button
                onClick={closeRescheduleModal}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b">
                <img
                  src={selectedBooking.doctor?.image || "/placeholder.svg?height=60&width=60"}
                  alt={selectedBooking.doctor?.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-foreground">{selectedBooking.doctor?.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedBooking.doctor?.specialty}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Select New Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  min={getMinDate()}
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Select New Time</label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="pt-4 space-y-2">
                <p className="text-sm text-muted-foreground">
                  Current appointment: {formatDate(selectedBooking.date)}
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t">
              <Button
                variant="outline"
                onClick={closeRescheduleModal}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleReschedule}
                disabled={actionLoading === selectedBooking.id}
                className="flex-1"
              >
                {actionLoading === selectedBooking.id ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Confirm Reschedule
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}