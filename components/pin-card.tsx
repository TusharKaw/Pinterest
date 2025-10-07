"use client"

import type { Pin } from "@/lib/types"
import { useState } from "react"
import Link from "next/link"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Heart, Share2, MoreHorizontal, Download } from "lucide-react"
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
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      setIsDownloading(true)
      const response = await fetch(pin.imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      
      // Extract file extension from the URL or default to png
      const fileExtension = pin.imageUrl.split('.').pop()?.split('?')[0] || 'png'
      const fileName = `pin-${pin.id}.${fileExtension}`
      
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading image:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <>
      <div 
        className="relative group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/pin/${pin.id}`} className="block w-full">
          <div className="relative overflow-hidden rounded-2xl bg-gray-100 w-full">
            <img
              src={pin.imageUrl || "/placeholder.svg"}
              alt={pin.title}
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            {isHovered && (
              <div className="absolute inset-0 bg-black/20 transition-opacity flex flex-col justify-between p-3">
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-white rounded-full px-4 py-2 text-sm font-semibold shadow-lg"
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
                      className="h-10 w-10 bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg rounded-full"
                      onClick={(e) => {
                        e.preventDefault()
                        toggleLike()
                      }}
                    >
                      <Heart className={cn("h-5 w-5", isLiked && "fill-red-500 text-red-500")} />
                    </Button>
                    <Button
                      size="icon"
                      className="h-10 w-10 bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg rounded-full"
                      onClick={(e) => {
                        e.preventDefault()
                        setShowShareDialog(true)
                      }}
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                  <Button
                    size="icon"
                    className="h-10 w-10 bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg rounded-full"
                    onClick={handleDownload}
                    disabled={isDownloading}
                    title="Download image"
                  >
                    {isDownloading ? (
                      <div className="h-5 w-5 border-2 border-transparent border-t-current rounded-full animate-spin" />
                    ) : (
                      <Download className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Link>
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
