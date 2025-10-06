"use client"

import { useState, useEffect } from "react"
import { mockPins } from "@/lib/mock-data"
import { MasonryGrid } from "./masonry-grid"
import { Button } from "./ui/button"
import type { Pin } from "@/lib/types"

export function HomeFeed() {
  const [pins, setPins] = useState<Pin[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    // Initial load
    loadMorePins()
  }, [])

  const loadMorePins = () => {
    setIsLoading(true)
    // Simulate loading more pins
    setTimeout(() => {
      const newPins = [...mockPins, ...mockPins.map((pin) => ({ ...pin, id: `${pin.id}-${Date.now()}` }))]
      setPins((prev) => [...prev, ...newPins])
      setIsLoading(false)
    }, 500)
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
    <div className="container mx-auto px-4 py-8">
      <MasonryGrid pins={pins} />
      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button onClick={loadMorePins} disabled={isLoading} size="lg">
            {isLoading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  )
}
