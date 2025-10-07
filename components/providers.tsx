"use client"

import { SessionProvider } from "next-auth/react"
import { AuthProvider } from "@/components/auth-provider"
import { NotificationProvider } from "@/contexts/notification-context"
import { Suspense } from "react"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <SessionProvider>
        <AuthProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </AuthProvider>
      </SessionProvider>
    </Suspense>
  )
}

