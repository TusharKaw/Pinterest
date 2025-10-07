import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!session?.user?.id && !userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const targetUserId = userId || session.user.id

    const boards = await prisma.board.findMany({
      where: {
        userId: targetUserId,
        OR: [
          { isPrivate: false },
          { userId: session?.user?.id }
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true
          }
        },
        pins: {
          take: 4,
          orderBy: {
            createdAt: "desc"
          }
        },
        _count: {
          select: {
            pins: true
          }
        }
      },
      orderBy: {
        updatedAt: "desc"
      }
    })

    return NextResponse.json(boards)
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
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description, isPrivate, coverImage } = body

    const board = await prisma.board.create({
      data: {
        name,
        description,
        isPrivate: isPrivate || false,
        coverImage,
        userId: session.user.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true
          }
        },
        pins: true,
        _count: {
          select: {
            pins: true
          }
        }
      }
    })

    return NextResponse.json(board, { status: 201 })
  } catch (error) {
    console.error("Error creating board:", error)
    return NextResponse.json(
      { error: "Failed to create board" },
      { status: 500 }
    )
  }
}

