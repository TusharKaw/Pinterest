"use client"

import { useState, useEffect } from "react"
import { socialStore } from "@/lib/social-store"

export function useLike(pinId: string) {
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    setIsLiked(socialStore.isLiked(pinId))
  }, [pinId])

  const toggleLike = () => {
    const newState = socialStore.toggleLike(pinId)
    setIsLiked(newState)
  }

  return { isLiked, toggleLike }
}

export function useSave(pinId: string) {
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    setIsSaved(socialStore.isSaved(pinId))
  }, [pinId])

  const toggleSave = () => {
    const newState = socialStore.toggleSave(pinId)
    setIsSaved(newState)
  }

  return { isSaved, toggleSave }
}

export function useFollow(userId: string) {
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    setIsFollowing(socialStore.isFollowing(userId))
  }, [userId])

  const toggleFollow = () => {
    const newState = socialStore.toggleFollow(userId)
    setIsFollowing(newState)
  }

  return { isFollowing, toggleFollow }
}
