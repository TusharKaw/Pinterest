import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import connectDB from "./mongodb"
import User from "./models/User"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("Authorize called with:", credentials?.email)
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials")
          return null
        }

        await connectDB()

        const user = await User.findOne({
          email: credentials.email
        })

        if (!user) {
          console.log("User not found:", credentials.email)
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          console.log("Invalid password for:", credentials.email)
          return null
        }

        console.log("User authorized:", user.email)
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          username: user.username,
          avatar: user.avatar,
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log("JWT callback - user:", user)
        token.username = user.username
        token.avatar = user.avatar
      }
      console.log("JWT callback - token:", token)
      return token
    },
    async session({ session, token }) {
      console.log("Session callback - token:", token)
      if (token) {
        session.user.id = token.sub!
        session.user.username = token.username as string
        session.user.avatar = token.avatar as string
      }
      console.log("Session callback - session:", session)
      return session
    }
  },
  pages: {
    signIn: "/login",
    signUp: "/signup"
  }
}

