"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { MasonryGrid } from "@/components/masonry-grid"
import { Button } from "./ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Card, CardContent } from "./ui/card"
import { Search, Users, Image } from "lucide-react"
import Link from "next/link"
import type { Pin } from "@/lib/types"

interface SearchUser {
  id: string
  name: string
  username: string
  avatar?: string
  bio?: string
  website?: string
  followers: number
  following: number
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [searchResults, setSearchResults] = useState<{
    pins: Pin[]
    users: SearchUser[]
    totalPins: number
    totalUsers: number
  }>({
    pins: [],
    users: [],
    totalPins: 0,
    totalUsers: 0
  })
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('pins')

  useEffect(() => {
    if (query) {
      performSearch(query)
    }
  }, [query])

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&type=all`)
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data)
      }
    } catch (error) {
      console.error('Error searching:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!query) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-20">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-2">Search Pinterest</h1>
              <p className="text-muted-foreground">Find ideas, people, and inspiration</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Search results for "{query}"
            </h1>
            <p className="text-muted-foreground">
              {searchResults.totalPins} pins • {searchResults.totalUsers} people
            </p>
          </div>

          {/* Search Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start mb-8">
              <TabsTrigger value="pins" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                Pins ({searchResults.totalPins})
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                People ({searchResults.totalUsers})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pins">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : searchResults.pins.length > 0 ? (
                <MasonryGrid pins={searchResults.pins} />
              ) : (
                <div className="text-center py-20">
                  <Image className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-foreground mb-2">No pins found</h2>
                  <p className="text-muted-foreground">
                    Try searching for something else or create a new pin
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="users">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : searchResults.users.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.users.map((user) => (
                    <Link key={user.id} href={`/profile/${user.username}`}>
                      <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                              <AvatarFallback className="text-xl">{user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-foreground group-hover:underline truncate">
                                {user.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">@{user.username}</p>
                              {user.bio && (
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                  {user.bio}
                                </p>
                              )}
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <span>{user.followers} followers</span>
                                <span>{user.following} following</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-foreground mb-2">No people found</h2>
                  <p className="text-muted-foreground">
                    Try searching for a different username or name
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}