"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useSession, signIn, signOut } from "next-auth/react"

interface User {
  id: string
  email: string
  name: string
  username: string
  avatar?: string
  bio?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string, username: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  
  // Debug session status
  console.log("AuthProvider - Session status:", status)
  console.log("AuthProvider - Session data:", session)

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Attempting login for:", email)
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })
      console.log("Login result:", result)
      return result?.ok || false
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }

  const signup = async (email: string, password: string, name: string, username: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log("Attempting signup for:", email, username)
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, username, password }),
      })

      console.log("Registration response status:", response.status)
      
      if (response.ok) {
        console.log("Registration successful")
        // For now, just return success - the user can login manually
        // Auto-login can be problematic with NextAuth in some cases
        return { success: true }
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error("Registration failed:", response.status, errorData)
        const errorMessage = errorData.error || `Registration failed with status ${response.status}`
        return { success: false, error: errorMessage }
      }
    } catch (error) {
      console.error("Registration failed:", error)
      return { success: false, error: "Network error. Please check your connection and try again." }
    }
  }

  const logout = () => {
    signOut()
  }

  const user: User | null = session?.user ? {
    id: session.user.id,
    name: session.user.name || "",
    email: session.user.email || "",
    username: session.user.username || "",
    avatar: session.user.avatar || undefined
  } : null

  return <AuthContext.Provider value={{ 
    user, 
    login, 
    signup, 
    logout, 
    isLoading: status === "loading" 
  }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
