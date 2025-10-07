import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Pin from "@/lib/models/Pin"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
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
    
    const { id } = params
    const userId = session.user.id
    
    // Find the pin
    const pin = await Pin.findById(id)
    if (!pin) {
      return NextResponse.json(
        { error: "Pin not found" },
        { status: 404 }
      )
    }
    
    // Check if user already liked the pin
    const isLiked = pin.likes.includes(userId)
    
    if (isLiked) {
      // Unlike the pin
      await Pin.findByIdAndUpdate(id, {
        $pull: { likes: userId }
      })
    } else {
      // Like the pin
      await Pin.findByIdAndUpdate(id, {
        $addToSet: { likes: userId }
      })
    }
    
    // Get updated like count
    const updatedPin = await Pin.findById(id)
    
    return NextResponse.json({
      isLiked: !isLiked,
      likesCount: updatedPin.likes.length
    })
  } catch (error) {
    console.error("Error toggling like:", error)
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    )
  }
}