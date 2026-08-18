// src/components/notification.jsx
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Bell, CheckCheck, Clock, Trash2, Mail, Calendar, AlertCircle, Info } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { useAuth } from "../lib/auth-context"
import { notificationApi } from "../lib/api"

// Simple loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
)

// Simple loading skeleton (divs with animation)
const NotificationSkeleton = () => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all") // all, unread, read
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate("/signin")
      return
    }
    fetchNotifications()
  }, [user, navigate])

  const fetchNotifications = async () => {
    try {
      setIsLoading(true)
      setError("")
      const response = await notificationApi.getNotifications()
      // Handle different response structures
      const notificationsData = response.data || response || []
      setNotifications(notificationsData)
    } catch (err) {
      console.error("[v0] Failed to fetch notifications:", err)
      setError(err.message || "Failed to load notifications")
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationApi.markAsRead(notificationId)
      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId || notif.notificationId === notificationId
            ? { ...notif, isRead: true, readAt: new Date().toISOString() }
            : notif
        )
      )
    } catch (err) {
      console.error("[v0] Failed to mark as read:", err)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead)
      await Promise.all(
        unreadNotifications.map(notif => 
          notificationApi.markAsRead(notif.id || notif.notificationId)
        )
      )
      // Update all as read
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, isRead: true, readAt: new Date().toISOString() }))
      )
    } catch (err) {
      console.error("[v0] Failed to mark all as read:", err)
    }
  }

  const handleDelete = async (notificationId) => {
    try {
      await notificationApi.deleteNotification(notificationId)
      setNotifications(prev => prev.filter(notif => 
        (notif.id !== notificationId && notif.notificationId !== notificationId)
      ))
    } catch (err) {
      console.error("[v0] Failed to delete notification:", err)
    }
  }

  const getNotificationIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "appointment":
      case "appointment_reminder":
        return <Calendar className="h-5 w-5 text-blue-500" />
      case "message":
        return <Mail className="h-5 w-5 text-green-500" />
      case "alert":
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "info":
        return <Info className="h-5 w-5 text-purple-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "recently"
    
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
    
    return date.toLocaleDateString()
  }

  const getFilteredNotifications = () => {
    if (selectedFilter === "unread") {
      return notifications.filter(n => !n.isRead)
    }
    if (selectedFilter === "read") {
      return notifications.filter(n => n.isRead)
    }
    return notifications
  }

  const filteredNotifications = getFilteredNotifications()
  const unreadCount = notifications.filter(n => !n.isRead).length

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <NotificationSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Bell className="h-8 w-8" />
                Notifications
              </h1>
              <p className="text-gray-600 mt-1">
                Stay updated with your appointments and messages
              </p>
            </div>
            
            {unreadCount > 0 && (
              <Button
                onClick={handleMarkAllAsRead}
                variant="outline"
                className="gap-2"
              >
                <CheckCheck className="h-4 w-4" />
                Mark all as read
              </Button>
            )}
          </div>

          {/* Filters */}
          <div className="flex gap-2 mt-6">
            <Button
              variant={selectedFilter === "all" ? "default" : "outline"}
              onClick={() => setSelectedFilter("all")}
              className="gap-2"
              size="sm"
            >
              All
              <Badge variant="secondary" className="ml-1">
                {notifications.length}
              </Badge>
            </Button>
            <Button
              variant={selectedFilter === "unread" ? "default" : "outline"}
              onClick={() => setSelectedFilter("unread")}
              className="gap-2"
              size="sm"
            >
              Unread
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {unreadCount}
                </Badge>
              )}
            </Button>
            <Button
              variant={selectedFilter === "read" ? "default" : "outline"}
              onClick={() => setSelectedFilter("read")}
              className="gap-2"
              size="sm"
            >
              Read
              <Badge variant="secondary" className="ml-1">
                {notifications.filter(n => n.isRead).length}
              </Badge>
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchNotifications}
              className="mt-2"
            >
              Try again
            </Button>
          </div>
        )}

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No notifications
              </h3>
              <p className="text-gray-600">
                {selectedFilter === "all" 
                  ? "You're all caught up! New notifications will appear here."
                  : `No ${selectedFilter} notifications to show.`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => {
              const notificationId = notification.id || notification.notificationId
              const isRead = notification.isRead || notification.read
              const title = notification.title || notification.subject || "Notification"
              const message = notification.message || notification.body || notification.content
              const type = notification.type || notification.notificationType
              const createdAt = notification.createdAt || notification.createdDate || notification.date
              
              return (
                <Card
                  key={notificationId}
                  className={`transition-all hover:shadow-md ${
                    !isRead ? "bg-blue-50/50 border-l-4 border-l-blue-500" : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div className="flex-1">
                            <h3 className={`text-base font-semibold ${
                              !isRead ? "text-gray-900" : "text-gray-700"
                            }`}>
                              {title}
                            </h3>
                            <p className="text-gray-600 mt-1">
                              {message}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="h-3 w-3" />
                                <span>
                                  {formatTimeAgo(createdAt)}
                                </span>
                              </div>
                              {notification.readAt && (
                                <div className="text-xs text-gray-500">
                                  Read {formatTimeAgo(notification.readAt)}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            {!isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkAsRead(notificationId)}
                                className="text-blue-600 hover:text-blue-700"
                                title="Mark as read"
                              >
                                <CheckCheck className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(notificationId)}
                              className="text-red-600 hover:text-red-700"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}