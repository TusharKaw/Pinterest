"use client"

import { useEffect, useState } from "react"
import { MasonryGrid } from "./masonry-grid"
import type { Pin } from "@/lib/types"
import { mockPins } from "@/lib/mock-data"
import { findRelatedPins } from "@/lib/related-pins"

interface RelatedPinsProps {
  currentPin: Pin
}

export function RelatedPins({ currentPin }: RelatedPinsProps) {
  const [relatedPins, setRelatedPins] = useState<Pin[]>([])

  useEffect(() => {
    // Find related pins based on tags, title, and category
    const related = findRelatedPins(currentPin, mockPins, 12)
    setRelatedPins(related)
  }, [currentPin])

  if (relatedPins.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-foreground mb-6">More like this</h2>
        <MasonryGrid pins={relatedPins} />
      </div>
    </div>
  )
}
