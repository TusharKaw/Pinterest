"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useDebounce } from "use-debounce"
import { useAuth } from "./auth-provider"
import { useNotifications } from "@/contexts/notification-context"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Search, Plus, X } from "lucide-react"
import { NotificationsDropdown } from "./notifications-dropdown"
import { CreatePinDialog } from "./create-pin-dialog"

export function Header() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedQuery] = useDebounce(searchQuery, 300)
  const pathname = usePathname()
  const { addNotification } = useNotifications()
  const [showCreatePinDialog, setShowCreatePinDialog] = useState(false)

  // Don't render if user is not available
  if (!user) {
    return null
  }

  // Clear search when navigating away from search page
  useEffect(() => {
    if (!pathname.startsWith('/search')) {
      setSearchQuery("")
    }
  }, [pathname])

  // Handle search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(debouncedQuery)}`)
    }
  }, [debouncedQuery, router])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/home" className="flex items-center">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="ml-2 text-2xl font-bold text-foreground hidden sm:block">Pinterest</span>
          </Link>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-12 h-12 bg-gray-100 border-0 rounded-full text-base placeholder:text-gray-500 focus:bg-white focus:ring-2 focus:ring-primary/20"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </form>

        {/* Navigation */}
        <div className="flex items-center gap-1">
          <Link href="/home">
            <Button variant="ghost" className="h-12 px-4 text-foreground hover:bg-gray-100 rounded-full">
              Home
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-12 w-12 hover:bg-gray-100 rounded-full"
            onClick={() => setShowCreatePinDialog(true)}
          >
            <Plus className="h-6 w-6" />
          </Button>
          <NotificationsDropdown />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full hover:bg-gray-100">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                  <AvatarFallback className="bg-gray-200 text-gray-600">
                    {user?.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href={`/profile/${user?.username}`}>Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/boards">Boards</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Create Pin Dialog */}
      <CreatePinDialog
        open={showCreatePinDialog}
        onOpenChange={setShowCreatePinDialog}
        onPinCreated={(pin) => {
          addNotification({
            type: 'success',
            message: 'Pin created successfully!'
          })
        }}
      />
    </header>
  )
}
