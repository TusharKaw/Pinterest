import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const pinId = params.id
    const { boardId } = await request.json()

    // Check if save already exists
    const existingSave = await prisma.save.findUnique({
      where: {
        userId_pinId: {
          userId: session.user.id,
          pinId
        }
      }
    })

    if (existingSave) {
      // Update existing save with new board
      const updatedSave = await prisma.save.update({
        where: {
          id: existingSave.id
        },
        data: {
          boardId
        },
        include: {
          board: {
            select: {
              id: true,
              name: true
            }
          }
        }
      })
      
      return NextResponse.json({ saved: true, save: updatedSave })
    } else {
      // Create new save
      const newSave = await prisma.save.create({
        data: {
          userId: session.user.id,
          pinId,
          boardId
        },
        include: {
          board: {
            select: {
              id: true,
              name: true
            }
          }
        }
      })
      
      return NextResponse.json({ saved: true, save: newSave })
    }
  } catch (error) {
    console.error("Error saving pin:", error)
    return NextResponse.json(
      { error: "Failed to save pin" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const pinId = params.id

    // Remove save
    await prisma.save.deleteMany({
      where: {
        userId: session.user.id,
        pinId
      }
    })
    
    return NextResponse.json({ saved: false })
  } catch (error) {
    console.error("Error removing save:", error)
    return NextResponse.json(
      { error: "Failed to remove save" },
      { status: 500 }
    )
  }
}

