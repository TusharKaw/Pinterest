import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
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
    
    const { userId } = params
    const currentUserId = session.user.id
    
    if (currentUserId === userId) {
      return NextResponse.json(
        { error: "Cannot follow yourself" },
        { status: 400 }
      )
    }
    
    // Find both users
    const currentUser = await User.findById(currentUserId)
    const targetUser = await User.findById(userId)
    
    if (!currentUser || !targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }
    
    // Check if already following
    const isFollowing = currentUser.following.includes(userId)
    
    if (isFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(currentUserId, {
        $pull: { following: userId }
      })
      await User.findByIdAndUpdate(userId, {
        $pull: { followers: currentUserId }
      })
    } else {
      // Follow
      await User.findByIdAndUpdate(currentUserId, {
        $addToSet: { following: userId }
      })
      await User.findByIdAndUpdate(userId, {
        $addToSet: { followers: currentUserId }
      })
    }
    
    return NextResponse.json({
      isFollowing: !isFollowing
    })
  } catch (error) {
    console.error("Error toggling follow:", error)
    return NextResponse.json(
      { error: "Failed to toggle follow" },
      { status: 500 }
    )
  }
}
