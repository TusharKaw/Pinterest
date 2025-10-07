"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { ScrollArea } from "./ui/scroll-area"
import { Plus, Check } from "lucide-react"
import type { Board } from "@/lib/types"
import { useAuth } from "./auth-provider"

interface SaveToBoardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pinId: string
}

export function SaveToBoardDialog({ open, onOpenChange, pinId }: SaveToBoardDialogProps) {
  const { user } = useAuth()
  const [boards, setBoards] = useState<Board[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [savedBoards, setSavedBoards] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (user?.id) {
      // Load user's boards from API
      fetch(`/api/boards?userId=${user.id}`)
        .then(response => response.json())
        .then(data => setBoards(data))
        .catch(error => console.error("Error loading boards:", error))
    }
  }, [user])

  const filteredBoards = boards.filter((board) => board.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const toggleBoard = (boardId: string) => {
    const newSavedBoards = new Set(savedBoards)
    if (newSavedBoards.has(boardId)) {
      newSavedBoards.delete(boardId)
    } else {
      newSavedBoards.add(boardId)
    }
    setSavedBoards(newSavedBoards)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save to Board</DialogTitle>
          <DialogDescription>Choose a board to save this pin</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="Search boards..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {filteredBoards.map((board) => (
                <Button
                  key={board.id}
                  variant="outline"
                  className="w-full justify-between bg-transparent"
                  onClick={() => toggleBoard(board.id)}
                >
                  <span>{board.name}</span>
                  {savedBoards.has(board.id) && <Check className="h-4 w-4" />}
                </Button>
              ))}
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Create new board
              </Button>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
