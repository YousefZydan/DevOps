// AdminBookings.jsx
import { useState, useEffect } from "react"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Mail,
  CheckCircle,
  XCircle,
  Loader2,
  Search,
  Filter,
  Eye
} from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Input } from "./ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { useToast } from "../hooks/use-toast"
import { dashboardApi } from "../lib/api"

export default function AdminBookings() {
  const [activeTab, setActiveTab] = useState("all")
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    loadBookings()
  }, [activeTab])

  const loadBookings = async () => {
    setLoading(true)
    try {
      let status = null
      if (activeTab !== "all") {
        status = activeTab
      }
      
      const data = await dashboardApi.getMyBookings(status)
      console.log("[AdminBookings] Bookings:", data)
      
      let bookingsData = []
      if (Array.isArray(data)) {
        bookingsData = data
      } else if (data?.data && Array.isArray(data.data)) {
        bookingsData = data.data
      } else {
        bookingsData = []
      }
      
      setBookings(bookingsData)
    } catch (error) {
      console.error("[AdminBookings] Error loading bookings:", error)
      toast({
        title: "Error",
        description: "Failed to load appointments",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (bookingId, newStatus) => {
    setUpdatingId(bookingId)
    try {
      await dashboardApi.updateBookingStatus(bookingId, newStatus)
      
      toast({
        title: "Status Updated",
        description: `Appointment marked as ${newStatus}`,
      })
      
      // Refresh the list
      await loadBookings()
    } catch (error) {
      console.error("[AdminBookings] Error updating status:", error)
      toast({
        title: "Error",
        description: "Failed to update appointment status",
        variant: "destructive",
      })
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'confirmed': return 'bg-green-100 text-green-700 border-green-200'
      case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const filteredBookings = bookings.filter(booking => {
    if (!searchQuery) return true
    const searchLower = searchQuery.toLowerCase()
    return (
      booking.patientName?.toLowerCase().includes(searchLower) ||
      booking.patientEmail?.toLowerCase().includes(searchLower) ||
      booking.id?.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={loadBookings}>
          <Filter className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredBookings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No appointments found
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Patient Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-foreground">
                              {booking.patientName || "Patient Name"}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                                {booking.status || "Pending"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {booking.patientEmail && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-4 w-4" />
                              {booking.patientEmail}
                            </div>
                          )}
                          {booking.patientPhone && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="h-4 w-4" />
                              {booking.patientPhone}
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {formatDate(booking.date)}
                          </div>
                          {booking.location && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              {booking.location}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 items-start">
                        {booking.status?.toLowerCase() === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => updateStatus(booking.id, 'confirmed')}
                              disabled={updatingId === booking.id}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {updatingId === booking.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Confirm
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateStatus(booking.id, 'cancelled')}
                              disabled={updatingId === booking.id}
                            >
                              {updatingId === booking.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Cancel
                                </>
                              )}
                            </Button>
                          </>
                        )}
                        
                        {booking.status?.toLowerCase() === 'confirmed' && (
                          <Button
                            size="sm"
                            onClick={() => updateStatus(booking.id, 'completed')}
                            disabled={updatingId === booking.id}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            {updatingId === booking.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Mark Completed
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}