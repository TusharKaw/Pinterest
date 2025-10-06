"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "./ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import Link from "next/link"
import { useFollow } from "@/hooks/use-social"

interface User {
  id: string
  name: string
  username: string
  avatar: string
  bio: string
  followers: number
  pins: number
}

interface UserSearchResultsProps {
  query: string
}

export function UserSearchResults({ query }: UserSearchResultsProps) {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    // Mock user search
    const mockUsers: User[] = [
      {
        id: "1",
        name: "Sarah Design",
        username: "sarahdesign",
        avatar: "/sarah-avatar.png",
        bio: "Interior designer & minimalist enthusiast",
        followers: 12500,
        pins: 234,
      },
      {
        id: "2",
        name: "Nature Lens",
        username: "naturelens",
        avatar: "/nature-photographer.jpg",
        bio: "Landscape photographer capturing nature's beauty",
        followers: 8900,
        pins: 567,
      },
      {
        id: "3",
        name: "Coffee Culture",
        username: "coffeeculture",
        avatar: "/coffee-lover.jpg",
        bio: "Coffee lover & lifestyle blogger",
        followers: 5600,
        pins: 432,
      },
    ]

    const filtered = mockUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.username.toLowerCase().includes(query.toLowerCase()) ||
        user.bio.toLowerCase().includes(query.toLowerCase()),
    )

    setUsers(filtered)
  }, [query])

  if (users.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-foreground mb-4">No users found</h2>
        <p className="text-muted-foreground">Try a different search term</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  )
}

function UserCard({ user }: { user: User }) {
  const { isFollowing, toggleFollow } = useFollow(user.id)

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <Link href={`/profile/${user.username}`}>
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
          </Link>
          <Link href={`/profile/${user.username}`}>
            <h3 className="font-semibold text-foreground mb-1 hover:underline">{user.name}</h3>
          </Link>
          <p className="text-sm text-muted-foreground mb-2">@{user.username}</p>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{user.bio}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span>
              <strong className="text-foreground">{user.followers.toLocaleString()}</strong> followers
            </span>
            <span>
              <strong className="text-foreground">{user.pins}</strong> pins
            </span>
          </div>
          <Button variant={isFollowing ? "outline" : "default"} onClick={toggleFollow} className="w-full">
            {isFollowing ? "Following" : "Follow"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
