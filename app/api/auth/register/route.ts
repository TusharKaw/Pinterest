import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"
import { z } from "zod"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters")
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = registerSchema.parse(body)
    const { name, email, username, password } = validatedData

    // Connect to MongoDB
    await connectDB()

    // Check if user already exists in MongoDB
    const existingUser = await User.findOne({
      $or: [
        { email },
        { username }
      ]
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email or username already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user in MongoDB
    const user = await User.create({
      name,
      email,
      username,
      password: hashedPassword,
      followers: [],
      following: [],
      isGuest: false,
      emailVerified: false
    })

    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
      createdAt: user.createdAt
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating user:", error)
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    )
  }
}

