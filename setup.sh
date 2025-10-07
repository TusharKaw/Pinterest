#!/bin/bash

echo "🚀 Setting up Pinterest Clone..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🗄️ Running database migrations..."
npx prisma db push

# Seed the database with sample data
echo "🌱 Seeding database with sample data..."
npx prisma db seed

echo "✅ Setup complete! Run 'npm run dev' to start the development server."

