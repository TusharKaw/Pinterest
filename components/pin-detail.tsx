"use client"

import type { Pin } from "@/lib/types"
import { useState, useEffect } from "react"
import { mockPins } from "@/lib/mock-data"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Card, CardContent } from "./ui/card"
import { Heart, Share2, Bookmark, ExternalLink, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useAuth } from "./auth-provider"
import { useLike, useSave } from "@/hooks/use-social"
import { ShareDialog } from "./share-dialog"
import { RelatedPins } from "./related-pins"

interface PinDetailProps {
  pinId: string
}

export function PinDetail({ pinId }: PinDetailProps) {
  const { user } = useAuth()
  const [pin, setPin] = useState<Pin | null>(null)
  const { isLiked, toggleLike } = useLike(pinId)
  const { isSaved, toggleSave } = useSave(pinId)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    if (!pin) return
    
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

  useEffect(() => {
    const foundPin = mockPins.find((p) => p.id === pinId)
    if (foundPin) {
      setPin(foundPin)
    }
  }, [pinId])

  if (!pin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Pin not found</p>
      </div>
    )
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="bg-muted flex items-center justify-center p-8">
                  <img
                    src={pin.imageUrl || "/placeholder.svg"}
                    alt={pin.title}
                    className="max-w-full max-h-[80vh] object-contain rounded-lg"
                  />
                </div>

                <div className="p-8 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="ghost" onClick={toggleLike}>
                        <Heart className={cn("h-5 w-5", isLiked && "fill-red-500 text-red-500")} />
                      </Button>
                      <span className="text-sm text-muted-foreground">{pin.likes + (isLiked ? 1 : 0)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant={isSaved ? "default" : "outline"} onClick={toggleSave}>
                        <Bookmark className={cn("h-4 w-4 mr-2", isSaved && "fill-current")} />
                        {isSaved ? "Saved" : "Save"}
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => setShowShareDialog(true)}>
                        <Share2 className="h-5 w-5" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost"
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

                  {pin.link && (
                    <a
                      href={pin.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {new URL(pin.link).hostname}
                    </a>
                  )}

                  <h1 className="text-3xl font-bold text-foreground mb-4">{pin.title}</h1>
                  <p className="text-muted-foreground mb-6">{pin.description}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {pin.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/search?q=${tag}`}
                        className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm hover:bg-secondary/80"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>

                  <Link href={`/profile/${pin.userId}`} className="flex items-center gap-3 group">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={pin.userAvatar || "/placeholder.svg"} alt={pin.userName} />
                      <AvatarFallback>{pin.userName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground group-hover:underline">{pin.userName}</p>
                      <p className="text-sm text-muted-foreground">{new Date(pin.createdAt).toLocaleDateString()}</p>
                    </div>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {pin && <RelatedPins currentPin={pin} />}

        <ShareDialog open={showShareDialog} onOpenChange={setShowShareDialog} pinId={pinId} />
      </div>
    </>
  )
}
