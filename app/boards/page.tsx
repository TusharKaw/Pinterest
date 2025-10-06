import { Header } from "@/components/header"
import { BoardsGrid } from "@/components/boards-grid"

export default function BoardsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <BoardsGrid />
        </div>
      </main>
    </div>
  )
}
