import { HomeFeed } from "@/components/home-feed"
import { Header } from "@/components/header"

export default function HomePageFeed() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <HomeFeed />
      </main>
    </div>
  )
}
