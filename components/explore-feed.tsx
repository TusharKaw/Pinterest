"use client"

import { useState, useEffect } from "react"
import { mockPins } from "@/lib/mock-data"
import { MasonryGrid } from "./masonry-grid"
import { Button } from "./ui/button"
import type { Pin } from "@/lib/types"
import { TrendingSection } from "./trending-section"

const categories = ["All", "Design", "Photography", "Art", "Food", "Nature", "Interior", "Fashion"]

export function ExploreFeed() {
  const [pins, setPins] = useState<Pin[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadPins()
  }, [selectedCategory])

  const loadPins = () => {
    setIsLoading(true)
    setTimeout(() => {
      // Generate more diverse pins
      const multipliedPins = Array.from({ length: 4 }, (_, i) =>
        mockPins.map((pin) => ({
          ...pin,
          id: `${pin.id}-${i}-${Date.now()}`,
        })),
      ).flat()
      setPins(multipliedPins)
      setIsLoading(false)
    }, 300)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-[1fr_300px] gap-8">
        <div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-6">Explore</h1>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Loading pins...</p>
            </div>
          ) : (
            <MasonryGrid pins={pins} />
          )}
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-20">
            <TrendingSection />
          </div>
        </div>
      </div>
    </div>
  )
}
