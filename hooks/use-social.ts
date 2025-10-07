"use client"

import { useState, useEffect } from "react"

export function useLike(pinId: string) {
  const [isLiked, setIsLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const toggleLike = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`/api/pins/${pinId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setIsLiked(data.isLiked)
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return { isLiked, toggleLike, isLoading }
}

export function useSave(pinId: string) {
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const toggleSave = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`/api/pins/${pinId}/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setIsSaved(data.isSaved)
      }
    } catch (error) {
      console.error("Error toggling save:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return { isSaved, toggleSave, isLoading }
}

export function useFollow(userId: string) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const toggleFollow = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setIsFollowing(data.isFollowing)
      }
    } catch (error) {
      console.error("Error toggling follow:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return { isFollowing, toggleFollow, isLoading }
}
