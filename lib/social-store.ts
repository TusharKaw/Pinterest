"use client"

// Client-side store for social interactions
class SocialStore {
  private likes: Set<string> = new Set()
  private saves: Set<string> = new Set()
  private follows: Set<string> = new Set()

  constructor() {
    if (typeof window !== "undefined") {
      this.loadFromStorage()
    }
  }

  private loadFromStorage() {
    const likes = localStorage.getItem("pinterest_likes")
    const saves = localStorage.getItem("pinterest_saves")
    const follows = localStorage.getItem("pinterest_follows")

    if (likes) this.likes = new Set(JSON.parse(likes))
    if (saves) this.saves = new Set(JSON.parse(saves))
    if (follows) this.follows = new Set(JSON.parse(follows))
  }

  private saveToStorage() {
    localStorage.setItem("pinterest_likes", JSON.stringify(Array.from(this.likes)))
    localStorage.setItem("pinterest_saves", JSON.stringify(Array.from(this.saves)))
    localStorage.setItem("pinterest_follows", JSON.stringify(Array.from(this.follows)))
  }

  // Likes
  toggleLike(pinId: string): boolean {
    if (this.likes.has(pinId)) {
      this.likes.delete(pinId)
    } else {
      this.likes.add(pinId)
    }
    this.saveToStorage()
    return this.likes.has(pinId)
  }

  isLiked(pinId: string): boolean {
    return this.likes.has(pinId)
  }

  // Saves
  toggleSave(pinId: string): boolean {
    if (this.saves.has(pinId)) {
      this.saves.delete(pinId)
    } else {
      this.saves.add(pinId)
    }
    this.saveToStorage()
    return this.saves.has(pinId)
  }

  isSaved(pinId: string): boolean {
    return this.saves.has(pinId)
  }

  // Follows
  toggleFollow(userId: string): boolean {
    if (this.follows.has(userId)) {
      this.follows.delete(userId)
    } else {
      this.follows.add(userId)
    }
    this.saveToStorage()
    return this.follows.has(userId)
  }

  isFollowing(userId: string): boolean {
    return this.follows.has(userId)
  }
}

export const socialStore = new SocialStore()
