"use client"
import { useDispatch, useSelector } from "react-redux"
import { X, Bell, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { removeNotification, clearAllNotifications } from "@/redux/features/notificationsSlice"
import type { RootState } from "@/redux/store"
import { useState, useEffect } from "react"

export function NotificationCenter() {
  const notifications = useSelector((state: RootState) => state.notifications.items)
  const dispatch = useDispatch()
  const [hasNewNotifications, setHasNewNotifications] = useState(false)

  useEffect(() => {
    // Check if there are any unread notifications
    const unreadNotifications = notifications.filter((n) => !n.read)
    if (unreadNotifications.length > 0) {
      setHasNewNotifications(true)
    }
  }, [notifications])

  const handleDismiss = (id: string) => {
    dispatch(removeNotification(id))
  }

  const handleClearAll = () => {
    dispatch(clearAllNotifications())
    setHasNewNotifications(false)
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Bell className="h-4 w-4 mr-2" />
          <h3 className="font-medium">Notifications</h3>
          {hasNewNotifications && (
            <span className="ml-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">New</span>
          )}
        </div>
        {notifications.length > 0 && (
          <Button variant="ghost" size="sm" className="text-xs" onClick={handleClearAll}>
            <Check className="h-3 w-3 mr-1" /> Clear all
          </Button>
        )}
      </div>
      <ScrollArea className="h-[300px]">
        {notifications.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
            No new notifications
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`relative rounded-lg border p-3 transition-all duration-200 ${
                  notification.type === "price_alert"
                    ? "border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950/30"
                    : "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30"
                } ${!notification.read ? "shadow-md" : ""}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    <p className="text-xs mt-1">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(notification.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleDismiss(notification.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                {!notification.read && <div className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></div>}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

