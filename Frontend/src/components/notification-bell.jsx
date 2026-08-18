// src/components/notification-bell.jsx
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Bell } from "lucide-react"
import { Badge } from "./ui/badge"
import { notificationApi } from "../lib/api"

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetchUnreadCount()
    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchUnreadCount = async () => {
    try {
      const notifications = await notificationApi.getNotifications()
      const unread = notifications.filter(n => !n.isRead).length
      setUnreadCount(unread)
    } catch (error) {
      console.error("Failed to fetch unread count:", error)
    }
  }

  return (
    <Link to="/notifications" className="relative">
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </Badge>
      )}
    </Link>
  )
}