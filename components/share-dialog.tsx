"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Facebook, Twitter, LinkIcon, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pinId: string
}

export function ShareDialog({ open, onOpenChange, pinId }: ShareDialogProps) {
  const { toast } = useToast()
  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/pin/${pinId}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    toast({
      title: "Link copied!",
      description: "The pin link has been copied to your clipboard",
    })
  }

  const shareOptions = [
    {
      name: "Facebook",
      icon: Facebook,
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, "_blank"),
    },
    {
      name: "Twitter",
      icon: Twitter,
      action: () => window.open(`https://twitter.com/intent/tweet?url=${shareUrl}`, "_blank"),
    },
    {
      name: "Email",
      icon: Mail,
      action: () => (window.location.href = `mailto:?subject=Check out this pin&body=${shareUrl}`),
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Pin</DialogTitle>
          <DialogDescription>Share this pin with others</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input value={shareUrl} readOnly />
            <Button onClick={copyToClipboard}>
              <LinkIcon className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {shareOptions.map((option) => (
              <Button
                key={option.name}
                variant="outline"
                onClick={option.action}
                className="flex flex-col h-auto py-4 bg-transparent"
              >
                <option.icon className="h-6 w-6 mb-2" />
                <span className="text-xs">{option.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
