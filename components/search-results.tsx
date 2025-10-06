"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { mockPins } from "@/lib/mock-data"
import { MasonryGrid } from "./masonry-grid"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import type { Pin } from "@/lib/types"
import { UserSearchResults } from "./user-search-results"
import { Spinner } from "./ui/spinner"

const PAGE_SIZE = 20

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

export function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const debouncedQuery = useDebounce(query, 300)
  const [pins, setPins] = useState<Pin[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const observer = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Search function
  const searchPins = useCallback(
    async (searchQuery: string, pageNum: number, append = false) => {
      if (!searchQuery.trim()) {
        setPins([])
        setHasMore(false)
        return
      }

      const loading = pageNum === 1 ? setIsLoading : setIsLoadingMore
      loading(true)

      try {
        // Simulate API call with mock data
        await new Promise((resolve) => setTimeout(resolve, 500))
        
        const filtered = mockPins.filter(
          (pin) =>
            pin.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pin.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pin.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
        )

        // Simulate pagination
        const start = (pageNum - 1) * PAGE_SIZE
        const end = start + PAGE_SIZE
        const paginated = filtered.slice(0, end)
        
        // Add some variety to the results
        const variedResults = paginated.map((pin) => ({
          ...pin,
          id: `${pin.id}-${Math.random().toString(36).substr(2, 6)}`,
        }))

        if (append) {
          setPins((prev) => {
            // Remove duplicates by ID
            const existingIds = new Set(prev.map((p) => p.id))
            const newPins = variedResults.filter((p) => !existingIds.has(p.id))
            return [...prev, ...newPins]
          })
        } else {
          setPins(variedResults)
        }

        setHasMore(variedResults.length < filtered.length)
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        loading(false)
      }
    },
    []
  )

  // Initial search when query changes
  useEffect(() => {
    setPage(1)
    searchPins(debouncedQuery, 1, false)
  }, [debouncedQuery, searchPins])

  // Load more when reaching the bottom
  useEffect(() => {
    if (isLoading || isLoadingMore || !hasMore) return

    const currentObserver = observer.current
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        const nextPage = page + 1
        setPage(nextPage)
        searchPins(debouncedQuery, nextPage, true)
      }
    }

    if (loadMoreRef.current) {
      observer.current = new IntersectionObserver(observerCallback, {
        root: null,
        rootMargin: "100px",
        threshold: 0.1,
      })
      observer.current.observe(loadMoreRef.current)
    }

    return () => {
      if (currentObserver) {
        currentObserver.disconnect()
      }
    }
  }, [isLoading, isLoadingMore, hasMore, page, debouncedQuery, searchPins])

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">
          <h2 className="text-3xl font-bold text-foreground mb-4">Search for inspiration</h2>
          <p className="text-muted-foreground">Enter a search term to discover pins</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Search results for "{query}"</h1>
        <p className="text-muted-foreground">{pins.length} pins found</p>
      </div>

      <Tabs defaultValue="pins" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="pins">Pins</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="boards">Boards</TabsTrigger>
        </TabsList>

        <TabsContent value="pins">
          {isLoading ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Searching...</p>
            </div>
          ) : pins.length > 0 ? (
            <MasonryGrid pins={pins} />
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-foreground mb-4">No pins found</h2>
              <p className="text-muted-foreground">Try a different search term</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="users">
          <UserSearchResults query={query} />
        </TabsContent>

        <TabsContent value="boards">
          <div className="text-center py-20">
            <p className="text-muted-foreground">Board search coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
