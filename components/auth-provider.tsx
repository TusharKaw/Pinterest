"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  name: string
  username: string
  avatar: string
  bio: string
  following: string[]
  followers: string[]
  createdAt: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string, username: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("pinterest_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Mock login - in production this would call an API
    const mockUser: User = {
      id: "1",
      email,
      name: "Demo User",
      username: email.split("@")[0],
      avatar: `/placeholder.svg?height=100&width=100&query=user+avatar`,
      bio: "Passionate about design and creativity",
      following: [],
      followers: [],
      createdAt: new Date().toISOString(),
    }

    localStorage.setItem("pinterest_user", JSON.stringify(mockUser))
    setUser(mockUser)
    router.push("/home")
  }

  const signup = async (email: string, password: string, name: string, username: string) => {
    // Mock signup - in production this would call an API
    const mockUser: User = {
      id: Date.now().toString(),
      email,
      name,
      username,
      avatar: `/placeholder.svg?height=100&width=100&query=${name}+avatar`,
      bio: "",
      following: [],
      followers: [],
      createdAt: new Date().toISOString(),
    }

    localStorage.setItem("pinterest_user", JSON.stringify(mockUser))
    setUser(mockUser)
    router.push("/home")
  }

  const logout = () => {
    localStorage.removeItem("pinterest_user")
    setUser(null)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
