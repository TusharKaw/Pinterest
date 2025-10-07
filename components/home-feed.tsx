"use client"

import { useState, useEffect } from "react"
import { MasonryGrid } from "./masonry-grid"
import { Button } from "./ui/button"
import type { Pin } from "@/lib/types"

export function HomeFeed() {
  const [pins, setPins] = useState<Pin[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  // Function to refresh pins (for when new pins are created)
  const refreshPins = () => {
    setPins([])
    setPage(1)
    setHasMore(true)
    loadMorePins()
  }

  // Expose refresh function globally for pin creation
  useEffect(() => {
    (window as any).refreshHomeFeed = refreshPins
    return () => {
      delete (window as any).refreshHomeFeed
    }
  }, [])

  useEffect(() => {
    // Initial load
    loadMorePins()
  }, [])

  const loadMorePins = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`/api/pins?page=${page}&limit=20`)
      if (response.ok) {
        const data = await response.json()
        const newPins = data.map((pin: any) => ({
          id: pin.id,
          title: pin.title,
          description: pin.description || "",
          imageUrl: pin.imageUrl,
          imageWidth: pin.imageWidth || 400,
          imageHeight: pin.imageHeight || 600,
          userId: pin.userId,
          userName: pin.userName,
          userAvatar: pin.userAvatar || "/placeholder.svg",
          tags: pin.tags || [],
          likes: pin.likes || 0,
          comments: pin.comments || 0,
          saves: pin.saves || 0,
          createdAt: pin.createdAt,
          link: pin.link
        }))
        
        setPins((prev) => [...prev, ...newPins])
        setPage((prev) => prev + 1)
        setHasMore(newPins.length === 20) // If we got less than 20, we've reached the end
      }
    } catch (error) {
      console.error("Error loading pins:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (pins.length === 0 && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">
          <h2 className="text-3xl font-bold text-foreground mb-4">Your feed is empty</h2>
          <p className="text-muted-foreground mb-8">Start following users and creating pins to see content here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-16">
      <MasonryGrid pins={pins} />
      {hasMore && (
        <div className="flex justify-center mt-8 pb-8">
          <Button onClick={loadMorePins} disabled={isLoading} size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-3">
            {isLoading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  )
}
