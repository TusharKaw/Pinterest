export interface Pin {
  id: string
  title: string
  description: string
  imageUrl: string
  imageWidth: number
  imageHeight: number
  userId: string
  userName: string
  userAvatar: string
  boardId?: string
  boardName?: string
  tags: string[]
  likes: number
  comments: number
  saves: number
  createdAt: string
  link?: string
}

export interface Board {
  id: string
  name: string
  description: string
  userId: string
  pins: string[]
  isPrivate: boolean
  coverImage?: string
  createdAt: string
}

export interface Comment {
  id: string
  pinId: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  createdAt: string
}
