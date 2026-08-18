// AdminOverview.jsx
import { useState, useEffect } from "react"
import { Calendar, Clock, Users, CheckCircle, XCircle, Timer, TrendingUp } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { dashboardApi } from "../lib/api"

export default function AdminOverview({ profile }) {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0
  })
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const allBookings = await dashboardApi.getMyBookings()
      const bookings = Array.isArray(allBookings) ? allBookings : allBookings?.data || []
      
      const stats = {
        total: bookings.length,
        pending: bookings.filter(b => b.status?.toLowerCase() === 'pending').length,
        confirmed: bookings.filter(b => b.status?.toLowerCase() === 'confirmed').length,
        completed: bookings.filter(b => b.status?.toLowerCase() === 'completed').length,
        cancelled: bookings.filter(b => b.status?.toLowerCase() === 'cancelled').length
      }
      
      setStats(stats)
      setRecentBookings(bookings.slice(0, 5))
    } catch (error) {
      console.error("[AdminOverview] Error loading stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { label: "Total Appointments", value: stats.total, icon: Calendar, color: "bg-blue-500" },
    { label: "Pending", value: stats.pending, icon: Timer, color: "bg-yellow-500" },
    { label: "Confirmed", value: stats.confirmed, icon: CheckCircle, color: "bg-green-500" },
    { label: "Completed", value: stats.completed, icon: TrendingUp, color: "bg-purple-500" },
    { label: "Cancelled", value: stats.cancelled, icon: XCircle, color: "bg-red-500" },
  ]

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'confirmed': return 'bg-green-100 text-green-700'
      case 'completed': return 'bg-blue-100 text-blue-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-foreground">Hello, Dr. {profile?.name?.split(" ")[0] || "Doctor"}!</h3>
        <p className="text-muted-foreground mt-1">Here's what's happening with your practice today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10`}>
                  <stat.icon className={`h-5 w-5 ${stat.color.replace("bg-", "text-")}`} />
                </div>
                <span className="text-2xl font-bold text-foreground">{stat.value}</span>
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Appointments */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Appointments</h3>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </div>
          
          {recentBookings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No appointments yet
            </div>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{booking.patientName || "Patient"}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(booking.date)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status || "Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}