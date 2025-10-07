"use client"

import { useState } from "react"
import { useAuth } from "./auth-provider"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Plus, Upload, Link as LinkIcon } from "lucide-react"
import { useRouter } from "next/navigation"

interface CreatePinDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPinCreated?: (pin: any) => void
}

export function CreatePinDialog({ 
  open, 
  onOpenChange, 
  onPinCreated 
}: CreatePinDialogProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    link: '',
    tags: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [imagePreview, setImagePreview] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const response = await fetch('/api/pins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          imageUrl: formData.imageUrl,
          link: formData.link || undefined,
          tags: tagsArray
        }),
      })

      if (response.ok) {
        const newPin = await response.json()
        onPinCreated?.(newPin)
        onOpenChange(false)
        // Reset form
        setFormData({
          title: '',
          description: '',
          imageUrl: '',
          link: '',
          tags: ''
        })
        setImagePreview('')
        // Refresh home feed if available
        if ((window as any).refreshHomeFeed) {
          (window as any).refreshHomeFeed()
        }
        // Optionally redirect to the new pin
        router.push(`/pin/${newPin.id}`)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to create pin')
      }
    } catch (error) {
      console.error('Error creating pin:', error)
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Update image preview when image URL changes
    if (field === 'imageUrl' && value) {
      setImagePreview(value)
    }
  }

  const handleImageLoad = () => {
    // Image loaded successfully
  }

  const handleImageError = () => {
    setImagePreview('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create Pin
          </DialogTitle>
          <DialogDescription>
            Share your inspiration with the world. Add an image, title, and description.
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Preview */}
          {imagePreview && (
            <div className="space-y-2">
              <Label>Image Preview</Label>
              <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              </div>
            </div>
          )}

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Image URL *
            </Label>
            <Input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => handleInputChange('imageUrl', e.target.value)}
              placeholder="https://example.com/image.jpg"
              required
            />
            <p className="text-xs text-muted-foreground">
              Paste the URL of the image you want to pin
            </p>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Give your pin a title"
              required
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground">
              {formData.title.length}/100 characters
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Tell people what your pin is about"
              maxLength={500}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Link */}
          <div className="space-y-2">
            <Label htmlFor="link" className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              Link
            </Label>
            <Input
              id="link"
              type="url"
              value={formData.link}
              onChange={(e) => handleInputChange('link', e.target.value)}
              placeholder="https://example.com"
            />
            <p className="text-xs text-muted-foreground">
              Optional: Link to the original source
            </p>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              placeholder="interior, design, home (comma separated)"
            />
            <p className="text-xs text-muted-foreground">
              Add tags to help people discover your pin
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.title || !formData.imageUrl}>
              {isLoading ? "Creating..." : "Create Pin"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
