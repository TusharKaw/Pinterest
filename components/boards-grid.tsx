"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./auth-provider"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Plus, Lock } from "lucide-react"
import Link from "next/link"
import type { Board } from "@/lib/types"
import { CreateBoardDialog } from "./create-board-dialog"

export function BoardsGrid() {
  const { user } = useAuth()
  const [boards, setBoards] = useState<Board[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  useEffect(() => {
    // Load user's boards
    const mockBoards: Board[] = [
      {
        id: "1",
        name: "Home Inspiration",
        description: "Ideas for my dream home",
        userId: user?.id || "1",
        pins: ["1", "5"],
        isPrivate: false,
        coverImage: "/modern-minimalist-interior-design.jpg",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Travel Dreams",
        description: "Places I want to visit",
        userId: user?.id || "1",
        pins: ["2"],
        isPrivate: false,
        coverImage: "/sunset-mountain-landscape.jpg",
        createdAt: new Date().toISOString(),
      },
      {
        id: "3",
        name: "Recipe Collection",
        description: "Delicious recipes to try",
        userId: user?.id || "1",
        pins: ["6"],
        isPrivate: true,
        coverImage: "/fresh-pasta-making.jpg",
        createdAt: new Date().toISOString(),
      },
    ]
    setBoards(mockBoards)
  }, [user])

  const handleCreateBoard = (name: string, description: string, isPrivate: boolean) => {
    const newBoard: Board = {
      id: Date.now().toString(),
      name,
      description,
      userId: user?.id || "1",
      pins: [],
      isPrivate,
      createdAt: new Date().toISOString(),
    }
    setBoards([newBoard, ...boards])
    setIsCreateOpen(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Boards</h1>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Board
        </Button>
      </div>

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
                      <Plus className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  {board.isPrivate && (
                    <div className="absolute top-2 right-2 bg-background/90 rounded-full p-2">
                      <Lock className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-1">{board.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{board.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">{board.pins.length} pins</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <CreateBoardDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} onCreateBoard={handleCreateBoard} />
    </div>
  )
}
