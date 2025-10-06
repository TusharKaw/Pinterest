"use client"

import { useState, useEffect } from "react"
import { Bell, Check, ChevronDown } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useNotifications, type NotificationType } from "@/contexts/notification-context"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"

export function NotificationsDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'like':
        return '❤️'
      case 'comment':
        return '💬'
      case 'welcome':
        return '👋'
      case 'follow':
        return '👥'
      case 'mention':
        return '@'
      default:
        return '🔔'
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open && unreadCount > 0) {
      markAllAsRead()
    }
  }

  return (
    <DropdownMenu onOpenChange={handleOpenChange} open={isOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 max-h-[500px] overflow-y-auto" align="end">
        <div className="flex items-center justify-between px-2 py-1.5">
          <h4 className="text-sm font-medium">Notifications</h4>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 text-xs"
              onClick={(e) => {
                e.stopPropagation()
                markAllAsRead()
              }}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        
        {notifications.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            No notifications yet
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem 
              key={notification.id} 
              className={`flex items-start gap-3 p-3 cursor-pointer ${!notification.read ? 'bg-accent' : ''}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex-shrink-0 mt-0.5">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`/placeholder.svg?height=32&width=32&query=user+${notification.userId}`} />
                  <AvatarFallback>{notification.userId?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{getNotificationIcon(notification.type)}</span>
                  <p className="text-sm font-medium truncate">{notification.message}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                </p>
              </div>
              {!notification.read && (
                <span className="w-2 h-2 rounded-full bg-primary ml-2 flex-shrink-0" />
              )}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
