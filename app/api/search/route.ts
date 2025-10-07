import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Pin from "@/lib/models/Pin"
import User from "@/lib/models/User"

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')
    const type = searchParams.get('type') || 'pins' // pins, users, or all
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit
    
    if (!q || q.trim().length === 0) {
      return NextResponse.json({
        pins: [],
        users: [],
        totalPins: 0,
        totalUsers: 0
      })
    }
    
    const searchQuery = q.trim()
    const results: any = {
      pins: [],
      users: [],
      totalPins: 0,
      totalUsers: 0
    }
    
    // Search pins
    if (type === 'pins' || type === 'all') {
      const pinsQuery = {
        $or: [
          { title: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } },
          { tags: { $in: [new RegExp(searchQuery, 'i')] } }
        ]
      }
      
      const pins = await Pin.find(pinsQuery)
        .populate('userId', 'name username avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
      
      const totalPins = await Pin.countDocuments(pinsQuery)
      
      results.pins = pins.map(pin => ({
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
      
      results.totalPins = totalPins
    }
    
    // Search users
    if (type === 'users' || type === 'all') {
      const usersQuery = {
        $or: [
          { name: { $regex: searchQuery, $options: 'i' } },
          { username: { $regex: searchQuery, $options: 'i' } }
        ]
      }
      
      const users = await User.find(usersQuery)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
      
      const totalUsers = await User.countDocuments(usersQuery)
      
      results.users = users.map(user => ({
        id: user._id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
        website: user.website,
        followers: user.followers.length,
        following: user.following.length
      }))
      
      results.totalUsers = totalUsers
    }
    
    return NextResponse.json(results)
  } catch (error) {
    console.error("Error searching:", error)
    return NextResponse.json(
      { error: "Failed to search" },
      { status: 500 }
    )
  }
}
