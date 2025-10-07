import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Pin from "@/lib/models/Pin"
import { z } from "zod"

const createPinSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  imageUrl: z.string().url("Invalid image URL"),
  imageWidth: z.number().min(100).max(2000).optional(),
  imageHeight: z.number().min(100).max(2000).optional(),
  link: z.string().url("Invalid link URL").optional().or(z.literal("")),
  tags: z.array(z.string()).max(10, "Maximum 10 tags allowed").optional(),
  boardId: z.string().optional()
})

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

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    await connectDB()
    
    const body = await request.json()
    const validatedData = createPinSchema.parse(body)
    
    // Create new pin
    const pin = await Pin.create({
      title: validatedData.title,
      description: validatedData.description || '',
      imageUrl: validatedData.imageUrl,
      imageWidth: validatedData.imageWidth || 400,
      imageHeight: validatedData.imageHeight || 600,
      link: validatedData.link || null,
      tags: validatedData.tags || [],
      userId: session.user.id,
      boards: validatedData.boardId ? [validatedData.boardId] : [],
      likes: [],
      comments: [],
      saves: []
    })
    
    // Populate user data
    await pin.populate('userId', 'name username avatar')
    
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
      createdAt: pin.createdAt
    }
    
    return NextResponse.json(pinData, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }
    
    console.error("Error creating pin:", error)
    return NextResponse.json(
      { error: "Failed to create pin" },
      { status: 500 }
    )
  }
}