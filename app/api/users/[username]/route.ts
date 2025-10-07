import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"
import Pin from "@/lib/models/Pin"
import Board from "@/lib/models/Board"
import { z } from "zod"

const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  bio: z.string().max(160, "Bio must be less than 160 characters").optional(),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  avatar: z.string().url("Invalid avatar URL").optional().or(z.literal(""))
})

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    await connectDB()
    
    const { username } = params
    
    // Find user by username
    const user = await User.findOne({ username }).select('-password')
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }
    
    // Get user's pins
    const pins = await Pin.find({ userId: user._id })
      .populate('userId', 'name username avatar')
      .sort({ createdAt: -1 })
      .limit(50)
    
    // Get user's boards
    const boards = await Board.find({ userId: user._id })
      .populate('pins')
      .sort({ createdAt: -1 })
    
    // Get follower and following counts
    const followerCount = await User.countDocuments({ following: user._id })
    const followingCount = user.following.length
    
    const profileData = {
      id: user._id,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      bio: user.bio,
      website: user.website,
      followers: followerCount,
      following: followingCount,
      pins: pins.map(pin => ({
        id: pin._id,
        title: pin.title,
        description: pin.description,
        imageUrl: pin.imageUrl,
        imageWidth: pin.imageWidth,
        imageHeight: pin.imageHeight,
        link: pin.link,
        tags: pin.tags,
        userId: pin.userId._id,
        userName: pin.userId.name,
        userAvatar: pin.userId.avatar,
        likes: pin.likes.length,
        comments: pin.comments.length,
        saves: pin.saves.length,
        createdAt: pin.createdAt
      })),
      boards: boards.map(board => ({
        id: board._id,
        name: board.name,
        description: board.description,
        isPrivate: board.isPrivate,
        coverImage: board.coverImage,
        userId: board.userId,
        pins: board.pins.length,
        createdAt: board.createdAt
      }))
    }
    
    return NextResponse.json(profileData)
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    await connectDB()
    
    const { username } = params
    
    // Check if user is updating their own profile
    if (session.user.username !== username) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    const validatedData = updateProfileSchema.parse(body)
    
    // Update user profile
    const updatedUser = await User.findOneAndUpdate(
      { username },
      {
        name: validatedData.name,
        bio: validatedData.bio || '',
        website: validatedData.website || null,
        avatar: validatedData.avatar || null
      },
      { new: true, select: '-password' }
    )
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      id: updatedUser._id,
      name: updatedUser.name,
      username: updatedUser.username,
      avatar: updatedUser.avatar,
      bio: updatedUser.bio,
      website: updatedUser.website
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }
    
    console.error("Error updating user profile:", error)
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}