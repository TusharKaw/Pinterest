import { Header } from "@/components/header"
import { BoardDetail } from "@/components/board-detail"

export default function BoardPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <BoardDetail boardId={params.id} />
      </main>
    </div>
  )
}
