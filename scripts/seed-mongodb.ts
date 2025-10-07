import connectDB from '../lib/mongodb'
import User from '../lib/models/User'
import Pin from '../lib/models/Pin'
import Board from '../lib/models/Board'
import bcrypt from 'bcryptjs'

async function seedMongoDB() {
  try {
    await connectDB()
    console.log('Connected to MongoDB')

    // Clear existing data
    await User.deleteMany({})
    await Pin.deleteMany({})
    await Board.deleteMany({})
    console.log('Cleared existing data')

    // Create sample users
    const hashedPassword = await bcrypt.hash('password123', 12)
    
    const users = await User.create([
      {
        name: 'John Doe',
        email: 'john@example.com',
        username: 'johndoe',
        password: hashedPassword,
        bio: 'Photographer and travel enthusiast',
        website: 'https://johndoe.com',
        followers: [],
        following: [],
        isGuest: false,
        emailVerified: true
      },
      {
        name: 'Sarah Design',
        email: 'sarah@example.com',
        username: 'sarahdesign',
        password: hashedPassword,
        bio: 'Interior designer & minimalist enthusiast. Creating beautiful spaces that inspire. 🏡✨',
        website: 'https://sarahdesign.com',
        followers: [],
        following: [],
        isGuest: false,
        emailVerified: true
      },
      {
        name: 'Mike Chef',
        email: 'mike@example.com',
        username: 'mikechef',
        password: hashedPassword,
        bio: 'Professional chef sharing delicious recipes',
        followers: [],
        following: [],
        isGuest: false,
        emailVerified: true
      }
    ])

    console.log('Created users:', users.length)

    // Create sample pins
    const pins = await Pin.create([
      {
        title: 'Modern Minimalist Interior Design',
        description: 'Clean lines and neutral colors create a calming atmosphere',
        imageUrl: '/modern-minimalist-interior-design.jpg',
        imageWidth: 400,
        imageHeight: 600,
        tags: ['interior', 'design', 'minimalist', 'modern'],
        userId: users[1]._id, // Sarah Design
        boards: [],
        likes: [],
        comments: [],
        saves: []
      },
      {
        title: 'Sunset Mountain Landscape',
        description: 'Breathtaking view of mountains during golden hour',
        imageUrl: '/sunset-mountain-landscape.jpg',
        imageWidth: 400,
        imageHeight: 500,
        tags: ['nature', 'landscape', 'sunset', 'mountains'],
        userId: users[0]._id, // John Doe
        boards: [],
        likes: [],
        comments: [],
        saves: []
      },
      {
        title: 'Fresh Pasta Making',
        description: 'Homemade pasta with traditional techniques',
        imageUrl: '/fresh-pasta-making.jpg',
        imageWidth: 400,
        imageHeight: 550,
        tags: ['cooking', 'pasta', 'italian', 'homemade'],
        userId: users[2]._id, // Mike Chef
        boards: [],
        likes: [],
        comments: [],
        saves: []
      },
      {
        title: 'Cozy Reading Nook',
        description: 'Perfect spot for afternoon reading with natural light',
        imageUrl: '/cozy-reading-nook.jpg',
        imageWidth: 400,
        imageHeight: 600,
        tags: ['interior', 'reading', 'cozy', 'home'],
        userId: users[1]._id, // Sarah Design
        boards: [],
        likes: [],
        comments: [],
        saves: []
      },
      {
        title: 'Artisan Coffee Setup',
        description: 'Professional coffee brewing station',
        imageUrl: '/artisan-coffee-setup.jpg',
        imageWidth: 400,
        imageHeight: 500,
        tags: ['coffee', 'artisan', 'brewing', 'setup'],
        userId: users[2]._id, // Mike Chef
        boards: [],
        likes: [],
        comments: [],
        saves: []
      }
    ])

    console.log('Created pins:', pins.length)

    // Create sample boards
    const boards = await Board.create([
      {
        name: 'Home Inspiration',
        description: 'Ideas for my dream home',
        isPrivate: false,
        coverImage: '/modern-minimalist-interior-design.jpg',
        userId: users[1]._id, // Sarah Design
        pins: [pins[0]._id, pins[3]._id],
        saves: []
      },
      {
        name: 'Travel Dreams',
        description: 'Places I want to visit',
        isPrivate: false,
        coverImage: '/sunset-mountain-landscape.jpg',
        userId: users[0]._id, // John Doe
        pins: [pins[1]._id],
        saves: []
      },
      {
        name: 'Cooking Inspiration',
        description: 'Delicious recipes to try',
        isPrivate: false,
        coverImage: '/fresh-pasta-making.jpg',
        userId: users[2]._id, // Mike Chef
        pins: [pins[2]._id, pins[4]._id],
        saves: []
      }
    ])

    console.log('Created boards:', boards.length)

    // Update pins with board references
    await Pin.updateOne(
      { _id: pins[0]._id },
      { $set: { boards: [boards[0]._id] } }
    )
    await Pin.updateOne(
      { _id: pins[1]._id },
      { $set: { boards: [boards[1]._id] } }
    )
    await Pin.updateOne(
      { _id: pins[2]._id },
      { $set: { boards: [boards[2]._id] } }
    )
    await Pin.updateOne(
      { _id: pins[3]._id },
      { $set: { boards: [boards[0]._id] } }
    )
    await Pin.updateOne(
      { _id: pins[4]._id },
      { $set: { boards: [boards[2]._id] } }
    )

    console.log('MongoDB seeding completed successfully!')
    console.log('Sample users:')
    console.log('- john@example.com / password123')
    console.log('- sarah@example.com / password123')
    console.log('- mike@example.com / password123')
    
  } catch (error) {
    console.error('Error seeding MongoDB:', error)
  } finally {
    process.exit(0)
  }
}

seedMongoDB()
