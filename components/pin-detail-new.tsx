"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import type { Pin } from "@/lib/types"
import { mockPins } from "@/lib/mock-data"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
  Heart,
  MessageSquare,
  Share2,
  Download,
  MoreHorizontal,
  ZoomIn,
  RotateCw,
  X,
  Save,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "./auth-provider"
import { useLike, useSave } from "@/hooks/use-social"
import { MasonryGrid } from "./masonry-grid"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { SaveToBoardDialog } from "./save-to-board-dialog"
import { ShareDialog } from "./share-dialog"
import { findRelatedPins } from "@/lib/related-pins"
import { Header } from "./header"

interface PinDetailNewProps {
  pinId: string
  onClose?: () => void
}

export function PinDetailNew({ pinId, onClose }: PinDetailNewProps) {
  const { user } = useAuth()
  const [pin, setPin] = useState<Pin | null>(null)
  const [relatedPins, setRelatedPins] = useState<Pin[]>([])
  const [isHovered, setIsHovered] = useState(false)
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const imageRef = useRef<HTMLDivElement>(null)
  const { isLiked, toggleLike } = useLike(pinId)
  const { isSaved, toggleSave } = useSave(pinId)
  const [isDownloading, setIsDownloading] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)

  // Load pin data
  useEffect(() => {
    const fetchPin = async () => {
      try {
        const response = await fetch(`/api/pins/${pinId}`)
        if (response.ok) {
          const data = await response.json()
          setPin({
            id: data.id,
            title: data.title,
            description: data.description,
            imageUrl: data.imageUrl,
            imageWidth: data.imageWidth,
            imageHeight: data.imageHeight,
            link: data.link,
            tags: data.tags,
            userId: data.userId,
            userName: data.userName,
            userAvatar: data.userAvatar,
            likes: data.likes,
            comments: data.comments,
            saves: data.saves,
            createdAt: data.createdAt
          })
          setRelatedPins(data.relatedPins)
        } else {
          console.error('Failed to fetch pin:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching pin:', error)
      }
    }

    fetchPin()
  }, [pinId])

  const handleDownload = async () => {
    if (!pin) return

    try {
      setIsDownloading(true)
      const response = await fetch(pin.imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")

      const fileExtension = pin.imageUrl.split(".").pop()?.split("?")[0] || "png"
      const fileName = `pin-${pin.id}.${fileExtension}`

      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading image:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3))
  }

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5))
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const handleReset = () => {
    setScale(1)
    setRotation(0)
  }

  if (!pin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 overflow-y-auto">
      <Header />
      <main className="pt-16">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Button aria-label="Close" variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              className={cn("rounded-full", isSaved ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700")}
              onClick={() => {
                toggleSave()
                setShowSaveDialog(true)
              }}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaved ? "Saved" : "Save"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full"
              onClick={() => setShowShareDialog(true)}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDownload} disabled={isDownloading}>
                  <Download className="h-4 w-4 mr-2" />
                  {isDownloading ? "Downloading..." : "Download image"}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Add comment
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <div className="grid gap-6 mt-4 lg:grid-cols-2">
          {/* Left Top - Main Image */}
          <div className="lg:col-start-1 flex flex-col gap-6">
            <div className="flex justify-center lg:sticky lg:top-20">
              <div
              className="relative max-w-4xl w-full rounded-2xl overflow-hidden shadow-xl z-0"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              ref={imageRef}
            >
              <div className="relative w-full">
                  <img
                    src={pin.imageUrl || "/placeholder.svg"}
                    alt={pin.title}
                    className="w-full h-auto object-contain lg:max-h-[70vh] xl:max-h-[60vh]"
                    style={{
                      transform: `scale(${scale}) rotate(${rotation}deg)`,
                      transition: "transform 0.3s ease",
                    }}
                  />

                {/* Image Controls */}
                {(isHovered || scale !== 1 || rotation !== 0) && (
                  <div className="absolute bottom-4 right-4 flex gap-2 bg-background/80 backdrop-blur-sm p-2 rounded-full shadow-lg">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={handleZoomIn}>
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={handleRotate}>
                      <RotateCw className="h-4 w-4" />
                    </Button>
                    {(scale !== 1 || rotation !== 0) && (
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={handleReset}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Image Actions */}
              <div className="absolute top-4 left-4 right-4 flex justify-between">
                <div className="flex items-center space-x-2 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
                  <Button variant="ghost" size="sm" className="rounded-full h-8 px-3" onClick={toggleLike}>
                    <Heart className={cn("h-4 w-4 mr-1", isLiked && "fill-red-500 text-red-500")} />
                    <span className="text-sm">{pin.likes + (isLiked ? 1 : 0)}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-full h-8 px-3">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span className="text-sm">0</span>
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-md"
                  onClick={handleDownload}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <div className="h-4 w-4 border-2 border-transparent border-t-current rounded-full animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            {/* Close sticky wrapper to ensure proper layout */}
            </div>

          {/* Left Bottom - Pin Details (title, description, tags, author) */}
          <div className="space-y-6">
            <div className="bg-background rounded-2xl p-6 shadow-sm relative z-10">
              <h1 className="text-2xl font-bold mb-2 line-clamp-2">{pin.title}</h1>
              <p className="text-muted-foreground mb-4">{pin.description}</p>

              {pin.link && (
                <a
                  href={pin.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
                >
                  <ChevronDown className="h-4 w-4 rotate-180" />
                  {new URL(pin.link).hostname}
                </a>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                {pin.tags.slice(0, 3).map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?q=${tag}`}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm hover:bg-secondary/80 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <Link href={`/profile/${pin.userId}`} className="flex items-center gap-2 group">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={pin.userAvatar || "/placeholder.svg"} alt={pin.userName} />
                    <AvatarFallback>{pin.userName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium group-hover:underline">{pin.userName}</p>
                    <p className="text-xs text-muted-foreground">{new Date(pin.createdAt).toLocaleDateString()}</p>
                  </div>
                </Link>

                <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                  Follow
                </Button>
              </div>
            </div>
          </div>
          </div>
          {/* Right Column - Masonry of related pins */}
          {relatedPins.length > 0 && (
            <div className="lg:col-start-2">
              <MasonryGrid pins={relatedPins} />
            </div>
          )}
        </div>

        {/* Dialogs */}
        <SaveToBoardDialog open={showSaveDialog} onOpenChange={setShowSaveDialog} pinId={pinId} />
        <ShareDialog open={showShareDialog} onOpenChange={setShowShareDialog} pinId={pinId} />
      </div>
      </main>
    </div>
  )
}
