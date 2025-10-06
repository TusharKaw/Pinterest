"use client"

import type { Pin } from "@/lib/types"
import { useState } from "react"
import Link from "next/link"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Heart, Share2, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLike, useSave } from "@/hooks/use-social"
import { SaveToBoardDialog } from "./save-to-board-dialog"
import { ShareDialog } from "./share-dialog"

interface PinCardProps {
  pin: Pin
}

export function PinCard({ pin }: PinCardProps) {
  const { isLiked, toggleLike } = useLike(pin.id)
  const { isSaved, toggleSave } = useSave(pin.id)
  const [isHovered, setIsHovered] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)

  return (
    <>
      <div 
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/pin/${pin.id}`} className="block w-full">
          <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-[2/3] w-full">
            <img
              src={pin.imageUrl || "/placeholder.svg"}
              alt={pin.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            {isHovered && (
              <div className="absolute inset-0 bg-black/20 transition-opacity flex flex-col justify-between p-4">
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/90 hover:bg-white/80 backdrop-blur-sm shadow-sm"
                    onClick={(e) => {
                      e.preventDefault()
                      setShowSaveDialog(true)
                    }}
                  >
                    {isSaved ? "Saved" : "Save"}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 bg-white/90 hover:bg-white/80 backdrop-blur-sm shadow-sm"
                      onClick={(e) => {
                        e.preventDefault()
                        toggleLike()
                      }}
                    >
                      <Heart className={cn("h-4 w-4", isLiked && "fill-red-500 text-red-500")} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 bg-white/90 hover:bg-white/80 backdrop-blur-sm shadow-sm"
                      onClick={(e) => {
                        e.preventDefault()
                        setShowShareDialog(true)
                      }}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 bg-white/90 hover:bg-white/80 backdrop-blur-sm shadow-sm"
                    onClick={(e) => {
                      e.preventDefault()
                    }}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Link>
        
        {/* Pin details shown below image */}
        <div className="mt-2 px-1">
          <Link href={`/pin/${pin.id}`} className="block">
            <h3 className="font-medium text-sm text-foreground line-clamp-2">{pin.title}</h3>
          </Link>
          <Link 
            href={`/profile/${pin.userId}`} 
            className="flex items-center gap-2 mt-2 group/user"
          >
            <Avatar className="h-6 w-6">
              <AvatarImage src={pin.userAvatar} alt={pin.userName} />
              <AvatarFallback>{pin.userName?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground group-hover/user:text-foreground">
              {pin.userName}
            </span>
          </Link>
        </div>
      </div>

      <SaveToBoardDialog 
        open={showSaveDialog} 
        onOpenChange={setShowSaveDialog} 
        pinId={pin.id} 
      />
      <ShareDialog 
        open={showShareDialog} 
        onOpenChange={setShowShareDialog} 
        url={`${typeof window !== 'undefined' ? window.location.origin : ''}/pin/${pin.id}`}
      />
    </>
  )
}
