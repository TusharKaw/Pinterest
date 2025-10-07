import { PrismaClient } from '../lib/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 12)

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'john@example.com' },
      update: {},
      create: {
        name: 'John Doe',
        email: 'john@example.com',
        username: 'johndoe',
        password: hashedPassword,
        avatar: '/placeholder-user.jpg',
        bio: 'Design enthusiast and creative thinker'
      }
    }),
    prisma.user.upsert({
      where: { email: 'jane@example.com' },
      update: {},
      create: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        username: 'janesmith',
        password: hashedPassword,
        avatar: '/placeholder-user.jpg',
        bio: 'Interior design lover and home decor expert'
      }
    }),
    prisma.user.upsert({
      where: { email: 'mike@example.com' },
      update: {},
      create: {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        username: 'mikejohnson',
        password: hashedPassword,
        avatar: '/placeholder-user.jpg',
        bio: 'Photography and travel enthusiast'
      }
    })
  ])

  console.log('👥 Created users:', users.length)

  // Create sample boards
  const boards = await Promise.all([
    prisma.board.create({
      data: {
        name: 'Home Inspiration',
        description: 'Beautiful home design ideas',
        userId: users[0].id,
        isPrivate: false,
        coverImage: '/modern-minimalist-interior-design.jpg'
      }
    }),
    prisma.board.create({
      data: {
        name: 'Travel Dreams',
        description: 'Places I want to visit',
        userId: users[0].id,
        isPrivate: false,
        coverImage: '/sunset-mountain-landscape.jpg'
      }
    }),
    prisma.board.create({
      data: {
        name: 'Food & Recipes',
        description: 'Delicious recipes and food ideas',
        userId: users[1].id,
        isPrivate: false,
        coverImage: '/fresh-pasta-making.jpg'
      }
    }),
    prisma.board.create({
      data: {
        name: 'Photography',
        description: 'Beautiful photography inspiration',
        userId: users[2].id,
        isPrivate: false,
        coverImage: '/nature-photographer.jpg'
      }
    })
  ])

  console.log('📋 Created boards:', boards.length)

  // Create sample pins
  const pins = await Promise.all([
    prisma.pin.create({
      data: {
        title: 'Modern Minimalist Living Room',
        description: 'Clean lines and neutral colors create a peaceful atmosphere',
        imageUrl: '/modern-minimalist-interior-design.jpg',
        imageWidth: 400,
        imageHeight: 600,
        tags: 'interior design,minimalist,living room,modern',
        userId: users[0].id,
        boards: {
          connect: { id: boards[0].id }
        }
      }
    }),
    prisma.pin.create({
      data: {
        title: 'Mountain Sunset Landscape',
        description: 'Breathtaking view of mountains at sunset',
        imageUrl: '/sunset-mountain-landscape.jpg',
        imageWidth: 400,
        imageHeight: 500,
        tags: 'landscape,mountains,sunset,nature',
        userId: users[2].id,
        boards: {
          connect: { id: boards[1].id }
        }
      }
    }),
    prisma.pin.create({
      data: {
        title: 'Fresh Pasta Making',
        description: 'Homemade pasta recipe with fresh ingredients',
        imageUrl: '/fresh-pasta-making.jpg',
        imageWidth: 400,
        imageHeight: 600,
        tags: 'cooking,pasta,recipe,italian',
        userId: users[1].id,
        boards: {
          connect: { id: boards[2].id }
        }
      }
    }),
    prisma.pin.create({
      data: {
        title: 'Cozy Reading Nook',
        description: 'Perfect spot for reading and relaxation',
        imageUrl: '/cozy-reading-nook.jpg',
        imageWidth: 400,
        imageHeight: 500,
        tags: 'reading,cozy,home decor,books',
        userId: users[0].id,
        boards: {
          connect: { id: boards[0].id }
        }
      }
    }),
    prisma.pin.create({
      data: {
        title: 'Artisan Coffee Setup',
        description: 'Professional coffee brewing station',
        imageUrl: '/artisan-coffee-setup.jpg',
        imageWidth: 400,
        imageHeight: 600,
        tags: 'coffee,brewing,kitchen,artisan',
        userId: users[1].id,
        boards: {
          connect: { id: boards[2].id }
        }
      }
    }),
    prisma.pin.create({
      data: {
        title: 'Abstract Geometric Art',
        description: 'Modern abstract art with geometric patterns',
        imageUrl: '/abstract-geometric-art.png',
        imageWidth: 400,
        imageHeight: 400,
        tags: 'art,abstract,geometric,modern',
        userId: users[2].id,
        boards: {
          connect: { id: boards[3].id }
        }
      }
    })
  ])

  console.log('📌 Created pins:', pins.length)

  // Create some likes and saves
  await Promise.all([
    // User 1 likes and saves some pins
    prisma.like.create({
      data: {
        userId: users[0].id,
        pinId: pins[1].id
      }
    }),
    prisma.save.create({
      data: {
        userId: users[0].id,
        pinId: pins[1].id,
        boardId: boards[1].id
      }
    }),
    // User 2 likes and saves some pins
    prisma.like.create({
      data: {
        userId: users[1].id,
        pinId: pins[0].id
      }
    }),
    prisma.save.create({
      data: {
        userId: users[1].id,
        pinId: pins[0].id,
        boardId: boards[2].id
      }
    })
  ])

  console.log('❤️ Created likes and saves')

  // Create some follows
  await Promise.all([
    prisma.follow.upsert({
      where: {
        followerId_followingId: {
          followerId: users[0].id,
          followingId: users[1].id
        }
      },
      update: {},
      create: {
        followerId: users[0].id,
        followingId: users[1].id
      }
    }),
    prisma.follow.upsert({
      where: {
        followerId_followingId: {
          followerId: users[1].id,
          followingId: users[2].id
        }
      },
      update: {},
      create: {
        followerId: users[1].id,
        followingId: users[2].id
      }
    })
  ])

  console.log('👥 Created follows')

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
