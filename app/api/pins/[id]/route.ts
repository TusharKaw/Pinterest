import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Pin from "@/lib/models/Pin"
import User from "@/lib/models/User"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const { id } = params
    
    // Find pin by ID and populate user data
    const pin = await Pin.findById(id).populate('userId', 'name username avatar')
    
    if (!pin) {
      return NextResponse.json(
        { error: "Pin not found" },
        { status: 404 }
      )
    }
    
    // Get related pins (same tags or same user)
    const relatedPins = await Pin.find({
      $and: [
        { _id: { $ne: pin._id } },
        {
          $or: [
            { tags: { $in: pin.tags } },
            { userId: pin.userId }
          ]
        }
      ]
    })
    .populate('userId', 'name username avatar')
    .sort({ createdAt: -1 })
    .limit(12)
    
    const pinData = {
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
      createdAt: pin.createdAt,
      relatedPins: relatedPins.map(relatedPin => ({
        id: relatedPin._id,
        title: relatedPin.title,
        description: relatedPin.description,
        imageUrl: relatedPin.imageUrl,
        imageWidth: relatedPin.imageWidth,
        imageHeight: relatedPin.imageHeight,
        link: relatedPin.link,
        tags: relatedPin.tags,
        userId: relatedPin.userId._id,
        userName: relatedPin.userId.name,
        userAvatar: relatedPin.userId.avatar,
        likes: relatedPin.likes.length,
        comments: relatedPin.comments.length,
        saves: relatedPin.saves.length,
        createdAt: relatedPin.createdAt
      }))
    }
    
    return NextResponse.json(pinData)
  } catch (error) {
    console.error("Error fetching pin:", error)
    return NextResponse.json(
      { error: "Failed to fetch pin" },
      { status: 500 }
    )
  }
}
