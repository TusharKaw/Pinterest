import { Header } from "@/components/header"
import { ExploreFeed } from "@/components/explore-feed"

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <ExploreFeed />
      </main>
    </div>
  )
}
