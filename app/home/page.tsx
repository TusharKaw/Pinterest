"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { HomeFeed } from "@/components/home-feed"
import { Header } from "@/components/header"

export default function HomePageFeed() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return // Still loading

    if (!session) {
      // User is not authenticated, redirect to login
      router.push("/login")
    }
  }, [session, status, router])

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated (will redirect)
  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HomeFeed />
    </div>
  )
}
