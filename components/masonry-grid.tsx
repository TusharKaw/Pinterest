"use client"

import { useEffect, useState } from "react"
import { PinCard } from "./pin-card"
import type { Pin } from "@/lib/types"

interface MasonryGridProps {
  pins: Pin[]
}

export function MasonryGrid({ pins }: MasonryGridProps) {
  const [columns, setColumns] = useState(4)

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth
      if (width < 640) setColumns(2)
      else if (width < 1024) setColumns(3)
      else if (width < 1536) setColumns(4)
      else setColumns(5)
    }

    updateColumns()
    window.addEventListener("resize", updateColumns)
    return () => window.removeEventListener("resize", updateColumns)
  }, [])

  // Distribute pins across columns with better spacing
  const columnPins: Pin[][] = Array.from({ length: columns }, () => [])
  pins.forEach((pin, index) => {
    columnPins[index % columns].push(pin)
  })

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {columnPins.map((columnPinList, columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-4">
            {columnPinList.map((pin) => (
              <PinCard key={pin.id} pin={pin} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
