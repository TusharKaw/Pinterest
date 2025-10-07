import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Pin from "@/lib/models/Pin"

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit
    
    // Fetch pins with user data
    const pins = await Pin.find({})
      .populate('userId', 'name username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
    
    const pinsData = pins.map(pin => ({
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
    }))
    
    return NextResponse.json(pinsData)
  } catch (error) {
    console.error("Error fetching pins:", error)
    return NextResponse.json(
      { error: "Failed to fetch pins" },
      { status: 500 }
    )
  }
}