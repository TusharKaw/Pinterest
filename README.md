# Pinterest Clone

A full-stack Pinterest clone built with Next.js, TypeScript, Prisma, and SQLite. This project replicates Pinterest's core functionality including pin creation, boards, likes, saves, follows, and more.

## Features

### 🎨 UI/UX
- **Exact Pinterest Design**: Red color scheme, proper spacing, and typography
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Masonry Grid**: Pinterest-style pin layout with infinite scroll
- **Hover Effects**: Interactive pin cards with overlay buttons
- **Modern Header**: Pinterest-style navigation with search

### 🔐 Authentication
- **NextAuth Integration**: Secure authentication system
- **User Registration**: Email, username, and password validation
- **Session Management**: Persistent login sessions
- **Protected Routes**: Secure access to user-specific features

### 📌 Core Features
- **Pin Management**: Create, view, edit, and delete pins
- **Board System**: Organize pins into custom boards
- **Social Interactions**: Like, save, and follow functionality
- **Search**: Find pins, users, and boards
- **User Profiles**: View user profiles and their content
- **Comments**: Add comments to pins

### 🗄️ Backend
- **RESTful API**: Complete API for all Pinterest features
- **Database**: SQLite with Prisma ORM
- **Data Models**: Users, Pins, Boards, Likes, Saves, Follows, Comments
- **Image Handling**: Support for pin images with dimensions
- **Pagination**: Efficient data loading with pagination

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Backend**: Next.js API routes
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **Image Handling**: Next.js Image optimization
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pinterest-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push database schema
   npm run db:push
   
   # Seed with sample data
   npm run db:seed
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Quick Setup Script

Alternatively, you can run the setup script:

```bash
chmod +x setup.sh
./setup.sh
```

## Sample Data

The seed script creates:
- 3 sample users (john@example.com, jane@example.com, mike@example.com)
- 4 sample boards with different themes
- 6 sample pins with images
- Sample likes, saves, and follows

**Default password for all sample users**: `password123`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Pins
- `GET /api/pins` - Get pins with pagination and filters
- `POST /api/pins` - Create a new pin
- `POST /api/pins/[id]/like` - Like/unlike a pin
- `POST /api/pins/[id]/save` - Save/unsave a pin
- `DELETE /api/pins/[id]/save` - Remove save

### Boards
- `GET /api/boards` - Get user boards
- `POST /api/boards` - Create a new board

### Users
- `POST /api/users/[id]/follow` - Follow/unfollow a user

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── (auth)/            # Authentication pages
│   ├── (home)/            # Home pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── ...               # Feature components
├── lib/                  # Utility libraries
│   ├── generated/        # Generated Prisma client
│   └── ...              # Other utilities
├── prisma/              # Database schema and migrations
├── public/              # Static assets
└── hooks/               # Custom React hooks
```

## Key Components

- **Header**: Pinterest-style navigation with search
- **MasonryGrid**: Responsive pin layout
- **PinCard**: Individual pin display with interactions
- **HomeFeed**: Main feed with infinite scroll
- **AuthProvider**: Authentication context
- **SaveToBoardDialog**: Pin saving interface

## Database Schema

The database includes the following models:
- **User**: User accounts with authentication
- **Pin**: Individual pins with images and metadata
- **Board**: Collections of pins
- **Like**: Pin likes by users
- **Save**: Pin saves to boards
- **Follow**: User following relationships
- **Comment**: Comments on pins

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is for educational purposes. Please respect Pinterest's terms of service and intellectual property.

## Acknowledgments

- Inspired by Pinterest's design and functionality
- Built with modern web technologies
- Uses open-source libraries and components

