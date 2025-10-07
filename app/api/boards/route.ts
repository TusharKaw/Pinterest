import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Board from "@/lib/models/Board"
import { z } from "zod"

const createBoardSchema = z.object({
  name: z.string().min(1, "Board name is required").max(50, "Board name must be less than 50 characters"),
  description: z.string().max(200, "Description must be less than 200 characters").optional(),
  isPrivate: z.boolean().optional(),
  coverImage: z.string().url("Invalid cover image URL").optional().or(z.literal(""))
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    await connectDB()
    
    // Get user's boards
    const boards = await Board.find({ userId: session.user.id })
      .populate('pins')
      .sort({ createdAt: -1 })
    
    const boardsData = boards.map(board => ({
      id: board._id,
      name: board.name,
      description: board.description,
      isPrivate: board.isPrivate,
      coverImage: board.coverImage,
      userId: board.userId,
      pins: board.pins.length,
      saves: board.saves.length,
      createdAt: board.createdAt
    }))
    
    return NextResponse.json(boardsData)
  } catch (error) {
    console.error("Error fetching boards:", error)
    return NextResponse.json(
      { error: "Failed to fetch boards" },
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
    const validatedData = createBoardSchema.parse(body)
    
    // Create new board
    const board = await Board.create({
      name: validatedData.name,
      description: validatedData.description || '',
      isPrivate: validatedData.isPrivate || false,
      coverImage: validatedData.coverImage || null,
      userId: session.user.id,
      pins: [],
      saves: []
    })
    
    const boardData = {
      id: board._id,
      name: board.name,
      description: board.description,
      isPrivate: board.isPrivate,
      coverImage: board.coverImage,
      userId: board.userId,
      pins: board.pins.length,
      saves: board.saves.length,
      createdAt: board.createdAt
    }
    
    return NextResponse.json(boardData, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }
    
    console.error("Error creating board:", error)
    return NextResponse.json(
      { error: "Failed to create board" },
      { status: 500 }
    )
  }
}