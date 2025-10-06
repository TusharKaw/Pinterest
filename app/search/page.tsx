import { Header } from "@/components/header"
import { SearchResults } from "@/components/search-results"
import { Suspense } from "react"

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
          <SearchResults />
        </Suspense>
      </main>
    </div>
  )
}
