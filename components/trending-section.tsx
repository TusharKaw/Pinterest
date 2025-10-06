"use client"
import Link from "next/link"
import { TrendingUp } from "lucide-react"

const trendingTopics = [
  { name: "Minimalist Design", count: "2.5M pins" },
  { name: "Home Decor", count: "5.8M pins" },
  { name: "Travel Photography", count: "3.2M pins" },
  { name: "Food Styling", count: "4.1M pins" },
  { name: "Abstract Art", count: "1.9M pins" },
  { name: "Nature Landscapes", count: "6.3M pins" },
]

export function TrendingSection() {
  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Trending Now</h2>
      </div>
      <div className="space-y-3">
        {trendingTopics.map((topic) => (
          <Link
            key={topic.name}
            href={`/search?q=${encodeURIComponent(topic.name)}`}
            className="block p-3 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground">{topic.name}</span>
              <span className="text-sm text-muted-foreground">{topic.count}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
