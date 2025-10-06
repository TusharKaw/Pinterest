"use client"

import type { Pin, Comment } from "@/lib/types"
import { useState, useEffect } from "react"
import { mockPins } from "@/lib/mock-data"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Textarea } from "./ui/textarea"
import { Card, CardContent } from "./ui/card"
import { Heart, Share2, Bookmark, ExternalLink, MoreHorizontal, Download } from "lucide-react"
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
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState<Comment[]>([])
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

  const handleAddComment = () => {
    if (!comment.trim() || !user) return

    const newComment: Comment = {
      id: Date.now().toString(),
      pinId: pin!.id,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content: comment,
      createdAt: new Date().toISOString(),
    }

    setComments([newComment, ...comments])
    setComment("")
  }

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

                  <Link href={`/profile/${pin.userId}`} className="flex items-center gap-3 mb-8 group">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={pin.userAvatar || "/placeholder.svg"} alt={pin.userName} />
                      <AvatarFallback>{pin.userName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground group-hover:underline">{pin.userName}</p>
                      <p className="text-sm text-muted-foreground">{new Date(pin.createdAt).toLocaleDateString()}</p>
                    </div>
                  </Link>

                  <div className="border-t border-border pt-6 flex-1">
                    <h2 className="text-xl font-semibold text-foreground mb-4">Comments ({comments.length})</h2>

                    <div className="space-y-4 mb-6">
                      <div className="flex gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                          <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <Textarea
                            placeholder="Add a comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={2}
                          />
                          <Button size="sm" className="mt-2" onClick={handleAddComment} disabled={!comment.trim()}>
                            Post
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {comments.map((c) => (
                        <div key={c.id} className="flex gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={c.userAvatar || "/placeholder.svg"} alt={c.userName} />
                            <AvatarFallback>{c.userName[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-sm">{c.userName}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(c.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-foreground">{c.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {pin && <RelatedPins currentPin={pin} />}

      <ShareDialog open={showShareDialog} onOpenChange={setShowShareDialog} pinId={pinId} />
    </>
  )
}
