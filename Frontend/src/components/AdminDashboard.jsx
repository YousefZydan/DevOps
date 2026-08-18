// AdminDashboard.jsx
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { 
  Calendar, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  Search,
  LogOut,
  Stethoscope,
  Mail,
  Phone,
  MapPin,
  Loader2,
  Eye,
  User,
  FileText,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Filter,
  Download,
  MoreVertical
} from "lucide-react"
import { Button } from "./ui/button.jsx"
import { Card, CardContent } from "./ui/card.jsx"
import { Input } from "./ui/input.jsx"
import { useToast } from "../hooks/use-toast.js"
import { useAuth } from "../lib/auth-context.jsx"

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("upcoming")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()
  const { logout, isAdmin, user } = useAuth()

  useEffect(() => {
    // Check if user is admin
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      })
      navigate("/")
      return
    }
    
    // Load mock data for admin
    loadMockData()
  }, [])

  const loadMockData = () => {
    setLoading(true)
    
    // Mock appointments data matching your images
    const mockAppointments = [
      {
        id: "1",
        patientName: "Mariam",
        patientPhone: "01202156947",
        patientEmail: "mariam@example.com",
        date: "2026-05-06T11:00:00",
        status: "Completed",
        doctor: {
          name: "Dr. Youssef",
          specialty: "Neuro",
          location: "Cairo, Egypt"
        }
      },
      {
        id: "2",
        patientName: "Mariam",
        patientPhone: "01202156947",
        patientEmail: "mariam@example.com",
        date: "2026-05-06T09:00:00",
        status: "Completed",
        doctor: {
          name: "Dr. Youssef",
          specialty: "Neuro",
          location: "Cairo, Egypt"
        }
      },
      {
        id: "3",
        patientName: "Mariam",
        patientPhone: "012021569147",
        patientEmail: "mariam@example.com",
        date: "2026-11-11T09:30:00",
        status: "UpComing",
        doctor: {
          name: "Dr. Youssef",
          specialty: "Neuro",
          location: "Cairo, Egypt"
        }
      },
      {
        id: "4",
        patientName: "marwan",
        patientPhone: "01142473862",
        patientEmail: "marwan@example.com",
        date: "2026-06-13T10:30:00",
        status: "Completed",
        doctor: {
          name: "Dr. Youssef",
          specialty: "Neuro",
          location: "Cairo, Egypt"
        }
      },
      {
        id: "5",
        patientName: "marwan",
        patientPhone: "01142473862",
        patientEmail: "marwan@example.com",
        date: "2026-06-30T10:00:00",
        status: "Completed",
        doctor: {
          name: "Dr. Youssef",
          specialty: "Neuro",
          location: "Cairo, Egypt"
        }
      },
      {
        id: "6",
        patientName: "Mariam",
        patientPhone: "01202156947",
        patientEmail: "mariam@example.com",
        date: "2026-05-06T12:30:00",
        status: "Completed",
        doctor: {
          name: "Dr. Youssef",
          specialty: "Neuro",
          location: "Cairo, Egypt"
        }
      }
    ]
    
    setAppointments(mockAppointments)
    setLoading(false)
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    })
    navigate("/signin")
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    } catch (error) {
      return "Invalid date"
    }
  }

  const getFilteredAppointments = () => {
    let filtered = [...appointments]
  
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.patientEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.patientPhone?.includes(searchTerm)
      )
    }
    
    // Filter by tab
    const now = new Date()
    filtered = filtered.filter(app => {
      const appDate = new Date(app.date)
      switch (activeTab) {
        case "upcoming":
          return appDate > now && app.status !== "Cancelled"
        case "completed":
          return app.status === "Completed"
        case "cancelled":
          return app.status === "Cancelled"
        default:
          return true
      }
    })
    
    return filtered
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">✓ Completed</span>
      case "UpComing":
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">Upcoming</span>
      case "Cancelled":
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">✗ Cancelled</span>
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{status}</span>
    }
  }

  const filteredAppointments = getFilteredAppointments()
  
  const stats = {
    total: appointments.length,
    upcoming: appointments.filter(a => new Date(a.date) > new Date() && a.status !== "Cancelled").length,
    completed: appointments.filter(a => a.status === "Completed").length,
    cancelled: appointments.filter(a => a.status === "Cancelled").length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="p-2 bg-primary/10 rounded-xl">
                <Stethoscope className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Appointments</h1>
                <p className="text-xs text-muted-foreground">Manage all patient appointments</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">
                    {user?.name?.charAt(0) || "A"}
                  </span>
                </div>
                <span className="text-sm font-medium hidden sm:block">{user?.name || "Admin"}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by patient name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
              activeTab === "upcoming"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Upcoming ({stats.upcoming})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
              activeTab === "completed"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Completed ({stats.completed})
          </button>
          <button
            onClick={() => setActiveTab("cancelled")}
            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
              activeTab === "cancelled"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Cancelled ({stats.cancelled})
          </button>
        </div>

        {/* Appointments List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredAppointments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No appointments found
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {appointment.patientName || "Patient Name"}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {appointment.patientPhone || "No phone"}
                          </p>
                        </div>
                        {getStatusBadge(appointment.status)}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(appointment.date)}</span>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                          {appointment.patientEmail && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs">{appointment.patientEmail}</span>
                            </div>
                          )}
                          {appointment.doctor?.name && (
                            <div className="flex items-center gap-2">
                              <Stethoscope className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs">Dr. {appointment.doctor.name}</span>
                            </div>
                          )}
                          {appointment.doctor?.specialty && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">{appointment.doctor.specialty}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedAppointment(appointment)
                        setShowDetailsModal(true)
                      }}
                      className="self-start"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Appointment Details Modal */}
      {showDetailsModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-lg font-bold text-foreground">Appointment Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Patient Info */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Patient Information</h3>
                <div className="space-y-2">
                  <p className="text-base font-medium">{selectedAppointment.patientName || "N/A"}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span>{selectedAppointment.patientPhone || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <span>{selectedAppointment.patientEmail || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Doctor Info */}
              <div className="pt-3 border-t">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Doctor Information</h3>
                <div className="space-y-2">
                  <p className="text-base font-medium">{selectedAppointment.doctor?.name || "N/A"}</p>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.doctor?.specialty || "General"}</p>
                  {selectedAppointment.doctor?.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span>{selectedAppointment.doctor.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Appointment Info */}
              <div className="pt-3 border-t">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Appointment Details</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span>{formatDate(selectedAppointment.date)}</span>
                  </div>
                  <div>
                    {getStatusBadge(selectedAppointment.status)}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t p-4">
              <Button onClick={() => setShowDetailsModal(false)} className="w-full">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}