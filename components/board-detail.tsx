"use client"

import { useState, useEffect } from "react"
import { mockPins } from "@/lib/mock-data"
import { MasonryGrid } from "./masonry-grid"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Lock, MoreHorizontal, Share2 } from "lucide-react"
import { useAuth } from "./auth-provider"
import type { Board, Pin } from "@/lib/types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

interface BoardDetailProps {
  boardId: string
}

export function BoardDetail({ boardId }: BoardDetailProps) {
  const { user } = useAuth()
  const [board, setBoard] = useState<Board | null>(null)
  const [pins, setPins] = useState<Pin[]>([])

  useEffect(() => {
    // Mock board data
    const mockBoard: Board = {
      id: boardId,
      name: "Home Inspiration",
      description: "Ideas for my dream home - modern, minimalist, and cozy",
      userId: user?.id || "1",
      pins: ["1", "5"],
      isPrivate: false,
      coverImage: "/modern-minimalist-interior-design.jpg",
      createdAt: new Date().toISOString(),
    }
    setBoard(mockBoard)

    // Load pins for this board
    const boardPins = mockPins.filter((pin) => mockBoard.pins.includes(pin.id))
    setPins(boardPins)
  }, [boardId, user])

  if (!board) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Board not found</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-4xl font-bold text-foreground">{board.name}</h1>
              {board.isPrivate && <Lock className="h-6 w-6 text-muted-foreground" />}
            </div>
            <p className="text-muted-foreground mb-4">{board.description}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{board.pins.length} pins</span>
              <span>•</span>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                  <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                </Avatar>
                <span>{user?.name}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit board</DropdownMenuItem>
                <DropdownMenuItem>Change privacy</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">Delete board</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {pins.length > 0 ? (
        <MasonryGrid pins={pins} />
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-foreground mb-4">No pins yet</h2>
          <p className="text-muted-foreground mb-8">Start adding pins to this board</p>
          <Button>Add Pins</Button>
        </div>
      )}
    </div>
  )
}
