"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Settings, Share2 } from "lucide-react"
import Link from "next/link"
import { mockPins } from "@/lib/mock-data"
import { MasonryGrid } from "./masonry-grid"
import type { Pin, Board } from "@/lib/types"
import { useFollow } from "@/hooks/use-social"
import { Card, CardContent } from "./ui/card"

interface UserProfileProps {
  username: string
}

interface ProfileUser {
  id: string
  name: string
  username: string
  avatar: string
  bio: string
  followers: number
  following: number
  website?: string
}

export function UserProfile({ username }: UserProfileProps) {
  const { user: currentUser } = useAuth()
  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null)
  const [pins, setPins] = useState<Pin[]>([])
  const [boards, setBoards] = useState<Board[]>([])
  const { isFollowing, toggleFollow } = useFollow(profileUser?.id || "")

  const isOwnProfile = currentUser?.username === username

  useEffect(() => {
    // Mock profile data
    const mockProfile: ProfileUser = {
      id: "1",
      name: "Sarah Design",
      username: "sarahdesign",
      avatar: "/sarah-avatar.png",
      bio: "Interior designer & minimalist enthusiast. Creating beautiful spaces that inspire. 🏡✨",
      followers: 12500,
      following: 342,
      website: "https://sarahdesign.com",
    }
    setProfileUser(mockProfile)

    // Load user's pins
    const userPins = mockPins.filter((pin) => pin.userId === "1")
    const multiplied = Array.from({ length: 3 }, (_, i) =>
      userPins.map((pin) => ({ ...pin, id: `${pin.id}-profile-${i}` })),
    ).flat()
    setPins(multiplied)

    // Load user's boards
    const mockBoards: Board[] = [
      {
        id: "1",
        name: "Home Inspiration",
        description: "Ideas for my dream home",
        userId: "1",
        pins: ["1", "5"],
        isPrivate: false,
        coverImage: "/modern-minimalist-interior-design.jpg",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Travel Dreams",
        description: "Places I want to visit",
        userId: "1",
        pins: ["2"],
        isPrivate: false,
        coverImage: "/sunset-mountain-landscape.jpg",
        createdAt: new Date().toISOString(),
      },
    ]
    setBoards(mockBoards)
  }, [username])

  if (!profileUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">User not found</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex flex-col items-center text-center mb-8">
          <Avatar className="h-32 w-32 mb-4">
            <AvatarImage src={profileUser.avatar || "/placeholder.svg"} alt={profileUser.name} />
            <AvatarFallback className="text-3xl">{profileUser.name[0]}</AvatarFallback>
          </Avatar>
          <h1 className="text-3xl font-bold text-foreground mb-2">{profileUser.name}</h1>
          <p className="text-muted-foreground mb-1">@{profileUser.username}</p>
          {profileUser.website && (
            <a
              href={profileUser.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline mb-4"
            >
              {profileUser.website}
            </a>
          )}
          <p className="text-foreground max-w-md mb-6">{profileUser.bio}</p>

          <div className="flex items-center gap-6 mb-6 text-sm">
            <div>
              <span className="font-semibold text-foreground">{profileUser.followers.toLocaleString()}</span>{" "}
              <span className="text-muted-foreground">followers</span>
            </div>
            <div>
              <span className="font-semibold text-foreground">{profileUser.following.toLocaleString()}</span>{" "}
              <span className="text-muted-foreground">following</span>
            </div>
            <div>
              <span className="font-semibold text-foreground">{pins.length}</span>{" "}
              <span className="text-muted-foreground">pins</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isOwnProfile ? (
              <>
                <Link href="/settings">
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant={isFollowing ? "outline" : "default"} onClick={toggleFollow}>
                  {isFollowing ? "Following" : "Follow"}
                </Button>
                <Button variant="outline">Message</Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="pins" className="w-full">
        <TabsList className="w-full justify-center mb-8">
          <TabsTrigger value="pins">Pins</TabsTrigger>
          <TabsTrigger value="boards">Boards</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>

        <TabsContent value="pins">
          {pins.length > 0 ? (
            <MasonryGrid pins={pins} />
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-foreground mb-4">No pins yet</h2>
              <p className="text-muted-foreground">
                {isOwnProfile
                  ? "Start creating pins to share your inspiration"
                  : "This user hasn't created any pins yet"}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="boards">
          {boards.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {boards.map((board) => (
                <Link key={board.id} href={`/board/${board.id}`}>
                  <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="relative aspect-square bg-muted overflow-hidden rounded-t-lg">
                        {board.coverImage ? (
                          <img
                            src={board.coverImage || "/placeholder.svg"}
                            alt={board.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-4xl text-muted-foreground">📌</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground mb-1">{board.name}</h3>
                        <p className="text-xs text-muted-foreground">{board.pins.length} pins</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-foreground mb-4">No boards yet</h2>
              <p className="text-muted-foreground">
                {isOwnProfile ? "Create boards to organize your pins" : "This user hasn't created any boards yet"}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-foreground mb-4">Saved pins</h2>
            <p className="text-muted-foreground">
              {isOwnProfile ? "Pins you save will appear here" : "Only visible to the profile owner"}
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
