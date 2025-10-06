"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type NotificationType = 'like' | 'comment' | 'welcome' | 'follow' | 'mention'

export interface Notification {
  id: string
  type: NotificationType
  message: string
  read: boolean
  timestamp: Date
  userId: string
  relatedItemId?: string
  relatedItemType?: 'pin' | 'board' | 'user'
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (notificationId: string) => void
  markAllAsRead: () => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pinterest_notifications')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const unreadCount = notifications.filter(n => !n.read).length

  // Save to localStorage whenever notifications change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pinterest_notifications', JSON.stringify(notifications))
    }
  }, [notifications])

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    }
    
    setNotifications(prev => [newNotification, ...prev])
    
    // Show browser notification if permissions are granted
    if (Notification.permission === 'granted') {
      new Notification('New Notification', {
        body: newNotification.message,
        icon: '/logo.png'
      })
    }
  }

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({
        ...notification,
        read: true
      }))
    )
  }

  const clearAll = () => {
    setNotifications([])
  }

  // Request notification permission when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission()
      }
    }
  }, [])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearAll
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
